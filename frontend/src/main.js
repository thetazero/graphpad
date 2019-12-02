import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false
// Vue.prototype.api = 'http://192.168.86.94:3000/api/'
const icons = {
  Person: "face",
  Date: "calendar_today"
}
Vue.prototype.$pick_icon = function (label) {
  if (label.length && label[0] in icons)
    return icons[label[0]];
  return "folder";
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
