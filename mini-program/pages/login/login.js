var base = require('../../base.js');
const request = base.request;

Page({
  data: {
    is_show_top: false,
    top: "",
    staff_id: "",
    password: "",
    account_types: ["学生", "教师"],
    account_types_name: ["学号", "教职工号"],
    account_type_index: 0,
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

  do_login: function (e) {
    const that = this;
    if (!this.data.staff_id) {
      wx.showToast({
        title: '请输入' + this.data.account_types_name[this.data.account_type_index],
        icon: 'none',
        duration: 1500
      });
    } else if (!this.data.password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 1500
      });
    } else {
      request(
        'POST', '/credential/account',
        {
          staff_id: this.data.staff_id,
          password: this.data.password
        },
        function (res) {
          console.log('fetched session_id=' + res.data["session_id"]);
          wx.setStorageSync('session_id', res.data['session_id']);
          that.setData({ is_show_top: true, top: "登录成功！" });
        },
      );
    }
  },

  do_register: function(e) {
    wx.navigateTo({
      url: '../register/register',
    })
  },

  onLoad: function (e) {
    const that = this;
    wx.getStorage({
      key: 'session_id',
      success: function(res) {
        that.setData({ is_show_top: true, top: "账号已登录！" });
      },
    });
  }
});
