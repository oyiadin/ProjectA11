var u = getApp().utils;


Page({
  data: {
    courses: [],
  },

  onLoad: function(options) {
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
    console.log(event);
    var data = event.currentTarget.dataset;
    wx.redirectTo({
      url: '../../class/classes-list/classes-list'
           + '?course_id=' + data.course_id
           + '&course_name=' + data.course_name
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

  do_search: function (e) {
    u.request(
      'POST', '/course', { pattern: this.data.inputVal },
      (res) => {
        this.setData({ courses: res.data.list });
      }
    );
    this.setData({ inputShowed: false });
  }
})
