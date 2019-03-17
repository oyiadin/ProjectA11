var u = getApp().utils;


Page({
  data: {
    apps: [
      {
        title: '课程列表',
        url: '../course/courses-list/courses-list',
      },
    ]
  },

  onLoad: function () {
    var role = wx.getStorageSync('role');
    if (role == 0) {
      this.setData({
        apps: this.data.apps.concat({  // 学生
          title: '课堂签到',
          url: '../check-in/student/do-check-in'
        })
      });
    }
  }
});
