var base = require('../../base.js');
const request = base.request;

Page({
  data: {
    account_types: ["学生", "教师"],
    account_types_name: ["学号", "教职工号"],
    account_type_index: 0,
  },

  bind_account_type_change: function (e) {
    this.setData({
      account_type_index: e.detail.value
    });
  },

  do_login: function (e) {
    request(
      'PUT', '/credential/account',
      {
        user_id: 123456,
        password: "p@ssword"
      },
    );
  }
});
