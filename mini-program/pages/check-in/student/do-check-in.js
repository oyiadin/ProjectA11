var u = require('../../../utils/utils.js');


function fail_handler(res) {
  var code = res.errCode;
  var msg = "开启WiFi时出现未知错误:" + res.errMsg;
  if (code == 12001) {
    msg = '当前系统不支持WiFi相关能力';
  } else if (code == 12005) {
    msg = '请在开启WiFi后重试';
  } else if (code == 12011) {
    msg = '小程序处于后台，无法获取WiFi信息';
  }
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 3000,
  });
}

Page({
  data: {
    Length: 4,        //输入框个数
    isFocus: true,    //聚焦
    Value: "",        //输入的内容
    ispassword: false, //是否密文显示 true为密文， false为明文。
  },

  onLoad: function () {
    console.log('loaded');
    wx.startWifi({
      success: function() {
        console.log('startWifi success');
      },
      fail: fail_handler,
    });
  },

  Focus(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    that.setData({
      Value: inputValue,
    })
  },

  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },

  submit_code: function(e){
    var that = this;

    wx.onGetWifiList(function (res) {
      var wifi_list = [];
      res.wifiList.forEach(function (x) {
        wifi_list = wifi_list.concat(x.BSSID);
      });
      console.log('wifi_list=', wifi_list);

      u.request(
        'PUT', '/check-in/verify/' + that.data.Value,
        { wifi_list: wifi_list },
        function (_res) {
          wx.showToast({
            title: '已签到:' + _res.data.num_same,
            icon: 'success',
            duration: 3000
          });
        },
        function () {
          wx.showModal({
            content: '签到失败！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        },
      )
    });

    wx.getWifiList({
      success: function () {
        console.log('getWifiList success')
      },
      fail: fail_handler,
    });
  }
})