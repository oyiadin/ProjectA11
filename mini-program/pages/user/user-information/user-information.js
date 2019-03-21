var u = getApp().utils;


Page({
  data: {
    response: {},
  },

  onLoad: function (options) {
    var user_id = options.user_id;
    u.request(
      'GET', '/user/' + user_id, {},
      (res) => {
        this.setData({ data: res.data });
      }
    );
  },

})