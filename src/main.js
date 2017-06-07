import './assets/hourglass.gif'
import './css/ionicons.min.css'
import './css/style.css'
import './directive.js'
import './filter.js'
import './common/components'
import Vue from 'vue'
import map from './common/map'
import checkbox from './common/checkbox.vue'
import router from './router.js'
import store from './store'
import app from './view/app.vue'
import ajax from './ajax.js'
import 'vue-smooth-picker/dist/css/style.css'
import smoothPicker from 'vue-smooth-picker'

Vue.component('checkbox', checkbox);

Vue.use(smoothPicker);
//import socket from './socket.js'

Vue.use(map, {
  id: 'map-container',
  resizeEnable: true,
  zoom: 13
});

//Vue.use(socket);

Vue.use(ajax, {
  root: 'http://39.108.88.153:8080/',
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
