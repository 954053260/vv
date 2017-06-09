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
import personActivity from './view/personActivity.vue'
import addActivity from './view/addActivity.vue'
import activityDetail from './view/activityDetail.vue'
import about from './view/about.vue'
Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'hash',
    routes: [
        { path: '/', redirect: '/app/home'},
        { path: '/app/', component: app,
            children: [
                { path: 'login', component: login, name: '登录'},
                { path: 'home', component: home, name: '主页'},
                { path: 'chat', component: chat, name: '聊天'},
                { path: 'personInfo', component: personInfo, name: '个人中心'},
                { path: 'personActivity', component: personActivity, name: '活动'},
                { path: 'addActivity', component: addActivity, name: '发布活动'},
                { path: 'activityDetail', component: activityDetail, name: '活动详情'},
                { path: 'about', component: about, name: '关于'}
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {

    if (to.path != '/app/personActivity') {
        document.title = to.name;
    } else {
        switch (to.query.type) {
            case '1':
                document.title = '参与的' + to.name;
                break;
            case '2':
                document.title = '发布的' + to.name;
                break;
            case '3':
                document.title = '收藏的' + to.name;
                break;
        }
    }

    next();
});

export default router;

