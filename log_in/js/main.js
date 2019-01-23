new Vue({
  el:'#app',
  methods:{
    CheckLogIn:function(){
      var x = document.getElementById("StuID")
      var y = document.getElementById("StuPSW")
      if(x.value==""){
        alert('请输入用户名！')
      }
      else if(y.value==""){
        alert('请输入密码！')
      }
    }
  }
})
