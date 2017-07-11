// import './css/ionicons.min.css'
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
// import socket from './socket.js'
import './common/vue-picker/style.css'
import smoothPicker from './common/vue-picker/index.js'
// https://github.com/wangdahoo/vue-scroller?utm_source=tuicool&utm_medium=referral
import VueScroller from 'vue-scroller'
Vue.component('checkbox', checkbox);
Vue.use(VueScroller);
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
  timeout: 30000,
  success: (data) => {
    if (data && data.code == '10010007') {
      Vue.toast.info('登录失效，请重新登录！');
      router.push('/app/login');
    }
  }
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
