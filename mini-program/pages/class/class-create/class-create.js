var u = getApp().utils;

Page({
  data: {
    course_id: "",
    class_name: "",
    weekday: "周一",
    start: 0,
    end: 0,
    weekdays: ["周一","周二","周三","周四","周五","周六","周末"],
    class_time_picker: [1,2,3,4,5,6,7,8,9,10],
    index: 0,
  },

  // 课程名
  set_course_name: function(e) {
    this.setData({
      class_name: e.detail.value
    })
  },

  // 星期
  bind_Weekday_Picker_Change: function(e) {
    var date = e.detail.value;
    date = date;
    switch (date) {
      case "0":
        this.setData({
          weekday: "周一"
        });
        break;
      case "1":
        this.setData({
          weekday: "周二"
        });
        break;
      case "2":
        this.setData({
          weekday: "周三"
        });
        break;
      case "3":
        this.setData({
          weekday: "周四"
        });
        break;
      case "4":
        this.setData({
          weekday: "周五"
        });
        break;
      case "5":
        this.setData({
          weekday: "周六"
        });
        break;
      case "6":
        this.setData({
          weekday: "周末"
        });
        break;
    }
  },

  // 开始时间
  bindDateStartChange: function(e) {
    this.setData({
      start: parseInt(e.detail.value) + 1
    })
  },

  // 结束时间
    bindDateEndChange: function (e) {
    this.setData({
      end: parseInt(e.detail.value) + 1
    })
  },

  // 创建课程
  do_create: function() {
    // 星期
    var date = this.data.weekday;
    switch (date) {
      case "周一":
        this.setData({
          weekday: 1
        });
        break;
      case "周二":
        this.setData({
          weekday: 2
        });
        break;
      case "周三":
        this.setData({
          weekday: 3
        });
        break;
      case "周四":
        this.setData({
          weekday: 4
        });
        break;
      case "周五":
        this.setData({
          weekday: 5
        });
        break;
      case "周六":
        this.setData({
          weekday: 6
        });
        break;
      case "周日":
        this.setData({
          weekday: 7
        });
        break;
    }
    // 课程时间
    var start = this.data.start;
    var end = this.data.end;
    // 创建
  },

  onLoad: function (options) {
    var course_id = options.course_id;
    this.setData({ course_id: course_id });
  }
})