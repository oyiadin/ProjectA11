Page({


  generate_check_in_code: function(){
    var that = this;
    wx.request({
      url: "http://localhost:8888/api/v1/check-in/class/3/code?session_id=14c0e8c2a3b87b6909cf58b6e6f38ea22fb3051310b3c01989475d59b7494cf18aab9f7939cd5ce1c4ac2551aef6cd33",
      method:'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        that.setData({msg:res.data.code});
        wx.hideToast();
      }
    });
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    });
  },
});
