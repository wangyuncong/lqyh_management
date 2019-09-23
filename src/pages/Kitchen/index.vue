<template>
  <div class="Kitchen">
    <div class="title">厨房执行配餐</div>
    <div style="background:#fff">
      <el-form :model="form">
        <el-form-item label="日期:" class="formItem" style="marginLeft:0">
          <el-date-picker
            v-model="form.orderdate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="dateChange"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="餐别:" class="formItem" style="marginLeft:20px">
          <el-select v-model="form.canbie" placeholder="请选择" @change="changeCanbie">
            <el-option
              v-for="item in buttons"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div class="tableBox">
        <el-table
          :data="tableData"
          class="table"
          style="width: 100%"
          :span-method="objectSpanMethod"
          
        >
          <el-table-column prop="ordernumber" label="订单号"></el-table-column>
          <el-table-column prop="userinfo.datavalue" label="客户姓名"></el-table-column>
          <el-table-column prop="orderdate" label="日期"></el-table-column>
          <el-table-column prop="mealtype" label="餐别"></el-table-column>
          <el-table-column prop="menuname" label="菜谱"></el-table-column>
          <el-table-column prop="menucent" label="份数">
            <template slot-scope="scope">
              <div v-for="(item1,index1) in scope.row.foodmenuinfo" :key="index1">
                <!-- {{item1.menuname}}: -->
                {{item1.menucent}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <button class="table_button table_button1" @click="editCaipuModal(scope.row,scope.row.foodmenuinfo[0])">查看菜谱</button>
              <!-- <el-dropdown trigger="click" @command="(item)=>editCaipu(scope.row,item)">
                <button class="table_button table_button1">查看菜谱</button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,index) in scope.row.foodmenuinfo"
                    :command="item"
                    :key="index"
                  >{{item.menuname}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
              <!-- <button class="table_button table_button2" @click="peicanDeal(scope.row)">制作完成</button> -->
            </template>
          </el-table-column>
          <el-table-column label width="120">
            <template slot-scope="scope">
              <!-- <el-dropdown trigger="click" @command="(item)=>editCaipu(scope.row,item)">
                <button class="table_button table_button1">查看菜谱</button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item,index) in scope.row.foodmenuinfo" :command="item" :key="index">{{item.menuname}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>-->
              <span v-if="scope.row.status==2">制作完成</span>
              <el-button v-else class="table_button table_button2" :disabled="form.canbie!=''" @click="peicanDeal(scope.row)">制作完成</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="Number(pageData.pageIndex)"
          :page-size="10"
          :total="pageData.total"
        ></el-pagination>
        <div class="totalCent">
          <span
            v-for="(item,index) in centArr"
            :key="index"
          >{{item.menuname}}:{{item.menucent}}份{{index == centArr.length-1 ? '' : '，'}}</span>
        </div>
      </div>
    </div>
    <el-dialog title="菜谱查看" :visible.sync="iscaipuModal" @close="this.iscaipuModal=false">
      <el-table
          :data="caipuArr"
          style="width: 90%"
        >
          <el-table-column prop="foodname" label="食材名称"></el-table-column>
          <el-table-column prop="weightratio" label="比重(g)"></el-table-column>
        </el-table>
        <el-button style="margin-top:20px;" :disabled="caipuArr.length==0" @click="editCaipu(caipuArr[0].ordermenuid,foodMenuInfoObj)">详细菜谱</el-button>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Kitchen",
  data() {
    return {
      form: {
        orderdate: "",
        canbie: ""
      },
      buttons: [
        {
          name: "早餐",
          status: 0
        },
        {
          name: "上午间餐",
          status: 0
        },
        {
          name: "中餐",
          status: 0
        },
        {
          name: "下午间餐",
          status: 0
        },
        {
          name: "晚餐",
          status: 0
        },
        {
          name: "零食",
          status: 0
        }
      ],
      tableData: [],
      pageData: {
        pageIndex: 1,
        total: 0
      },
      spanArr: [],
      centArr: [],
      caipuArr:[],
      iscaipuModal:false,
      foodMenuInfoObj:{}
    };
  },
  created() {
    this.getDealList(this.form.orderdate);
  },
  methods: {
    //合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 0 ||
        columnIndex === 1 ||
        columnIndex === 2 ||
        columnIndex === 7
      ) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    getSpanArr(data) {
      this.spanArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].fooddealid === data[i - 1].fooddealid) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    editCaipuModal(rowmsg, item){
      this.iscaipuModal = true
      this.caipuArr = []
      this.foodMenuInfoObj=item
      this.getOrderRecipeListDetail(rowmsg.id,item.id)
    },
    async getOrderRecipeListDetail(ordermenuid,foodmenuid,$index){
      await this.$http({
        url: "/bjyyq/apimg/orderRecipeListDetail",
        data: {ordermenuid,foodmenuid},
        method: "get",
        success: data => {
          this.caipuArr = data.data
          // this.tableData = data.data
          // console.log(data.data.data,'sssdadassa')
          // let arr = []
          // data.data.map((item)=>{
          //   let obj = {}
          //   obj.typeid = item.foodcode
          //   obj.weightratio = item.weightratio
          //   obj.typename = item.foodname
          //   arr.push(obj)
          // })
          // console.log(arr,'sssdadassa')
          // this.getStatementList('','shicai_params',JSON.stringify(arr),$index).then(()=>{

          // })
        }
      });
    },
    changeCanbie(val) {
      this.getDealList(this.form.orderdate);
    },
    //套餐制作完成
    peicanDeal(msg) {
      this.$http({
        url: "/bjyyq/apimg/dealAction",
        data: { dealid: msg.fooddealid, status: 2, orderid: msg.orderid,kitchenerid:sessionStorage.userid },
        method: "get",
        success: data => {
          if (data.status == "success") {
            let temp = false;
            let actiondesc = "";
            data.data.map(item => {
              if (item.status == 0 || item.status == 1) {
                temp = true;
              }
            });
            if (temp) {
              actiondesc = `${msg.orderdate} 配餐完成`;
            } else {
              actiondesc = `此订单全部配餐完成`;
            }
            this.orderActionEdit(msg.userinfo.userid,msg.orderid,`${msg.orderdate} 配餐完成`,actiondesc).then(()=>{
              if ((this.pageData.total - 10 )* (this.pageData.pageIndex - 1) == 1) {
                this.pageData.pageIndex = this.pageData.pageIndex - 1;
              }
              this.getDealList(this.form.orderdate);
            });
          }
        }
      });
    },
    //修改订单action状态
    async orderActionEdit(userid, orderid, actionname, actiondesc) {
      console.log("///////");
      await this.$http({
        url: "/bjyyq/apimg/orderActionEdit",
        data: { userid, actionname, actiondesc, orderid, actionseq: 4 },
        method: "get",
        success: data => {
          if (data.status == "success") {
            if(actiondesc == '此订单全部配餐完成'){
              this.orderformstate(3,orderid)
            }else{
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1000,
                center: true
              });
              this.getDealList(this.form.orderdate);
            }
            
          }
        }
      });
    },
    async orderformstate(status,id){
      await this.$http({
        url: "/bjyyq/api/orderformstate",
        data: { status,id },
        method: "post",
        success: data => {
          if (data.status == 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1000,
              center: true
            });
            this.getDealList(this.form.orderdate);
          }
        }
      });
    },
    //改变分页
    handleCurrentChange(val) {
      this.pageData.pageIndex = val;
      this.getDealList(this.form.orderdate);
    },
    editCaipu(rowmsg, item) {
      console.log(item);
      // item.map((i)=>{
      item.ordermenuid = rowmsg;
      item.foodmenuid = item.id;
      // })
      this.$router.push({
        path: "/home/recipesMakingEdit",
        query: {
          type: "examine",
          msg: encodeURIComponent(JSON.stringify(item)),
          from: 'order',
        }
      });
    },

    dateChange(value) {
      this.pageData.pageIndex = 1;
      this.getDealList(value);
    },
    getDealList(orderdate) {
      this.$http({
        url: "/bjyyq/apimg/getDealList",
        data: {
          pageIndex: this.pageData.pageIndex,
          orderdate,
          status: 1,
          mealtype: this.form.canbie
        },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.tableData = data.data.data;
            this.pageData = data.data.pageData;
            let arr = [];
            this.centArr = [];
            this.tableData.map(item => {
              item.menuname = "";
              item.foodmenuinfo.map((item2, index2) => {
                if (item.foodmenuinfo.length > 1) {
                  item2.menucent = item.menucent.split(",")[index2];
                } else {
                  item2.menucent = item.menucent;
                }
                if (index2 == 0) {
                  item.menuname += item2.menuname;
                } else {
                  item.menuname += `，${item2.menuname}`;
                }
                arr.push(JSON.parse(JSON.stringify(item.foodmenuinfo[0])));
              });
            });

            // var result = [];
            var obj = {};
            for (var i = 0; i < arr.length; i++) {
              if (!obj[arr[i].menuname]) {
                this.centArr.push(JSON.parse(JSON.stringify(arr[i])));
                obj[arr[i].menuname] = true;
              }
            }
            this.centArr.map(item => {
              item.menucent = 0;
              arr.map(item1 => {
                if (item.menuname == item1.menuname) {
                  item.menucent += Number(item1.menucent);
                }
              });
            });
            console.log(this.tableData, arr, this.centArr);
            this.getSpanArr(this.tableData);
          }
        }
      });
    }
  }
};
</script>
<style lang="less">
.Kitchen {
  text-align: left;
  .el-form-item__label {
    text-align: left;
    width: auto !important;
    padding-left: 15px;
  }
  .formItem {
    display: inline-block;
    width: 300px;
  }
}
.Kitchen {
  .table {
    margin-top: 20px;
    .el-table__header-wrapper {
      .has-gutter {
        background: #e9e9e9;
        th,
        tr {
          background: #e9e9e9;
          color: #666666;
        }
      }
    }
  }
  .el-table__row:hover{
    td{
      background: #e0e3e9!important;
    }
    
  }
}
</style>
<style lang="less" scoped>
.Kitchen {
  text-align: left;
  .totalCent {
    color: red;
    padding-left: 10px;
    position: relative;
    top: -30px;
    display: inline-block
    // margin-top: -20px
  }
  .title {
    font-size: 32px;
    font-family: PingFangSC;
    font-weight: 500;
    color: rgba(88, 71, 221, 1);
    line-height: 45px;
    padding-bottom: 10px;
  }
  .el-form {
    padding-top: 25px;
  }
  .el-form-item__label {
    text-align: left;
  }
  .el-pagination {
    text-align: right;
    padding: 10px 0px;
  }
  .tableBox {
    .table_button {
      border: none;
      padding: 5px 10px;
      color: #fff;
    }
    .table_button1 {
      background: #d46b08;
    }
    .table_button2 {
      background: #237804;
      margin-left: 15px;
      border-radius: 0px;
      padding: 8px 10px!important;
    }
  }
}
</style>