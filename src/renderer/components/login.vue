<template>
  <div class="wrapper">
    <HeaderBar></HeaderBar>
    <div class="login-from">
      <div class="title text-center">
        <h1>聊聊</h1>
      </div>
      <div class="from">
        <div class="from-box">
          <input v-model="name" class="ui-input" placeholder="请输入用户名"/>
        </div>
        <div class="from-box text-center">
          <template v-if="loading">
            <button type="button" class="ui-btn">
              <span class="ui-btn__text">Loading...</span>
            </button>
          </template>
          <template v-else>
            <button type="button" class="ui-btn ui-btn--primary" @click="login">
              <span class="ui-btn__text">登录</span>
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Config from "@/config";
import HeaderBar from "@/components/header";
import Storage from "@/utils/Storage";
import WS from "@/utils/ws";

export default {
  name: "login",
  components: {
    HeaderBar
  },
  data() {
    return {
      name: "",
      loading: false
    };
  },
  created: function() {
    Vue.prototype.$WS = new WS();
    
    if (Storage.get("name")) {
      this.$router.push("/chat");
    }
  },
  methods: {
    login() {
      let that = this;

      if (this.name.length <= 0) {
        this.$Message.warning("用户名不能为空");
        return false;
      }

      this.loading = true;
      this.$http
        .post(Config.DOMAIN + "/login", {
          username: this.name,
          password: this.name
        })
        .then(function(response) {
          let data = response.data;
          // that.$Message.success("登录成功");
          Storage.set("name", that.name);
          Storage.set("token", data.token);
          Storage.set("uid", data.uid);
          that.$router.push("/chat");
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style scope>
.login-from {
  padding: 10px;
}
.title {
  margin: 50px 0;
}
.from-box {
  margin-bottom: 20px;
}
</style>
