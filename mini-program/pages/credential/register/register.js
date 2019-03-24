var u = getApp().utils;
var _ = require('../../i18n.js')._;



Page({
  data: {
    staff_id: "",
    password: "",
    confirm_password: "",
    is_male: "",
    name: "",
    src: "",
    captcha: "",
    account_type: "",
    role: "",
    account_types: [_('role1'), _('role2'), _('role3')],
    id_name: "",
    id_names: ["学号", "教职工号", "账号ID"],
    is_checked: false,
    invite_code: "",

    sex_types: [
      { name: _('male'), value: '1' },
      { name: _('female'), value: '0' }
    ],
  },

  bind_account_type_change: function (e) {
    this.setData({
      account_type: this.data.account_types[e.detail.value],
      id_name: this.data.id_names[e.detail.value],
      role: e.detail.value,
    });
    //console.log(this.data.account_type);
    if (this.data.account_type == "教师" || this.data.account_type == "管理员"){
      this.setData({
        is_checked: true
      })
    }
  },

  set_staff_id: function (e) {
    this.data.staff_id = e.detail.value; },
  set_password: function (e) {
    this.data.password = e.detail.value; },
  confirm_password: function (e) {
    this.data.confirm_password = e.detail.value;},
  set_name: function (e) {
    this.data.name = e.detail.value; },
  set_captcha: function(e) {
    this.data.captcha = e.detail.value; },
  set_invite_code: function(e){
    this.setData({
      invite_code: e.detail.value
    })
  },

  sex_change: function (e) {
    var sex_types = this.data.sex_types;
    for (var i = 0, len = sex_types.length; i < len; ++i) {
      sex_types[i].checked = sex_types[i].value == e.detail.value;
    }
    this.setData({ sex_types: sex_types, is_male: e.detail.value });
  },

  refetch_captcha: function (e) {
    this.setData({
      src: u.gen_url('/misc/captcha')
        + '?session_id=' + wx.getStorageSync('session_id')
        + '&app_id=0cc175b9c0f1b6a8'
        + '&t=' + Date.parse(new Date()),
    });
  },

  onLoad: function () {
    this.setData({ langIndex: wx.getStorageSync('langIndex') });
    this.refetch_captcha();
    this.setData({
      role: 0,
      account_type: this.data.account_types[0],
      id_name: this.data.id_names[0],
    });
  },

  do_register: function (e) {
    const that = this;
    if (!this.data.staff_id || !this.data.password || !this.data.captcha || !this.data.is_male) {
      wx.showToast({
        title: '请补全所有必填项',
        icon: 'none',
        duration: 2000
      });
    } else if(this.data.password != this.data.confirm_password){
      wx.showToast({
        title: '两次输入的密码不一致！请重试',
        icon: 'none',
        duration: 2000
      });
    }
    else {
      u.request(
        'PUT', '/credential/account', 
        {
          staff_id: this.data.staff_id,
          password: this.data.password,
          is_male: this.data.is_male,
          name: this.data.name,
          app_id: '0cc175b9c0f1b6a8',
          captcha: this.data.captcha,
          role: parseInt(this.data.role),
        },
        function (res) {
          wx.showToast({
            title: '注册成功！',
            icon: 'success',
            duration: 1200
          });
          setTimeout(wx.navigateBack, 1200);
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
  },

  clear_information: function () {
    this.setData({
      staff_id: "",
      password: "",
      confirm_password: "",
      name: "",
      captcha: "",
      invite_code: null
    })
  },

  // 下拉更新
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
    wx.showNavigationBarLoading();
    this.clear_information();

    console.log(this.data.staff_id);
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  }
})