var u = getApp().utils;
var _ = require('../i18n.js')._;


Page({
  data: {
    apps: [
      {
        title: _('notif_center'),
        url: '../notification/notification/notification',
      }, 
      {
        title: _('course_list'),
        url: '../course/courses-list/courses-list',
      },  
      {
        title: _('watch_live'),
        url: '../live/student/pick',
      }, 
    ]
  },

  onLoad: function () {
    this.setData({ langIndex: wx.getStorageSync('langIndex') });
    var role = wx.getStorageSync('role');
    var user_id = wx.getStorageSync('user_id')
    if (role == 0) {  // 学生
      this.setData({
        apps: this.data.apps.concat({
          title: _('checkin'),
          url: '../check-in/student/do-check-in'
        })
      });
    } else if (role == 1) {  // 教师
      this.setData({
        apps: this.data.apps.concat({
          title: _('live_center'),
          url: '../live/teacher/index?user_id=' + user_id,
        })
      });
    }
  }
});
