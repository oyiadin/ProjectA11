var u = getApp().utils;


Page({
  data: {
    date1: "2019-01-01",
    date2: "2019-09-01",
    course_name: "",
  },

  // 获取课程名
  set_course_name: function (e) {
    this.data.course_name = e.detail.value;
  },
  // 获取日期
  bindDate1Change: function (e) {
    this.setData({
      date1: e.detail.value
    })
  },
  bindDate2Change: function (e) {
    this.setData({
      date2: e.detail.value
    })
  },
  
  // 创建课程
  do_create: function () {
    var start = u.get_timestamp(this.data.date1),
          end = u.get_timestamp(this.data.date2);
    u.request(
      'PUT', '/course',
      {
        course_name: this.data.course_name,
        start: start,
        end: end,
      },
      function (res) {
        wx.showToast({
          title: '创建成功',
          duration: 2000,
        });
        wx.navigateBack();
      },
      function (res) {
        var title = "发生未知错误:" + res.data.msg;
        if (res.statusCode == 410) {
          title = "权限不足";
        }
        wx.showToast({
          title: title,
          icon: 'none',
          duration: 3000,
        })
      }
    )
  },
})