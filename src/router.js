/**
 * Created by tz on 2016/12/9.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import app from './view/app.vue'
import login from './view/login.vue'
import home from './view/home.vue'
import chat from './view/chat.vue'
import personInfo from './view/personInfo.vue'
import personActivityJoin from './view/personActivityJoin.vue'
import personActivityAdd from './view/personActivityAdd.vue'
import personActivityCollection from './view/personActivityCollection.vue'
import addActivity from './view/addActivity.vue'
import cancelActivity from './view/cancelActivity.vue'
import activityDetail from './view/activityDetail.vue'
import evaluate from './view/evaluate.vue'
import authentication from './view/authentication.vue'
import apply from './view/apply.vue'
import applyGroup from './view/applyGroup.vue'
import hostInfo from './view/hostInfo.vue'
import userAgreement from './view/userAgreement.vue'
import about from './view/about.vue'
Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'hash',
    routes: [
        { path: '/', redirect: '/home'},
        { path: '/', component: app,
            children: [
                { path: 'login', component: login, name: '登录'},
                { path: 'home', component: home, name: 'VV活动'},
                { path: 'chat', component: chat, name: '聊天'},
                { path: 'personInfo', component: personInfo, name: '个人中心'},
                { path: 'personActivityJoin', component: personActivityJoin, name: '我的参与'},
                { path: 'personActivityAdd', component: personActivityAdd, name: '我的发布'},
                { path: 'personActivityCollection', component: personActivityCollection, name: '我的收藏'},
                { path: 'addActivity', component: addActivity, name: '发布活动'},
                { path: 'cancelActivity', component: cancelActivity, name: '取消活动'},
                { path: 'activityDetail', component: activityDetail, name: '活动详情'},
                { path: 'evaluate', component: evaluate, name: '评价'},
                { path: 'authentication', component: authentication, name: '实名认证'},
                { path: 'apply', component: apply, name: '群体用户申请'},
                { path: 'applyGroup', component: applyGroup, name: '用户申请'},
                { path: 'hostInfo', component: hostInfo, name: '主办方'},
                { path: 'userAgreement', component: userAgreement, name: '用户协议'},
                { path: 'about', component: about, name: '关于我们'}
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    Vue.wx.config();
    document.title = to.name;
    switch (to.path) {
        case '/addActivity':
        case '/activityDetail':
        case '/personActivityJoin':
        case '/personActivityAdd':
        case '/personActivityCollection':
        case '/personInfo':
        case '/chat':
        case '/evaluate':
        case '/authentication':
            if (!store.state.user.info.token) {
                router.push('/login');
            }
            break;
    }
    next();
});

export default router;

