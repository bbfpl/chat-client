<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'chat'
  }
</script>

<style>
@import "./assets/style/reset.css";
body{
  background-color: transparent;
  padding: 5px;
}
#app{
  background-color: #fff;
  border-radius: 5px;
  height: 100%;
  box-shadow: 0px 0px 12px -2px #999;
}
.cursor-pointer {
  cursor: pointer;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.position-fixed {
  position: fixed;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.pull-left {
  float: left;
}

.pull-right {
  float: right;
}

.size-full-height {
  min-height: 100vh;
}

.size-full-width {
  width: 100%;
}

.size-full {
  width: 100%;
  min-height: 100vh;
}

.hidden {
  display: none;
}

.flex {
  display: flex;
}

.flex-start {
  justify-content: flex-start;
}

.flex-center {
  justify-content: center;
}

.flex-end {
  justify-content: flex-end;
}

.flex-between {
  justify-content: space-between;
}

.flex-around {
  justify-content: space-around;
}

.flex-top {
  align-items: flex-start;
}

.flex-middle {
  align-items: center;
}

.flex-bottom {
  align-items: flex-end;
}

.direction-column {
  flex-direction: column;
}

.direction-column-reverse {
  flex-direction: column-reverse;
}

.direction-row {
  flex-direction: row;
}

.direction-row-reverse {
  flex-direction: row-reverse;
}

.center {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

</style>
