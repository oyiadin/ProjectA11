// pages/login/login.js
var app = getApp();
var base = require('../../base.js');
const request = base.request;

Page({
  data: {
    staff_id: "",
    password: "",
    account_types: ["学生", "教师"],
    account_types_name: ["学号", "教职工号"],
    account_type_index: 0,
    src: "",
    captcha: "",
  },

  bind_account_type_change: function (e) {
    this.setData({
      account_type_index: e.detail.value
    });
  },

  set_staff_id: function (e) {
    this.data.staff_id = e.detail.value;
  },

  set_password: function (e) {
    this.data.password = e.detail.value;
  },

  set_captcha: function(e) {
    this.data.captcha = e.detail.value;
  },

  refetch_captcha: function (e) {
    this.setData({
      src: 'http://localhost:8888/api/v1/misc/captcha?session_id=' + wx.getStorageSync('session_id') + '&app_id=0cc175b9c0f1b6a8' + '&t=' + Date.parse(new Date()),
    });
  },

  onLoad: function () {
    this.refetch_captcha();
  },

  do_register: function (e) {
    const that = this;
    request(
      'PUT', '/credential/account', 
      {
        staff_id: this.data.staff_id,
        password: this.data.password,
        app_id: '0cc175b9c0f1b6a8',
        captcha: this.data.captcha,
      },
      function (res) {
        wx.showToast({
          title: '已完成',
          icon: 'success',
          duration: 3000
        });
        wx.navigateBack();
      }
    )
  }
})