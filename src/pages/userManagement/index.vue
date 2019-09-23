<template>
  <div class="userManagement">
    <div class="filterBox">
      <Screen :screenName="screenName" @callback="callback"/>
    </div>
    <div style="padding:0 10px">
      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column prop="username" label="登录名"></el-table-column>
        <el-table-column prop="name" label="昵称"></el-table-column>
        <el-table-column prop="rolename" label="角色"></el-table-column>
        <el-table-column prop="createtime" label="创建日期"></el-table-column>
        <el-table-column prop="glucometerid" label="血糖仪id"></el-table-column>
        <el-table-column label="操作" width="350">
          <template slot-scope="scope">
            <el-button size="mini" @click="setRole(scope.row)">设置角色</el-button> 
            <el-button size="mini" @click="setUser(scope.row)">设置用户名</el-button>   
            <el-button size="mini" @click="setGlucometer(scope.row)">设置血糖仪</el-button>     
            <!-- <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            <el-button size="mini" type="success" @click="handleAdd()">添加</el-button> -->
          </template>
        </el-table-column>
        <template slot="empty">
          <el-button size="mini" type="success"></el-button>
        </template>
      </el-table>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="Number(pageData.pageIndex)"
      :page-size="10"
      :total="pageData.total"
    ></el-pagination>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form v-if="dialogTitle=='设置角色'" :model="form">
        <el-form-item label="角色:" class="formItem">
          <el-select v-model="form.rolename" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.rolename"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form v-else-if="dialogTitle=='设置用户名'" :model="form">
        <el-form-item label="用户名:" class="formItem">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-else :model="form">
        <el-form-item label="血糖仪id:" class="formItem">
          <el-input v-model="form.glucometerid"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Screen from '@/components/Screen'
export default {
  name:'userManagement',
  data(){
    return{
      screenName: [
        {
          value: "name",
          label: "昵称"
        }
      ],
      dialogFormVisible: false,
      dialogTitle: "",
      pageData: {
        pageIndex: 1,
        total: 0,
        searchKey:'',
        searchValue:''
      },
      form: {
        username: "213",
        name: "123",
        rolename:''
      },
      tableData: [],
      options:[]
    }
  },
  created(){
    this.getList()
    this.getAllRole()
    // this.$http({
    //   url: "/sendbloodsugar",
    //   data: {devicesn:'1',result:'10',testtime:'2019-09-23 05:00:00' },
    //   method: "post",
    //   success: data => {
    //     if (data.status === "success") {
          
    //     }
    //   }
    // });
  },
  components:{
    Screen
  },
  methods:{
    // setUserName(msg){
    //   this.$http({
    //     url: "/bjyyq/apimg/registered",
    //     data: { 
    //       username: msg.username,
    //       password: CryptoJS.SHA1(123456).toString(CryptoJS.enc.Hex),

    //     },
    //     method: "get",
    //     success: data => {
    //       if (data.status === "success") {
    //         this.$message({
    //           message: "注册成功",
    //           type: "success",
    //           duration: 1000,
    //           center: true
    //         });
    //       }
    //     }
    //   })
    // },
    setGlucometer(msg){
      this.dialogFormVisible = true
      this.dialogTitle = '设置血糖仪id'
      this.form = JSON.parse(JSON.stringify(msg))
    },
    callback(res){
      console.log(res,'sss')
      this.pageData.pageIndex = 1
      this.pageData.searchKey = res.key
      this.pageData.searchValue = res.value
      this.getList(this.pageData.searchKey,this.pageData.searchValue)
    },
    getAllRole(){
      this.$http({
        url: "/bjyyq/apimg/roleList",
        data: { type:'all' },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.options = data.data.data;
            this.options.unshift({
              rolename:'无角色',
              id:'norole'
            })
          }
        }
      });
    },
    determine(){
      this.dialogFormVisible = false
      let type = ''
      if(this.dialogTitle == '设置用户名'){
        type = 'setusername'
      }else if(this.dialogTitle == '设置角色'){
        type = 'setrolename'
      }else{
        type = 'setglucometerid'
      }
      this.dialogTitle = ''
      // CryptoJS.SHA1(this.form.password).toString(CryptoJS.enc.Hex)
      this.form.password = CryptoJS.SHA1('123456').toString(CryptoJS.enc.Hex)
      if(this.form.rolename == 'norole'){
         this.form.rolename = null
      }
      // console.log(this.form,'form')
      this.$http({
        url: "/bjyyq/apimg/userRoleAction",
        data: {...this.form,type},
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1000,
              center: true
            });
          }else{
            if(type=='setusername' || type=='setglucometerid'){
              this.$message({
                message: data.data,
                type: "error",
                duration: 1000,
                center: true
              });
            }
            
          }
        }
      }).then(() => {
        this.pageData.pageIndex = 1
        this.getList();
      });
    },
    setRole(msg){
      this.dialogFormVisible = true
      this.dialogTitle = '设置角色'
      this.form = JSON.parse(JSON.stringify(msg))
    },
    setUser(msg){
      this.dialogFormVisible = true
      this.dialogTitle = '设置用户名'
      this.form = JSON.parse(JSON.stringify(msg))
    },
    //获取列表数据
    getList(searchKey='',searchValue='') {
      this.$http({
        url: "/bjyyq/apimg/userList",
        data: { pageIndex: this.pageData.pageIndex,searchKey,searchValue },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.tableData = data.data.data;
            this.pageData = data.data.pageData;
          }
        }
      });
    },
    //改变分页
    handleCurrentChange(val) {
      this.pageData.pageIndex = val;
      this.getList()
    }
  }
}
</script>
<style lang="less" scoped>
.userManagement {
  background: #fff;
  .filterBox{
    padding: 10px;
  }
  .el-pagination {
    text-align: right;
    padding: 10px 0px;
  }
  .formItem {
    display: flex;
  }
  //   .el-form-item__content{
  //       display: flex!important;
  //   }
  .el-input {
    width: 250px;
  }
  .el-textarea {
    width: 400px;
  }
}
</style>