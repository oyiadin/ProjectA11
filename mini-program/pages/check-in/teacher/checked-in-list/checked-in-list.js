var u = require('../../../../utils/utils.js');


Page({
  get_student_list: function(e){
    var that = this;
    var code_id = wx.getStorageSync("code_id");
    u.request(
      'GET', '/check-in/code/' + code_id + '/list',{},
      function(res){
        console.log(res.data);
        that.setData({ staff_id: res.data.list[0].staff_id});
        that.setData({ user_id: res.data.list[0].user_id });
        wx.hideLoading();
      }
    )
    wx.showLoading({
      title: '获取中',
      mask: true
    })
  }
})