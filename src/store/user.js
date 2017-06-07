/**
 * Created by tz on 2017/1/11.
 */
import Vue from 'vue'
export default {
    state: {
        info: {
            token: '',
            user: {}
        }
    },
    getters: {},
    mutations: {
        SET_USER_TOKEN: (state, token) => {
            state.info.token = token;
        }
    },
    actions: {
        login ({commit}, data) {
            return Vue.http.post('login', {data: data})
                .then(data => {
                    if (data.code == 0) {
                        commit('SET_USER_TOKEN', data.datas.token);
                        return data;
                    } else {
                        return Promise.reject(data.msg);
                    }
                });
        }
    }
}