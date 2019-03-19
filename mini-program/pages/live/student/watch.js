var u = getApp().utils;


Page({
  data: {
    src: ""
  },

  onLoad: function (options) {
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