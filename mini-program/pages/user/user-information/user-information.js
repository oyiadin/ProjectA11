var u = getApp().utils;


Page({
  data: {
    response: {},
  },

  onLoad: function (options) {
    const that = this;
    u.request(
      'GET', '/user', {},
      function (res) {
        that.setData({ data: res.data });
      }
    );
  },

})