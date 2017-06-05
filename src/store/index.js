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

    },
    getters:{

    },
    mutations:{
        setRouterTransition: (state, name) => {
            state.routerTransition = name;
        }
    },
    actions:{

    },
    modules:{
        user, map
    }
});
export default store





