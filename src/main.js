import './css/style.css'
import './directive.js'
import './filter.js'
import './common/components'
import Vue from 'vue'
import map from './common/map'
import wx from './common/wx'
import file from './common/file'
import checkbox from './common/checkbox.vue'
import router from './router.js'
import store from './store'
import app from './view/app.vue'
import ajax from './ajax.js'
import './common/vue-picker/style.css'
import smoothPicker from './common/vue-picker/index.js'
import VueScroller from 'vue-scroller'
Vue.component('checkbox', checkbox);
Vue.use(wx);
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
    //if (data && data.code == '10010007') {
    //  Vue.toast.info('登录失效，请重新登录！');
    //  localStorage.setItem('token', null);
    //  router.push('/login');
    //}
  }
});

if (!window.userInfo) {
  Vue.loading.show('自动登录中...');
  store.dispatch('getUserInfo', window.token || localStorage.getItem('token')).then(() => {
    Vue.loading.hide();
  }, () => {
    Vue.loading.hide();
    Vue.toast.info('获取用户信息失败，请重新登录');
    localStorage.setItem('token', null);
    router.push('/home');
  });
}

new Vue({
  el: '#main',
  router,
  store
});
