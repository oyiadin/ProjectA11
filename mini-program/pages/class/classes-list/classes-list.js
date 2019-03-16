var u = getApp().utils;


Page({
  data: {
    classes: [],
  },

  onLoad: function (options) {
    var course_id = options.course_id;
    this.setData({ course_id: course_id, course_name: options.course_name });
    
    u.request(
      'GET', '/course/' + course_id + '/classes', {},
      (res) => {
        this.setData({ classes: res.data.list });
      }
    )
  },

  create_class: function () {
    wx.redirectTo({
      url: '../class-create/class-create'
           + '?course_id=' + this.data.course_id,
    });
  },

  openAlert: function (event) {
    u.request(
      'POST', '/class/' + event.currentTarget.dataset.class_id + '/enroll_in', {},
      function (res) {
        wx.showModal({
          content: '选课成功',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
      },
      function (res) {
        wx.showModal({
          content: '选课失败:' + res.data.msg,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击失败')
            }
          }
        });
      }
    );
  }

});