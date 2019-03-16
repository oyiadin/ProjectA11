// pages/class/classes-create/classes-create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session_id: "",
    date: "2019-01-01",
    time: "12:01",
    class_name: "",
    class_teacher: "",
  },
  // 获取课程名
  set_class_name: function (e) {
    this.data.class_name = e.detail.value;
  },
  // 获取教师名
  set_class_teacher: function (e) {
    this.data.class_teacher = e.detail.value;
  },
  // 获取验证码
  set_captcha: function (e) {
    this.data.captcha = e.detail.value;
  },

  // 获取日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  
  // 获取时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  
  // 创建课程
  do_create: function () {
    var time = getTimeStamp(); // 把时间转换成时间戳
  },

  // 获取时间戳
  getTimeStamp: function () {
    const that = this;
    // var date = '2015-03-05 17:59:00.0';
    var date = this.data.date + ' ' + this.data.time;
    date = date.substring(0, 19);
    date = date.replace(/-/g, '/');
    var timestamp = new Date(date).getTime();
    return timestamp;

  },

  // 刷新验证码
  refetch_captcha: function (e) {
    var src = u.gen_url('/misc/captcha')
      + '?session_id=' + this.data.session_id
      + '&app_id=9c15af0d3e0ea84d'
      + '&t=' + Date.parse(new Date());
    console.log('src=', src);
    this.setData({
      src: src,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})