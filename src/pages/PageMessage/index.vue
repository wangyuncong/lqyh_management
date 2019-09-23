<template>
  <div class="pageMessage">
    <div style="padding:10px 0px;">
      <el-button type="success" @click="handleAdd('wenzi')">添加文字信息</el-button>
      <el-button type="success" @click="handleAdd('img')">添加图片信息</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="contentinfo" label="内容">
        <template slot-scope="scope">
          <img v-if="scope.row.src" :src="scope.row.src" class="foodImg" />
          <span v-else="!scope.row.src">{{scope.row.contentinfo}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="contenttype1" label="类型"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          
        </template>
      </el-table-column>
      <template slot="empty">
        <el-button size="mini" type="success" @click="handleAdd()">添加页面信息</el-button>
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
        <el-form-item label="内容:" class="formItem">
            <el-upload
            v-if="form.src"
            class="upload-demo"
            :http-request="(file)=>{uploadFileMethod(file,'small')}"
            action=""
            :file-list="fileList"
            list-type="picture"
            :on-exceed="handleErr"
            :limit="Number(1)"
          >
            <el-button size="small" type="primary">点击修改</el-button>
          </el-upload>
          <el-input v-else="form.src" type="textarea" v-model="form.contentinfo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型:" class="formItem">
          <el-input v-model="form.contenttype1" auto-complete="off"></el-input>
          <el-alert
            title="类型请慎重修改"
            type="warning"
            :closable="false">
            
        </el-alert>
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
export default {
  name: "PageMessage",
  data() {
    return {
        dialogFormVisible: false,
      dialogTitle: "",
      tableData: [],
      pageData: {
        pageIndex: 1,
        total: 0
      },
      fileList:[],
      form: {
        contentinfo: "",
        contenttype1: ""
      },
    };
  },
  beforeMount() {
    this.getList();
  },
  methods: {
      //图片大于一个
    handleErr(file, fileList) {
      this.$message({
        message: "只能添加一张图片，请先删除再添加",
        type: "error",
        duration: 2500,
        center: true
      });
    },
      //文件上传
      uploadFileMethod(param) {
      let fileObject = param.file;
      console.log(param.file);
      let formData = new FormData();
      formData.append("file", fileObject);
      this.$http({
        url: "/bjyyq/apimg/fileupload",
        data: formData,
        method: "post",
        success: data => {
          if (data.status === "success") {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1000,
              center: true
            });
              this.form.contentinfo = data.data;
          } else {
            this.$message({
              message: "操作失败",
              type: "error",
              duration: 1000,
              center: true
            });
            this.fileList = [];
          }
        },
        error: err =>{
            this.$message({
              message: "操作失败",
              type: "error",
              duration: 1000,
              center: true
            });
            this.fileList = [];
        }
      });
    },
    getList() {
      this.$http({
        url: "/bjyyq/apimg/pageMessageList",
        data: { pageIndex: this.pageData.pageIndex },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.tableData = data.data.data;
            this.pageData = data.data.pageData;
          }
        }
      }).then(() => {
        this.tableData = this.tableData.map(item => {
          let obj = item;
          if (item.contenttype1 == "商城轮播") {
            obj.src = `http://bjyyq.zhaoshuikan.com.cn/static/${item.contentinfo}`;
          }
          //   obj.smallImg = `http://bjyyq.zhaoshuikan.com.cn/static/${item.foodpicsmall}`;
          //   obj.bigImg = `http://bjyyq.zhaoshuikan.com.cn/static/${item.foodpicbig}`;
          return obj;
        });
        console.log(this.tableData, "?>??>>>>>>");
      });
    },
    //改变分页
    handleCurrentChange(val) {
      this.pageData.pageIndex = val;
      this.getList()
    },
    //添加按钮
    handleAdd(type) {
      this.dialogFormVisible = true;
      this.dialogTitle = "添加信息";
      if(type === 'wenzi'){
          this.form = {
            contentinfo: "",
            contenttype1: ""
        };
      }else{
          this.form = {
            contentinfo: "",
            contenttype1: "",
            src: '123'
        };
        this.fileList = []
      }
      
    },
    //编辑按钮
    handleEdit(categoryMsg) {
      this.dialogFormVisible = true;
      this.dialogTitle = "修改信息";
      this.form = JSON.parse(JSON.stringify(categoryMsg));
      this.fileList = []
      console.log(categoryMsg)
      if(categoryMsg.contenttype1 == '商城轮播'){
          let obj = {}
          obj.name = categoryMsg.contentinfo
          obj.url = categoryMsg.src
          this.fileList.push(obj)
          console.log(this.fileList)
      }
    },
    //删除按钮
    handleDelete(categoryId) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: "/bjyyq/apimg/pageMessageDelete",
            data: { id: categoryId },
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
        url: "/bjyyq/apimg/pageMessageActions",
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
};
</script>
<style lang="less" scoped>
.pageMessage {
  text-align: left;
  .el-pagination {
    text-align: right;
    padding: 10px 0px;
  }
  .foodImg {
    width: 50px;
    height: 50px;
  }
  .formItem {
    display: flex;
  }
  .el-alert{
      padding: 0px;
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

