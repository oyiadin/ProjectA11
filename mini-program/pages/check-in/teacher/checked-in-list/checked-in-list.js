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
    var code_id = options.code_id;

    u.request(
      'GET', '/check-in/code/' + code_id + '/list', {},
      (res) => {
        this.setData({ logs: res.data.list });
      }
    )
  },

  bindoperationCodeChange: function (e) {
    console.log('picker operation code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      operationCodeIndex: e.detail.value
    })
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
})