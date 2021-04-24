import moment from 'moment-timezone'
import Vue from 'vue'
import VueSimpleAlert from 'vue-simple-alert'
import router from './router'
import App from './index.vue'
import './components'

Vue.use(VueSimpleAlert)

moment.tz.setDefault('Asia/Jakarta')
Vue.prototype.$moment = moment

// Feather font icon - For form-wizard
require('@core/assets/fonts/feather/iconfont.css')

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

// set default http access api
const httpApi = {
  host: 'http://103.212.239.10:8000/api',
  user: sessionStorage.getItem('username'), // username
  pass: sessionStorage.getItem('password'), // password
  ApiKey: sessionStorage.getItem('set_api'), // project api key
  sensor: 'Sensor Tegangan',
}

Vue.prototype.$api = httpApi
export default httpApi

// set router
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
