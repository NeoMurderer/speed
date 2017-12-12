import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import Draw from './modules/draw'
import store from './store'
Vue.use(new Draw())
Vue.use(Vuex)
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
