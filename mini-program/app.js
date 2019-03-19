function success_callback(res) { }
function fail_callback(res) { }
function logger(res) { console.log(res.data); }


App({
  onLaunch: function (options) {
    var query = options.query;
    this.protocol = query.protocol || 'https';
    this.host = query.host || 'project-a11.lwh.red';
    this.port = query.port || '8888';
    console.log('启动了');
  },

  utils: {
    get_timestamp: function (date) {
      date = date.replace(/-/g, '/');
      var timestamp = new Date(date).getTime();
      return timestamp / 1000;
    },
    timestamp2date: function (timestamp) {
      var date = new Date();
      date.setTime(timestamp * 1000);
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      return Y + M + D;
    },
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
