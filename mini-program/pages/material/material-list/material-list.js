var u = getApp().utils;


Page({
  data: {
    materials: [],
  },

  onLoad: function(options) {
    this.class_id = options.class_id,
    this.course_id = options.course_id;
  },

  onShow: function () {
    var url;
    if (this.class_id) {
      url = '/class/' + this.class_id + '/materials/list';
    } else if (this.course_id) {
      url = '/course/' + this.course_id + '/materials/list';
    }

    u.request(
      'GET', url, {},
      (res) => {
        this.setData({ materials: res.data.list });
      }
    )
  }
});
