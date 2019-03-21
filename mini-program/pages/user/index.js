var u = getApp().utils;


Page({
  data: {
    apps: []
  },

  onLoad: function() {
    this.setData({ name: wx.getStorageSync('name') });

    var role = wx.getStorageSync('role'),
        user_id = wx.getStorageSync('user_id'),
        apps = this.data.apps,
        postfix = '';

    apps = apps.concat({
      title: '个人资料',
      url: 'user-information/user-information?user_id=' + user_id,
    });

    if (role == 0) {
      postfix = '同学';
      apps = apps.concat({
        title: '已选课程',
        url: '../class/classes-list/classes-list?user_id=' + user_id,
      });
      apps = apps.concat({
        title: '我的课表',
        url: 'enrolled-in-classes/enrolled-in-classes?user_id=' + user_id,
      });
      apps = apps.concat({
        title: '我的成绩',
        url: '../score/score-list/score-list?user_id=' + user_id,
      });
      apps = apps.concat({
        title: '课程满意度调查',
        url: '../questionaire/course/course?user_id=' + user_id,
      });
      apps = apps.concat({
        title: '教学问卷',
        url: '../questionaire/teaching/teaching?user_id=' + user_id,
      });
    } else if (role == 1) {
      postfix = '老师';
      apps = apps.concat({
        title: '班级管理',
        url: '../class/classes-list/classes-list?user_id=' + user_id,
        },
        {
          title: '直播管理',
          url: '../live/teacher/index'
        }
      );
    } else if (role == 2) {
      postfix = '管理员';
      apps = apps.concat({
        title: '课程管理',
        url: '../course/courses-list/courses-list'
      },
      {
        title: '直播管理',
        url: '../live/teacher/index'
      });
    }

    this.setData({ apps: apps, postfix: postfix });
  },

  log_out: function() {
    wx.showModal({
      title: '登出',
      content: '点击确定登出',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          var complete = function() {
            wx.removeStorageSync('session_id');
            wx.removeStorageSync('is_login');
            wx.reLaunch({
              url: '/pages/credential/login/login',
            });
          }
          u.request(
            'DELETE', '/credential/account', {},
            complete, complete
          );
        } else {
          console.log('用户点击辅助操作')
        }
      }
    });
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