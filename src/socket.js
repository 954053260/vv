/**
 * Created by tz on 2017/4/6.
 */
import io from './lib/socket.io.js'
export default {
    install: function (Vue, option) {
        Vue.socket = Vue.prototype.$socket = io('http://localhost:3000');
    }
}