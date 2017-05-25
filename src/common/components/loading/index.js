/**
 * Created by tz on 2017/4/8.
 */
import loadingComponent from './loading.vue'
export default {
    install: function (Vue, option) {
        let loading, div = document.createElement('div');
        div.innerHTML = `<div><loading-component :text="text" v-for="text in texts" transition-name="fade"></loading-component></div>`;
        document.body.appendChild(div);
        loading = Vue.loading = Vue.prototype.$loading = new Vue({
            el: div,
            data: {texts: []},
            components: { loadingComponent }
        });

        loading.show = function (text) {
            if (this.texts.length) {
                return;
            }

            this.texts.push(text || '加载中...');
            return true;
        };

        loading.hide = function () {
            this.texts.shift();
            return false;
        };
    }
}