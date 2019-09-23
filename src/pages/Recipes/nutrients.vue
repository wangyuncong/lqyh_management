<template>
  <div class="nutrients">
    <div class="title">
      选择营养成分
    </div>
    <div class="checkBox">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="(item,index) in checkData" :key="index" :disabled="item.isdisabled" :label="item.statement"></el-checkbox>
      </el-checkbox-group>
    </div>
    <p style="color:red;fontSize:12px;padding-top:10px;">选择完请点击保存更改</p>
    <div class="footer">
      <el-button type="primary" @click="nutrientsAction">保存</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name:'nutrients',
  data(){
    return{
      checkList:[],
      nutritionistNutritionData:[
        {
          indexname:'能量',
          propname:'nl'
        },{
          indexname:'蛋白质',
          propname:'dbz'
        },{
          indexname:'脂肪',
          propname:'zf'
        },{
          indexname:'碳水化合物',
          propname:'tshhw'
        }
      ],
      nutritionistNutritionDataRows:[],
      checkData:[
        // {
        //   name:'能量',
        //   pym:'nl',
        //   isdisabled:true
        // },{
        //   name:'蛋白质',
        //   pym:'dbz',
        //   isdisabled:true
        // },{
        //   name:'脂肪',
        //   pym:'zf',
        //   isdisabled:true
        // },{
        //   name:'碳水化合物',
        //   pym:'tshhw',
        //   isdisabled:true
        // }
      ]
    }
  },
  created(){
    this.getAllNutrients()
  },
  methods:{
    getAllNutrients(){
      this.$http({
        url: "/bjyyq/apimg/getAllNutrients",
        data: {},
        method: "get",
        success: data => {
          this.checkData = data.data
          this.checkData.map((item)=>{
            this.nutritionistNutritionData.map((item1)=>{
              if(item.statement == item1.indexname){
                item.isdisabled = true
                this.checkList.push(item.statement)
              }
            })
          })
          this.getNutritionData()
          // console.log(this.checkData,'this.checkData')
        }
      });
    },
    nutrientsAction(){
      let nutrients = []
      this.checkList.map((item)=>{
        this.checkData.map((item1)=>{
          if(item == item1.statement){
            let obj = {}
            obj.indexname = item1.statement
            obj.unit = item1.unit
            obj.pym = item1.pym
            nutrients.push(obj)
          }
        })
      })
      this.$http({
        url: "/bjyyq/apimg/nutrientsAction",
        data: {nutrients:JSON.stringify(nutrients),userid:sessionStorage.userid},
        method: "get",
        success: data => {
          this.$message({
            message: "保存成功",
            type: "success",
            duration: 1000,
            center: true
          });
          this.getNutritionData()
        }
      });
    },
    getNutritionData(){
      this.$http({
        url: "/bjyyq/apimg/nutrientsList",
        data: {userid:sessionStorage.userid},
        method: "get",
        success: data => {
          if(data.status == 'success'){
            // this.nutritionistNutritionData.map((item)=>{
              data.data.map((item1)=>{
                // if(item.statement != item1.indexname){
                  this.checkList.push(item1.indexname)
                // }
              })
            // })
            this.checkList = Array.from(new Set(this.checkList))
            console.log(this.checkList,this.nutritionistNutritionData,data.data,'this.checkList')
            this.checkList = [...this.checkList]
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.nutrients{
  text-align: left;
  .title{
    font-size:32px;
    font-family:PingFangSC;
    font-weight:500;
    color:rgba(88,71,221,1);
    line-height:45px;
  }
  .checkBox{
    width: 1000px;
    margin-top: 20px;
    .el-checkbox{
      margin-top: 10px;
    }
  }
  .footer{
    text-align: center;
    margin-top: 50px;
  }
}
</style>