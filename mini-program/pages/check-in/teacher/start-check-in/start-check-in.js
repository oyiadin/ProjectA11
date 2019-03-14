var u = require('../../../../utils/utils.js');

function fail_handler (res) {
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
    code: "待获取",
    wifi_list: undefined,
  },

  onLoad: function () {
    const that = this;
    wx.startWifi({
      success: function (res) {
        console.log('startWifi success');
      },
      fail: fail_handler,
    });
    wx.onGetWifiList(function (res) {
      var list = [];
      res.wifiList.forEach(function (x) {
        list = list.concat(x.BSSID);
      });
      that.data.wifi_list = JSON.stringify(list);
      console.log('wifi_list=', JSON.stringify(list));
    });
  },

  gen_captcha: function(e) {
    var that = this;
    wx.getWifiList({
      success: function (res) {
        console.log('getWifiList success');
        wx.showLoading({ title: '获取中' });
        u.request(
          'GET', '/check-in/class/1/code', {},
          function (res) {
            console.log(res.data);
            that.setData({ code: res.data.code });
            wx.hideLoading();
            that.setData({ code_id: res.data.code_id });
            wx.setStorageSync('code_id', res.data.code_id);
          },
          function (res) {
            wx.hideLoading();
            wx.showToast({
              title: '发生错误，请重试',
              icon: 'none',
              duration: 2000,
            });
          }
        );
      },
      fail: fail_handler,
    });
  },

  start_check_in: function(e) {
    var that = this;
    u.request(
      'POST',
      '/check-in/code/' + that.data.code_id +  '/start',
      { wifi_list: that.data.wifi_list },
      function () {
        wx.showToast({
          title: '已完成',
          icon: 'success',
          duration: 3000
        });
      },
      function () {
        wx.showModal({
          content: '网络访问失败！请重试！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
      }
    );
  },

  check_status: function() {
    wx.redirectTo({
      url: '../checked-in-list/checked-in-list',
    });
  }
});
