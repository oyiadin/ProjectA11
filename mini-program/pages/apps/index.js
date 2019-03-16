var u = getApp().utils;


Page({
  data: {
    apps: [
      {
        title: '用户信息',
        url: '../user/user-information/user-information',
      },
      {
        title: '签到(学生)',
        url: '../check-in/student/do-check-in',
      },
      {
        title: '签到(教师)',
        url: '../check-in/teacher/start-check-in/start-check-in',
      },
      {
        title: '课程列表',
        url: '../class/classes-list/classes-list',
      },
      {
        title: '已选课程',
        url: '../user/enrolled-in-classes/enrolled-in-classes',
      },
      {
        title: '查看分数(学生)',
        url: '../uncatalogued/show_score/show_score',
      },
      {
        title: '增加分数(教师)',
        url: '../uncatalogued/set_score/set_score',
      },
      {
        title: '教学视频',
        url: '../material/material-list/material-list',
      },
      {
        title: '课程管理中心',
        url: '../class/classes-control/classes-control',
      }
    ]
  },
});
