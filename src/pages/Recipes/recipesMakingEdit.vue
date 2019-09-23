<template>
  <div class="recipesMakingEdit">
    <div class="title">
      <div>菜谱编辑</div>
      <el-button v-if="!isExamine" @click="saveRecipes">保存</el-button>
    </div>
    <div class="recipeContent">
      <el-form :model="form">
        <el-form-item label="名称:" :rules="rules" class="formItem">
          <el-input :disabled="isExamine || isfromOrder" v-model="form.menuname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码:" :rules="rules" class="formItem">
          <el-input :disabled="isExamine || isfromOrder" v-model="form.menucode" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="甜度:" :rules="rules" class="formItem">
          <el-input :disabled="isExamine || isfromOrder" v-model="form.sweetness" auto-complete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="烹饪方法:" :rules="rules" class="formItem">
          <el-input :disabled="isExamine || isfromOrder" v-model="form.cooktype" auto-complete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="准备时长(分):" :rules="rules" class="formItem">
          <el-input :disabled="isExamine || isfromOrder" v-model="form.cooktime" auto-complete="off"></el-input>
        </el-form-item><br/> -->
        <el-form-item label="描述:" class="formItem">
          <el-input :disabled="isExamine || isfromOrder" class="textarea_recipe" type="textarea" rows="3" v-model="form.menudesc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片:" class="formItem" style="display:block">
          <el-upload
            class="upload-demo"
            :http-request="(file)=>{uploadFileMethod(file)}"
            action
            :file-list="fileList"
            list-type="picture"
            :on-exceed="handleErrBig"
            :limit="Number(1)"
            :disabled="isExamine || isfromOrder"
          >
            <el-button size="small" :disabled="isExamine || isfromOrder">上传图片</el-button>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="选择营养成分:" style="width:100%" class="formItem">
          <div>
            <el-checkbox-group v-model="checkList">
              <el-checkbox v-for="(item,index) in checkData" :key="index" :disabled="item.isdisabled" :checked="item.isdisabled" :label="item.name"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item> -->
        <el-form-item label="营养成分:" class="formItem formItemYy">
          <div style="display:inline-block;width:1100px;">
            <el-table :data="nutritionistNutritionDataRows" class="table" style="width:100%" center>
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column v-for="(item1,index1) in nutritionistNutritionData" :key="index1" :prop="item1.propname" :label="item1.indexname+'('+item1.unit+')'"></el-table-column>
              
            </el-table>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="title" style="padding:10px 0px;">食材</div>
    <div class="shicaiBox">
      <div class="filter">
        <el-form :model="filterObj">
          <el-form-item label="名称:" class="formItem2">
            <el-select
              class="select_filter"
              v-model="filterObj.typeid"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :disabled="isExamine"
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
        <button v-if="!isExamine" @click="addShicai">添加</button>
      </div>
      <div class="shicaiTable">
        <el-table :data="tableData" class="table" style="width: 100%" center>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="bm.ansrange" label="编码"></el-table-column>
          <el-table-column prop="sb.ansrange" label="可食部(%)"></el-table-column>
          <el-table-column prop="sf.ansrange" label="水(g)"></el-table-column>
          <!-- <el-table-column prop="nl.ansrange" label="能量(kcal)"></el-table-column>
          <el-table-column prop="dbz.ansrange" label="蛋白质(g)"></el-table-column>
          <el-table-column prop="zf.ansrange" label="脂肪(g)"></el-table-column>
          <el-table-column prop="tshhw.ansrange" label="碳水化合物(g)  "></el-table-column> -->
          <el-table-column v-for="(item1,index1) in nutritionistNutritionData" :key="index1" :prop="item1.propname+'.ansrange'" :label="item1.indexname+'('+item1.unit+')'"></el-table-column>
          <el-table-column prop="weightratio" label="比重(g)">
            <template slot-scope="scope">
              <input :disabled="isExamine" style="width:50px" v-model="scope.row.weightratio"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template v-if="!isExamine" slot-scope="scope">
              <button class='chicai_button' @click="seqno('up',scope.$index)">上移</button>
              <button class='chicai_button' @click="seqno('down',scope.$index)">下移</button>
              <button class='chicai_button' @click="del(scope.$index)">删除</button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'recipesMakingEdit',
  data(){
    return {
      checkList:[],
      form:{
        menuname:'',
        menucode:'',
        cooktype:'',//烹饪方法
        cooktime:'',//烹饪时长
        sweetness:'',//甜度
        menudesc:'',//描述
        menupic:''
      },
      rules:[
        { required: true, message: '输入不能为空'},
      ],
      filterObj:{
        typeid:''
      },
      options4:[],
      fileList:[],
      tableData:[],
      isExamine:false,
      isfromOrder:false,
      nutritionistNutritionData:[
        // {
        //   indexname:'能量',
        //   propname:'nl'
        // },{
        //   indexname:'蛋白质',
        //   propname:'dbz'
        // },{
        //   indexname:'脂肪',
        //   propname:'zf'
        // },{
        //   indexname:'碳水化合物',
        //   propname:'tshhw'
        // }
      ],
      nutritionistNutritionDataRows:[],
      checkData:[
        {
          name:'能量',
          pym:'nl',
          isdisabled:true
        },{
          name:'蛋白质',
          pym:'dbz',
          isdisabled:true
        },{
          name:'脂肪',
          pym:'zf',
          isdisabled:true
        },{
          name:'碳水化合物',
          pym:'tshhw',
          isdisabled:true
        },{
          name:'钙',
          pym:'g'
        },{
          name:'镁',
          pym:'m'
        },{
          name:'烟酸',
          pym:'ys'
        },{
          name:'铁',
          pym:'t'
        },{
          name:'锌',
          pym:'x'
        },{
          name:'铝',
          pym:'l'
        }
      ]
    }
  },
  watch:{
//     checkList: {
// 　　　　handler(newValue, oldValue) { 
//           this.nutritionistNutritionDataRows = []
//           this.nutritionistNutritionData = [
//             // {
//             //   indexname:'能量',
//             //   propname:'nl'
//             // },{
//             //   indexname:'蛋白质',
//             //   propname:'dbz'
//             // },{
//             //   indexname:'脂肪',
//             //   propname:'zf'
//             // },{
//             //   indexname:'碳水化合物',
//             //   propname:'tshhw'
//             // }
//           ]
//           newValue.map((item)=>{
//             this.checkData.map((item1)=>{
//               if(item==item1.name){
//                 let obj = {}
//                 obj.indexname = item1.name
//                 obj.propname = item1.pym
//                 if(obj.indexname !='能量' && obj.indexname !='碳水化合物'&&obj.indexname !='脂肪'&&obj.indexname !='蛋白质'){
//                   this.nutritionistNutritionData.push(obj)
//                 }
//               }
//             })
//           })
//           this.tableData.map((item,index)=>{
//             let obj = {}
//             obj.name = item.name
//             this.nutritionistNutritionData.map((item1,index1)=>{
//               obj[item1.propname] = (item['weightratio'] * item['sb'].ansrange/100/100*(item[item1.propname]?item[item1.propname].ansrange:0)).toFixed(2)
//             })
//             this.nutritionistNutritionDataRows.push(obj)
//           })
// 　　　　},
// 　　　　deep: true
// 　　},
    tableData:{
      handler(newValue,oldValue){
        this.nutritionistNutritionDataRows = []
        newValue.map((item,index)=>{
          let obj = {}
          obj.name = item.name
          this.nutritionistNutritionData.map((item1,index1)=>{
            obj[item1.propname] = (item['weightratio'] * item['sb'].ansrange/100/100*(item[item1.propname]?item[item1.propname].ansrange:0)).toFixed(2)
          })
          this.nutritionistNutritionDataRows.push(obj)
          
          // console.log(objheji,'hejiheji')
          
          
          
          console.log(this.nutritionistNutritionDataRows,'this.nutritionistNutritionDataRows')
        })
        if(this.nutritionistNutritionDataRows.length>0){
          let objheji = JSON.parse(JSON.stringify(this.nutritionistNutritionDataRows[0]))
          // objheji.name = '合计'
          Object.keys(objheji).map((itemheji)=>{
            objheji[itemheji] = 0
            this.nutritionistNutritionDataRows.map((item2)=>{
              console.log(item2[itemheji],itemheji,item2,'item2[itemheji]')
              objheji[itemheji] += Number(item2[itemheji])
            })
            objheji[itemheji] = objheji[itemheji].toFixed(2)
          })
          objheji.name = '合计'
          this.nutritionistNutritionDataRows.push(objheji)
        }
      },
      deep: true
    }
  },
  created(){
    if(this.$route.query.from == 'order'){
      if(this.$route.query.type == 'examine'){
        this.isExamine = true
      }
      this.isfromOrder = true
      this.form = JSON.parse(decodeURIComponent(this.$route.query.msg))
      if(this.form.menupic!=''&&this.form.menupic!=null&&this.form.menupic!=undefined){
        this.fileList.push({
          name:this.form.menupic,
          url:sessionStorage.img + '/'+ this.form.menupic
        })
      }
      
      this.getOrderRecipeListDetail()
    }else{
      if(this.$route.query.type == 'edit'){
        this.form = JSON.parse(decodeURIComponent(this.$route.query.msg))
        if(this.form.menupic!=''&&this.form.menupic!=null&&this.form.menupic!=undefined){
          this.fileList.push({
            name:this.form.menupic,
            url:sessionStorage.img + '/'+ this.form.menupic
          })
        }
        this.getRecipeListDetail()
      }else if(this.$route.query.type == 'examine'){
        this.isExamine = true
        this.form = JSON.parse(decodeURIComponent(this.$route.query.msg))
        if(this.form.menupic!=''&&this.form.menupic!=null&&this.form.menupic!=undefined){
          this.fileList.push({
            name:this.form.menupic,
            url:sessionStorage.img + '/'+ this.form.menupic
          })
        }
        this.getRecipeListDetail()
      }
    } 
    this.getNutritionData()
  },
  methods:{
    getNutritionData(){
      console.log('000000000')
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
            console.log(this.nutritionistNutritionData,'this.nutritionistNutritionData')
          }
        }
      });
    },
    getOrderRecipeListDetail(){
      this.$http({
        url: "/bjyyq/apimg/orderRecipeListDetail",
        data: {ordermenuid:this.form.ordermenuid,foodmenuid:this.form.foodmenuid},
        method: "get",
        success: data => {
          // this.tableData = data.data
          console.log(data.data.data,'sssdadassa')
          let arr = []
          data.data.map((item)=>{
            let obj = {}
            obj.typeid = item.foodcode
            obj.weightratio = item.weightratio
            obj.typename = item.foodname
            arr.push(obj)
          })
          console.log(arr,'sssdadassa')
          this.getStatementList('','shicai_params',JSON.stringify(arr)).then(()=>{
            // this.tableData.map((item,index)=>{
            //   let obj = {}
            //   obj.name = item.name
            //   this.nutritionistNutritionData.map((item1,index1)=>{
            //     obj[item1.propname] = (item['weightratio'] * item['sb'].ansrange/100/100*item[item1.propname].ansrange).toFixed(2)
            //   })
            //   this.nutritionistNutritionDataRows.push(obj)
            //   console.log(this.nutritionistNutritionDataRows,'this.nutritionistNutritionDataRows')
            // })
          })
        }
      });
    },
    async getRecipeListDetail(){
      await this.$http({
        url: "/bjyyq/apimg/recipeListDetail",
        data: {id:this.form.id},
        method: "get",
        success: data => {
          // this.tableData = data.data
          console.log(data.data.data,'sssdadassa')
          let arr = []
          data.data.data.map((item)=>{
            let obj = {}
            obj.typeid = item.foodcode
            obj.weightratio = item.weightratio
            obj.typename = item.foodname
            arr.push(obj)
          })
          console.log(arr,'sssdadassa')
          this.getStatementList('','shicai_params',JSON.stringify(arr)).then(()=>{
              // this.tableData.map((item,index)=>{
              //   let obj = {}
              //   obj.name = item.name
              //   this.nutritionistNutritionData.map((item1,index1)=>{
              //     obj[item1.propname] = (item['weightratio'] * item['sb'].ansrange/100/100*item[item1.propname].ansrange).toFixed(2)
              //   })
              //   this.nutritionistNutritionDataRows.push(obj)
              //   console.log(this.nutritionistNutritionDataRows,'this.nutritionistNutritionDataRows')
              // })
          })
        }
      });
    },
    saveRecipes(){
      if(
        this.form.menuname == '' || 
        this.form.menucode == '' ||
        this.form.cooktype == '' 
        // this.form.cooktime == '' ||
        // this.form.sweetness == ''
      ){
        this.$alert('带*为必填项', {
          confirmButtonText: '确定',
        });
        return
      }
      console.log(this.tableData,'this.tableData')
      if(
        this.tableData.length == 0
      ){
        this.$alert('食材最少有一样', {
          confirmButtonText: '确定',
        });
        return
      }
      this.save()
    },
    save(){
      !this.isfromOrder && this.$http({
        url: "/bjyyq/apimg/saveRecipes",
        data: { recipes:JSON.stringify(this.form),ingredientsInfo:JSON.stringify(this.tableData),id:this.form.id},
        method: "post",
        success: data => {
          if (data.status === "success") {
            this.$message({
              message: "保存成功",
              type: "success",
              duration: 1000,
              center: true
            });
            let store = this.$store.global;
            store.commit("setBreadcrumb", [
              {
                name:'菜谱配餐',
                path:'/home'
              },{
                name:'菜谱制作',
                path:'/home/recipesMaking'
              }
            ])
            this.$router.push({
              path: '/home/recipesMaking',
              query: {
                // type:type,
                // id: id
              }
            })
          }
        }
      });
      this.isfromOrder && this.$http({
        url: "/bjyyq/apimg/saveOrderRecipes",
        data: { ingredientsInfo:JSON.stringify(this.tableData),ordermenuid:this.form.ordermenuid,foodmenuid:this.form.foodmenuid},
        method: "post",
        success: data => {
          if (data.status === "success") {
            this.$message({
              message: "保存成功",
              type: "success",
              duration: 1000,
              center: true
            });
            let store = this.$store.global;
            // store.commit("setBreadcrumb", [
            //   {
            //     name:'菜谱配餐',
            //     path:'/home'
            //   },{
            //     name:'菜谱制作',
            //     path:'/home/recipesMaking'
            //   }
            // ])
            this.$router.go(-1)
          }
        }
      });
    },
    //上移下移
    seqno(type,$index){
      console.log($index,'ppp')
      if(type == 'up'){
        this.tableData.splice($index-1, 0, this.tableData[$index])
        this.tableData.splice($index+1, 1)
      }else{
        this.tableData.splice($index+2, 0, this.tableData[$index])
        this.tableData.splice($index, 1)
        // console.log(this.tableData,'pdassassasa')
      }
    },
    del($index){
      this.tableData.splice($index, 1)
    },
    //添加食材
    addShicai(){
      console.log(this.filterObj.typeid,'////////')
      let typename = ''
      this.options4.map((item)=>{
        if(item.id == this.filterObj.typeid){
          typename = item.typename
        }
      })
      let arr = [
        {
          typeid:this.filterObj.typeid,
          typename:typename
        }
      ]
      this.getStatementList(typename,'shicai_params',JSON.stringify(arr))
    },
    //上传大于一个，详情图片
    handleErrBig(file, fileList) {
      this.$message({
        message: "只能添加一张图片，请先删除再添加",
        type: "error",
        duration: 2500,
        center: true
      });
    },
    uploadFileMethod(param, type) {
      let fileObject = param.file;
      let formData = new FormData();
      formData.append("file", fileObject);
      this.$http({
        url: "/bjyyq/apimg/fileupload",
        data: formData,
        method: "post",
        success: data => {
          if (data.status === "success") {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1000,
              center: true
            });
            this.form.menupic = data.data;
          } else {
            this.$message({
              message: "操作失败",
              type: "error",
              duration: 1000,
              center: true
            });
            this.fileList = []
          }
        }
      });
    },
    //远程搜索
    remoteMethod(res){
      console.log(res,'res')
      this.getStatementList(res,'shicai_name')
    },
    async getStatementList(typename='',type,typeid=JSON.stringify([])){
      await this.$http({
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
    }
  }
}
</script>
<style lang="less">
.recipesMakingEdit{
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
  .formItem{
    display: inline-block;
    div{
      display: inline-block;
    }
    .el-input__inner{
      width: 280px;
      height: 32px;
    }
    .el-textarea__inner{
      width: 1100px;
    }
    .el-form-item__label{
      width:130px!important;
    }
  }
  .filter{
    .formItem2{
      display: inline-block;
      div{
        display: inline-block;
      }
      .el-form-item__label{
        text-align: left;
        width: auto!important
      }
    }
    .select_filter{
      height: 34px;
      .el-input__inner{
        height: 34px!important;
      }
    }
  }
  .formItemYy{
    >div{
      width:85%;
    }
  }
}
</style>
<style lang="less" scoped>
  .recipesMakingEdit{
    text-align: left;
    .title{
      font-size:32px;
      font-family:PingFangSC;
      font-weight:500;
      color:rgba(88,71,221,1);
      line-height:45px;
      >div{
        display: inline-block;
      }
      button{
        float: right;
        margin-right: 20px;
      }
    }
    .recipeContent{
      background: #fff;
      padding:20px 0px;
      margin-top: 10px;
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
    }
    .shicaiBox{
      background: #fff;
      .filter{
        padding:10px 0px;
        padding-left: 20px;
        .el-form{
          display: inline-block;
          div{
            display:inline-block;
          }
        }
        
        button{
          width:80px;
          height:32px;
          background:rgba(88,71,221,1);
          border-radius:2px;
          border: none;
          color: #fff;
          margin-left: 20px;
        }
      }
      .chicai_button{
        width:52px;
        height:24px;
        background:rgba(146,84,222,1);
        border-radius:2px;
        color: #fff;
        border:none;
        margin-left: 12px;
        &:first-child{
          margin-left: 0px;
        }
        &:last-child{
          background: #999999;
        }
      }
    }
  }
</style>