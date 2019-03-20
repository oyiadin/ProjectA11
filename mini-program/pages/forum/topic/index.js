var u = getApp().utils;


Page({
  data:{
    icon: "../../../images/icons/user0.png",
    len: 0,
    content: "",
    showModal: false,
  },

  change_content: function (e) {
    this.setData({ content: e.detail.value, len: e.detail.value.length})
  },

  submit: function () {
    var url;
    if (this.data.class_id) {
      url = '/class/' + this.data.class_id;
    } else if (this.data.course_id) {
      url = '/course/' + this.data.course_id;
    }
    url = url + '/forum/topic/' + this.data.topic_id + '/reply';

    u.request(
      'PUT', url, { content: this.data.content },
      (res) => {
        wx.showToast({
          title: '回复成功！',
        });
        this.refresh();
      }
    );
  },

  onLoad: function (options) {
    var topic_id = options.topic_id,
        class_id = options.class_id,
        course_id = options.course_id;
    this.data.topic_id = topic_id;
    
    var url;
    if (class_id) {
      this.setData({ class_mode: true, class_id: class_id });
      
    } else if (course_id) {
      this.setData({ course_mode: true, course_id: course_id });
      url = '/course/' + course_id + '/forum/topic/' + topic_id;
    }

    this.refresh();
  },

  refresh: function (callback) {
    wx.showLoading({
      title: '加载中',
    });
    var url,
        topic_id = this.data.topic_id,
        class_id = this.data.class_id,
        course_id = this.data.course_id;
    if (class_id) {
      url = '/class/' + class_id + '/forum/topic/' + topic_id;
    } else if (course_id) {
      url = '/course/' + course_id + '/forum/topic/' + topic_id;
    }

    u.request(
      'GET', url, {},
      (res) => {
        var topic = res.data;
        topic.date = u.timestamp2date(topic.created_at);
        this.setData({ topic: topic });
        u.request(
          'GET', url + '/replies', {},
          (res) => {
            this.setData({ replies: res.data.list });
            if (callback) callback();
            wx.hideLoading();
          }
        );
      }
    );
  },

  onPullDownRefresh: function() {
    this.refresh(wx.stopPullDownRefresh);
  },


  reply: function () {
    this.setData({
      showModal: true
    })
  },

  preventTouchMove: function () {
    this.setData({
      showModal: false
    })
  },


  // go: function () {
  //   this.setData({
  //     showModal: false
  //   })
  // }

})