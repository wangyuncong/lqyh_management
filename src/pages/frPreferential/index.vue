<template>
  <div class="frPreferential">
    <div style="padding:10px 0px 10px 0px"><el-button type="success" @click="handleAdd()">添加</el-button></div>
    
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="couponname" label="名称"></el-table-column>
      <el-table-column prop="statusValue" label="状态"></el-table-column>
      <el-table-column prop="period" label="有效期(天)"></el-table-column>
      <!-- <el-table-column prop="operid" label="创建人"></el-table-column> -->
      <el-table-column prop="discount" label="满减金额(元)"></el-table-column>
      <el-table-column prop="limitamount" label="满减标准(元)"></el-table-column>
      <el-table-column prop="foodcata" label="适用商品种类"></el-table-column>
      <el-table-column prop="updatetime" label="更新时间" width="100"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <div class="buttons">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            
            <el-button v-if="!scope.row.isShangjia" size="mini" type="success" @click="shangjia(scope.row)">上架</el-button>
            <el-button v-else size="mini" type="success" @click="xiajia(scope.row.id)">下架</el-button>
          </div>
        </template>
      </el-table-column>
      <template slot="empty">
        <el-button size="mini" type="success" @click="handleAdd()">添加满减优惠劵</el-button>
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
          <el-input v-model="form.couponname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态:" class="formItem">
          <el-select v-model="form.statusValue" @change="update">
            <el-option
              v-for="item in ['正常','暂停使用']"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期(天):" class="formItem">
          <el-input type="number" v-model="form.period" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="满减金额:" class="formItem"> -->
          
        <!-- </el-form-item> -->
        <el-form-item label="满减标准:" class="formItem">
          满 <el-input type="number" v-model="form.limitamount" auto-complete="off" style="width:100px"></el-input> 元减
          <el-input type="number" v-model="form.discount" auto-complete="off" style="width:100px"></el-input> 元
        </el-form-item>
        <el-form-item label="适应商品种类:" class="formItem">
          <el-select :multiple="true" v-model="form.foodcata" @change="update">
            <el-option
              v-for="item in allCategory"
              :key="item.cname"
              :label="item.cname"
              :value="item.cname">
            </el-option>
          </el-select>
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
  name: 'frPreferential',
  data(){
    return {
      dialogFormVisible:false,
      tableData: [],
      allCategory:[],
      dialogTitle: "",
      pageData: {
        pageIndex: 1,
        total: 0
      },
      form:{
        couponname: '',
        statusValue: '',
        period: '',
        discount: '',
        limitamount:'',
        foodcata:''
      }
    }
  },
  created(){
    this.getList().then(()=>{
      this.getCentshopList()
    })
    this.getAllCategory()
  },
  methods:{
    shangjia(msg){
      let obj = {
        type: msg.type,
        goodid: msg.id,
        goodname: msg.couponname
      }
      this.$http({
        url: "/bjyyq/apimg/centshopAction",
        data: {...obj},
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
        this.getList().then(()=>{
          this.getCentshopList()
        })
      });
    },
    xiajia(id){
      let obj = {
        type:'yhj',
        id:id
      }
      this.$http({
        url: "/bjyyq/apimg/centshopDelete",
        data: {...obj},
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
        this.getList().then(()=>{
          this.getCentshopList()
        })
      });
    },
    update(){
      this.$forceUpdate()
    },
    getAllCategory() {
      this.$http({
        url: "/bjyyq/api/category",
        data: {},
        method: "get",
        success: data => {
          this.allCategory = data;
        }
      })
    },
    //获取积分商城列表数据
    async getCentshopList(){
      await this.$http({
        url: "/bjyyq/apimg/centshopList",
        data: { type:0 },
        method: "get",
        success: data => {
          if (data.status === "success") {
            let arr = data.data.data
            console.log(arr,'arr')
            arr.map((item)=>{
              this.tableData.map((item1)=>{
                if(item.goodid == item1.id){
                  console.log('ppppp')
                  item1.isShangjia = true
                }
              })
              
            })
            this.tableData = [...this.tableData]
            // this.$forceUpdate()
            // this.tableData = data.data.data;
            // this.pageData = data.data.pageData;
            // this.tableData.map((item)=>{
            //   if(item.status == 0){
            //     item.statusValue = '正常'
            //   }else if(item.status == 1){
            //     item.statusValue = '暂停使用'
            //   }
            // })
          }
        }
      });
    },
    //获取列表数据
    async getList() {
      await this.$http({
        url: "/bjyyq/apimg/preferentialList",
        data: { pageIndex: this.pageData.pageIndex,type:0 },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.tableData = data.data.data;
            this.pageData = data.data.pageData;
            this.tableData.map((item)=>{
              item.isShangjia = false
              item.discount = (item.discount/100).toFixed(2)
              item.limitamount = (item.limitamount/100).toFixed(2)
              if(item.status == 0){
                item.statusValue = '正常'
              }else if(item.status == 1){
                item.statusValue = '暂停使用'
              }
            })
          }
        }
      });
    },
    //改变分页
    handleCurrentChange(val) {
      this.pageData.pageIndex = val;
      this.getList().then(()=>{
        this.getCentshopList()
      })
    },
    handleEdit(msg){
      this.dialogFormVisible = true;
      this.dialogTitle = "修改满减优惠券";
      this.form = JSON.parse(JSON.stringify(msg));
      this.form.foodcata = this.form.foodcata.split(',')
      console.log(this.form,'form')
    },
    handleDelete(id){
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: "/bjyyq/apimg/preferentialDelete",
            data: { id: id },
            method: "get",
            success: data => {
              if (data.status === "success") {
                this.delShopCenter()
              }
            }
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    delShopCenter(){
      this.$http({
        url: "/bjyyq/apimg/centshopDelete",
        data: { id: id,type:'yhj' },
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
        // console.log(this.pageData.pageIndex,'this.pageData.pageIndex')
        if ((this.pageData.total - 10 )* (this.pageData.pageIndex - 1) == 1) {
          this.pageData.pageIndex = this.pageData.pageIndex - 1;
          // if(this.pageData.pageIndex == 0){
          //   this.pageData.pageIndex = 1
          // }
          // console.log(this.pageData.pageIndex,'this.pageData.pageIndex')
        }
        this.getList().then(()=>{
          this.getCentshopList()
        })
      });
    },
    handleAdd(){
      this.dialogFormVisible = true;
      this.dialogTitle = "添加满减优惠券";
      this.form = {
        couponname: '',
        statusValue: '',
        period: '',
        discount: '',
        limitamount:'',
        foodcata:'',
        type: 0
      };
    },
    //添加确定修改回调
    determine() {
      if(this.form.statusValue == '正常'){
        this.form.status = 0
      }else if(this.form.statusValue == '暂停使用'){
        this.form.status = 1
      }
      if (
        this.form.discount == "" ||
        this.form.limitamount == ""
      ) {
        this.$message({
          message: "满减金额，满减标准为必填项",
          type: "error",
          duration: 1000,
          center: true
        });
        return;
      }
      console.log(this.form.foodcata,'this.form.status.foodcata')
      this.dialogFormVisible = false;
      this.form.discount = this.form.discount*100
      this.form.limitamount = this.form.limitamount*100
      this.$http({
        url: "/bjyyq/apimg/preferentialActions",
        data: {...this.form,...{operid:sessionStorage.userid}},
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
        this.getList().then(()=>{
          this.getCentshopList()
        })
      });
    },
  }
}
</script>
<style lang="less" scoped>
  .frPreferential{
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
    // .buttons{
    //   .el-button{
    //     margin-left: 10px;
    //     margin-top: 10px;
    //   }
    // }
  }
</style>