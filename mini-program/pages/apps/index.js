var u = getApp().utils;


Page({
  data: {
    apps: [
      {
        title: '课程列表',
        url: '../course/courses-list/courses-list',
      },  
      {
        title: '观看直播',
        url: '../live/watch/pick_room_id/pick_room_id',
      }, 
    ]
  },

  onLoad: function () {
    var role = wx.getStorageSync('role');
    var user_id = wx.getStorageSync('user_id')
    if (role == 0) {  // 学生
      this.setData({
        apps: this.data.apps.concat({
          title: '课堂签到',
          url: '../check-in/student/do-check-in'
        })
      });
    } else if (role == 1) {  // 教师
      this.setData({
        apps: this.data.apps.concat({
          title: '课程直播中心',
          url: '../live/teacher/index?user_id=' + user_id,
        })
      });
    }
  }
});
