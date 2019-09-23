<template>
  <div class="goodsList">
    <div style="padding:10px 0px;"><el-button type="success" @click="handleAdd()">添加</el-button></div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="foodname" label="名称"></el-table-column>
      <el-table-column prop="fooddesc" label="描述"></el-table-column>
      <el-table-column prop="foodkeyword" label="关键字"></el-table-column>
      <el-table-column prop="foodpicsmall" label="列表图片">
        <template slot-scope="scope">
          <img :src="scope.row.smallImg" class="foodImg" />
        </template>
      </el-table-column>
      <el-table-column prop="foodpicbig" label="详情图片">
        <template slot-scope="scope">
          <img :src="scope.row.bigImg" class="foodImg" />
        </template>
      </el-table-column>
      <el-table-column prop="foodprice" label="价格(元)">
        <template slot-scope="scope">
          <p>￥{{scope.row.foodprice}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="foodtrans" label="配送规则">
        <!-- <template slot-scope="scope">
          <p>￥{{scope.row.foodprice}}</p>
        </template> -->
      </el-table-column>
      <el-table-column
        prop="categoryName"
        label="分类"
        width="100"
        :filters="this.allCategory"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag>{{scope.row.categoryName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.foodid)">删除</el-button>
          
        </template>
      </el-table-column>
      <template slot="empty">
        <el-button size="mini" type="success" @click="handleAdd()">添加商品</el-button>
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
          <el-input v-model="form.foodname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述:" class="formItem">
          <el-input type="textarea" v-model="form.fooddesc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="关键词:" class="formItem">
          <el-input v-model="form.foodkeyword" auto-complete="off"></el-input>
          <el-alert
            title="关键词用英文逗号(,)隔开"
            type="warning"
            :closable="false"/>
        </el-form-item>
        <el-form-item label="列表图片:" class="formItem">
          <el-upload
            class="upload-demo"
            :http-request="(file)=>{uploadFileMethod(file,'small')}"
            action
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileSmallList"
            list-type="picture"
            :on-exceed="handleErr"
            :on-success="handleSuccess"
            :limit="Number(1)"
          >
            <el-button size="small" type="primary">点击修改</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="详情图片:" class="formItem">
          <el-upload
            class="upload-demo"
            :http-request="(file)=>{uploadFileMethod(file,'big')}"
            action
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileBigList"
            list-type="picture"
            :on-exceed="handleErrBig"
            :on-success="handleSuccess"
            :limit="Number(1)"
          >
            <el-button size="small" type="primary">点击修改</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="价格(元):" class="formItem">
          <el-input v-model="form.foodprice" auto-complete="off" type="number"></el-input>
        </el-form-item>
        <el-form-item label="配送规则:" class="formItem">
          <el-input v-model="form.foodtrans" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类:" class="formItem">
          <template>
            <el-select v-model="form.categoryName" placeholder="请选择" @change="selectChange">
              <el-option
                v-for="item in this.allCategory"
                :key="item.id"
                :label="item.cname"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <!-- <el-input v-model="form.categoryName" auto-complete="off"></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </div>
    </el-dialog>
    <!-- <inCoder/> -->
  </div>
</template>
<script>
import axios from "axios";
import inCoder from '../../components/CodeEdit'
export default {
  name: "Goods",
  data() {
    return {
      pageData: {
        pageIndex: 1,
        total: 0
      },
      tableData: [],
      allCategory: [],
      dialogTitle: "",
      dialogFormVisible: false,
      form: {
        foodname: "213",
        fooddesc: "123",
        foodkeyword: "",
        foodpicsmall: "",
        smallImg: "",
        foodpicbig: "",
        bigImg: "",
        foodprice: "",
        categoryName: "",
        catagoryid: "",
        foodtrans: ""
      },
      fileSmallList: [],
      fileBigList: []
    };
  },
  components:{
    inCoder
  },
  beforeMount() {
    this.getGoodsList();
  },
  methods: {
    uploadFileMethod(param, type) {
      let fileObject = param.file;
      console.log(param.file, type);
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
            if (type === "small") {
              this.form.foodpicsmall = data.data;
            } else {
              this.form.foodpicbig = data.data;
            }
          } else {
            this.$message({
              message: "操作失败",
              type: "error",
              duration: 1000,
              center: true
            });
            if (type === "small") {
              this.fileSmallList = [];
            } else {
              this.fileBigList = [];
            }
          }
          console.log(data);
        }
      });
    },
    //选择分类
    selectChange(value) {
      this.form.catagoryid = value;
      this.allCategory.map(item => {
        if (item.id == this.form.catagoryid) {
          this.form.categoryName = item.cname;
        }
      });
      this.$forceUpdate();
    },
    //列表图片,大于一个
    handleErr(file, fileList) {
      this.$message({
        message: "只能添加一张图片，请先删除再添加",
        type: "error",
        duration: 2500,
        center: true
      });
    },
    //上传成功
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    getGoodsList() {
      this.$http({
        url: "/bjyyq/apimg/goodsList",
        data: { pageIndex: this.pageData.pageIndex },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.tableData = data.data.data;
            this.pageData = data.data.pageData;
          }
        }
      }).then(() => {
        console.log('000000000000000000000')
        this.tableData = this.tableData.map(item => {
          let obj = item;
          obj.foodprice = (obj.foodprice/100).toFixed(2)
          obj.smallImg = `http://bjyyq.zhaoshuikan.com.cn/static/${item.foodpicsmall}`;
          obj.bigImg = `http://bjyyq.zhaoshuikan.com.cn/static/${item.foodpicbig}`;
          return obj;
        });
        this.getAllCategory();
      });
    },
    getAllCategory() {
      this.$http({
        url: "/bjyyq/api/category",
        data: {},
        method: "get",
        success: data => {
          this.allCategory = data;
        }
      }).then(() => {
        let arr = [];
        console.log(this.tableData, "this.tableData before");
        this.allCategory.length > 0 &&
          this.allCategory.map(item => {
            item.text = item.cname;
            item.value = item.id;
            arr = this.tableData.map(item1 => {
              let obj = item1;
              if (item.id == item1.catagoryid) {
                obj.categoryName = item.cname;
              }
              return obj;
            });
            this.tableData = arr;
            console.log(this.tableData, "this.tableData");
          });
      });
    },
    //编辑按钮
    handleEdit(categoryMsg) {
      this.fileSmallList = []
      this.fileBigList = []
      let smallFileObj = {
        name: categoryMsg.foodpicsmall,
        url: categoryMsg.smallImg
      };
      let bigFileObj = {
        name: categoryMsg.foodpicbig,
        url: categoryMsg.bigImg
      };
      this.dialogFormVisible = true;
      this.dialogTitle = "修改商品";
      this.form = JSON.parse(JSON.stringify(categoryMsg));
      this.fileSmallList.push(smallFileObj);
      this.fileBigList.push(bigFileObj);
    },
    //添加按钮
    handleAdd() {
      this.dialogFormVisible = true;
      this.dialogTitle = "添加商品";
      this.form = {
        foodname: "",
        fooddesc: "",
        foodkeyword: "",
        foodpicsmall: "",
        smallImg: "",
        foodpicbig: "",
        bigImg: "",
        foodprice: "",
        categoryName: "",
        catagoryid: "",
        foodtrans: ""
      };
      this.fileSmallList = [];
      this.fileBigList = [];
    },
    //过滤分类
    filterTag(id, row) {
      return row.catagoryid == id;
    },
    //添加确定修改回调
    determine() {
      console.log(this.form);
      this.dialogFormVisible = false;
      this.form.foodprice = this.form.foodprice*100
      this.$http({
        url: "/bjyyq/apimg/goodsActions",
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
        this.getGoodsList();
      });
    },
    //删除按钮
    handleDelete(foodid) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: "/bjyyq/apimg/goodsDelete",
            data: { id: foodid },
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
            console.log('//////////////')
            if ((this.pageData.total - 10 )* (this.pageData.pageIndex - 1) == 1) {
              this.pageData.pageIndex = this.pageData.pageIndex - 1;
            }
            this.getGoodsList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //改变分页
    handleCurrentChange(val) {
      this.pageData.pageIndex = val;
      this.$http({
        url: "/bjyyq/apimg/goodsList",
        data: { pageIndex: this.pageData.pageIndex },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.tableData = data.data.data;
            this.pageData = data.data.pageData;
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.goodsList{
  text-align: left;
}
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
.el-select{
  width: 250px;
}
.el-form-item .el-form-item__label {
  width: 120px !important;
  text-align: right;
}
.el-input {
  width: 250px;
}
.el-textarea {
  width: 400px;
}
.el-alert{
      padding: 0px;
  }
</style>

