var u = getApp().utils;


Page({
  data: {
    class_id: '',
    staff_id: '',
    score: '',
  },

  onLoad: function (options) {
    this.data.class_id = options.class_id;
  },

  bindStaffID: function (e) {
    this.setData({ staff_id: e.detail.value });
  },
  bindScore: function (e) {
    this.setData({ score: e.detail.value });
  },

  submit: function () {
    u.request(
      'PUT', '/score',
      {
        score: this.data.score,
        staff_id: this.data.staff_id,
        class_id: this.data.class_id,
      },
      (res) => {
        wx.showToast({
          title: '添加成功',
          duration: 800,
        });
        this.setData({
          staff_id: '',
          score: '',
        });
      },
      (res) => {
        var msg = '导入失败:' + res.statusCode;
        if (res.statusCode == 404) {
          msg = '没有学号为' + this.data.staff_id + '的学生';
        }
        wx.showToast({
          title: msg,
          duration: 2000,
          icon: 'none',
        });
      }
    );
  }
});