<template>
  <div class="category">
    <div style="padding:10px 0px;"><el-button type="success" @click="handleAdd()">添加</el-button></div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="cname" label="名称"></el-table-column>
      <el-table-column prop="cdesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          
        </template>
      </el-table-column>
      <template slot="empty">
        <el-button size="mini" type="success" @click="handleAdd()">添加分类</el-button>
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
          <el-input v-model="form.cname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述:" class="formItem">
          <el-input type="textarea" v-model="form.cdesc" auto-complete="off"></el-input>
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
  name: "Category",
  data() {
    return {
      dialogFormVisible: false,
      dialogTitle: "",
      pageData: {
        pageIndex: 1,
        total: 0
      },
      form: {
        name: "213",
        des: "123"
      },
      tableData: []
    };
  },
  beforeMount() {
    this.getList();
  },
  methods: {
    //获取列表数据
    getList() {
      this.$http({
        url: "/bjyyq/apimg/categoryList",
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
    handleEdit(categoryMsg) {
      this.dialogFormVisible = true;
      this.dialogTitle = "修改分类";
      this.form = JSON.parse(JSON.stringify(categoryMsg));
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
            url: "/bjyyq/apimg/categoryDelete",
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
    //添加按钮
    handleAdd() {
      this.dialogFormVisible = true;
      this.dialogTitle = "添加分类";
      this.form = {
        cname: "",
        cdes: ""
      };
    },
    //添加确定修改回调
    determine() {
      this.dialogFormVisible = false;
      this.$http({
        url: "/bjyyq/apimg/categoryActions",
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
    //改变分页
    handleCurrentChange(val) {
      this.pageData.pageIndex = val;
      this.$http({
        url: "/bjyyq/apimg/categoryList",
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
.category {
  // background: #fff;
  text-align: left;
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

