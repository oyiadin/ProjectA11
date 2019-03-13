// pages/login/login.js
var app = getApp();
var u = require('../../../utils/utils.js');


Page({
  data: {
    staff_id: "",
    password: "",
    src: "",
    captcha: "",
    account_type: "",
    account_types: ["学生", "教师"],
    id_name: "",
    id_names: ["学号", "教职工号"],

    radioItems: [
      { name: '男', value: '1' },
      { name: '女', value: '0' }
    ],
  },

  bind_account_type_change: function (e) {
    this.setData({
      account_type: this.data.account_types[e.detail.value],
      id_name: this.data.id_names[e.detail.value],
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
    this.setData({
      account_type: this.data.account_types[0],
      id_name: this.data.id_names[0],
    });
  },

  do_register: function (e) {
    const that = this;
    if (!this.data.staff_id || !this.data.password || !this.data.captcha) {
      wx.showToast({
        title: '请补全所有必填项',
        icon: 'none',
        duration: 2000
      });
    } else {
      u.request(
        'PUT', '/credential/account', 
        {
          staff_id: this.data.staff_id,
          password: this.data.password,
          app_id: '0cc175b9c0f1b6a8',
          captcha: this.data.captcha,
        },
        function (res) {
          wx.showToast({
            title: '注册成功！',
            icon: 'success',
            duration: 2000
          });
          setInterval(wx.navigateBack, 1000);
        },
        function (res) {
          that.refetch_captcha();
          var title = "发生错误，请重试";
          if (res.statusCode == 405) {
            title = '验证码错误，请重试';
          } else if (res.statusCode == 409) {
            title = that.data.id_name + '发生冲突，请重试';
          }
          wx.showToast({
            title: title,
            icon: 'none',
            duration: 2000
          })
        }
      )
    }
  }
})