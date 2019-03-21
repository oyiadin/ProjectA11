var u = getApp().utils;


Page({
  data: {
    logs: [],
    checkboxItems: [
      { value: '0', checked: false }
    ],
    operationCodes: ["已到", "迟到", "早退", "旷课"],
    operationCodeIndex: 0
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '载入中',
    });
    var code_id = options.code_id;

    u.request(
      'GET', '/check-in/code/' + code_id + '/list', {},
      (res) => {
        this.setData({ logs: res.data.list });
        wx.hideLoading();
      }
    )
  },

  bindoperationCodeChange: function (e) {
    this.setData({
      operationCodeIndex: e.detail.value
    })
  },

  checkboxChange: function (e) {
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
})