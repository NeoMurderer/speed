<template>
  <div id="app">
    <div id="chart"></div>
    <div id="singleton"></div>
      <div v-for="n in 50" v-bind:id="'chart' + n" class="widget"></div>
  </div>
</template>
<script>
import Speedometer from "./widgets/speedometer";
import Widget from "./widgets/index";
import c3 from "c3";
import Papa from "papaparse";
export default {
  name: "app",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      widgets: ["widget", "widget2"]
    };
  },
  mounted() {
    const height = 100;
    let headers = [];
    let parsedData = [];
    Papa.parse("static/chart.csv", {
      download: true,
      // step: function(results) {
      //   if(!headers.length) {
      //     headers = results.data[0]
      //   } else {
      //     // parsedData.push(results.data[0])
      //   }
      // },
      complete: function(results) {
        console.log('Total parsed', results.data.length)
        const data = results.data.splice(0, 1000);
        headers = data.splice(0, 1);
        initCharts(headers[0], data);
      }
    });
    function initCharts(headers, data) {
      headers.map((sensor, index) => {
        const chartData = data.map(item => item[index]);
        var chart = c3.generate({
          bindto: "#chart" + index,
          data: {
            columns: [[sensor, ...chartData]]
          },
          size: {
            height,
          },
          axis: {
            y: { show: false },
            x: { show: false }
          },
          legend: {
            position: "inset",
            inset: {
              anchor: "top-left",
              x: 0,
              y: 0,
              step: undefined
            }
          }
        });
      });
    }
  },
  mounteds() {
    const Draw = this.$draw;
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
      for (var i = 1; i <= 50; i++) {
        const speedometer = new Widget(Draw, {
          el: "#widget" + i
        });
      }
    }, 2000);
  }
};
</script>

<style>
@import url("../node_modules/c3/c3.css");
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
  background-color: #00051c;
}
.c3 {
  background: #1c2345;
}
.c3-chart {
  fill: none;
}
.c3-chart-bar {
  fill: #3fbeff;
}
.c3 text {
  fill: #fff;
}
.c3-legend-background {
  fill: #0c1027;
  opacity: 0.95;
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
  width: 100%;
  margin-bottom: 2px;
}
.line {
  stroke-width: 2;
  fill: "none";
}
p {
  color: #fff;
}
</style>
