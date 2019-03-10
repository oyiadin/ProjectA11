// pages/users/users.js
var base = require('../../base.js');
const request = base.request;


Page({
  data: {
    name: '用户名Test'
  },

  // 登出
  log_out: function() {
    request(
      'DELETE', '/credential/account', {},
      function() {
        wx.removeStorageSync('session_id');
        wx.navigateTo({
          url: '/pages/login/login',
        });
      }
    );
  },

  // 个人信息跳转
  user_information: function () {
    wx.navigateTo({
      url: './user_information/user_information',
    })
  },

  selected_class: function(){
    wx.navigateTo({
      url: './selected_class/selected_class',
    })
  }
})