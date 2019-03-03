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
});
