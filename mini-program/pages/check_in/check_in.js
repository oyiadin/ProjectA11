var base = require('../../base.js');
const request = base.request;


Page({
  data: {
    code: "待获取",
  },

  gen_captcha: function(e) {
    var that = this;
    request(
      'GET', '/check-in/class/1/code', {},
      function (res) {
        console.log(res.data);
        that.setData({ code: res.data.code });
        wx.hideLoading();
        that.setData({ code_id: res.data.code_id });
        wx.setStorageSync('code_id', res.data.code_id);
      }
    );
    wx.showLoading({
      title: '获取中',
      mask: true
    })
  },

  start_check_in: function(e) {
    var that = this;
    request(
      'POST', '/check-in/code/' + this.data.code_id +  '/start', {},
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
    wx.switchTab({
      url: '../stu_check_in_list/stu_check_in_list',
    });
  }
});
