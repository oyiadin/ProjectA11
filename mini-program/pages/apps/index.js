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
