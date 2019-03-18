var u = getApp().utils;


Page({
  data: {
    checkboxItems: [
      { value: '0', checked: false }
    ],
  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },
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