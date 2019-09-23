<template>
  <div class="orderManagement">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="ordernumber" label="订单编号"></el-table-column>
      <!-- <el-table-column prop="createtime" label="创建时间"></el-table-column> -->
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="addrinfo" label="地址"></el-table-column>
      <!-- <el-table-column prop="startdate" label="开始时间"></el-table-column>
      <el-table-column prop="enddate" label="结束时间"></el-table-column> -->
      <el-table-column prop="amount" label="总金额(元)">
        <template slot-scope="scope">
          <div>{{(scope.row.amount/100).toFixed(2)}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="realamount" label="实收金额(元)">
        <template slot-scope="scope">
          <div>{{(scope.row.realamount/100).toFixed(2)}}</div>
        </template>
      </el-table-column> -->
      <el-table-column prop="foodinfo" label="商品名称">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.foodInfo" :key="index">
            {{item.foodname}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="statusValue" label="状态"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini">详细信息</el-button>
          <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button size="mini" type="success" @click="handleAdd()">添加</el-button> -->
        </template>
      </el-table-column>
      <!-- <template slot="empty">
        <el-button size="mini" type="success" @click="handleAdd()">添加分类</el-button>
      </template> -->
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="Number(pageData.pageIndex)"
      :page-size="10"
      :total="pageData.total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  name: 'orderManagement',
  data(){
    return {
      pageData: {
        pageIndex: 1,
        total: 0
      },
      tableData:[]
    }
  },
  created(){
    this.getList()
  },
  methods:{
    getList(){
      this.$http({
        url: "/bjyyq/apimg/orderList",
        data: { pageIndex: this.pageData.pageIndex,type:'other' },
        method: "get",
        success: data => {
          if (data.status === "success") {
            console.log( data.data.data,' data.data.data')
            this.tableData = data.data.data;
            this.pageData = data.data.pageData;
            this.tableData.map((item)=>{
              switch(item.status) {
                case '0':
                  item.statusValue = '待支付'
                  break;
                case '1':
                  item.statusValue = '执行中'
                  break
                case '2':
                  item.statusValue = '执行完成'
                  break
                case '3':
                  item.statusValue = '已取消'
                  break
                // case '4':
                //   item.statusValue = '待执行'
                //   break
                // case '5':
                //   item.statusValue = '配送中'
                //   break
                // case '6':
                //   item.statusValue = '订单完成'
                //   break
              } 
            })
          }
        }
      });
    },
    //改变分页
    handleCurrentChange(val) {
      this.pageData.pageIndex = val
      this.getList()
    }
  }
}
</script>
<style lang="less" scoped>
  .orderManagement {
    background: #fff;
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