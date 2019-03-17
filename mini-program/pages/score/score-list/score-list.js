var u = getApp().utils;

Page({
  onLoad: function (options) {
    var user_id = options.user_id,
        name = wx.getStorageSync('name');

    if (user_id) {
      this.setData({
        student_mode: true,
        user_id: user_id,
        name: name,
      });
    }

    this.refresh();
  },

  refresh: function(callback=undefined) {
    wx.showLoading();
    u.request(
      'GET', '/user/' + this.data.user_id + '/scores', {},
      (res) => {
        if (callback)
          callback();
        this.setData({ scores: res.data.list });
        wx.hideLoading();
      }
    );
  },

  onPullDownRefresh: function () {
    this.refresh(wx.stopPullDownRefresh);
  },
});