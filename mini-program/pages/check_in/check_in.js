var base = require('../../base.js');
const request = base.request;


Page({
  generate_check_in_code: function(){
    var that = this;
    request(
      'GET', '/check-in/class/3/code', {},
      function (res) {
        console.log(res.data);
        that.setData({ msg: res.data.code });
        wx.hideToast();
      }
    );
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    });
  },
});
