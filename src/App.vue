<template>
  <div id="app">
      <div v-for="n in 50" v-bind:id="'widget' + n" class="widget"></div>
  </div>
</template>

<script>
import Speedometer from "./widgets/speedometer";
import Widget from "./widgets/index";
export default {
  name: "app",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      widgets: ["widget", "widget2"]
    };
  },
  mounted() {
    const Draw = this.$draw
    let speed = 150;
    let side = +1;

    const max = 120;
    const min = 50;

    let i = min;
    const next = () => {
      if (i == max || i == min - 1) side *= -1;
      return (i += 1 * side);
    };
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this,
          args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }
    setTimeout(function() { 
      for(var i = 1; i <= 50; i++) {
        const speedometer = new Widget(Draw, {
          el: '#widget' + i
        });
      }
    }, 2000)
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
  display: flex;
  flex-flow: row wrap;
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
.widget {
  width: 20%
}
</style>
