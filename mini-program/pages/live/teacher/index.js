var u = getApp().utils;


Page({
  data: {
    activities: [],
  },

  onLoad: function (options) {
    this.setData({ langIndex: wx.getStorageSync('langIndex') });
    var role = wx.getStorageSync('role'),
        user_id = wx.getStorageSync('user_id');
    this.setData({ role: role, user_id: user_id });
  },

  onShow: function () {
    u.request(
      'GET', '/user/' + this.data.user_id + '/live/list', {},
      (res) => {
        var lives = res.data.list;
        for (var i = 0; i < lives.length; ++i) {
          lives[i].date = u.timestamp2date(lives[i].start);
        }
        this.setData({ lives: lives });
      }
    );
  }

})