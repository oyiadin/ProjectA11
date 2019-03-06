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
      }
    );
    wx.showLoading({
      title: '获取中',
      mask: true
    })
  },
});
