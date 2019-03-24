var u = getApp().utils;
var _ = require('../i18n.js')._;



Page({
  data: {
    apps: []
  },

  onLoad: function() {
    this.setData({ langIndex: wx.getStorageSync('langIndex') });
    this.setData({ name: wx.getStorageSync('name') });

    var role = wx.getStorageSync('role'),
        user_id = wx.getStorageSync('user_id'),
        apps = this.data.apps,
        postfix = '';

    apps = apps.concat({
      title: _('user_info'),
      url: 'user-information/user-information?user_id=' + user_id,
    });

    if (role == 0) {
      postfix = _('student_postfix');
      apps = apps.concat({
        title: _('enrolled_in_classes'),
        url: '../class/classes-list/classes-list?user_id=' + user_id,
      });
      apps = apps.concat({
        title: _('my_curriculum'),
        url: 'enrolled-in-classes/enrolled-in-classes?user_id=' + user_id,
      });
      apps = apps.concat({
        title: _('my_scores'),
        url: '../score/score-list/score-list?user_id=' + user_id,
      });
      apps = apps.concat({
        title: _('questionaire'),
        url: '../questionaire/course/course?user_id=' + user_id,
      });
      apps = apps.concat({
        title: _('teaching_quiz'),
        url: '../questionaire/teaching/teaching?user_id=' + user_id,
      });
    } else if (role == 1) {
      postfix = _('teacher_postfix');
      apps = apps.concat({
        title: _('class_management'),
        url: '../class/classes-list/classes-list?user_id=' + user_id,
        },
        {
          title: _('live_management'),
          url: '../live/teacher/index'
        }
      );
    } else if (role == 2) {
      postfix = _('admin_postfix');
      apps = apps.concat({
        title: _('course_management'),
        url: '../course/courses-list/courses-list'
      },
      {
        title: _('live_management'),
        url: '../live/teacher/index'
      });
    }

    this.setData({ apps: apps, postfix: postfix });
  },

  log_out: function() {
    wx.showModal({
      title: _('logout'),
      content: _('confirm_logout'),
      confirmText: _("ok"),
      cancelText: _("cancel"),
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