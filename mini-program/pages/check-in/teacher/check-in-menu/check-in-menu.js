Page({
  start_check_in: function() {
    wx.navigateTo({
      url: '../start-check-in/start-check-in',
    })
  },
  check_in_list: function () {
    wx.navigateTo({
      url: '../checked-in-list/checked-in-list',
    })
  }
})