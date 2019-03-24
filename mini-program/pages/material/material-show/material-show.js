var u = getApp().utils;


Page({
  data: {
    src: {},
    file: ''
  },

  in_: function (x) {
    var postfix = this.file.postfix;
    for (var i = 0; i < x.length; ++i) {
      if (x.includes(postfix))
        return true;
    }
    return false;
  },

  onLoad: function (options) {
    this.setData({ langIndex: wx.getStorageSync('langIndex') });
    var file_id = options.file_id;
    u.request(
      'GET', '/material/' + file_id + '/info', {},
      (res) => {
        var file = res.data;
        file.postfix = file.filename.substr(
          file.filename.lastIndexOf(".") + 1).toLowerCase();
        
        file.date = u.timestamp2date(file.uploaded_at);
        this.setData({ file: file });
      }
    );
  },

  bindDownload: function () {
    wx.downloadFile({
      url: u.gen_url('/material/' + this.data.file.file_id),
      success: (res) => {
        wx.showToast({
          title: '下载成功！',
          duration: 800,
        });

        wx.openDocument({
          filePath: res.tempFilePath,
        });
      }
    });
  }
});
