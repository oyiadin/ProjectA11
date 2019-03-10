// pages/login/login.js
var app = getApp();
var base = require('../../base.js');
const request = base.request;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    staff_id: "",
    password: "",
    src: 'http://localhost:8888/api/v1/misc/captcha?session_id=' + wx.getStorageSync('session_id') + '&app_id=0cc175b9c0f1b6a8',
    captcha : '',
  },

  setStaffID: function (e) {
    this.data.staff_id = e.detail.value;
  },

  setPassword: function (e) {
    this.data.password = e.detail.value;
  },

  set_captcha: function(e) {
    this.data.captcha = e.detail.value;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  //   console.log('hi');
  //   console.log(wx.request({
  //     url: 'http://localhost:8887/',
  //     data: {
  //       hello: "world!"
  //     },
  //     success(res) {
  //       console.log(res.data)
  //     }
  //   }));
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  submit: function (e) {
    const that = this;
    request(
      'PUT', '/credential/account', 
      {
        staff_id: this.data.staff_id,
        password: this.data.password,
        app_id: '0cc175b9c0f1b6a8',
        captcha: this.data.captcha
        },
      function (res) {
        console.log(res.data);
        wx.showToast({
          title: '已完成',
          icon: 'success',
          duration: 3000
        });
        wx.redirectTo({
          url: '../login/login',
        });
      }
    )
  }
})