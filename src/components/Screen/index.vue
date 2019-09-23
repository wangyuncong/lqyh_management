<template>
  <div style="textAlign:left">
    <el-select v-model="selectvalue" class="sele" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <!-- 输入框 -->
    <el-input
      v-if="selectvalue != 'createtime' && selectvalue != 'schemedate' && selectvalue != 'valuetime'"
      placeholder="请输入内容"
      @keyup.native.enter="search"
      class="inputVlue"
      v-model="value"
    >
      <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
    </el-input>
    <!-- 两个日期选择 -->
    <el-date-picker
      v-else
      style="float: right;width: 257px;"
      v-model="value7"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions2"
      value-format="yyyy-MM-dd"
      @change="selechange"
    ></el-date-picker>
    <!-- 单日期选择 -->
    
  </div>
</template>
<script>
export default {
  name: "Screen",
  data() {
    return {
      selectvalue: "",
      value7: "",
      value: "",
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  components: {},
  created() {
    this.options = this.screenName;
    if(this.options.length === 1){
      this.selectvalue = this.options[0].value
    }
    
  },
  watch: {
    value7(res) {}
  },
  props: ["screenName", "type", "qita"],
  methods: {
    // type类型 1=普通 2=时间
    //   时间选择
    selechange(res) {
      if (res == null) {
        this.$emit("callback", {
          type: 2,
          value: ``,
          key: "",
          types: this.type,
          qita: this.qita
        });
        return;
      }
      this.$emit("callback", {
        type: 2,
        value: `${this.value7.toString(",")}`,
        key: this.selectvalue,
        types: this.type,
        qita: this.qita
      });
    },
    // 按钮的筛选
    search() {
      this.$emit("callback", {
        type: 1,
        value: this.value,
        key: this.selectvalue,
        types: this.type,
        qita: this.qita
      });
    }
  }
};
</script>
<style>
.inputVlue {
  width: 200px;
  height: 36px;
  border-radius: 8px;
  /* float: right; */
}
.sele{
  width:100px;
}
.el-input__icon {
}
</style>


