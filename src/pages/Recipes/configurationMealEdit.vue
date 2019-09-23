<template>
  <div class="configurationMealEdit">
    <div class="title">
      {{form.name}}
    </div>
    <div class="message">
      <p>客户基本信息</p>
      <el-form :model="form">
        <div style="display:block;">
          <el-form-item label="姓名:" class="formItem">
            <el-input :disabled="true" v-model="form.name || ''" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别:" class="formItem">
            <el-input :disabled="true" v-model="form.sex || ''" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="年龄:" class="formItem">
            <el-input :disabled="true" v-model="form.age || ''" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="体重(kg):" class="formItem">
            <el-input :disabled="true" v-model="form.weight || ''" auto-complete="off"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="日期:" class="formItem" style="marginLeft:0">
          <el-date-picker
            v-model="form.orderdate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions()"
            @change="dateChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="妊娠开始日期:" class="formItem">
          <el-input :disabled="true" v-model="form.gestation || ''" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="检查报告:" class="formItem" style="vertical-align: top;">
          <div style="display:inline-block;" v-if="form.img">
            <img v-for="(item,index) in JSON.parse(form.img)" :key="index" :src="`http://bjyyq.zhaoshuikan.com.cn/static/${item}`" style="width:100px;height:100px;cursor: pointer;" @click="openImg(`http://bjyyq.zhaoshuikan.com.cn/static/${item}`)"/>
          </div>
        </el-form-item>
      </el-form>
      <div class="buttonbox">
        <button class="button" v-for="(item,index) in buttons" :key="index" @click="ancionCanbie(item,index)">
          {{item.name}} {{item.status == 0?'+':'-'}}
        </button>
        
        <el-button v-if="isChangShiZzwc" style="float:right;marginRight:20px;padding:8px 16px" :disabled="true">已制作完成</el-button>
        <el-button v-else style="float:right;marginRight:20px;padding:8px 16px" :disabled="orderMenuList.length==0" @click="peicanDeal">配餐完成</el-button>
      </div>
      <div class="canbieBox">
        <el-table :data="orderMenuList" class="table" style="width: 100%" center>
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
          <el-table-column prop="" label="营养成分">
            <template slot-scope="scope">
              <div style="display:inline-block;width:400px;" v-html="scope.row.nutrientsHtml">
                
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350">
            <template slot-scope="scope">
              <!-- <el-dropdown trigger="click" @command="(item)=>editCaipu(scope.row,item)">
                <button class="table_button table_button1" :disabled="isChangShiZzwc">修改菜谱</button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item,index) in scope.row.foodmenuinfo" :command="item" :key="index">{{item.menuname}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
              <!-- <button class="table_button table_button1" :disabled="isChangShiZzwc" @click="editCaipu(scope.row,scope.row.foodmenuinfo[0])">修改菜谱</button> -->
              <!-- <button class="table_button table_button4" @click="changeFenshu(scope.row)">修改份数</button> -->
              <button class="table_button table_button1" :disabled="isChangShiZzwc" @click="clickEditCaipuDialog(scope.row.id,scope.row.foodmenuinfo[0].id,scope.row.foodmenuinfo[0].menuname,scope.row.ingredientsInfo)">修改菜谱</button>
              <button class="table_button table_button4" @click="changeMenuCent(scope.row.id,Number(scope.row.foodmenuinfo[0].menucent)+1)">添加一份</button>
              <button class="table_button table_button4" :disabled="scope.row.foodmenuinfo[0].menucent==1" @click="changeMenuCent(scope.row.id,scope.row.foodmenuinfo[0].menucent-1)">减少一份</button>
              <!-- <el-dropdown trigger="click" :disabled="isChangShiZzwc" @command="(item)=>addCaipu(scope.row,item)">
                <button class="table_button table_button2">增加菜谱</button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item,index) in menus" :command="item" :key="index">{{item.menuname}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
              <button class="table_button table_button3" @click="delCanbieButton(scope.row)">删除</button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <p style="margin-top:20px">合计营养成分</p>
        <div style="display:inline-block;width:1100px;">
          <el-table :data="nutritionistNutritionDataRows" class="table" style="width:100%" center>
            <!-- <el-table-column prop="name" label="名称"></el-table-column> -->
            <el-table-column v-for="(item1,index1) in nutritionistNutritionData" :key="index1" :prop="item1.propname" :label="item1.indexname+'('+item1.unit+')'"></el-table-column>
            
          </el-table>
        </div>
      </div>
    </div>
    <div class="detailMessage">
      <div class="title_detailmessage">客户详细信息</div>
      <div class="detailMessage_spans">
        <span v-for="(item,index) in spans" :key="index" @click="setIndicatorMsg(item)" :class="indicatorMsg.indicatorid == item.indicatorid?'spans spans_active':'spans'">{{item.indicatorname}}</span>
      </div>
      <p style="font-size:12px;color:#8C8C8C;padding-top:15px;">{{indicatorMsg.indicatorname}}变化曲线图</p>
      <div id="main" style="height: 250px;width: 80%;display: inline-block;position: relative;"></div>
    </div>
    <el-dialog title="菜谱选择" :visible.sync="dialogFormVisible">
      <el-form :model="menusObj">
        <el-form-item label="菜谱名称:" class="formItem">
          <template>
            <el-select v-model="menusObj.foodmenuid" placeholder="请选择">
              <el-option
                v-for="item in menus"
                :key="item.id"
                :label="item.menuname"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="份数修改" custom-class="fenshuBox" :visible.sync="dialogFormVisibleFenshu">
      <el-form :model="menusObj">
        <!-- <el-form-item label="菜谱选择:" class="formItem">
          <template>
            <el-select v-model="fenshuObj.caipumsg" placeholder="请选择">
              <el-option
                v-for="item in fenshuObj.canpuArr.foodmenuinfo"
                :key="item.id"
                :label="item.menuname"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-form-item><br /> -->
        <el-form-item label="份数:" class="formItem">
          <el-input type="number" v-model="fenshuObj.menucent" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleFenshu = false">取 消</el-button>
        <el-button type="primary" @click="determineFenshu">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="editCaipuTitle" :visible.sync="editCaipuDialog">
      <el-form :model="editCaipuObj" class="editCaipudialog">
        <!-- <div>
          <div v-for="(item,index) in editCaipuObj.ingredientsInfo" :key="index">
            <span>{{item.name}}</span>
            <el-input type="number" v-model="item.weightratio" @change="caipuchange"></el-input>
          </div>
        </div> -->
        <el-form-item v-for="(item,index) in editCaipuObj.ingredientsInfo" :label="item.foodname+':'" :key="index" class="formItem" style="display:block;marginBottom:0px;">
          <input type="number" v-model="item.weightratio" @change="caipuchange" class="inputCaipu"></input> g
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editCaipuDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCaipuDialogDetermine">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'configurationMealEdit',
  data(){
    return {
      dialogFormVisible:false,
      dialogFormVisibleFenshu:false,
      nutritionistNutritionDataRows:[],
      form:{
        orderdate:''
      },
      msg:'',
      buttons:[
        {
          name:'早餐',
          status:0
        },{
          name:'上午间餐',
          status:0
        },{
          name:'中餐',
          status:0
        },{
          name:'下午间餐',
          status:0
        },{
          name:'晚餐',
          status:0
        },{
          name:'零食',
          status:0
        }
      ],
      dealid:'',
      orderMenuList:[],
      menus:[],
      menusObj:{
        foodmenuid:''
      },
      canbieObj:{
        mealtype:'',
        fooddealid:'',
        $index:''
      },
      fenshuObj:{
        canpuArr:'',
        menucent:1,
        caipumsg:''
      },
      spans:[
        {
          name:'血糖',
          indicatorid:'1'
        },{
          name:'血酮',
          indicatorid:'2'
        },{
          name:'体重',
          indicatorid:'3'
        }
      ],
      indicatorMsg:{
        name:'血糖',
        indicatorid:'1'
      },
      unit:'',
      option :{
        grid: {
          top: "30px",
          left: "50px",
          right: "15px",
          bottom: "80px"
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100,
            show:false,
          },
          // {
          //   handleIcon:
          //     "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z"
          // }
        ],
        tooltip: {
          show: true,
          trigger: "axis",
          formatter: function(params) {
            return `dssssss`;
          },
          backgroundColor: "#fff",
          textStyle: {
            color: "#000"
          },
          borderColor: "#000",
          borderWidth: 1
        },
        xAxis: {
          type: "category",
          data: [1,2,3,4]
        },
        yAxis: {
          type: "value",
          // splitNumber: 5,
          min: 0,
          splitArea: {
            show: false,
            areaStyle: {
              color: []
            }
          },
          max: 200,
          // axisLabel: {
          //   formatter: "{value}kg"
          // },
        },
        series: [
          {
            connectNulls:true,
            data: [
              {
                name: 1,
                value: 90,
                symbol: "emptyCircle",
                symbolSize:  4,
                symbolOffset:  ""
              },{
                name: 2,
                value: 130,
                symbol: "emptyCircle",
                symbolSize: 4,
                symbolOffset: ""
              },{
                name: '',
                value: '',
                symbol: "emptyCircle",
                symbolSize: 4,
                symbolOffset: ""
              },{
                name: 199,
                value: 150,
                symbol: "emptyCircle",
                symbolSize: 4,
                symbolOffset: ""
              }
            ],
            type: "line"
          }
        ],
        
      },
      nutritionistNutritionData:[],
      isChangShiZzwc:false,
      editCaipuTitle:'',
      editCaipuDialog:false,
      editCaipuObj:{},
      allDate:[]
    }
  },
  created(){
    this.getNutritionData()
    this.getZhibiao()
    if(this.$route.query.msg){
      this.msg = JSON.parse(decodeURIComponent(this.$route.query.msg))
    }
    //console.log(this.msg,'msg')
    this.getMsg()
    this.getmenus()
    // option(res) {
      this.$nextTick(() => {
        var myChart = echarts.init(document.getElementById("main"));
        myChart.setOption(this.option);
      });
    // }
    this.getIndicatorList(this.indicatorMsg.indicatorid,this.msg.userid)
    this.$http({
      url: "/bjyyq/apimg/ordeDayMsg",
      data: { orderid:this.msg.orderid},
      method: "get",
      success: data => {  
        if (data.status === "success") {
          this.allDate = data.data
        }
      }
    })
  },
  watch:{
    option:{
      handler:function(newVal,oldVal){
        //console.log(newVal,'llllll')
        this.$nextTick(() => {
          var myChart = echarts.init(document.getElementById("main"));
          myChart.setOption(this.option);
        });
      },
      deep:true
    },
    orderMenuList:{
      handler:function(newVal,oldVal){
        this.nutritionistNutritionDataRows = []
        let objheji = JSON.parse(JSON.stringify(newVal[0].nutrients[0]))
        // objheji.name = '合计'
        Object.keys(objheji).map((itemheji)=>{
          objheji[itemheji] = 0
          newVal.map((item2)=>{
            //console.log(item2[itemheji],itemheji,item2,'item2[itemheji]')
            objheji[itemheji] += Number(item2.nutrients[item2.nutrients.length-1][itemheji]*item2.menucent)
          })
          objheji[itemheji] = objheji[itemheji].toFixed(2)
        })
        objheji.name = '合计'
        this.nutritionistNutritionDataRows.push(objheji)
        this.nutritionistNutritionDataRows = [...this.nutritionistNutritionDataRows]
        // this.nutritionistNutritionDataRows = []

      },
      deep:true
    }
  },
  methods:{
    caipuchange(){
      //console.log('1111')
      this.$forceUpdate()
    },
    clickEditCaipuDialog(ordermenuid,foodmenuid,title,ingredientsInfo){
      this.editCaipuObj.ordermenuid = ordermenuid
      this.editCaipuObj.foodmenuid = foodmenuid
      this.editCaipuObj.ingredientsInfo = JSON.parse(JSON.stringify(ingredientsInfo))
      //console.log( this.editCaipuObj.ingredientsInfo,' this.editCaipuObj.ingredientsInfo')
      this.editCaipuTitle = title
      this.editCaipuDialog = true
    },
    editCaipuDialogDetermine(){
      //console.log(this.editCaipuObj.ingredientsInfo)
      this.editCaipuObj.ingredientsInfo.map((item)=>{
        item.name = item.foodname
      })
      this.$http({
        url: "/bjyyq/apimg/saveOrderRecipes",
        data: { ingredientsInfo:JSON.stringify(this.editCaipuObj.ingredientsInfo),ordermenuid:this.editCaipuObj.ordermenuid,foodmenuid:this.editCaipuObj.foodmenuid},
        method: "post",
        success: data => {
          if (data.status === "success") {
            this.$message({
              message: "保存成功",
              type: "success",
              duration: 1000,
              center: true
            });
            this.getCanbie()
            this.editCaipuDialog = false
            // let store = this.$store.global;
            // store.commit("setBreadcrumb", [
            //   {
            //     name:'菜谱配餐',
            //     path:'/home'
            //   },{
            //     name:'菜谱制作',
            //     path:'/home/recipesMaking'
            //   }
            // ])
            // this.$router.go(-1)
          }
        }
      });
    },
    getZhibiao(){
      this.$http({
        url: "/bjyyq/api/everydayCal",
        data: {},
        method: "post",
        success: data => {
          if(data.status == 0){
            this.spans = data.data.msg
            this.spans.map((item)=>{
              item.indicatorid = item.id
            })
            this.indicatorMsg = this.spans[0]
            this.unit = this.spans[0].unit
            this.option.yAxis.max = this.spans[0].ymax
            this.option.yAxis.min = this.spans[0].ymin
            // this.option.yAxis.axisLabel.formatter = `${this.spans[0].indicatorname}(${this.spans[0].unit})`
          }
        }
      })
    },
    openImg(src){
      window.open(src)
    },
    //改变指标信息
    setIndicatorMsg(msg){
      this.indicatorMsg = msg
      this.unit = msg.unit
      this.option.yAxis.max = msg.ymax
      this.option.yAxis.min = msg.ymin
      // this.option.yAxis.axisLabel.formatter = `${msg.indicatorname}(${msg.unit})`
      this.getIndicatorList(this.indicatorMsg.indicatorid,this.msg.userid)
    },
    getIndicatorList(indicatorid,userid){
      this.$http({
        url: "/bjyyq/apimg/indicatorList",
        data: {indicatorid,userid},
        method: "get",
        success: data => {
          if(data.status == 'success'){
            this.option.xAxis.data = []
            this.option.series[0].data = []
            //console.log(this.unit,'this.unit')
            let _this = this
            if(data.data.length>0){
              this.option.tooltip.formatter = function(params) {
                //console.log(params,'22222')
                return params[0].value
                  ?`<div>${params[0].axisValue} <br/>${params[0].value}(${_this.unit})</div>`
                  :''
              }
              data.data.map((item)=>{
                this.option.xAxis.data.push(item.valuetime.split(' ')[0])
                this.option.series[0].data.push({
                  name: item.indicatorvalue,
                  value: item.indicatorvalue,
                  symbol: "emptyCircle",
                  symbolSize:  4,
                  symbolOffset:  ""
                })
              })
            } 
          }
        }
      })
    },
    //修改份数
    changeFenshu(rowmsg){
      if(this.isChangShiZzwc){
        return
      }
      this.dialogFormVisibleFenshu = true
      this.fenshuObj.canpuArr = rowmsg
      this.fenshuObj.menucent = rowmsg.foodmenuinfo[0].menucent
    },
    determineFenshu(){
      // if(this.fenshuObj.canpuArr.foodmenuinfo.length>1){
      //   let arr = this.fenshuObj.canpuArr.menucent.split(',')
      //   this.fenshuObj.canpuArr.foodmenuid.split(',').map((item,index)=>{
      //     if(item == this.fenshuObj.caipumsg){
      //       arr[index] = this.fenshuObj.menucent
      //     }
      //   })
      //   this.changeMenuCent(this.fenshuObj.canpuArr.id,arr.join(','))
      // }else{
        //console.log(this.fenshuObj)
        this.changeMenuCent(this.fenshuObj.canpuArr.id,this.fenshuObj.menucent)
      // }
    },
    //修改菜谱份数
    changeMenuCent(id,menucent){
      this.$http({
        url: "/bjyyq/apimg/menuCentAction",
        data: {id,menucent},
        method: "get",
        success: data => {
          if(data.status == 'success'){
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1000,
              center: true
            });
            this.dialogFormVisibleFenshu = false
            this.getCanbie()
          }
        }
      });
    },
    //每天配餐完成
    peicanDeal(){
      this.$http({
        url: "/bjyyq/apimg/dealAction",
        data: {dealid:this.dealid,status:1,orderid:this.msg.orderid,dietitianid:sessionStorage.userid},
        method: "get",
        success: data => {
          if(data.status == 'success'){
            let temp = false
            let actiondesc = ''
            // this.nutritionistNutritionDataRows = []
            data.data.map((item)=>{
              if(item.status == 0){
                temp = true
              }
            })
            if(temp){
              actiondesc = `${this.form.orderdate} 菜谱制作完成`
            }else{
              actiondesc = `此订单菜谱全部制作完成`
            }
            this.orderActionEdit(this.msg.userid,this.msg.orderid,`${this.form.orderdate} 菜谱制作完成`,actiondesc)
          }
        }
      });
    },
    //修改订单状态
    orderActionEdit(userid,orderid,actionname,actiondesc){
      this.$http({
        url: "/bjyyq/apimg/orderActionEdit",
        data: {userid,actionname,actiondesc,orderid,actionseq:3},
        method: "get",
        success: data => {
          if(data.status == 'success'){
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1000,
              center: true
            });
            // this.dealid = ''
            // this.form.orderdate = ''
            // this.getCanbie()
          }
        }
      })
    },
    editCaipu(rowmsg,item){
      //console.log(item)
      // item.map((i)=>{
        item.ordermenuid = rowmsg.id
        item.foodmenuid = item.id
      // })
      this.$router.push({
        path: '/home/recipesMakingEdit',
        query: {
          type:'edit',
          msg: encodeURIComponent(JSON.stringify(item)),
          from: 'order',
          
        }
      })
    },
    delCanbieButton(msg){
      if(this.isChangShiZzwc){
        return
      }
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        this.delCanbie(msg)
      }).catch(()=>{
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      })
    },
    delCanbie(msg){
      this.$http({
        url: "/bjyyq/apimg/deleteOrderMenu",
        data: {id:msg.id},
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.buttons.map((item)=>{
              if(item.name == msg.mealtype){
                item.status = 0
              }
            })
            
            this.getCanbie()
          }
        }
      });
    },
    determine(){
      
      this.addCanbie(this.canbieObj.mealtype,this.dealid,1,this.menusObj.foodmenuid).then(()=>{
        // this.buttons[this.canbieObj.$index].status = 1
        this.dialogFormVisible = false
      })
    },
    getmenus(){
      this.$http({
        url: "/bjyyq/apimg/recipeList",
        data: {},
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.menus = data.data.data
          }
        }
      });
    },
    addCaipu(rowmsg,item){
      // //console.log(rowmsg,item,'///////')
      let str = `${rowmsg.foodmenuid},${item.id}`
      this.addCanbie(rowmsg.mealtype,rowmsg.fooddealid,rowmsg.menucent+','+1,str,rowmsg.id)
    },
    dateChange(value){
      if(value == null){
        this.dealid = ''
        this.form.orderdate = ''
        this.nutritionistNutritionDataRows = []
        this.getCanbie()
        return
      }
      this.$http({
        url: "/bjyyq/apimg/ordeDayMsg",
        data: { orderid:this.msg.orderid,orderdate:value },
        method: "get",
        success: data => {  
          if (data.status === "success") {
            this.dealid = data.data[0].id
            this.getCanbie()
            this.isChangShiZzwc = false
          }
          else{
            // this.$message({
            //   message: data.data,
            //   type: "warning",
            //   duration: 1000,
            //   center: true
            // });
            this.isChangShiZzwc = true
            this.dealid = data.data[0].id
            this.getCanbie()

          }
        }
      })
    },
    getCanbie(){
      this.$http({
        url: "/bjyyq/apimg/orderMenuList",
        data: { fooddealid:this.dealid},
        method: "get",
        success: data => {  
          if (data.status === "success") {
            this.orderMenuList = data.data
            this.buttons = [
              {
                name:'早餐',
                status:0
              },{
                name:'上午间餐',
                status:0
              },{
                name:'中餐',
                status:0
              },{
                name:'下午间餐',
                status:0
              },{
                name:'晚餐',
                status:0
              },{
                name:'零食',
                status:0
              }
            ]
            this.orderMenuList.length>0 && this.orderMenuList.map((item,index)=>{
              this.buttons.map((item1,index1)=>{
                if(item.mealtype == item1.name){
                  // item1.status = 1
                }
              })
            })
            this.orderMenuList.length>0 && this.orderMenuList.map((item)=>{
              item.menuname = ''
              item.foodmenuinfo.map((item2,index2)=>{
                if(item.foodmenuinfo.length>1){
                  item2.menucent = item.menucent.split(',')[index2]
                }else{
                  item2.menucent = item.menucent
                }
                if(index2==0){
                  item.menuname+=item2.menuname 
                }else{
                  item.menuname+=`，${item2.menuname}`
                }
              })
            })
            let arr = []
            this.orderMenuList.length>0 && this.orderMenuList.map((item,index)=>{
              // item.ordermenuid = rowmsg.id
              // item.foodmenuid = item.id
              //console.log(item,item.id,item.foodmenuinfo[0].id,'ssssss')
              this.getOrderRecipeListDetail(item.id,item.foodmenuinfo[0].id,index)
            })
            
            // //console.log(this.orderMenuList,'orderMenuList')
          }
        }
      })
    },
    async getOrderRecipeListDetail(ordermenuid,foodmenuid,$index){
      await this.$http({
        url: "/bjyyq/apimg/orderRecipeListDetail",
        data: {ordermenuid,foodmenuid},
        method: "get",
        success: data => {
          // this.tableData = data.data
          // //console.log(data.data.data,'sssdadassa')
          let arr = []
          // //console.log(this.orderMenuList,'this.orderMenuListthis.orderMenuListthis.orderMenuList')
          this.orderMenuList[$index].ingredientsInfo = data.data
          //console.log(this.orderMenuList,data.data,'this.orderMenuList')
          data.data.map((item)=>{
            let obj = {}
            obj.typeid = item.foodcode
            obj.weightratio = item.weightratio
            obj.typename = item.foodname
            arr.push(obj)
          })
          // //console.log(arr,'sssdadassa')
          this.getStatementList('','shicai_params',JSON.stringify(arr),$index).then(()=>{

          })
        }
      });
    },
    getNutritionData(){
      //console.log('000000000')
      this.$http({
        url: "/bjyyq/apimg/nutrientsList",
        data: {userid:sessionStorage.userid},
        method: "get",
        success: data => {
          if(data.status == 'success'){
            data.data.map((item)=>{
              let obj = {}
              obj.indexname = item.indexname
              obj.propname = item.pym
              obj.unit = item.unit
              this.nutritionistNutritionData.push(obj)
            })
            
            //console.log(this.nutritionistNutritionData,'this.nutritionistNutritionData')
          }
        }
      });
    },
    async getStatementList(typename='',type,typeid=JSON.stringify([]),$index){
      await this.$http({
        url: "/bjyyq/apimg/statementList",
        data: { typename,type,typeid},
        method: "get",
        success: data => {
          if (data.status === "success") {
            
            if(type == 'shicai_params'){
              //console.log(data.data,'dadadada')
              let tableData = []
              data.data.map((item)=>{
                tableData.push(item)
              })
              
              // this.orderMenuList[$index].nutrients = tableData
              // //console.log(this.orderMenuList,'this.tableData')
              // let 
              this.orderMenuList[$index].nutrients = []
              //console.log(tableData,'obj')
              tableData.map((item,index)=>{
                //console.log(this.nutritionistNutritionData,'nutritionistNutritionData')
                let obj = {}
                obj.name = item.name
                this.nutritionistNutritionData.map((item1,index1)=>{
                  obj[item1.propname] = (item['weightratio'] * item['sb'].ansrange/100/100*(item[item1.propname]?item[item1.propname].ansrange:0)).toFixed(2)
                })
                
                this.orderMenuList[$index].nutrients.push(obj)
                
              })
              if(this.orderMenuList[$index].nutrients.length>0){
                let objheji = JSON.parse(JSON.stringify(this.orderMenuList[$index].nutrients[0]))
                // objheji.name = '合计'
                Object.keys(objheji).map((itemheji)=>{
                  objheji[itemheji] = 0
                  this.orderMenuList[$index].nutrients.map((item2)=>{
                    //console.log(item2[itemheji],itemheji,item2,'item2[itemheji]')
                    objheji[itemheji] += Number(item2[itemheji])
                  })
                  objheji[itemheji] = objheji[itemheji].toFixed(2)
                })
                objheji.name = '合计'
                this.orderMenuList[$index].nutrients.push(objheji)
              }
              let str = ''
              Object.keys(this.orderMenuList[$index].nutrients[this.orderMenuList[$index].nutrients.length-1]).map((item)=>{
                this.nutritionistNutritionData.map((item1)=>{
                  if(item1.propname == item){
                    str+=`<p>${item1.indexname}:${this.orderMenuList[$index].nutrients[this.orderMenuList[$index].nutrients.length-1][item]*this.orderMenuList[$index].menucent}${item1.unit}</p>`
                  }
                })
              })
              this.orderMenuList[$index].nutrientsHtml = str
              this.$forceUpdate()
              this.orderMenuList = [...this.orderMenuList]
              //console.log(this.orderMenuList,'this.tableData')
            }else{
              // this.options4 = data.data
            }
            
          }
        }
      });
    },
    ancionCanbie(item,$index){
      if(this.form.orderdate == '' || this.form.orderdate == null || this.form.orderdate == undefined){
        this.$message({
          message: "请先选择日期",
          type: "error",
          duration: 1000,
          center: true
        });
        return
      }
      if(this.isChangShiZzwc){
        return
      }
      if(item.status == 0){
        
        this.dialogFormVisible = true
        this.canbieObj.mealtype = item.name
        this.canbieObj.$index = $index
      }else{
        this.buttons[$index].status = 0
        this.orderMenuList.map((item1,index1)=>{
          if(item1.mealtype == item.name){
            this.delCanbie(item1)
          }
        })
      }
      // this.addCanbie(item.name,this.dealid)
    },
    async addCanbie(mealtype,fooddealid,menucent,foodmenuid,id){
      await this.$http({
        url: "/bjyyq/apimg/orderMenuAction",
        data: {mealtype,fooddealid,menucent,foodmenuid,id},
        method: "get",
        success: data => {  
          if (data.status === "success") {
            this.$message({
              message: "添加成功",
              type: "success",
              duration: 1000,
              center: true
            });
            this.getCanbie()
            
          }
        }
      })
    },
    pickerOptions(){
      let _this = this
      //console.log(this.allDate,'allDate')
      // allDate
      return {
        disabledDate(time) {
          return time.getTime() < new Date(_this.msg.startdate) || time.getTime() > new Date(_this.msg.enddate)
        },
        cellClassName(time){
          let peicanwancheng = []
          let zhizuowancheng = []
          _this.allDate.map((item)=>{
            if(item.status==1){
              // //console.log(new Date(item.orderdate).getTime(),'new Date(item.orderdate)')
              let da = new Date(item.orderdate)
              var year = da.getFullYear();
              var month = da.getMonth()+1;
              var date = da.getDate();
              let str = [year,month,date].join('-')
              peicanwancheng.push(str)
            }
            if(item.status==2){
              let da = new Date(item.orderdate)
              var year = da.getFullYear();
              var month = da.getMonth()+1;
              var date = da.getDate();
              let str = [year,month,date].join('-')
              zhizuowancheng.push(str)
            }
          })
          // //console.log(peicanwancheng,time.getTime(),'time.getTime()')
          // //console.log(peicanwancheng.includes(time.getTime()),'peicanwancheng.includes(time.getTime())')
          let date2 = time
          var year = date2.getFullYear();
          var month = date2.getMonth()+1;
          var date = date2.getDate();
          let str = [year,month,date].join('-')
          //console.log(str,peicanwancheng,'peicanwancheng')
          if(peicanwancheng.includes(str)){
            return 'peicangreen';
          }else if(zhizuowancheng.includes(str)){
            return 'peicanred'
          }
        }
      }
    },
    getMsg(){
      this.$http({
        url: "/bjyyq/apimg/customerMsg",
        data: { userid:this.msg.userid },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.form = {...data.data,...this.form}
            //console.log(this.form,'sss')
          }
        }
      })
    },
    // orderdate
  }
}
</script>
<style lang="less">
.configurationMealEdit{
  .formItem{
    display: inline-block;
    div{
      display: inline-block;
    }
    .el-input__inner{
      width: 200px;
      height: 32px;
    }
    .el-form-item__label{
      width: auto!important;
    }
  }
  .editCaipudialog{
    max-height: 300px;
    overflow-y: auto;
  }
}
.configurationMealEdit{
  .table{
    margin-top: 20px;
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
.peicanred{
    // color: red;
    span{
      // border:1px solid red;
      border-radius:50%;
      background: #f5d7d7;
    }
  }
  .peicangreen{
    span{
      // border:1px solid red;
      border-radius:50%;
      background: #22ef7d;
    }
  }
</style>
<style lang="less" scoped>
  .configurationMealEdit{
    
    text-align: left;
    .title{
      font-size:32px;
      font-family:PingFangSC;
      font-weight:500;
      color:rgba(88,71,221,1);
      line-height:45px;
      padding-bottom: 10px;
    }
    .message{
      background: #fff;
      padding: 15px;
      >p{
        font-size:18px;
        font-family:PingFangSC;
        font-weight:500;
        color:rgba(88,71,221,1);
        line-height:25px;
        padding-bottom: 10px;
      }
      .formItem{
        margin-left: 50px;
        &:first-child{
          margin-left: 0px;
        }
      }
      .buttonbox{
        .button{
          background:rgba(28,9,179,1);
          border-radius:2px;
          padding:5px 10px;
          color: #fff;
          border: none;
          margin-left: 20px;
          &:first-child{
            margin-left: 0px;
          }
        } 
        
      }
    }
    .canbieBox{
      .table_button{
        padding:5px 10px;
        color:#fff;
        border:none;
        margin-left: 16px;
      }
      .table_button1{
        background: #D0021B;
        margin-left:0px;
      }
      .table_button4{
        background: #D0021B;
      }
      .table_button2{
        background: #5847DD;
      }
      .table_button3{
        background: #999999;
      }
    }
    .detailMessage{
      margin-top:20px;
      background: #fff;
      padding: 15px;
      .title_detailmessage{
        font-size:18px;
        font-family:PingFangSC;
        font-weight:500;
        color:rgba(88,71,221,1);
      }
      .detailMessage_spans{
        padding: 10px 0px;
        .spans{
          background:rgba(28,9,179,.65);
          border-radius:2px;  
          color: #fff;
          padding:5px 18px;
          margin-left: 20px;
          cursor: pointer;
          &:nth-child(1){
            margin-left: 0px
          }
        }
        .spans_active{
          background:rgba(28,9,179,1);
        }
      }
      
    }
    .inputCaipu{
      outline: none;
      // line-height: 30px;
      width: 50px;
    }
    
  }
</style>