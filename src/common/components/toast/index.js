/**
 * Created by hyt on 2017/3/30.
 */
import notice from './toast.vue'
export default {
    install: function (Vue, option) {
        let toast, div = document.createElement('div');
        div.innerHTML = `<div class="toast-content"><notice :message="message.info" v-for="message in messages"  transition-name="toast"></notice></div>`;
        document.body.appendChild(div);

        toast = Vue.toast = Vue.prototype.$toast = new Vue({
            el: div,
            data: {messages: []},
            components: { notice }
        });

        toast.info = function (message,duration = 1.5) {
            var timer = setTimeout(() => {
                this.remove();
            }, duration*1000);
            this.messages.push({info:message, timer: timer});
        };

        toast.remove = function () {
            var message = this.messages.shift();
            clearTimeout(message && message.timer);
        };
    }
}

