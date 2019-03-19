var u = getApp().utils;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    live_class: {
      name : '小圆课堂',
      start : "2018-9-10 10:23",
      end : "2019-10-10 23:23"
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var role = wx.getStorageSync('role');
    this.setData({ role: role });
    this.refresh();
  }

})