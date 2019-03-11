// pages/users/users.js
var base = require('../../base.js');
const request = base.request;


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
        url: '../../login/login',
      })
    }
  },

  // 登出
  log_out: function() {
    request(
      'DELETE', '/credential/account', {},
      function() {
        wx.removeStorageSync('session_id');
        wx.removeStorageSync('is_login');
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