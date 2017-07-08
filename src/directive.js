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

Vue.directive('cellSwipe', {
    inserted (el, binding, vnode) {

        el.className += ' cell-swipe';

        el.addEventListener('touchstart', function (e) {
            //e.preventDefault();
            e = e.touches[0];
            var x = e.clientX;
            var optionsWidth = el.nextElementSibling && el.nextElementSibling.offsetWidth;
            var distance;
            var translateX = el.style.transform ? el.style.transform.match(/(\d+)px/)[1] : 0;
            var cellNodes = document.querySelectorAll('.cell-swipe');
            var i = 0;

            if (!translateX) {
                for (; i < cellNodes.length; i++) {
                    cellNodes[i].transform = null;
                }
            }

            document.addEventListener('touchmove', mouseMove);
            document.addEventListener('touchend', mouseUp);

            function mouseMove (e) {
                e = e.touches[0];
                distance = Math.abs(x - e.clientX);

                if (distance <= optionsWidth) {

                    if (translateX) {
                        el.style.transform = 'translate3d(-' + (translateX - distance) +'px, 0, 0)';
                    } else {
                        el.style.transform = 'translate3d(-' + distance +'px, 0, 0)';
                    }

                }
            }
            //停止事件
            function mouseUp () {

                if ((distance >= optionsWidth/2 && !translateX) || distance < optionsWidth/2 && translateX) {
                    el.style.transform = 'translate3d(-' + optionsWidth +'px, 0, 0)';
                } else {
                    el.style.transform = null;
                }

                //卸载事件
                document.removeEventListener('touchmove',mouseMove);
                document.removeEventListener('touchend',mouseUp);
            }
        });
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