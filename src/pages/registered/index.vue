<template>
  <div class="registered">
    <div class="box">
      <div class="left">
        <div v-if="!isxiugaipassword" class="registeredBox">
          <div class="top">
            <h3>登录</h3>
            <p>欢迎来到另起一行后台管理</p>
          </div>
          <el-form :model="form">
            <el-form-item label="账号" class="formItem">
              <el-input v-model="form.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" class="formItem">
              <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <p style="text-align:left;color:red;fontSize:12px;">初始密码是123456</p>
          <div class="loginButton">
            <el-button type="primary" @click="login">登录</el-button>
            <!-- <el-button @click="regist">注册</el-button> -->
          </div>
        </div>
        <div v-else class="registeredBox" style="height:250px">
          <el-form :model="form">
            <el-form-item label="用户名" class="formItem changePassword">
              <el-input :disabled="true" v-model="form.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="旧密码" class="formItem changePassword">
              <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" class="formItem changePassword">
              <el-input type="password" v-model="form.newpassword" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div class="loginButton">
            <el-button type="primary" @click="edit">确定</el-button>
          </div>
        </div>
      </div>
      <div class="right">
        <img src="../../../static/images/regist.png"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'registered',
  data(){
    return {
      form:{
        username:'',
        password:'',
        newpassword:''
      },
      isxiugaipassword: false
    } 
  },
  created(){
    let href = window.location.hash
    // console.log(window.location)
    if(href!==''){
      if(href.split('?')[1].split("=")[1] == 3){
        
        this.isxiugaipassword = true
        this.form.username = JSON.parse(sessionStorage.userinfo).username
      }
    }
  },
  methods:{
    edit(){
      if(this.form.username == '' || this.form.password == '' ||this.form.newpassword == '' ){
        this.$message({
          message: "请填写新密码和旧密码",
          type: "error",
          duration: 1000,
          center: true
        });
        return
      }
      this.$http({
        url: "/bjyyq/apimg/changePassword",
        data: { 
          username: this.form.username,
          password: CryptoJS.SHA1(this.form.password).toString(CryptoJS.enc.Hex),
          newpassword: CryptoJS.SHA1(this.form.newpassword).toString(CryptoJS.enc.Hex)
        },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.$message({
              message: "修改成功,请重新登录",
              type: "success",
              duration: 1000,
              center: true
            });
            this.isxiugaipassword = false
            this.form = {
              username:'',
              password:'',
              newpassword:''
            }
          }else{
            this.$message({
              message: data.data,
              type: "error",
              duration: 1000,
              center: true
            });
          }
        }
      })
    },
    login(){
      if(this.form.username == '' || this.form.password == '' ){
        this.$message({
          message: "请填写用户名和密码",
          type: "error",
          duration: 1000,
          center: true
        });
        return
      }
      this.$http({
        url: "/bjyyq/apimg/login",
        data: { 
          username: this.form.username,
          password: CryptoJS.SHA1(this.form.password).toString(CryptoJS.enc.Hex)
        },
        method: "get",
        success: data => {
          if (data.status === "success") {
            console.log(data.data)
            this.$message({
              message: "登录成功",
              type: "success",
              duration: 1000,
              center: true
            });
            sessionStorage.userid = data.data[0].id
            sessionStorage.userinfo = JSON.stringify(data.data[0])
            // sessionStorage.userid = 1
            this.$router.push('/home')
          }else{
            this.$message({
              message: data.data,
              type: "error",
              duration: 1000,
              center: true
            });
          }
        }
      })
      
    },
    regist(){
      if(this.form.username == '' || this.form.password == '' ){
        this.$message({
          message: "请填写用户名和密码",
          type: "error",
          duration: 1000,
          center: true
        });
        return
      }
      console.log(CryptoJS,'CryptoJS')
      this.$http({
        url: "/bjyyq/apimg/registered",
        data: { 
          username: this.form.username,
          password: CryptoJS.SHA1(this.form.password).toString(CryptoJS.enc.Hex)
        },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.form = {
              username:'',
              password:''
            }
            this.$message({
              message: "注册成功",
              type: "success",
              duration: 1000,
              center: true
            });
          }else{
            this.$message({
              message: data.data,
              type: "error",
              duration: 1000,
              center: true
            });
          }
        }
      })
      // sessionStorage.userid = 1
    }
  }
}
</script>
<style lang="less">
.registered{
  .el-input__inner{
    border: none!important;
    background-color:transparent;
    border:0;
  }
  .el-form-item__label{
    width: auto!important;
    text-align: left!important;
    font-size:16px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(66,171,144,1);
  }
  .changePassword{
    .el-form-item__label{
      width: 65px!important;
      text-align: left!important;
      font-size:16px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(66,171,144,1);
    }
  }
}
</style>
<style lang="less" scoped>
  .registered{
    display: flex;
    display: -webkit-flex;
    align-items:center;
    justify-content:center;
    min-height:900px;
    background:linear-gradient(0deg,rgba(158,226,208,1) 0%,rgba(125,210,249,1) 99%);
    // padding: 100px 120px;
    // box-sizing: border-box;
    height: 100vh;
    .box{
      width: 1200px;
      height: 700px;
      background: red;
      display: block;
      margin: 100px 120px;
      background:rgba(67,200,166,1);
      border-radius:2px;
      vertical-align: top;
      >div{
        display: inline-block;
        vertical-align: top;
      }
      .left{
        width: 518px;
        height: 100%;
        background: #fff;
        text-align: center;
        .top{
          h3{
            font-size:36px;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(66,171,144,1);
          }
          p{
            font-size:16px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(102,102,102,1);
            padding-top: 14px;
          }
        }
      }
      .right{
        width: 682px;
        float: right;
        img{
          width: 608px;
          height: 432px;
          display: inline-block;
          margin-top: 202px;
          float: right;
          margin-right: 30px;
        }
      }
    }
    .registeredBox{
      width: 260px;
      margin: 0 auto;
      margin-top: 193px;
      // height: 190px;
      // // background: #eef0f3;
      // padding-top: 20px;
      // border-radius: 10px;
    }
    .loginButton{
      text-align: center;
      button{
        margin-top: 45px;
        width:260px;
        height:40px;
        background:linear-gradient(90deg,rgba(66,171,144,1) 0%,rgba(66,143,171,1) 99%);
        box-shadow:-1px 11px 38px 0px rgba(156,225,210,0.43);
        border-radius:20px;
      }
    }
    .formItem{
      display: flex;
      border-bottom: 1px solid #42AB90;
      margin-bottom: 15px;
      
    }
    .el-form{
      margin-top: 40px
    }
  }
</style>
