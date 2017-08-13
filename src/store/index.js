/**
 * Created by hyt on 2017/1/11.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import user from './user.js'
import map from './map.js'
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        host: 'http://www.vv-tl.com',
        loginPhone: '',
        loginCode: '',
        refreshText: '',// 刷新活动提示文字
        isUserMenu: false,
        isChat: false
    },
    getters:{

    },
    mutations:{

    },
    actions:{
        fileUpload ({commit}, file) {
            return Vue.http.post('/file/base64/upload',
                {data: {fileType: 'image', files: [file]}})
                .then(data => {
                    if (data.code == 0) {
                        return data;
                    } else {
                        return Promise.reject(data);
                    }
                });
        }
    },
    modules:{
        user, map
    }
});
export default store





