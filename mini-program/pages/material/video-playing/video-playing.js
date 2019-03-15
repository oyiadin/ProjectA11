var u = getApp().utils;


Page({
  data: {
    src: u.gen_url('/material/1') + '?session_id=' + wx.getStorageSync('session_id'),
  },
});
