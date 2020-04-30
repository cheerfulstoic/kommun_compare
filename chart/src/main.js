import Vue from 'vue'
import './plugins/fontawesome'
import './plugins/chart-background'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
