import './assets/hourglass.gif'
//import './css/ionicons.min.css'
import './css/style.css'
import './directive.js'
import './filter.js'
import './common/components'
import Vue from 'vue'
import map from './common/map'
import file from './common/file'
import checkbox from './common/checkbox.vue'
import router from './router.js'
import store from './store'
import app from './view/app.vue'
import ajax from './ajax.js'
//import socket from './socket.js'
import './common/vue-picker/style.css'
import smoothPicker from './common/vue-picker/index.js'

Vue.component('checkbox', checkbox);

Vue.use(smoothPicker);
Vue.use(file);
//Vue.use(socket);
Vue.use(map, {
  id: 'map-container',
  resizeEnable: true,
  zoom: 14
});
Vue.use(ajax, {
  root: store.state.host,
  timeout: 30000
});

new Vue({
  el: '#main',
  router,
  store,
  created: function () {
  
  },
  mounted: function () {

  }
});
