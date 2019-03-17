Page({
  data: {
    classes: ["1", "2", "3"],
    classIndex: 0
  },
  bindClass: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      classIndex: e.detail.value
    })
  }
});