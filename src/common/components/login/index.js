/**
 * Created by tz on 2017/4/8.
 */
import Login from './login.vue'
export default {
    install: function (Vue, option) {
        let loginNode = document.createElement('div'),
            clientHeight = document.body.clientHeight,
            loginVue,
            loginElement,
            height,
            login;
        login = Vue.login = Vue.prototype.$login = {
            show: function (callback) {
                if (loginVue) {
                    return;
                }

                loginNode.innerHTML = `<div class="mask z-1000" @click="remove()"></div><login @login="login"></login>`;
                document.body.appendChild(loginNode);
                loginVue = new Vue({
                    el: loginNode,
                    components: { login: Login },
                    created: function () {
                        this.isComplete = false;
                    },
                    mounted: function () {
                        loginElement = this.$el.querySelector('#login');
                        clientHeight = document.body.clientHeight;
                        height = loginElement.offsetHeight;
                        loginElement.style.top = -height + 'px';

                        setTimeout(() => {
                            loginElement.style.top = (clientHeight - height)/3 + 'px';
                            this.isComplete = true;
                        }, 0);

                    },
                    data: {
                        isComplete: false
                    },
                    methods: {
                        login: function (data) {
                            this.remove();
                            callback && callback(data);
                        },
                        remove: function () {

                            if (this.isComplete) {
                                this.isComplete = false;
                                loginElement.style.top = clientHeight + 'px';

                                setTimeout(() => {
                                    loginElement = loginVue = null;
                                    this.$el.parentNode.removeChild(this.$el);
                                },300);

                            }

                        }
                    }
                });
            }
        };
    }
}