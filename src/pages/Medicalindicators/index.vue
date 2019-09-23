<template>
  <div class="medicalindicators">
    <div style="padding:10px 0px;"><el-button type="success" @click="handleAdd()">添加</el-button></div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="seqno" label="序列"></el-table-column>
      <el-table-column prop="indicatorname" label="名称"></el-table-column>
      <el-table-column prop="indicatordesc" label="描述"></el-table-column>
      <el-table-column prop="unit" label="单位"></el-table-column>
      <!-- <el-table-column prop="method" label="获取方式"></el-table-column> -->
      <el-table-column prop="indicatorcode" label="指标编码"></el-table-column>
      <el-table-column prop="ymax" label="Y轴最大值"></el-table-column>
      <el-table-column prop="ymin" label="Y轴最小值"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          
        </template>
      </el-table-column>
      <template slot="empty">
        <el-button size="mini" type="success" @click="handleAdd()">添加医学指标</el-button>
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
          <el-input v-model="form.indicatorname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述:" class="formItem">
          <el-input type="textarea" v-model="form.indicatordesc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位:" class="formItem">
          <el-input v-model="form.unit" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="指标编码:" class="formItem">
          <el-input v-model="form.indicatorcode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="序列:" class="formItem">
          <el-input v-model="form.seqno" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Y轴最大值:" class="formItem">
          <el-input v-model="form.ymax" type="number" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Y轴最小值:" class="formItem">
          <el-input v-model="form.ymin" type="number" auto-complete="off"></el-input>
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
  name: "Medicalindicators",
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
        indicatorname: "",
        indicatordesc: "",
        unit: "",
        indicatorcode: "",
        seqno:'',
        ymax:'',
        ymin:''
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.$http({
        url: "/bjyyq/apimg/medicalIndicatorList",
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
      this.dialogTitle = "修改医学指标";
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
            url: "/bjyyq/apimg/medicalIndicatorDelete",
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
      this.dialogTitle = "添加医学指标";
      this.form = {
        indicatorname: "",
        indicatordesc: "",
        unit: "",
        indicatordesc: "",
        seqno:'',
        ymax:'',
        ymin:''
      };
    },
    handleCurrentChange(val) {
      this.pageData.pageIndex = val;
      this.getList();
    },
    //添加确定修改回调
    determine() {
      if (
        this.form.indicatorname == "" ||
        this.form.indicatordesc == "" ||
        this.form.unit == "" ||
        this.form.ymax == "" ||
        this.form.ymin == ""
      ) {
        this.$message({
          message: "名称，描述，单位，y轴最大值，y轴最小值为必填项",
          type: "error",
          duration: 1000,
          center: true
        });
        return;
      }
      this.dialogFormVisible = false;
      this.$http({
        url: "/bjyyq/apimg/medicalIndicatorAction",
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
.medicalindicators {
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