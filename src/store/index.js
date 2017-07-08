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
        host: 'http://39.108.88.153:8080',
        isRefresh: false // home页刷新按钮状态
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





