var base = require('../../base.js');
const request = base.request;


function fetch_new_session_id() {
  wx.setStorageSync('is_login', 0);
  request(
    'GET', '/credential/session_id', {},
    function (res) {
      wx.setStorageSync('session_id', res.data.session_id);
    });
}


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
          wx.setStorageSync('is_login', 1);
          wx.switchTab({url: '/pages/users/users'});
        },
        function (res) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        }
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
      key: 'is_login',
      success: function(res) {
        if (res.data == 0)
          return fetch_new_session_id();

        request(
          'OPTIONS', '/credential/session_id', {},
          function (_res) {
            if (_res.data.is_valid) {
              wx.switchTab({
                url: '/pages/users/users',
              });
            } else {
              fetch_new_session_id();
            }
          },
          function () {
            fetch_new_session_id();
          }
        )
      },
      fail: function() {
        fetch_new_session_id();
      }
    });
  }
});
