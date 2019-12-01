import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.prototype.api = 'http://192.168.86.94:3000/api/'
Vue.prototype.$gapi = async function (query) {
  let res = await window.fetch(this.api + query)
  let data = await res.json()
  return data
}
const icons = {
  Person: "face"
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
