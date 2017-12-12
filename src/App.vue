<template>
  <div id="app">
    <!-- <line-chart :chart-data="datacollection"></line-chart> -->
    <h1>{{label}}</h1>
    <button v-on:click="index--">-</button>
    <button v-on:click="index++">+</button>
    <div id="chart_div" style="width:100%; height:calc(100vh - 200px)"></div>
    <svg id="lineChart" style="width:100%; height:calc(100vh - 200px)"></svg>
  </div>
</template>
<script>
import LineChart from "./components/Chart";
import d3Chart from "./widgets/lineChart";
let gChart = null
let vueData = null
      var options = {
        hAxis: {
          title: "Time"
        },
        vAxis: {
          title: "Popularity"
        },
          explorer: { 
            axis: 'horizontal',
            keepInBounds: true,
            maxZoomIn: 4.0
          },
      };

    const drawBasic = function(){
      const gData = new google.visualization.DataTable();
      gData.addColumn("date", "X");
      gData.addColumn("number", "Dogs");
      gData.addRows(vueData)

      gChart = new google.visualization.LineChart(
        document.getElementById("chart_div")
      );
      gChart.draw(gData, options)
      console.log('End draw chart')
    }
export default {
  name: "app",
  data() {
    return {
      index: 9
    };
  },
  computed: {
    datacollection() {
      return this.$store.getters.statistic(this.index);
    },
    label() {
      return this.$store.getters.statLabel(this.index);
    }
  },
  watch: {
    datacollection(newCollection) {
      vueData = newCollection
      if(gChart) {
        const gData = new google.visualization.DataTable();
        gData.addColumn("date", "X");
        gData.addColumn("number", "Dogs");
        gData.addRows(newCollection)
        gChart.draw(gData)
      } else {
        google.charts.load("current", { packages: ["corechart", "line"] })
        google.charts.setOnLoadCallback(drawBasic)
        console.warn('No gData or gChart')
      }
    }
  },
  mounted() {
    this.$store.dispatch("loadStat");
    // this.$chart = new d3Chart({
    //   data: this.datacollection
    // })
  }
};
</script>
<style>
html,
body {
  height: 100%;
}
.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 2px;
}
</style>
