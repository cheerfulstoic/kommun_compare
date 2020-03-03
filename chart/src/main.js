import Vue from 'vue'
import './plugins/fontawesome'
import App from './App.vue'

import sassStyles from 'bulma/bulma.sass'

sassStyles // Reference so that it doesn't complain

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
