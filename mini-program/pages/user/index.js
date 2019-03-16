var u = getApp().utils;


Page({
  data: {
    name: "",
  },

  onLoad: function() {
    this.setData({ name: wx.getStorageSync('name') });
  },

  log_out: function() {
    var complete = function() {
      wx.removeStorageSync('session_id');
      wx.removeStorageSync('is_login');
      wx.navigateTo({
        url: '/pages/credential/login/login',
      });
    }
    u.request(
      'DELETE', '/credential/account', {},
      complete, complete);
  },

  user_information: function () {
    wx.navigateTo({
      url: './user-information/user-information',
    })
  },

  selected_class: function(){
    wx.navigateTo({
      url: './enrolled-in-classes/enrolled-in-classes',
    })
  }
})