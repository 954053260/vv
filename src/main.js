import './assets/hourglass.gif'
import './css/ionicons.min.css'
import './css/style.css'
import './directive.js'
import './filter.js'
import './common/components'
import Vue from 'vue'
import map from './common/map'
import router from './router.js'
import store from './store'
import app from './view/app.vue'
import ajax from './ajax.js'
import 'vue-smooth-picker/dist/css/style.css'
import smoothPicker from 'vue-smooth-picker'

Vue.use(smoothPicker);
//import socket from './socket.js'

Vue.use(map, {
  id: 'map-container',
  resizeEnable: true,
  zoom: 10,
  center: [113.2759952545166, 23.117055306224895]
});

//Vue.use(socket);
//Vue.use(ajax, {
//  root: 'http://localhost:3000/',
//  timeout: 30000
//});
new Vue({
  el: '#main',
  router,
  store,
  created: function () {

  },
  mounted: function () {

  }
});
