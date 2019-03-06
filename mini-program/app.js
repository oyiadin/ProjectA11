// app.js
App({
  // 启动时
  onLaunch: function () {
    console.log('启动了')
    // 调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    if (!logs) {
      pass
    }
    else {
      this.appData.logs = logs;
    }
  },

  // 登录
  login: function (e) {
    pass;
  },

  // 注册代码
  register: function (e) {
    pass;;
  },

  appData: {
    userInfo: null,
    log: null,
  }
})