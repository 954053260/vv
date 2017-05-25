/**
 * Created by tz on 2017/4/6.
 */
import Vue from 'vue'
Vue.directive('clickoutside', {
    bind (el, binding, vnode) {
        function documentHandler (e) {
            if (el.contains(e.target)) {
                return false;
            }
            if (binding.expression) {
                binding.value(e);
            }
        }
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    update () {

    },
    unbind (el, binding) {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    }
});

Vue.directive('imgload', {
    bind (el, binding, vnode) {
        var img = new Image(),
            defaultSrc = '/images/audio.png';
        img.src = el.getAttribute('src');
        el.setAttribute('src', defaultSrc);
        img.onload = function () {
            el.setAttribute('src', this.getAttribute('src'));
        };
        img.onerror = function () {
            Vue.toast('加载图片失败！');
        };
    }
});