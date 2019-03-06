// pages/users/users.js
const app = getApp();
//var Request = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '用户名Test'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //if (app.appData.userInfo == null) {
    //  wx.redirectTo({ url: "../login/login" })
    //}
    // 获取个人信息
    //else{
    //  Request.
    //  this.setData({username:app.appData.userInfo.username})
    //}
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

  // 登出
  log_out: function() {
    wx.navigateTo({
      // 这里要加一个seesion销毁功能

      url: '../index/index',
    })
  },

  // 个人信息跳转
  user_information: function () {
    wx.navigateTo({
      url: './user_information/user_information',
    })
  }
  // 点击我发布的跳转
  //wofabude: function () {
  //  wx.navigateTo({
  //   url: './UserAllActivity/UserAllActivity',
  //  })
  //},
  // 浏览记录
  //liulanjilu: function () {
  //  wx.navigateTo({
  //    url: './userjiaoyin/userjiaoyin',
  //  })
  //},
  // 我的收藏
  //collection: function () {
  //  wx.navigateTo({
  //   url: './collection/collection',
  //  })
  //},
  // 我的报名跳转
  //wodebaoming: function () {
  //  wx.navigateTo({
  //    url: './usersingup/usersingup',
  //  })
  //},
  // 建议反馈
  //Advicefeedback: function () {
  //  wx.navigateTo({
  //    url: './Advicefeedback/Advicefeedback',
  //  })
  //}
})