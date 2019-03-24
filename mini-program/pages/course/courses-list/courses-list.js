var u = getApp().utils;
var _ = require('../../i18n.js')._;



Page({
  data: {
    courses: [],
  },

  onLoad: function(options) {
    this.setData({ langIndex: wx.getStorageSync('langIndex') });
    var role = wx.getStorageSync('role');
    this.setData({ role: role });
    this.refresh();
  },

  // 搜索框
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  do_search: function (e) {
    u.request(
      'POST', '/course', { pattern: this.data.inputVal },
      (res) => {
        this.setData({ courses: res.data.list });
      }
    );
    this.setData({ inputShowed: false });
  },

  refresh: function(callback) {
    wx.showLoading({ title: '加载中' });
    u.request(
      'GET', '/courses', {},
      (res) => {
        if (callback) callback();

        var courses = res.data.list;
        for (var i = 0; i < courses.length; i++) {
          courses[i].date1 = u.timestamp2date(courses[i].start);
          courses[i].date2 = u.timestamp2date(courses[i].end);
        }
        this.setData({ courses: res.data.list });

        wx.hideLoading();
      }
    );
  },

  onPullDownRefresh: function() { this.refresh(wx.stopPullDownRefresh); },
  onShow: function() { this.refresh(); }
})
