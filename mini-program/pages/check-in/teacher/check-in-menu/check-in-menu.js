var u = getApp().utils;
var _ = require('../../../i18n.js')._;



Page({
  data: {
    activities: {},
  },

  onLoad: function (options) {
    this.setData({ langIndex: wx.getStorageSync('langIndex') });
    var class_id = options.class_id;
    console.log('class_id=', class_id);
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