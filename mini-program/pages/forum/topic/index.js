var u = getApp().utils;


Page({
  data:{
    icon: "../../../images/icons/user0.png"
  },

  onLoad: function (options) {
    var topic_id = options.topic_id,
        class_id = options.class_id,
        course_id = options.course_id;
    
    var url;
    if (class_id) {
      this.setData({ class_mode: true });
      url = '/class/' + class_id + '/forum/topic/' + topic_id;
    } else if (course_id) {
      this.setData({ course_mode: true });
      url = '/course/' + course_id + '/forum/topic/' + topic_id;
    }

    u.request(
      'GET', url, {},
      (res) => {
        this.setData({ topic: res.data });
      }
    )

    u.request(
      'GET', url + '/replies', {},
      (res) => {
        this.setData({ replies: res.data.list });
      }
    )
  }
})