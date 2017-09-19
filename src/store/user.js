/**
 * Created by tz on 2017/1/11.
 */
import Vue from 'vue'

if (window.token) {
    localStorage.setItem('token', window.token);
}

if (window.vvOpenid) {
    localStorage.setItem('vvOpenid', window.vvOpenid);
}

var userInfo = JSON.parse(window.userInfo || '{}');

export default {
    state: {
        info: {
            token: localStorage.getItem('token') || '',
            openid: localStorage.getItem('vvOpenid'),
            isSubscribeVV: userInfo.isSubscribeVV || false,
            user: userInfo
        }
    },
    getters: {},
    mutations: {
        SET_USER_TOKEN: (state, token) => {
            state.info.token = token;
        },
        SET_USER: (state, user) => {
            state.info.user = user;
        }
    },
    actions: {
        login ({commit}, data) {
            return Vue.http.post('/login', {data: data})
                .then(data => {
                    if (data.code == 0) {
                        commit('SET_USER_TOKEN', data.datas.token);
                        return data;
                    } else {
                        return Promise.reject(data.msg);
                    }
                });
        },
        getUserInfo ({commit}, token) {

            return Vue.http.get('/user/center', {data: {token: token}})
                .then(data => {
                    if (data.code == 0) {
                        commit('SET_USER', data.datas.user);
                        return data;
                    } else {
                        return Promise.reject(data.msg);
                    }
                });
        }
    }
}