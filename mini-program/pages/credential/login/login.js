var u = getApp().utils;
var _ = require('../../i18n.js')._;



function fetch_new_session_id(that, callback) {
  console.log('fetching new session_id');
  wx.setStorageSync('is_login', 0);
  u.request(
    'GET', '/credential/session_id', {},
    (res) => {
      that.setData({ session_id: res.data.session_id });
      wx.setStorageSync('session_id', res.data.session_id);
      callback();
    },
    (res) => {
      wx.hideLoading();
      wx.showModal({
        title: '网络错误',
        content: '服务器好像开小差了QAQ',
        confirmText: '重试',
        success: (res) => {
          if (res.confirm)
            fetch_new_session_id(that, callback);
          else
            wx.showToast({
              title: '小程序在下次重启前将无法正常运行，请重启后重试',
              icon: 'none',
              duration: 10000,
            });
        }
      })
    }
  );
}


Page({
  data: {
    session_id: "",
    staff_id: "",
    password: "",
    account_type: "",
    role: "0",
    account_types: ["学生", "教师", "管理员"],
    id_name: "",
    id_names: ["学号", "教职工号", "账号ID"],
  },

  bind_account_type_change: function (e) {
    console.log("account type changed");
    this.setData({
      account_type: this.data.account_types[e.detail.value],
      id_name: this.data.id_names[e.detail.value],
      role: e.detail.value,
    });
  },

  set_staff_id: function (e) {
    this.setData({
      staff_id:e.detail.value
    })
  },
  set_password: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  set_captcha: function (e) {
    this.setData({
      captcha: e.detail.value
    })
  },

  refetch_captcha: function (e) {
    console.log('refetch captcha');
    var src = u.gen_url('/misc/captcha')
      + '?session_id=' + this.data.session_id
      + '&app_id=9c15af0d3e0ea84d'
      + '&t=' + Date.parse(new Date());
    console.log('src =', src);
    this.setData({ src: src });
    wx.hideLoading();
  },

  submit: function (e) {
    if (!this.data.staff_id || !this.data.password || !this.data.captcha) {
      wx.showModal({
        title: '请补全所有必填项',
        duration: 2000
      });
    } else {
      wx.showLoading({
        title: '登录中',
      })
      console.log('[login] submitting...');
      u.request(
        'POST', '/credential/account',
        {
          staff_id: this.data.staff_id,
          password: this.data.password,
          captcha: this.data.captcha,
          role: parseInt(this.data.role),
        },
        (res) => {
          wx.hideLoading();
          wx.setStorage({
            key: 'is_login',
            data: 1 });
          wx.setStorage({
            key: 'user_id',
            data: res.data.user_id });
          wx.setStorage({
            key: 'role',
            data: this.data.role });
          wx.setStorage({
            key: 'name',
            data: res.data.name });
          wx.switchTab({ url: '/pages/apps/index' });
        },
        (res) => {
          wx.hideLoading();
          this.refetch_captcha();
          var title = '发生错误，请重试';
          if (res.statusCode == 405) {
            title = '验证码错误，请重试';
          } else if (res.statusCode == 404) {
            title = '请检查账号类型、'+this.data.id_name+'、密码后重试';
          }
          wx.showModal({
            title: title,
            duration: 2000,
          });
        }
      );
    }
  },

  onLoad: function (e) {
    wx.showLoading({
      title: '正在载入',
    });
    this.setData({ langIndex: wx.getStorageSync('langIndex') });
    this.setData({
      role: 0,
      account_type: this.data.account_types[0],
      id_name: this.data.id_names[0],
    });

    wx.getStorage({
      key: 'session_id',
      success: (res) => {
        if (res.data == undefined) {
          fetch_new_session_id(this, wx.hideLoading);
          this.refetch_captcha();
        } else {
          u.request(
            'OPTIONS', '/credential/session_id', {},
            (_res) => {
              if (_res.data.is_valid) {
                if (wx.getStorageSync('is_login')) {
                  wx.hideLoading();
                  wx.switchTab({
                    url: '/pages/apps/index',
                  });
                } else {
                  this.setData({ session_id: res.data });
                  this.refetch_captcha();
                }
              } else {
                fetch_new_session_id(this, this.refetch_captcha);
              }
            },
            (res) => {
              fetch_new_session_id(this, this.refetch_captcha);
            }
          );
        }
      },
      fail: (res) => {
        fetch_new_session_id(this, this.refetch_captcha);
      }
    });
  },

  jumpRegister: () => {
    wx.navigateTo({
      url: '../register/register',
    });
  },

  clear_information: function() {
    this.setData({
      staff_id: null,
      password: null
    })
  },

  // 下拉更新
  onPullDownRefresh: function() {
    console.log('onPullDownRefresh')
    wx.showNavigationBarLoading();
    this.clear_information();
    
    console.log(this.data.staff_id);
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  switchLang: function() {
    console.log('language switched!');
    var prevLangIndex = wx.getStorageSync('langIndex') || 0;
    if (prevLangIndex == 1) {
      wx.setStorageSync('langIndex', 0);
      this.setData({ langIndex: 0 });
    } else {
      wx.setStorageSync('langIndex', 1);
      this.setData({ langIndex: 1 });
    }
  },
});
