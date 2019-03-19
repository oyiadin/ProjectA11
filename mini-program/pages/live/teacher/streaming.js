var u = getApp().utils;


Page({
  data: {
    is_streaming: false,
    streaming_url: '',
    danmuList:[
      {
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '第 3s 出现的弹幕',
        color: '#ff00ff',
        time: 3
      }
    ]
  },

  onLoad: function (options) {
    this.live_id = options.live_id;
    this.pusher = wx.createLivePusherContext('pusher');
  },

  bindStartStreaming: function () {
    u.request(
      'POST', '/live/' + this.live_id + '/start', {},
      (res) => {
        this.setData({ streaming_url: res.data.url });
        console.log(this.pusher);
        this.pusher.start({
          success: (_res) => {
            console.log('succ');
            console.log(_res);
          },
          fail: (_res) => {
            console.log('fail');
            console.log(_res);
          }
        });
        console.log('started');
      }
    );
  },

  bindStopStreaming: function () {
    u.request(
      'POST', '/live/' + this.live_id + '/stop', {},
      (res) => {
        this.setData({ streaming_url: "" });
        this.pusher.stop();
      }
    );
  }
})