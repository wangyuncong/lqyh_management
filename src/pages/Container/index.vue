<template>
  <div class="container">
    <el-container>
      <el-container>
        <el-aside width="200px">
          <h1 class="title">另起一行管理端</h1>
          <el-menu
            @open="handleOpen"
            @close="handleClose"
            @select="selectMenu"
            background-color="#001529"
            text-color="#fff"
            :router="true"
            :default-active="defaultActive"
          >
            <el-submenu
              v-if="menus.length>=1 && item.children.length > 0"
              v-for="item in menus"
              :key="item.index"
              :index="item.path"
            >
              
              <span slot="title">{{item.name}}</span>
              <el-menu-item-group v-bind:index="item.path">
                <el-menu-item
                  v-for="item2 in item.children"
                  v-bind:index="item2.path"
                  :key="item2.index"
                  style="paddingLeft:80px"
                >{{item2.name}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item
             v-bind:index="item.path"
             v-for="item in menus"
             :key="item.index"
             v-if="item.children.length == 0" 
            >
              {{item.name}}
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-header>
            <Breadcrumb :breadcrumb="this.$store.global.state.breadcrumb"></Breadcrumb>
            <div class="login">
              <el-dropdown placement="bottom" @command="handleCommand">
                <div>
                  <i class="el-icon-user" style="fontSize:20px;"></i>
                  <span>{{username}}</span>
                  <span>{{rolename}}</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <router-link to="/registered">
                    <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
                  </router-link>
                  <!-- <router-link to="/registered">
                    <el-dropdown-item>注册</el-dropdown-item>
                  </router-link> -->
                  <router-link to="/registered?type=3">
                    <el-dropdown-item>修改密码</el-dropdown-item>
                  </router-link>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-header>
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
export default {
  name: "Container",
  data() {
    return {
      menus: [],
      // menus: [
      //   {
      //     name: "用户角色",
      //     path: "/home_1",
      //     children: [
      //       {
      //         name: "用户管理",
      //         path: "/home/userManagement"
      //       },
      //       {
      //         name: "角色管理",
      //         path: "/home/roleManagement"
      //       }
      //     ]
      //   },
      //   {
      //     name: "网站信息",
      //     path: "/home_2",
      //     children: [
      //       {
      //         name: "页面信息",
      //         path: "/home/pageMessage"
      //       }
      //     ]
      //   },
      //   {
      //     name: "商品分类",
      //     path: "/home_3",
      //     children: [
      //       {
      //         name: "商品管理",
      //         path: "/home/goods"
      //       },
      //       {
      //         name: "分类管理",
      //         path: "/home/category"
      //       }
      //     ]
      //   },
      //   {
      //     name: "优惠券管理",
      //     path: "/home_4",
      //     children: [
      //       {
      //         name: "满减优惠劵",
      //         path: "/home/frPreferential"
      //       }
      //     ]
      //   },
      //   {
      //     name: "指标维护",
      //     path: "/home_5",
      //     children: [
      //       {
      //         name: "医学指标",
      //         path: "/home/medicalindicators"
      //       }
      //     ]
      //   },
      //   {
      //     name: "参数维护",
      //     path: "/home_6",
      //     children: [
      //       {
      //         name: "系统参数",
      //         path: "/home/systemParameters"
      //       }
      //     ]
      //   },
      //   {
      //     name: "积分商城",
      //     path: "/home_7",
      //     children: [
      //       {
      //         name: "积分商城",
      //         path: "/home/centShop"
      //       }
      //     ]
      //   }
      // ],
      defaultActive: "",
      username: "",
      rolename:''
    };
  },
  mounted() {
    if (!sessionStorage.userid) {
      this.$router.push("/registered");
      return;
    }
    this.getMenus().then(() => {
      // console.log(this.menus, "menus");
      // this.$router.push(this.menus[0].children[0].path)
      this.getRoleName(JSON.parse(sessionStorage.userinfo).roleid)
      this.username = JSON.parse(sessionStorage.userinfo).username;
      let url = window.location.hash.replace("#", "");
      // console.log(url, "urlurlurl");
      let arr = url.split("/");
      let store = this.$store.global;
      // console.log(arr, url);
      let arr1 = [];
      arr.map(item => {
        if (item !== "") {
          let obj = {};
          if (item === "home") {
            obj.path = `/${item}`;
          } else {
            obj.path = `/home/${item}`;
            this.defaultActive = obj.path;
          }
          arr1.push(obj);
        }
      });
      // console.log(arr1);
      this.menus.map(item => {
        item.children.map(item1 => {
          if (item1.path === arr1[1].path) {
            arr1[0].name = item.name;
          }
        });
      });
      arr1.length > 0 &&
      arr1.map(item => {
        this.menus.map(item1 => {
          if (item.path === item1.path) {
            item.name = item1.name;
          }
          if (item1.children) {
            item1.children.map(item2 => {
              if (item.path === item2.path) {
                item.name = item2.name;
              }
            });
          }
        });
      });
      arr1.map((item,index)=>{
        if(!item.name){
          arr1.splice(index,1)
        }
      })
      console.log(arr1, this.menus, "ppppppp");
      store.commit("setBreadcrumb", arr1);
    });
  },
  methods: {
    async getMenus() {
      await this.$http({
        url: "/bjyyq/apimg/menuList",
        data: {
          roleid: JSON.parse(sessionStorage.userinfo).roleid,
          type: "menuauth"
        },
        method: "get",
        success: data => {
          if (data.status === "success") {
            this.menus = data.data;
            let $index = ''
            let $item = ''
            this.menus.map((item,index)=>{
              if(item.name=='优惠券管理'){
                $index = index
                
              }
              if(item.name=='积分商城'){
                this.menus.splice(index,1)
                $item = item
              }
            })
            if($index!=='' && $item!==''){
              this.menus.splice($index+1, 0, $item)
            }
            
            console.log(this.menus,'this.menus')
          }
        }
      });
    },
    async getRoleName(id){
      await this.$http({
        url: "/bjyyq/apimg/roleList",
        data: { id },
        method: "get",
        success: data => {
          if (data.status === "success") {
            if(data.data.data.length>0){
              this.rolename = data.data.data[0].rolename
            }
          }
        }
      });
    },
    handleCommand(command) {
      if (command == "loginOut") {
        sessionStorage.removeItem("userid");
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    selectMenu(key, keyPath) {
      let store = this.$store.global;
      let arr = [];
      keyPath.map(item => {
        let obj = {};
        obj.path = item;
        arr.push(obj);
      });
      arr.map(item => {
        this.menus.map(item1 => {
          if (item.path === item1.path) {
            item.name = item1.name;
          }
          if (item1.children) {
            item1.children.map(item2 => {
              if (item.path === item2.path) {
                item.name = item2.name;
              }
            });
          }
        });
      });
      store.commit("setBreadcrumb", arr);
    }
  },
  components: {
    Breadcrumb
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.container {
  height: 100vh;
  .el-menu-item{
    background: none!important;
  }
  .el-container {
    height: 100vh;
  }
  .el-menu-item {
    // padding-left: 80px !important;
  }
  .el-header {
    position: relative;
  }
  .login {
    position: absolute;
    top: 0px;
    right: 50px;
  }
}
.title {
  font-size: 20px;
  line-height: 60px;
}
.el-menu-item.is-active {
  color: #fff;
  background: #1890ff !important;
}
.el-header,
.el-footer {
  background-color: #fff;
  /* color: #333; */
  text-align: center;
  line-height: 60px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.el-aside {
  // min-height: 600px;
  background-color: #001529;
  color: #fff;
  text-align: center;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  overflow: overlay;
  /* background: 2px 0 6px rgba(0,21,41,.35); */
}
.el-main {
  background-color: #f0f2f5;
  color: #333;
  text-align: center;
  padding: 10px;
  overflow: overlay;
  /* line-height: 700px; */
}
</style>
