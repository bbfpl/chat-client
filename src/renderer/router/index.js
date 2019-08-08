import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: require("@/page/login").default
    },
    {
      path: "/chat",
      name: "chat",
      component: require("@/page/chat").default
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
