var u = require('../../../utils/utils.js');

Page({
  data: {
    Length: 4,        //输入框个数
    isFocus: true,    //聚焦
    Value: "",        //输入的内容
    ispassword: false, //是否密文显示 true为密文， false为明文。
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
  // formSubmit(e) {
  //   console.log(e.detail.value.password);
  // },
  submit_code: function(e){
    var that = this;
    u.request(
      'PUT', '/check-in/verify/' + this.data.Value, {},
      function () {
        wx.showToast({
          title: '已签到',
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
  }
})