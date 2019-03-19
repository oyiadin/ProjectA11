var u = getApp().utils;


Page({
  data: {
    logs: [],
    checkboxItems: [
      { value: '0', checked: false }
    ],
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