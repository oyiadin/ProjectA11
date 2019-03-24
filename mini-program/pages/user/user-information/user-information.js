var u = getApp().utils;


Page({
  data: {
    response: {},
  },

  onLoad: function (options) {
    this.setData({ langIndex: wx.getStorageSync('langIndex') });
    wx.showLoading({
      title: '载入中',
    });
    var user_id = options.user_id;
    u.request(
      'GET', '/user/' + user_id, {},
      (res) => {
        this.setData({ data: res.data });
        wx.hideLoading();
      }
    );
  },

})