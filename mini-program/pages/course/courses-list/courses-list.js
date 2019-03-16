var u = getApp().utils;


Page({
  data: {
    classes: [],
  },

  onLoad: function() {
    const that = this;
    u.request(
      'GET', '/courses', {},
      function (res) {
        var classes = res.data.list;
        for (var i = 0; i < classes.length; i++) {
          classes[i].date1 = u.timestamp2date(classes[i].start);
          classes[i].date2 = u.timestamp2date(classes[i].end);
        }
        that.setData({ classes: res.data.list });
      }
    );
  },

  openAlert: function (event) {
    const that = this;
    console.log(event);
    u.request(
      'POST', '/class/' + event.currentTarget.dataset.course_id + '/enroll_in', {},
      function(res){
        wx.showModal({
          content: '选择成功',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
      },
      function(res) {
        wx.showModal({
          content: '选择失败'+res.data.msg,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击失败')
            }
          }
        });
      }
    )
  },

  // 搜索框
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
})
