var u = getApp().utils;


Page({
  data: {
    activities: {},
  },

  onLoad: function (options) {
    var class_id = options.class_id;
    u.request(
      'GET', '/check-in/class/' + class_id + '/activities/list', {},
      (res) => {
        var activities = res.data.list;
        for (var i = 0; i < activities.length; i++) {
          activities[i].date = u.timestamp2date(activities[i].expire_at);
        }
        this.setData({ activities: res.data.list });
      }
    )
  },
})