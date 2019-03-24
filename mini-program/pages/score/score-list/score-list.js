var u = getApp().utils;
var _ = require('../../i18n.js')._;


Page({
  onLoad: function (options) {
    this.setData({ langIndex: wx.getStorageSync('langIndex') });
    var user_id = options.user_id,
        class_id = options.class_id,
        name = wx.getStorageSync('name');

    if (user_id) {
      this.setData({
        student_mode: true,
        user_id: user_id,
        name: name,
      });
    } else if (class_id) {
      this.setData({
        class_mode: true,
        class_id: class_id,
        name: name,
      })
    }
  },

  onShow: function () {
    this.refresh();
  },

  refresh: function(callback=undefined) {
    wx.showLoading();

    if (this.data.student_mode) {
      u.request(
        'GET', '/user/' + this.data.user_id + '/scores', {},
        (res) => {
          if (callback)
            callback();
          this.setData({ scores: res.data.list });
          wx.hideLoading();
        }
      );
    } else if (this.data.class_mode) {
      u.request(
        'GET', '/class/' + this.data.class_id + '/scores', {},
        (res) => {
          if (callback)
            callback();
          this.setData({ scores: res.data.list });
          wx.hideLoading();
        }
      )

      wx.hideLoading();
    }
  },

  onPullDownRefresh: function () {
    this.refresh(wx.stopPullDownRefresh);
  },
});