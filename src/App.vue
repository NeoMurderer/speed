<template>
  <div id="app">
    <h1>Dash</h1>
    <div id="widget"></div>
  </div>
</template>

<script>
import Speedometer from "./widgets/speedometer";
import Widget from "./widgets/index";
export default {
  name: "app",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  mounted() {
    const speedometer = new Widget(this.$draw);
    var i = 150;
    const next = () => {
      if (i == 280) i = 150;
      return ++i;
    };
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const speed = 20;
    setInterval(() => {
      const rand = next();
      speedometer.redraw(rand, speed);
    }, 20);
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  background-color: #050a20;
}
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
