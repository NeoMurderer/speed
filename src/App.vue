<template>
  <div id="app">
    <line-chart :chart-data="datacollection"></line-chart>
    <button v-on:click="index--">-</button>
    <button v-on:click="index++">+</button>
  </div>
</template>
<script>
import LineChart from './components/Chart'
export default {
  name: "app",
  data() {
    return {
      index: 8
    }
  },
  computed: {
    datacollection() {
      return this.$store.getters.statistic(this.index)
    }
  },
  mounted() {
    this.$store.dispatch('loadStat')    
  }
}
</script>
