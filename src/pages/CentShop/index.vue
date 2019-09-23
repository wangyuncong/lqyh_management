<template>
  <div class="centShop">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="goodname" label="名称"></el-table-column>
      <el-table-column prop="goodcent" label="商品价格（所需积分）"></el-table-column>
      <el-table-column prop="typeValue" label="类型"></el-table-column>
      <el-table-column prop="goodpic" label="图片">
        <template slot-scope="scope">
          <img v-if="scope.row.goodpic!=='' && scope.row.goodpic!==null && scope.row.goodpic!==undefined && scope.row.goodpic!=='undefined'" :src="img + '/'+ scope.row.goodpic" class="tableImg" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <div class="buttons">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="success" @click="xiajia(scope.row.id)">下架</el-button>
          </div>
        </template>
      </el-table-column>
      <template slot="empty">
        <el-button size="mini" type="success">上架优惠劵</el-button>
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
          <el-input v-model="form.goodname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格（所需积分）:" class="formItem">
          <el-input type="number" v-model="form.goodcent" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片:" class="formItem">
          <el-upload
            class="upload-demo"
            :http-request="(file)=>{uploadFileMethod(file)}"
            action
            :file-list="fileList"
            list-type="picture"
            :on-exceed="handleErrBig"
            :limit="Number(1)"
          >
            <el-button size="small" type="primary">点击修改</el-button>
          </el-upload>
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
  name: 'centShop',
  data(){
    return {
      dialogFormVisible:false,
      tableData: [],
      dialogTitle: "",
      pageData: {
        pageIndex: 1,
        total: 0
      },
      form:{
        goodname: '',
        goodcent: '',
        goodpic:''
      },
      fileList: [],
      img:''
    }
  },
  created(){
    this.img = sessionStorage.img
    this.getList()
  },
  methods:{
    //改变分页
    handleCurrentChange(val) {
      this.pageData.pageIndex = val;
      this.getList()
    },
    //上传大于一个，详情图片
    handleErrBig(file, fileList) {
      this.$message({
        message: "只能添加一张图片，请先删除再添加",
        type: "error",
        duration: 2500,
        center: true
      });
    },
    uploadFileMethod(param, type) {
      let fileObject = param.file;
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
            this.form.goodpic = data.data;
          } else {
            this.$message({
              message: "操作失败",
              type: "error",
              duration: 1000,
              center: true
            });
            this.fileList = []
          }
        }
      });
    },
    //获取列表数据
    async getList() {
      await this.$http({
        url: "/bjyyq/apimg/centshopList",
        data: { pageIndex: this.pageData.pageIndex},
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.tableData = data.data.data;
            this.pageData = data.data.pageData;
            this.tableData.map((item)=>{
              item.isShangjia = false
              if(item.type == 0){
                item.typeValue = '满减优惠'
              }else{
                item.typeValue = '其他优惠'
              }
            })
          }
        }
      });
    },
    handleEdit(msg){
      this.fileList = []
      let fileObj = {
        name: msg.goodpic,
        url: this.img +`/${msg.goodpic}`
      };
      this.dialogFormVisible = true;
      this.dialogTitle = "修改"+msg.goodname;
      this.form = JSON.parse(JSON.stringify(msg));
      if(msg.goodpic!=='' && msg.goodpic!==null && msg.goodpic!==undefined && msg.goodpic!=='undefined'){
        this.fileList.push(fileObj);
      }
      
    },
    xiajia(id){
      this.$http({
        url: "/bjyyq/apimg/centshopDelete",
        data: {id},
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
        console.log('0000000000000')
        if ((this.pageData.total - 10) * (this.pageData.pageIndex - 1) == 1) {
          console.log('////////////')
          this.pageData.pageIndex = this.pageData.pageIndex - 1;
        }
        console.log(this.pageData.pageIndex,(this.pageData.total - 10 )* (this.pageData.pageIndex - 1) == 1,this.pageData.total,'this.pageData.pageIndex')
        this.getList();
      });
    },
    //添加确定修改回调
    determine() {
      this.dialogFormVisible = false;
      this.$http({
        url: "/bjyyq/apimg/centshopAction",
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
    }
  }
}
</script>
<style lang="less" scoped>
.centShop{
    .tableImg{
      width:100px;
      display: inline-block;
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
    // .buttons{
    //   .el-button{
    //     margin-left: 10px;
    //     margin-top: 10px;
    //   }
    // }
  }
</style>