<template>
  <div class="configurationMeal">
    <div class="title">配餐</div>
    <div class="yeji">
      <p><span>历史配餐数量(天)：</span><span>{{allPeiCanJl}}</span></p>
      <p><span>本月配餐数量(天)：</span><span>{{monthPeiCanJl}}</span></p>
    </div>
    <div class="filter">
      <el-form :model="filterObj">
        <el-form-item label="客户编号:" class="formItem">
          <el-input placeholder="请输入要查找的编号" v-model="filterObj.userid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用餐人:" class="formItem">
          <el-input placeholder="请输入要查找的用餐人姓名" v-model="filterObj.username" auto-complete="off"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="待配餐:" class="formItem">
          <el-switch v-model="filterObj.status" active-color="#597EF7" inactive-color="#ccc" @change="changePeicanStatus"></el-switch>
        </el-form-item>
      </el-form>
      <div class="filter_button">
        <el-button type="primary" icon="el-icon-search" @click="searchList">查询</el-button>
      </div>
    </div>
    <div class="main_box">
      <el-table :data="tableData" class="table" style="width: 100%" center>
        <el-table-column prop="userid" label="客户ID" width="50"></el-table-column>
        <el-table-column prop="ordernumber" label="订单号"></el-table-column>
        <el-table-column prop="userinfoObj.name" label="客户"></el-table-column>
        <el-table-column prop="foodInfo.foodname" label="产品名称"></el-table-column>
        <el-table-column prop="cooktype" label="配餐日期">
          <template slot-scope="scope">
            <div>{{scope.row.startdate}} - {{scope.row.enddate}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="statusValue" label="状态"></el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <button
              :class="scope.row.statusValue === '执行完成' ? 'table_button-dis' : 'table_button'"
              @click="peican(scope.row)"
            >配餐</button>
          </template>
        </el-table-column>
        <!-- <template slot="empty">
          <el-button size="mini" type="success" @click="handleAdd()">添加分类</el-button>
        </template>-->
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
  </div>
</template>
<script>
export default {
  name: "configurationMeal",
  data() {
    return {
      pageData: {
        pageIndex: 1,
        total: 0
      },
      tableData: [],
      filterObj: {
        userid: "",
        username: "",
        status: true
      },
      allPeiCanJl:0,
      monthPeiCanJl:0
    };
  },
  created() {
    this.getList();
    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0; //

    var lastMonthDate = new Date(); //上月日期
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
    var lastYear = lastMonthDate.getYear();
    var lastMonth = lastMonthDate.getMonth();
    //获得本月的开始日期
    function formatDate(date) {
      var myyear = date.getFullYear();
      var mymonth = date.getMonth()+1;
      var myweekday = date.getDate();

      if(mymonth < 10){
      mymonth = "0" + mymonth;
      }
      if(myweekday < 10){
      myweekday = "0" + myweekday;
      }
      return (myyear+"-"+mymonth + "-" + myweekday);
    }
    //获得某月的天数
    function getMonthDays(myMonth){
      var monthStartDate = new Date(nowYear, myMonth, 1);
      var monthEndDate = new Date(nowYear, myMonth + 1, 1);
      var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
      return days;
    }
    function getMonthStartDate(){
      var monthStartDate = new Date(nowYear, nowMonth, 1);
      return formatDate(monthStartDate);
    }
    //获得本月的结束日期
    function getMonthEndDate(){
      var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
      return formatDate(monthEndDate);
    }
    console.log(getMonthEndDate())
    this.cateringamountMsg('dietitianid','all')
    this.cateringamountMsg('dietitianid','month',getMonthStartDate(),getMonthEndDate())
  },
  methods: {
    changePeicanStatus(val){
      this.getList();
    },
    cateringamountMsg(type,getType,startdate,enddate){
      this.$http({
        url: "/bjyyq/apimg/cateringamountMsg",
        data: { type,getType,startdate,enddate,userid:sessionStorage.userid },
        method: "get",
        success: data => {
          if (data.status === "success") {
            if(getType=='all'){
              this.allPeiCanJl = data.data.length
            }else{
              this.monthPeiCanJl = data.data.length
            }
          }
        }
      });
    },
    
    peican(msg) {
      if(msg.statusValue === '执行完成'){
        return
      }
      this.$router.push({
        path: "/home/configurationMealEdit",
        query: {
          msg: encodeURIComponent(JSON.stringify(msg))
        }
      });
    },
    //改变分页
    handleCurrentChange(val) {
      this.pageData.pageIndex = val;
      this.getList();
    },
    searchList() {
      this.pageData.pageIndex = 1;
      this.getList();
    },
    //获取列表数据
    getList() {
      this.$http({
        url: "/bjyyq/apimg/mealList",
        data: { pageIndex: this.pageData.pageIndex, filter: this.filterObj },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.tableData = data.data.data;
            this.pageData = data.data.pageData;
            this.tableData.map(item => {
              switch (item.status) {
                case "0":
                  item.statusValue = "待支付";
                  break;
                case "1":
                  item.statusValue = "执行中";
                  break;
                case "2":
                  item.statusValue = "执行完成";
                  break;
                case "3":
                  item.statusValue = "已取消";
                  break;
              }
            });
          }
        }
      });
    }
  }
};
</script>
<style lang="less">
.configurationMeal {
  .formItem {
    display: inline-block;
    div {
      display: inline-block;
    }
    .el-input__inner {
      width: 280px;
      height: 32px;
    }
  }
  .filter_button {
    i {
      display: block;
      margin-top: 5px;
      font-size: 18px !important;
      margin-bottom: 10px !important;
    }
  }
  
}
.configurationMeal {
  .table {
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
}
</style>
<style lang="less" scoped>
.configurationMeal {
  text-align: left;
  .title {
    font-size: 32px;
    font-family: PingFangSC;
    font-weight: 500;
    color: rgba(88, 71, 221, 1);
    line-height: 45px;
  }
  .yeji{
    display: flex;
    padding:20px;
    background: #fff;
    margin-top: 15px;
    >p:last-child{
      margin-left: 100px;
    }
  }
  .filter {
    background: #fff;
    box-sizing: border-box;
    
    padding-bottom: 20px;
    padding-top: 10px;
    .el-form {
      display: inline-block;
    }
    .formItem {
      display: inline-block;
      margin-top: 10px;
      margin-bottom: 0px;
      div {
        display: inline-block;
      }
    }
    .filter_button {
      display: inline-block;
      vertical-align: top;
      margin-left: 250px;
      padding-top: 10px;
      button {
        display: flex;
        flex-direction: column;
        text-align: center;
        width: 65px;
        height: 80px;
        align-items: center;
        justify-content: center;
        border-radius: 2px;
        display: inline-block;
        // i{
        //   font-size: 18px!important;
        //   margin-bottom: 10px!important;
        // }
      }
    }
  }
  .main_box {
    background: #fff;
    box-sizing: border-box;
    // padding: 20px;
    margin-top: 25px;
    .table_button {
      background: rgba(89, 126, 247, 1);
      border-radius: 2px;
      color: #fff;
      font-size: 12px;
      font-family: PingFangSC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      padding: 4px 10px;
      border: none;
    }
    .table_button-dis {
      background:#eee;
      border-radius: 2px;
      color: #999 !important; 
      font-size: 12px;
      font-family: PingFangSC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      padding: 4px 10px;
      border: none;
    }
    .el-pagination {
      text-align: right;
      padding: 10px 0px;
    }
  }
}
</style>