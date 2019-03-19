var u = getApp().utils;


Page({
  data: {
    title: '',
    introduction: '',
    date: '2019-01-01',
    time: "18:00",
    duration: 1,
    duration_options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    classes: [],
    is_public: false,
  },

  onLoad: function (options) {
    var user_id = options.user_id;
    var date = new Date();
    this.setData({ date: u.timestamp2date(date.getTime() / 1000) });
    u.request(
      'GET', '/user/' + user_id + '/classes', {},
      (res) => {
        this.setData({ classes: res.data.list });
      }
    )
  },

  // 班级选择
  checkboxChange: function (e) {
    var classes = this.data.classes, values = e.detail.value;
    for (var i = 0, lenI = classes.length; i < lenI; ++i) {
      classes[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (classes[i].class_id == values[j]) {
          classes[i].checked = true;
          break;
        }
      }
    }
    this.setData({ classes: classes });
  },

  change_title: function (e) {
    this.setData({ title: e.detail.value })
  },

  change_introduction: function (e) {
    this.setData({ introduction: e.detail.value })
  },

  change_date: function (e) {
    this.setData({ date: e.detail.value })
  },

  change_time: function (e) {
    this.setData({ time: e.detail.value })
  },

  change_duration: function (e) {
    this.setData({ duration: parseInt(e.detail.value) + 1 })
  },

  change_public: function (e) {
    this.setData({ is_public: e.detail.value })
  },

  submit: function () {
    var start = u.get_timestamp(this.data.date + ' ' + this.data.time);
    var duration = parseInt(this.data.duration) * 60;

    var classes = [];
    for (var i = 0; i < this.data.classes.length; ++i) {
      if (this.data.classes[i].checked) {
        classes = classes.concat({
          class_id: this.data.classes[i].class_id
        })
      }
    }

    u.request(
      'PUT', '/live/new',
      {
        title: this.data.title,
        introduction: this.data.introduction,
        start: start,
        duration: duration,
        classes: classes,
      },
      (res) => {
        wx.showToast({
          title: '创建成功！',
          duration: 1500,
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    )
  },

})