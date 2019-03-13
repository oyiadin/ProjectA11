// pages/users/users.js
var u = require('../../utils/utils.js');


Page({
  data: {
    name: 'Welcome'
  },
   // 个人信息
  onload: function(){
    var session = wx.getStorageSync('session_id');
    var is_login = wx.getStorageSync('is_login');
    if(is_login){
      pass;
    } else {
      wx.navigateTo({
        url: '/pages/credential/login/login',
      })
    }
  },

  // 登出
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

  // 个人信息跳转
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