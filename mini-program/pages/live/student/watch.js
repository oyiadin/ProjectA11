var u = getApp().utils;
var _ = require('../../i18n.js')._;



Page({
  data: {
    src: ""
  },

  onLoad: function (options) {
    this.setData({ langIndex: wx.getStorageSync('langIndex') });
    var live_id = options.live_id;
    u.request(
      'GET', '/live/' + live_id, {},
      (res) => {
        this.setData({ src: res.data.play_url });
      }
    );
  },

  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  inputValue: '',

  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },

  bindPlay: function () {
    this.videoContext.play()
  },

  bindPause: function () {
    this.videoContext.pause()
  },
  
  videoErrorCallback: function (e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },
})