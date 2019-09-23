<template>
  <div class="consulting">
    <!-- <div class="tabs">
      <el-button
        :class="index ==activeIndex?'active':''"
        @click="clickTab(index)"
        v-for="(item,index) in tabs"
        :key="index"
      >{{item}}</el-button>
    </div>
    <div class="content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="userinfo.datavalue" label="名称"></el-table-column>
        <el-table-column prop="createtime" label="时间"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="activeIndex==0" size="mini" @click="toChat(scope.row.userid)">继续处理</el-button>
            <el-dropdown
              v-if="activeIndex==0"
              trigger="hover"
              @command="(item1)=>changeShouliren(scope.row,item1)"
            >
              <el-button size="mini">更改受理人</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item1,index1) in dietitianList"
                  :command="item1"
                  :key="index1"
                >{{item1.username}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-button v-else size="mini" @click="toChat(scope.row.userid)">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>-->
    <div class="consulting-main">
      <div class="consulting-main-left">
        <div class="tabs">
          <el-button
            :class="index ==activeIndex?'active':''"
            @click="clickTab(index)"
            v-for="(item,index) in tabs"
            :key="index"
          >{{item}}</el-button>
        </div>
        <div
          class="consulting-main-left-info"
          @click="tableSelect(item)"
          :key="index"
          v-for="(item,index) in tableData"
        >
          <img :src="item.img" alt />
          <div class="main-info-div">
            <p>{{item.userinfo ? item.userinfo.datavalue : item.name}}</p>
            <p>{{item.createtime}}</p>
            <div style="text-align: right; width: 100%;position: absolute;top: 0;">
              <template>
                <el-dropdown
                  v-if="activeIndex==0"
                  trigger="hover"
                  @command="(item1)=>changeShouliren(item,item1)"
                >
                  <p class="zhaunchuli">转处理</p>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(item1,index1) in dietitianList"
                      :command="item1"
                      :key="index1"
                    >{{item1.username}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="consulting-main-right">
        <chat :userid="infoUserid" v-if="infoUserid"></chat>
      </div>
    </div>
  </div>
</template>
<script>
import chat from "./chat";
export default {
  name: "consulting",
  data() {
    return {
      tabs: ["已受理咨询", "未受理咨询"],
      activeIndex: 0,
      tableData: [],
      dietitianList: [],
      infoUserid: ""
    };
  },
  created() {
    this.getList(this.activeIndex);
    this.getAllyys();
  },
  components: {
    [chat.name]: chat
  },
  methods: {
    getAllyys() {
      this.$http({
        url: "/bjyyq/apimg/dietitianList",
        data: { roleid: 3 },
        method: "get",
        success: data => {
          if (data.status === "success") {
            let arr = data.data;
            arr.map(item => {
              if (item.id != sessionStorage.userid) {
                this.dietitianList.push(item);
              }
            });
          }
        }
      });
    },
    tableSelect(item) {
      this.infoUserid = "";
      this.$nextTick(() => {
        this.infoUserid = item.userid;
      });
    },
    changeShouliren(tableMsg, itemMsg) {
      let replierid = itemMsg.id;
      let userid = tableMsg.userid;
      let id = tableMsg.id;
      this.$http({
        url: "/bjyyq/apimg/consultingAction",
        data: { replierid, userid, id },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.getList(this.activeIndex);
            this.$message({
              message: "更改成功",
              type: "success",
              duration: 1000,
              center: true
            });
          }
        }
      });
    },
    toChat(userid) {
      let routeData = this.$router.resolve({
        path: "/home/chat",
        query: {
          id: userid
        }
      });
      window.open(routeData.href, "_blank");
    },
    clickTab($index) {
      this.activeIndex = $index;
      this.getList(this.activeIndex);
    },
    getList(activeIndex) {
      if (activeIndex == 0) {
        this.$http({
          url: "/bjyyq/apimg/consultingList",
          data: { replierid: sessionStorage.userid },
          method: "get",
          success: data => {
            if (data.status === "success") {
              this.tableData = data.data;
            }
          }
        });
      } else {
        this.$http({
          url: "/bjyyq/apimg/consultingList",
          data: {},
          method: "get",
          success: data => {
            if (data.status === "success") {
              this.tableData = data.data;
            }
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.consulting {
  width: 100%;
  height: 100%;
  .consulting-main {
    background: white;
    width: 98%;
    height: 97%;
    padding: 1%;
    .consulting-main-right {
      height: 100%;
      border: 1px solid #c9cacb;
      float: right;
      width: calc(100% - 313px);
    }
    .consulting-main-left {
      float: left;
      width: 300px;
      height: 100%;
      overflow: auto;
      border: 1px solid rgba(201, 202, 203, 1);
      .consulting-main-left-info {
        padding: 0px 10px;
        margin-top: 5px;
        .main-info-div {
          float: right;
          width: 73%;
          position: relative;
          top: 8px;
          line-height: 22px;
          p:nth-of-type(1) {
            font-size: 15px;
          }
          p:nth-of-type(2) {
            font-size: 12px;
            color: #999;
          }
          .zhaunchuli {
            font-size: 12px !important;
            background: #dad5ff;
            padding: 4px;
            color: #333;
            height: 15px;
            line-height: 15px;
          }
        }
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
      }
    }
  }
  text-align: left;
  .tabs {
    padding: 10px;
    background: #f5f5f5;
    text-align: center;
    .active {
      background: #ecf5ff;
    }
    .el-button:hover {
      background: none;
    }
  }
}
</style>