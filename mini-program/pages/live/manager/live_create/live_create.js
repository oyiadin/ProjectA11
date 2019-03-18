var u = getApp().utils;


Page({
  data: {
    is_checked: false,
    to_class_name: "", // 对应的课程名
    live_name: "",
    description: "",
    start_date: "2018-2-2",
    start_time: "10:30",
    time_active: 0,
    time_list: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
  },
  // 开关选项
  changeSwitch: function(e) {
    //console.log(e.detail.value);
    this.setData({
      is_checked: e.detail.value
    })
  },
  // 面向班级名称
  to_class_name: function(e){
    this.setData({
      to_class_name: e.detail.value
    })
  },

  // 获取课程名
  set_live_name: function (e) {
    this.setData({
      live_name: e.detail.value
    })
  },
  // 简介
  set_live_description: function(e) {
    //console.log(e.detail.value);
    this.setData({
      description: e.detail.value
    })
  },
  // 获取日期
  bindDateStartDateActiveChange: function (e) {
    this.setData({
      start_date: e.detail.value
    })
  },
  // 开始时间
  bindDateStartTimeActiveChange: function (e) {
    this.setData({
      start_time: e.detail.value
    })
  },

  // 持续时间
  bindDateTimeActiveChange: function(e){
    this.setData({
      time_active: parseInt(e.detail.value) + 1
    })
  },

  // 创建课程
  do_create: function () {
    // 开始时间
    var start_time = this.data.start_date + ' ' +this.data.start_time;
    console.log(start_time)
    // 持续时间
    var time_active = parseInt(this.data.time_active) * 60;
  },

})