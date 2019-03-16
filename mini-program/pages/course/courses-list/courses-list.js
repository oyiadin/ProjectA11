var u = getApp().utils;


Page({
  data: {
    courses: [],
  },

  onLoad: function() {
    const that = this;
    u.request(
      'GET', '/courses', {},
      function (res) {
        var courses = res.data.list;
        for (var i = 0; i < courses.length; i++) {
          courses[i].date1 = u.timestamp2date(courses[i].start);
          courses[i].date2 = u.timestamp2date(courses[i].end);
        }
        that.setData({ courses: res.data.list });
      }
    );
  },

  openAlert: function (event) {
    const that = this;
    console.log(event);
    wx.redirectTo({
      url: '../../class/courses-list/courses-list?course_id=' + event.currentTarget.dataset.course_id,
    });
  },

  // 搜索框
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
