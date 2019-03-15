var u = getApp().utils;


Page({
  data: {
    name: "",
  },

  onLoad: function() {
    this.setData({ name: wx.getStorageSync('name') });
  },

  log_out: function() {
    u.request(
      'DELETE', '/credential/account', {},
      function() {
        wx.removeStorageSync('session_id');
        wx.removeStorageSync('is_login');
        wx.navigateTo({
          url: '/pages/credential/login/login',
        });
      }
    );
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