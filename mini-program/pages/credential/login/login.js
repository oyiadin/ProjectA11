var u = require('../../../utils/utils.js');

function fetch_new_session_id(that, callback) {
  wx.setStorageSync('is_login', 0);
  u.request(
    'GET', '/credential/session_id', {},
    function (res) {
      that.setData({ session_id: res.data.session_id });
      wx.setStorageSync('session_id', res.data.session_id);
      callback();
    }
  );
}


Page({
  data: {
    session_id: "",
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

  set_captcha: function (e) {
    this.data.captcha = e.detail.value;
  },

  refetch_captcha: function (e) {
    var src = 'http://localhost:8888/api/v1/misc/captcha?session_id=' + this.data.session_id + '&app_id=9c15af0d3e0ea84d' + '&t=' + Date.parse(new Date());
    console.log('src=', src);
    this.setData({
      src: src,
    });
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
      u.request(
        'POST', '/credential/account',
        {
          staff_id: this.data.staff_id,
          password: this.data.password,
          captcha: this.data.captcha,
        },
        function (res) {
          wx.setStorageSync('is_login', 1);
          wx.setStorageSync('user_id', res.data.user_id);
          wx.switchTab({url: '/pages/misc/index'});
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

  onLoad: function(e) {
    const that = this;
    wx.getStorage({
      key: 'session_id',
      success: function(res) {
        if (res.data == undefined) {
          fetch_new_session_id(that);
          that.refetch_captcha();
        } else {
          u.request(
            'OPTIONS', '/credential/session_id', {},
            function (_res) {
              if (_res.data.is_valid) {
                if (wx.getStorageSync('is_login')) {
                  wx.switchTab({
                    url: '/pages/misc/index',
                  });
                }
                that.setData({ session_id: res.data });
                that.refetch_captcha();
              } else {
                fetch_new_session_id(that, that.refetch_captcha);
              }
            },
            function () {
              fetch_new_session_id(that, that.refetch_captcha);
            }
          );
        }
      },
      fail: function() {
        fetch_new_session_id(that, that.refetch_captcha);
      }
    });
  }
});
