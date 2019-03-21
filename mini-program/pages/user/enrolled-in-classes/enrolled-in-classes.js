var u = getApp().utils;


Page({
  data: {
    colors: ["#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD"],
    classes: [],
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '载入中',
    });
    var user_id = options.user_id;
    u.request(
      'GET', '/user/' + user_id + '/classes', {},
      (res) => {
        this.setData({ classes: res.data.list });
        wx.hideLoading();
      }
    )
  }
})