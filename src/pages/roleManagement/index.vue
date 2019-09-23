<template>
  <div class="roleManagement">
    <div style="padding:10px 0px;"><el-button type="success" @click="handleAdd()">添加</el-button></div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="rolename" label="名称"></el-table-column>
      <el-table-column prop="roledesc" label="描述"></el-table-column>
      <el-table-column label="操作" width="550">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          
          <el-button size="mini" @click="changeAuth(scope.row)">权限管理</el-button>
        </template>
      </el-table-column>
      <template slot="empty">
        <el-button size="mini" type="success" @click="handleAdd()">添加角色</el-button>
      </template>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="Number(pageData.pageIndex)"
      :page-size="10"
      :total="pageData.total"
    ></el-pagination>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="名称:" class="formItem">
          <el-input v-model="form.rolename" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述:" class="formItem">
          <el-input type="textarea" v-model="form.roledesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'权限管理'" @close="closeAuth" :visible.sync="dialogAuthVisible">
      <div>
        <el-transfer
          :titles="['暂无权限菜单','已有权限菜单']"
          v-model="anthValue"
          :props="{
            key: 'id',
            label: 'menuname'
          }"
          :data="anthData">
        </el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAuth">取 消</el-button>
        <el-button type="primary" @click="authDetermine">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'roleManagement',
  data(){
    return {
      dialogFormVisible: false,
      dialogAuthVisible:false,
      authMsg:{},
      dialogTitle: "",
      pageData: {
        pageIndex: 1,
        total: 0
      },
      form: {
        rolename: "",
        roledesc: ""
      },
      tableData: [],
      anthData:[],
      anthValue:[],
      allAuthData:[]
    }
  },
  created(){
    this.getList()
  },
  methods:{
    changeAuth(msg){
      this.dialogAuthVisible = true
      console.log(msg,'msg')
      this.authMsg = msg
      this.getAuthMenu().then(()=>{
        this.getAuthMenu(msg.id,'menuauth')
      })
    },
    closeAuth(){
      this.dialogAuthVisible = false
      this.authMsg = {}
    },
    authDetermine(){
      // let arr = []
      // this.anthData.map((item,index)=>{
      //   this.anthValue.map((item1,index1)=>{
      //     if(item1 == item.id){
      //       arr.push(item)
      //     }
      //   })
      // })
      // let arr1 = []
      // arr.map((item,index)=>{
      //    this.anthData.map((item1,index1)=>{
      //      if(item.parentid == item1.id){
      //        this.anthValue.push(item1.id)
      //      }
      //    })
      // })
      this.allAuthData.map((item,index)=>{
        this.anthValue.map((item1,index1)=>{
          console.log(item,this.allAuthData,this.anthValue,'item')
          // if(item.children.length>0){
            if(item.id == item1){
            
              this.anthValue.push(item.parentid)
            }
          // }
          
          // item.children.map(()=>{})
        })
      })
      this.anthValue = [...new Set(this.anthValue)]
      console.log(this.anthValue,'this.authMsg')
      this.$http({
        url: "/bjyyq/apimg/setAuthMenu",
        data: {
          roleid: this.authMsg.id,
          anthMenuIds: this.anthValue.join(',')
        },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.closeAuth()
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1000,
              center: true
            });
          }
        }
      })
    },
    async getAuthMenu(roleid,type){
      await this.$http({
        url: "/bjyyq/apimg/menuList",
        data: {roleid,type},
        method: "get",
        success: data => {
          if (data.status === "success") {
            if(roleid){
              this.anthValue = []
              data.data.map((item)=>{
                if(item.children.length>0){
                  item.children.map((item1)=>{
                    this.anthValue.push(Number(item1.menuid))
                  })
                }else{
                  this.anthValue.push(Number(item.menuid))
                }
                
              })
              console.log(this.anthData,this.anthValue,'anthValue')
            }else{
              this.anthData = []
              this.allAuthData = data.data
              data.data.map((item)=>{
                if(item.parentid){
                  console.log(item,'lllllllllllllllllllllllll')
                  this.anthData.push(item)
                }
                if(item.menuname=='咨询' || item.menuname=='订单管理' || item.menuname=='厨房执行配餐'){
                  this.anthData.push(item)
                }
              })
            }
          }
        }
      })
    },
    //改变分页
    handleCurrentChange(val) {
      this.pageData.pageIndex = val;
      this.getList()
    },
    //获取列表数据
    getList() {
      this.$http({
        url: "/bjyyq/apimg/roleList",
        data: { pageIndex: this.pageData.pageIndex },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.tableData = data.data.data;
            this.pageData = data.data.pageData;
          }
        }
      });
    },
    //编辑按钮
    handleEdit(msg) {
      this.dialogFormVisible = true;
      this.dialogTitle = "修改角色";
      this.form = JSON.parse(JSON.stringify(msg));
    },
    //添加按钮
    handleAdd() {
      this.dialogFormVisible = true;
      this.dialogTitle = "添加角色";
      this.form = {
        rolename: "",
        rolename: ""
      };
    },
    //删除按钮
    handleDelete(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: "/bjyyq/apimg/roleDelete",
            data: { id: id },
            method: "get",
            success: data => {
              if (data.status === "success") {
                this.$message({
                  message: "删除成功",
                  type: "success",
                  duration: 1000,
                  center: true
                });
              }
            }
          }).then(() => {
            if ((this.pageData.total - 10 )* (this.pageData.pageIndex - 1) == 1) {
              this.pageData.pageIndex = this.pageData.pageIndex - 1;
            }
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //添加确定修改回调
    determine() {
      this.dialogFormVisible = false;
      this.$http({
        url: "/bjyyq/apimg/roleAction",
        data: this.form,
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1000,
              center: true
            });
          }
        }
      }).then(() => {
        this.getList();
      });
    },
  }
}
</script>
<style lang="less">
  .roleManagement {
    .el-checkbox__input{
      left: 0px!important;
    }
    .el-transfer-panel__header{
      padding-left: 0px;
    }
    .el-checkbox:last-of-type{
      margin-right: 30px;
    }
    .el-checkbox__label{
      width: 100px!important;
      >span{
        right: 0px!important;
      }
    }
  }
</style>
<style lang="less" scoped>
.roleManagement {
  // background: #fff;
  text-align: left;
  .el-checkbox__input{
    left: 0px!important;
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