var u = getApp().utils;


Page({
  data: {
    apps: [
      {
        title: '创建直播',
        url: './live_create/live_create',
      },
      {
        title: '已创建直播',
        url: './live_exists/live_exists',
      }
    ]
  },

  onLoad: function() {
    
  }
});