<template>
  <div id="app">
    <races />
  </div>
</template>

<script>
import Races from "./components/Races.vue";

export default {
  name: "App",
  components: {
    Races
  }
};
</script>

<style>
body {
  background-color: #ff7800;
  padding-top: 30px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
