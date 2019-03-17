var u = getApp().utils;


Page({
  data: {
    apps: [
      {
        title: '个人资料',
        url: 'user-information/user-information'
      },
    ]
  },

  onLoad: function() {
    this.setData({ name: wx.getStorageSync('name') });

    var role = wx.getStorageSync('role'),
        user_id = wx.getStorageSync('user_id'),
        apps = this.data.apps,
        postfix = '';

    if (role == 0) {
      postfix = '同学';
      apps = apps.concat({
        title: '已选课程',
        url: '../class/classes-list/classes-list?user_id=' + user_id,
      });
      apps = apps.concat({
        title: '我的成绩',
        url: '../score/score-list/score-list?user_id=' + user_id,
      });
    } else if (role == 1) {
      postfix = '老师';
      apps = apps.concat({
        title: '班级管理',
        url: '../class/classes-list/classes-list?user_id=' + user_id,
      });
    } else if (role == 2) {
      postfix = '管理员';
      apps = apps.concat({
        title: '课程管理',
        url: '../course/course-list/course-list'
      });
    }

    this.setData({ apps: apps, postfix: postfix });
  },

  log_out: function() {
    var complete = function() {
      wx.removeStorageSync('session_id');
      wx.removeStorageSync('is_login');
      wx.redirectTo({
        url: '/pages/credential/login/login',
      });
    }
    u.request(
      'DELETE', '/credential/account', {},
      complete, complete);
  },

  user_information: function () {
    wx.navigateTo({
      url: './user-information/user-information',
    })
  },

  selected_class: function(){
    wx.navigateTo({
      url: './enrolled-in-classes/enrolled-in-classes',
    })
  }
})