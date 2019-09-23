<template>
  <div class="chat">
    <div class="chatbox">
      <div class="content">
        <el-main ref="chatContentBig" class="scrolldivmain">
          <div v-for="(item,index) in list" :key="index">
            <div
              :class="(item.replierid!==null && item.replierid!=='')?'item itemme':'item itemyou'"
            >
              <p
                v-if="(item.replierid!==null && item.replierid!=='')"
                class="chatContent"
              >{{item.content}}</p>
              <p style="display:flex;flex-direction: column;">
                <!-- <span>{{item.msg.name}}</span> -->
                <img
                  v-if="(item.replierid==null || item.replierid=='')"
                  :src="item.msg.img?item.msg.img:'../../../static/images/chat.jpg'"
                  style="width:30px;height:30px;"
                />
                <img
                  v-else
                  src='../../../static/images/chat.jpg'
                  style="width:30px;height:30px;"
                />
              </p>
              <p
                v-if="(item.replierid==null || item.replierid=='')"
                class="chatContent"
              >{{item.content}}</p>
            </div>

            <p
              :class="(item.replierid!==null && item.replierid!=='')?'time timeme':'time timeyou'"
            >{{item.createtime}}</p>
          </div>
        </el-main>
      </div>

      <div class="sendButton">
        <el-input type="textarea" rows="5" v-model="value" @keyup.enter.native="send"></el-input>
        <el-button @click="send" style="margin-top:20px;">发送</el-button>
      </div>
    </div>
  </div>
</template>
<script>
var ip =
  process.env.NODE_ENV === "production"
    ? `${location.hostname}:8001`
    : "127.0.0.1:8001";
var ws = "";

export default {
  name: "chat",
  data() {
    return {
      list: [],
      value: ""
    };
  },
  props: ["userid"],
  watch: {
    list() {
      this.$nextTick(() => {
        var scrollTop = this.$el.querySelector('.content')
        scrollTop.scrollTop = scrollTop.scrollHeight
      })
    }
  },
  destroyed() {
    ws.close();
  },
  mounted() {
    // 获取自己的id
    var _this = this;
    ws = new WebSocket(`ws://${ip}/`);
    // this.userid = this.$route.query.id;
    this.restUserId = sessionStorage.userid;
    ws.onopen = function() {
      ws.send(
        JSON.stringify({
          userid: _this.userid,
          restUserId: _this.restUserId,
          type: "ACQUIRE"
        })
      );
    };
    ws.onmessage = function(e) {
      if (e.data !== "{}") {
        var data = JSON.parse(e.data);
        if (data.type === "ACQUIRE") {
          data.inquire.forEach(element => {
            _this.list.push(element);
          });
        } else if (data.type === "ADD" || data.type === "success") {
          data.replierid = data.replierid || "";
          data.content = data.value;
          if (data.userid == _this.userid) {
            _this.list.push(data);
          }
        }
      }
    };
  },
  methods: {
    send() {
      var _this = this;
      var data = {
        userid: _this.userid,
        value: this.value,
        restUserId: _this.restUserId,
        type: "ADD"
      };
      ws.send(JSON.stringify(data));
      this.value = "";
    }
  }
};
</script>
<style lang="less" scoped>
.chat {
  height: 100%;
}
.chatbox {
  background: #fff;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 20px;
  .content {
    height: 56vh;
    overflow-y: scroll;
    .timeme {
      // position: absolute;
      text-align: right;
      padding-right: 20px;
    }
    .timeyou {
      // position: absolute;
      text-align: left;
      padding-left: 20px;
    }
    .item {
      position: relative;
      // width: 200px;
      // p{
      //   text-align: left;
      // }
      padding: 20px;
      // margin-top: 10px;
    }
    .itemme {
      text-align: right;
      display: flex;
      justify-content: flex-end;
      .chatContent {
        background: #17e31e;
        max-width: 300px;
        padding: 10px;
        margin-right: 10px;
        display: inline-block;
      }
    }
    .itemyou {
      display: flex;
      justify-content: flex-start;
      text-align: left;
      .chatContent {
        max-width: 300px;
        background: #eee;
        padding: 10px;
        margin-left: 10px;
      }
    }
  }
  .sendButton {
    margin-top: 10px;
    text-align: right;
    max-height: 30vh;
  }
}
</style>