<template>
  <div>
    <nav-bar id="nav"></nav-bar>
    <router-view/>
  </div>
</template>

<script>
import NavBar from "@/components/nav-bar.vue"

export default {
  components: {
    "nav-bar": NavBar
  }
}
</script>

<style>
@import url('https://unpkg.com/papercss@1.8.2/dist/paper.min.css');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
/* @import '~vue-context/dist/css/vue-context.css'; */
@import "./assets/scrollbars.css";
@import "./assets/vue-context.css";

html {
  min-height: 100vh;
}

body {
  background: url("../public/geometry2.png") fixed;
  min-height: 100vh;
}

.container-custom {
  padding: 0 100px 0 100px;
}

[popover-bottom]:after, [popover-top]:after, [popover-left]:after, [popover-right]:after  {
  background: white;
  color: black;
}

.clearfix:after {
  content: "";
  clear: both;
  display: table;
}

.material-icons {
 position: relative;
 top: 5px;
}

.material-icons-large {
  font-size: 2rem;
}

.btn-corner {
  position: absolute; top: 2px; right: 2px;
}

.header-corner {
  position: relative;
  top: -35px;
  left: -20px;
  margin: 0px;
}

.action-bar {
  display: flex;
  align-items: stretch;
}

.action-bar-item {
  flex-grow: 1;
}

.btn-inline {
  padding: .5rem;
}

.btn-icon-inline {
  padding: 0.15rem .5rem .5rem .5rem;
}

</style>
