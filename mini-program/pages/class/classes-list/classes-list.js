var u = getApp().utils;


Page({
  data: {
    classes: [],
  },

  onLoad: function (options) {
    var role = wx.getStorageSync('role');
    this.setData({ role: role });

    var course_id = options.course_id,
        user_id = options.user_id;

    if (course_id) {  // 从特定课程点进来的
      this.setData({
        course_mode: true,
        course_id: course_id,
        course_name: options.course_name 
      });
      
      u.request(
        'GET', '/course/' + course_id + '/classes', {},
        (res) => {
          this.setData({ classes: res.data.list });
        }
      );

    } else if (user_id && role == 1) {  // 从教师的个人中心点进来的
      this.setData({
        teacher_mode: true,
        user_id: user_id,
      });

      u.request(
        'GET', '/user/' + user_id + '/classes', {},
        (res) => {
          this.setData({ classes: res.data.list });
        }
      );
    
    } else if (user_id && role == 0) {  // 从学生的个人中心点进来的
      this.setData({
        student_mode: true,
        user_id: user_id,
      });

      u.request(
        'GET', '/user/' + user_id + '/classes', {},
        (res) => {
          this.setData({ classes: res.data.list });
        }
      );
    }
  },

  create_class: function () {
    wx.navigateTo({
      url: '../class-create/class-create'
           + '?course_id=' + this.data.course_id,
    });
  },

  redirect2forum: function () {
    wx.navigateTo({
      url: '../../forum/index?course_id=' + this.data.course_id,
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