<template>
  <div id="header" class="flex">
    <div class="flex flex-middle flex-start">
      <template v-if="type=='logout'">
        <div class="logout btn" @click="logout"></div>
      </template>
      <template v-if="type=='goback'">
        <div class="goback btn" @click="goback"></div>
      </template>

    </div>
    <div class="flex move"></div>
    <div class="flex flex-middle flex-end">
      <div class="min btn" @click="min"></div>
      <div class="close btn" @click="close"></div>
    </div>
  </div>
</template>

<script>
  import Storage from "@/utils/Storage";
  let ipc = require('electron').ipcRenderer;
  export default {
    name: 'headerBox',
    components: {},
    props: ['type'],
    data() {
        return {

        }
    },
    methods: {
      min(){
        ipc.send('window-min');
      },
      close(){
        ipc.send('window-close');
      },
      logout(){
        Storage.remove("name");
        Storage.remove("token");
        Storage.remove("uid");
        this.$WS.send({
          type: "logout"
        });
        this.$router.push("/");
        this.$WS.socket.close();
      },
      goback(){
        this.$emit('cb')
      }
    }
  }
</script>

<style scope>
  #header{
    position: relative;
    min-height: 44px;
    border-bottom: 1px solid rgba(0,0,0,.1);
    background-color: rgba(0,0,0,.05)
  }
  .move{
    -webkit-app-region: drag;
    position: relative;;
    z-index: 1;
    width: 100%;
    min-height: 44px;
  }
  .btn{
    width: 30px;
    height: 30px;
    background-size: 100%;
    display: block;
    margin-right: 5px;
    position: relative;
    z-index: 2;
    cursor: pointer;
  }
  .min{
    background-image: url(../assets/header/min.png);
  }
  .min:hover{
    background-image: url(../assets/header/min_hover.png);
    background-color: rgba(0, 0, 0, 0.2);
  }
  .close{
    background-image: url(../assets/header/close.png);
  }
  .close:hover{
    background-image: url(../assets/header/close_hover.png);
    background-color: red;
  }

  .logout{
    background-image: url(../assets/header/out.png);
    margin-left: 10px;
  }
  .goback{
    background-image: url(../assets/header/goback.png);
    margin-left: 10px;
    width: 60px;
    height: 25px;
  }
</style>
