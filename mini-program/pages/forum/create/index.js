var u = getApp().utils;
var _ = require('../../i18n.js')._;



Page({
  data: {
    len: 0,
  },

  onLoad: function (options) {
    this.setData({ langIndex: wx.getStorageSync('langIndex') });
    this.setData({
      class_id: options.class_id,
      course_id: options.course_id
    });
  },

  change_title: function (e) {
    this.setData({ title: e.detail.value });
  },
  change_content: function (e) {
    this.setData({ content: e.detail.value, len: e.detail.value.length });
  },

  submit: function() {
    var url;
    if (this.data.class_id) {
      url = '/class/' + this.data.class_id + '/forum/topic';
    } else if (this.data.course_id) {
      url = '/course/' + this.data.course_id + '/forum/topic';
    }

    u.request(
      'PUT', url,
      {
        title: this.data.title,
        content: this.data.content,
      },
      (res) => {
        wx.hideLoading();
        wx.showToast({
          title: '发布成功！',
          duration: 1500,
        });
        setTimeout(() => {
          wx.redirectTo({
            url: '../topic/index?topic_id=' + res.data.topic_id
                 + '&class_id=' + this.data.class_id
                 + '&course_id=' + this.data.course_id,
          });
        }, 1500);
      }
    )
  }
})
