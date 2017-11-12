<template>
  <div id="app">
    <h1>Dash</h1>
    <div id="speed"></div>
  </div>
</template>

<script>
import Speedometer from "./widgets/speedometer";
export default {
  name: "app",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  mounted() {
    const speedometer = new Speedometer(this.$draw, {
      el: "#speed",
      min: 0,
      max: 1000,
    });
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const speed = 400
    setInterval(() => {
      const rand = getRandomInt(0, 1000)
      speedometer.redraw(rand, speed)
    }, speed);
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
