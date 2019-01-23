new Vue({
  el:'#app',
  methods:{
    CheckLogIn:function(){
      var ID = document.getElementById("StuID")
      var Name = document.getElementById("UserName")
      var FstPSW = document.getElementById("FirstPassword")
      var SecPSW = document.getElementById("SecondPassword")
      if(ID.value==""){
        alert('请输入学号！')
      }
      else if(Name.value==""){
        alert('请输入用户名！')
      }
      else if(FstPSW.value==""){
        alert('请输入密码！')
      }
      else if(FstPSW.value.length<6 || FstPSW.value.length>15){
        alert('密码要在6-15位之间！')
      }
      else if(SecPSW.value==""){
        alert('请重新输入密码！')
      }
      else if(FstPSW.value!=SecPSW.value){
        alert('两次输入的密码不一致！')
      }
      else alert('已提交！')
    }
  }
})
