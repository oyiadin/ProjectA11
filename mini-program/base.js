function success_callback(res) {
  console.log('success: ' + res.statusCode + ' ' + res.data);
}

function fail_callback(res) {
  console.log('failed: ' + res.statusCode + ' ' + res.data);
}

function nonsense(res) {}

function request(
    method, url, data,
    parse_json = true,
    success = success_callback,
    fail = fail_callback,
    complete = nonsense) {

    function _req() {
      wx.request({
        url: url,
        data: data,
        header: { 'Content-Type': 'application/json' },
        method: method,
        dataType: parse_json ? "json" : "binary",
        success: success,
        fail: fail,
        complete: complete
      });
    }
  
  console.log(method + ' ' + url);
  url = 'http://localhost:8888/api/v1' + url;

  wx.getStorage({
    key: 'session_id',
    success: function(res) {
      if (res.data) {
        url = url + '?session_id=' + res.data;
      }
      _req();
    },
    fail: function(res) {
      _req();
    }
  });
}


module.exports = {
  request: request,
};
