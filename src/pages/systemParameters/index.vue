<template>
  <div class="systemParameters">
    <div style="padding:10px 0px;"><el-button type="success" @click="handleAdd()">添加</el-button></div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="paramname" label="系统参数名"></el-table-column>
      <el-table-column prop="paramvalue" label="参数值"></el-table-column>
      <el-table-column prop="paramdesc" label="参数描述"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          
        </template>
      </el-table-column>
      <template slot="empty">
        <el-button size="mini" type="success" @click="handleAdd()">添加系统参数</el-button>
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
        <el-form-item label="系统参数名:" class="formItem">
          <el-input v-model="form.paramname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数值:" class="formItem">
          <el-input v-model="form.paramvalue" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数描述:" class="formItem">
          <el-input type="textarea" v-model="form.paramdesc" auto-complete="off"></el-input>
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
  name: "systemParameters",
  data() {
    return {
      dialogFormVisible: false,
      dialogTitle: "",
      pageData: {
        pageIndex: 1,
        total: 0
      },
      tableData: [],
      form: {
        paramname: "",
        paramvalue: "",
        paramdesc: ""
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.$http({
        url: "/bjyyq/apimg/sysparamList",
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
    handleEdit(msg) {
      this.dialogFormVisible = true;
      this.dialogTitle = "修改系统参数";
      this.form = JSON.parse(JSON.stringify(msg));
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: "/bjyyq/apimg/sysparamDelete",
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
    handleAdd() {
      this.dialogFormVisible = true;
      this.dialogTitle = "添加系统参数";
      this.form = {
        paramname: "",
        paramvalue: "",
        paramdesc: ""
      };
    },
    handleCurrentChange(val) {
      this.pageData.pageIndex = val;
      this.getList();
    },
    //添加确定修改回调
    determine() {
      if (
        this.form.paramname == "" ||
        this.form.paramvalue == "" ||
        this.form.paramdesc == ""
      ) {
        this.$message({
          message: "系统参数名，参数值，参数描述为必填项",
          type: "error",
          duration: 1000,
          center: true
        });
        return;
      }
      this.dialogFormVisible = false;
      this.$http({
        url: "/bjyyq/apimg/sysparamAction",
        data: { ...this.form },
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
};
</script>
<style lang="less" scoped>
.systemParameters {
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