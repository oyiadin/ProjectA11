var u = getApp().utils;


Page({
  data: {
    is_checked: false,
    classItems: [
      { name: '302班.', value: '0', checked: true },
      { name: '301班', value: '1' }
    ],
    open_class_name: "",
    live_name: "",
    description: "",
    start_date: "2018-2-2",
    start_time: "12:00",
    time_active: 0,
    time_list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
  },
  // 班级选择
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var classItems = this.data.classItems, values = e.detail.value;
    for (var i = 0, lenI = classItems.length; i < lenI; ++i) {
      classItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (classItems[i].value == values[j]) {
          classItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      classItems: classItems
    });
  },
  // 开关选项
  changeSwitch: function (e) {
    //console.log(e.detail.value);
    this.setData({
      is_checked: e.detail.value
    })
  },
  // 面向班级名称
  to_class_name: function (e) {
    this.setData({
      open_class_name: e.detail.value
    })
  },

  // 获取课程名
  set_live_name: function (e) {
    this.setData({
      live_name: e.detail.value
    })
  },
  // 简介
  set_live_description: function (e) {
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
  bindDateTimeActiveChange: function (e) {
    this.setData({
      time_active: parseInt(e.detail.value) + 1
    })
  },

  // 创建课程
  do_create: function () {
    // 开始时间
    var start_time = this.data.start_date + ' ' + this.data.start_time;
    console.log(start_time)
    // 持续时间
    var time_active = parseInt(this.data.time_active) * 60;
  },

})