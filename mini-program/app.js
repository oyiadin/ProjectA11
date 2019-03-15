function success_callback(res) { }
function fail_callback(res) { }
function logger(res) { console.log(res.data); }


App({
  onLaunch: function (options) {
    var query = options.query;
    this.protocol = query.protocol || 'http';
    this.host = query.host || '127.0.0.1';
    this.port = query.port || '8888';
    console.log('启动了');
  },

  utils: {
    gen_url: function(url) {
      var app = getApp();
      return app.protocol + '://' + app.host + ':' + app.port + '/api/v1' + url;
    },
    request: function(
        method, url, data,
        success = success_callback,
        fail = fail_callback,
        parse_json = true) {
      var status_code_checker = function (res) {
        if (res.statusCode == 200) {
          success(res);
        } else {
          fail(res);
        }
      }

      function _req() {
        wx.request({
          url: url,
          data: data,
          header: { 'Content-Type': 'application/json' },
          method: method,
          dataType: parse_json ? "json" : "binary",
          success: status_code_checker,
          fail: fail,
          complete: logger
        });
      }

      console.log(method + ' ' + url);
      url = this.gen_url(url);

      wx.getStorage({
        key: 'session_id',
        success: function (res) {
          if (res.data) {
            url = url + '?session_id=' + res.data;
          }
          _req();
        },
        fail: function (res) {
          _req();
        }
      });
    }
  }
})
