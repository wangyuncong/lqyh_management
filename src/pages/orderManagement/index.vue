<template>
  <div class="order">
    <div class="tabs">
      <el-button :class="index ==activeIndex?'active':''" @click="clickTab(index)" v-for="(item,index) in tabs" :key="index">{{item}}</el-button>
      <!-- <el-button>其他订单</el-button> -->
    </div>
    <div class="content">
      <orderManagement v-if="activeIndex==0"/>
      <otherOrder v-else/>
    </div>
  </div>
</template>
<script>
import orderManagement from './taocanOrder'
import otherOrder from './otherOrder'
export default {
  name: 'Order',
  data(){
    return {
      tabs:['套餐订单','其他订单'],
      activeIndex:0
    }
  },
  components:{
    orderManagement,
    otherOrder
  },
  methods:{
    clickTab($index){
      this.activeIndex = $index
    }
  }
}
</script>
<style lang="less" scoped>
.order{
  background: #fff;
  text-align: left;

  .tabs{
    padding:10px;
    .active{
      background: #ecf5ff;
    }
    .el-button:hover{
      background: none;
    }
  }
  .content{
    padding: 10px;
    padding-top: 0px;
  }
}
</style>