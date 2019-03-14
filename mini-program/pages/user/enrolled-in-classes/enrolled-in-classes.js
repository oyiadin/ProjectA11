var u = require('../../../utils/utils.js');


Page({
  data: {
    colors: ["#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD"],
    classes: [
      { "weekday": 2, "start": 1, "end": 2, "class_name": "数学分析@教A-301"}
    ],
  },

  onLoad: function() {
    const that = this;
    u.request(
      'GET', '/user/'+wx.getStorageSync('user_id')+'/classes', {},
      function(res) {
        that.setData({ classes: res.data.list });
      }
    )
  }
})