import Vue from 'vue'
import App from './App.vue'
import Draw from './modules/draw'

Vue.use(new Draw())

new Vue({
  el: '#app',
  render: h => h(App)
})
