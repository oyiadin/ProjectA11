var u = require('../../../utils/utils.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    staff_id: "",
    classes: [
      {
        "name":"示例1",
        "teacher":"王老师"
      },
      {
        "name": "示例2",
        "teacher": "李老师"
      }
    ]
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.getStorage({
      key: 'is_login',
      success: function(res) {
        u.request(
          'GET', '/class/',{
            staff_id: this.data.staff_id
          },
          function(res) {
            this.setData({ classes: res.classes })
          },
          function(res) {}
        )
      },
      fail: function(){
        wx.navigateTo({
          url: '/pages/login/login',
        });
      }
    })
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

  /**
   * 搜索框
   */
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },



})
