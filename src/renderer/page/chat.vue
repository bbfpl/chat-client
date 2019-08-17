<template>
  <div class="wrapper">
    <HeaderBar type="logout" v-if="!gameWindow"></HeaderBar>
    <HeaderBar type="goback" @cb="goback" v-else></HeaderBar>

    <div class="c-body flex" v-show="!gameWindow">
      <div class="user-list-box">
        <div class="user-list">
          <p v-for="(item, index) in usersData" :key="index">{{item}}</p>
        </div>
      </div>
      <div class="chat-box">
        <div class="games">
            <a class="tank" @click="toGame"></a>
        </div>
        <div class="chat-data">
          <div class="chat-ul" ref="area">
            <ul>
              <li v-for="(item, index) in chatData" :key="index">
                <div class="flex flex-middle">
                  <span class="username">@{{ item.user }}</span>
                  <i class="icon-time"></i>
                  <span class="time">{{ item.timestamp| formatDate }}</span>
                </div>
                <p>{{ item.data }}</p>
              </li>
            </ul>
          </div>
        </div>

        <div class="send-box">
          <textarea v-model="msg" @keyup.enter.native="sendMessage" placeholder="这里是输入框..."></textarea>

          <div class="flex flex-end">
            <button type="button" class="ui-btn ui-btn--primary" @click="sendMessage">
              <span class="ui-btn__text">发送</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="c-body flex" v-show="gameWindow">
      <div id="canvas-box" ref='canvas'></div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import HeaderBar from "@/page/header";
import Storage from "@/utils/Storage";
import TankGameMain from "@/game/tank/main";

import WS from "@/utils/ws";

export default {
  name: "chat",
  components: {
    HeaderBar
  },
  data() {
    return {
      name: "",
      count: 20,
      msg: "",
      chatData: [],
      usersData: [],
      gameWindow:false,
      gameStart:false,
    };
  },
  created() {
    Vue.prototype.$WS = new WS();
  },
  mounted() {
    if (!Storage.get("name")) {
      this.$router.push("/");
    } else {
      this.initSocket();
    }
  },
  filters: {
    formatDate(val) {
      const date = new Date(val);
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();
      const hh = date.getHours();
      const mm = date.getMinutes();
      const ss = date.getSeconds();
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }
  },
  methods: {
    //初始化
    initSocket() {
      let that = this;
      this.$WS.init("ws://192.168.5.222:8090/ws?token=" + Storage.get("token"), {
        Open: function() {},
        Receive: function(data) {
          that.receiveMsg(data);
        },
        Error: function() {
          console.log("出现error");
        },
        Close: function() {
          console.log("出现close");
        }
      });
    },
    //接收消息
    receiveMsg(data) {
      let that = this;
      
      if (data.type == "msg") {
        that.chatData.push(data);
        setTimeout(() => {
          that.scrollTop();
        }, 50);
      }
      
      if (data.type == "userJoin") {
        that.usersData = data.data;
      }

      if (data.type == "userOut") {
        that.usersData = data.data;
      }
    },
    //发送消息
    sendMessage() {
      if (!this.msg) {
        console.log("不能发送空消息");
        return;
      }
      this.$WS.send({
        type: "msg",
        data: this.msg
      });
      this.msg = "";
    },
    scrollTop() {
      // 滚动到最底部
      const div = this.$refs.area;
      if (div != undefined) {
        div.scrollTop = div.scrollHeight-160;
      }
    },
    toGame(){
      this.gameWindow = true;
      // console.log("mounted",this.$refs.canvas);
      if(!this.gameStart){
        TankGameMain.init(this.$refs.canvas);
      }
      this.gameStart=true;
    },
    goback(){
      this.gameWindow = false;
    }
  }
};
</script>

<style>
.wrapper {
  height: 100%;
}
.c-body {
  height: 745px;
}
.user-list-box {
  width: 150px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}
.user-list-box p {
  padding: 5px 10px;
  margin-bottom: 1px;
  background-color: rgba(0, 0, 0, 0.04);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.chat-box {
  width: 640px;
}
.chat-data {
  height: 550px;
  overflow: hidden;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  width: 640px;
}
.chat-ul {
  overflow-y: scroll;
  height: 540px;
  width: 652px;
  padding: 10px;
}
.chat-ul li {
  margin-bottom: 10px;
}
.chat-ul .username {
  font-size: 16px;
}
.chat-ul .time {
  font-size: 12px;
}
.chat-ul .icon-time {
  background-image: url(../assets/chat/time.png);
  width: 20px;
  height: 20px;
  background-size: 100%;
  display: inline-block;
  margin: 0 5px 0 4px;
}
.send-box {
  height: 135px;
}
.send-box textarea {
  height: 100px;
  font-size: 14px;
  display: block;
  width: 100%;
  padding: 6px 8px;
  color: #3F536E;
  line-height: 1.5;
  border: none;
  background-color: #FFF;
  -webkit-transition: border .3s;
  transition: border .3s;
  outline: 0;
  resize: vertical;
  resize:none;
}
.send-box .flex-end {
  padding-right: 10px;
}
.games{
    height: 50px;
    border-bottom: 1px solid rgba(0,0,0,.1);
    background-color: rgba(192,234,255,.03);
}
.games a{
  border: 1px solid #1f87dd;
  background-color: rgba(192,234,255,.5);
  border-radius: 5px;
  margin: 6px;
}
.games a.tank{
  background-image: url(../assets/games/tank.png);
  width: 35px;
  height: 35px;
  background-size: 100%;
  display: inline-block;
}

.user-list{
  height: 546px;
}
#canvas-box{
  width: 100%;
  height: 100%;
}

</style>
