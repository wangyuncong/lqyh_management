<template>
  <div class="recipesMaking">
    <div class="title">菜谱查询</div>
    <div class="filter">
      <el-form :model="filterObj">
        <el-form-item label="菜谱名称:" class="formItem">
          <el-input placeholder="请输入菜谱名称" v-model="filterObj.menuname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜谱编码:" class="formItem">
          <el-input placeholder="请输入菜谱编码" v-model="filterObj.menucode" auto-complete="off"></el-input>
        </el-form-item><br/>
        <el-form-item label="食材名称:" class="formItem">
          <el-select
            class="select_filter"
            v-model="filterObj.typename"
            filterable
            clearable 
            remote
            reserve-keyword
            placeholder="请输入食材名称"
            :remote-method="remoteMethod"
          >
            <el-option
              v-for="item in options4"
              :key="item.id"
              :label="item.typename"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="filter_button">
        <el-button type="primary" icon="el-icon-search" @click="searchList">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="toEdit('add')">新建</el-button>
      </div>
    </div>
    <div class="main_box">
      <el-table :data="tableData" class="table" style="width: 100%" center>
        <el-table-column prop="menuname" label="名称"></el-table-column>
        <el-table-column prop="menucode" label="编码"></el-table-column>
        <el-table-column prop="cooktype" label="烹饪方法"></el-table-column>
        <!-- <el-table-column prop="cooktime" label="烹饪时长(分)"></el-table-column>
        <el-table-column prop="sweetness" label="甜度"></el-table-column> -->
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <button class="table_button" @click="toEdit('edit',scope.row)">修改</button>
            <button class="table_button" @click="toEdit('examine',scope.row)">查看详情</button>
            <button class="table_button" @click="deleteRecipe(scope.row.id)">删除</button>
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
  </div>
</template>
<script>
export default {
  name:'recipesMaking',
  data(){
    return{
      filterObj:{
        menuname:'',
        menucode:'',
        typename:'' //食材名称
      },
      pageData: {
        pageIndex: 1,
        total: 0
      },
      tableData: [],
      options4:[]
    }
  },
  beforeMount() {
    this.getList();
  },
  methods:{
    searchList(){
      this.pageData.pageIndex = 1
      this.getList()
    },
    //远程搜索
    remoteMethod(res){
      console.log(res,'res')
      this.getStatementList(res,'shicai_name')
    },
    getStatementList(typename,type,typeid=JSON.stringify([])){
      this.$http({
        url: "/bjyyq/apimg/statementList",
        data: { typename,type,typeid},
        method: "get",
        success: data => {
          if (data.status === "success") {
            if(type == 'shicai_params'){
              console.log(data.data,'dadadada')
              data.data.map((item)=>{
                this.tableData.push(item)
              })
              console.log(this.tableData,'this.tableData')
            }else{
              this.options4 = data.data
            }
          }
        }
      });
    },
    toEdit(type,msg){
      let store = this.$store.global;
      store.commit("setBreadcrumb", [
        {
          name:'菜谱配餐',
          path:'/home'
        },{
          name:'菜谱制作',
          path:'/home/recipesMaking'
        },{
          name:'菜谱配餐',
          path:`/home/recipesMakingEdit?type=${type}&msg=${encodeURIComponent(JSON.stringify(msg))}`
        }
      ]);
      this.$router.push({
        path: '/home/recipesMakingEdit',
        query: {
          type:type,
          msg: encodeURIComponent(JSON.stringify(msg))
        }
      })
    },
    //获取列表数据
    getList() {
      this.$http({
        url: "/bjyyq/apimg/recipeList",
        data: { pageIndex: this.pageData.pageIndex,filter:this.filterObj},
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.tableData = data.data.data;
            this.pageData = data.data.pageData;
          }
        }
      });
    },
    //改变分页
    handleCurrentChange(val) {
      this.pageData.pageIndex = val;
      this.getList()
    },
    //删除菜谱
    deleteRecipe(id){
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: "/bjyyq/apimg/deleteRecipe",
            data: { id },
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
            this.getList()
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
}
</script>
<style lang="less">
  .recipesMaking .filter{
    .formItem{
      display: inline-block;
      div{
        display: inline-block;
      }
      .el-input__inner{
        width: 280px;
        height: 32px;
      }
    }
    .filter_button{
      i{
        display: block;
        margin-top: 5px;
        font-size: 18px!important;
        margin-bottom: 10px!important;
      }
    }
  }
  .recipesMaking{
    .table{
      .el-table__header-wrapper{
        .has-gutter{
          background: #E9E9E9;
          th,tr{
            background: #E9E9E9;
            color: #666666;
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .recipesMaking{
    text-align: left;
    .title{
      font-size:32px;
      font-family:PingFangSC;
      font-weight:500;
      color:rgba(88,71,221,1);
      line-height:45px;
    }
    .filter{
      background: #fff;
      box-sizing: border-box;
      margin-top: 15px;
      padding-bottom: 20px;
      padding-top: 10px;
      .el-form{
        display: inline-block;
      }
      .formItem{
        display: inline-block;
        margin-top: 10px;
        margin-bottom: 0px;
        div{
          display: inline-block;
        }
      }
      .filter_button{
        display: inline-block;
        vertical-align: top;
        margin-left: 250px;
        padding-top: 10px;
        button{
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
    .main_box{
      background: #fff;
      box-sizing: border-box;
      padding: 20px;
      
      .el-pagination {
        text-align: right;
        padding: 10px 0px;
      }
      .table_button{
        border-radius:2px;
        padding: 4px 8px;
        color: #fff;
        background: #D0021B;
        border: none;
        font-size: 12px;
        &:nth-child(2){
          background: #5847DD;
          margin-left: 12px
        }
        &:nth-child(3){
          background: #999999;
          margin-left: 12px;
        }
      }
    }
  }
</style>