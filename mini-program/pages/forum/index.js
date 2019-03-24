var u = getApp().utils;
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var _ = require('../i18n.js')._;



Page({
  data: {
    tabs: ["全部", "精华", "消息"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },

  onLoad: function (options) {
    this.setData({ langIndex: wx.getStorageSync('langIndex') });
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          sliderLeft: (res.windowWidth / this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
        });
      }
    });

    wx.showLoading({
      title: '载入中',
    });

    var class_id = options.class_id,
        course_id = options.course_id;
    
    var url = '';
    if (class_id) {
      this.setData({ class_mode: true, class_id: class_id });
      url = '/class/' + class_id + '/forum/topics/list';
    } else if (course_id) {
      this.setData({ course_mode: true, course_id: course_id });
      url = '/course/' + course_id + '/forum/topics/list';
    }

    u.request(
      'GET', url, {},
      (res) => {
        var topics = res.data.list;
        for (var i = 0; i < topics.length; i++) {
          topics[i].create_date = u.timestamp2date(topics[i].created_at);
          topics[i].update_date = u.timestamp2date(topics[i].updated_at);
        }
        this.setData({ topics: res.data.list });
        wx.hideLoading();
      }
    );
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  navigate2topic: function (e) {
    var class_id = this.data.class_id,
        course_id = this.data.course_id;

    var url = 'topic/index?topic_id=' + e.currentTarget.dataset.topic_id;

    if (class_id) {
      url = url + '&class_id=' + class_id;
    } else if (course_id) {
      url = url + '&course_id=' + course_id;
    }

    wx.navigateTo({ url: url });
  },
});