var u = getApp().utils;


Page({
  data: {
    staff_id: "",
    classes: [{
      "class_id": 1,
      "class_name": "高等数学",
      "course_id": 1,
      "end": 7,
      "msg": "OK",
      "start": 6,
      "status_code": 200,
      "teacher_id": 1,
      "teacher_name": "你猜",
      "weekday": 2
    }],
  },

  openAlert: function (event) {
    const that = this;
    console.log(event);
    u.request(
      'POST', '/class/' + event.currentTarget.dataset.class_id + '/enroll_in', {},
      function(res){
        wx.showModal({
          content: '选择成功',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
      },
      function(res){
        wx.showModal({
          content: '选择失败',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击失败')
            }
          }
        });
      }
    )
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
