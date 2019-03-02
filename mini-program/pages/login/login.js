// pages/login/login.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: null,
    password: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.appData.userInfo == null ){
      wx.redirectTo("../register/register");
    }
    else {
      this.setDate({username:app.appData.username})
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  loginBtnClick:function() {
    app.appData.userInfo = {username:this.data.username,password:this.data.password}
  },

  registerBtnClick:function() {
    
  },

  usernameInput:function(event) {
    this.setDate({username:event.detail.value})
  },

  passwordInput: function (event) {
    this.setDate({ password: event.detail.value })
  }
  
})