// pages/user_information/user_information.js

// pages/user_information/user_information.js
var base = require('../../../base.js');
const request = base.request;

Page({
  data: {
    session_id: "null",
    name: '用户名Test',
    gender: "男",
    student_number: 17071140,
    mobile: 18267275886
  },

  get_information: function (session){
    pass;
  },

  onLoad: function (options) {
    var session = wx.getStorageSync('session_id');
    var is_login = wx.getStorageSync('is_login');
    if (is_login) {
      var information = get_information(session);
      this.setData({
        session_id:session,
        name: information.name,
        gender: information.gender,
        student_number: information.number,
        mobile: information.phone_number
      })
    }else{
      wx.navigateTo({
        url: '../../login/login',
      })
    }
  },

})