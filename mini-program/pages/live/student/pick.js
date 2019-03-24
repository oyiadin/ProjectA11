var u = getApp().utils;


Page({
  data: {
    live_id: '',
  },

  onLoad: function () {
    this.setData({ langIndex: wx.getStorageSync('langIndex') });
  },

  change_live_id: function (e) {
    this.data.live_id = e.detail.value;
  },

  submit: function () {
    u.request(
      'GET', '/live/' + this.data.live_id, {},
      (res) => {
        wx.redirectTo({
          url: 'watch?live_id=' + this.data.live_id,
        });
      },
      (res) => {
        if (res.statusCode == 404) {
          wx.showToast({
            title: '没有这场直播！',
            icon: 'none',
            duration: 1500,
          });
        }
      }
    )

    
  }
});
