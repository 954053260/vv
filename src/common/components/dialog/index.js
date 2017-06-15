/**
 * Created by tz on 2017/4/5.
 */
import dialogComponent from './dialog.vue'
export default {
    install: function (Vue, option) {
        let dialog, div = document.createElement('div');
        div.innerHTML = `<div class="dialog-content">
        <div v-if="dialogs.length" class="mask z-1000" @click="cancel()"></div>
        <dialog-component v-for="(dialog, index) in dialogs"
                :title="dialog.title"
                :content="dialog.content"
                :cancel-text="dialog.cancelText"
                :ok-text="dialog.okText"
                @on-ok="ok(index)"
                @on-cancel="cancel(index)"
                transition-name="dialog"></dialog-component>
        </div>`;
        document.body.appendChild(div);
        dialog = Vue.dialog = Vue.prototype.$dialog = new Vue({
            el: div,
            data: {dialogs: []},
            components: { dialogComponent },
            methods: {
                ok: function (index) {
                    this.remove(index, true);
                },
                cancel: function (index) {
                    this.remove(index);
                },
                remove: function (index, bool) {
                    var dialog = index == undefined ? this.dialogs.pop() :  this.dialogs.splice(index,1)[0];
                    bool ? dialog.onOk() : dialog.onCancel();
                }
            }
        });

        dialog.confirm = function (dialog) {
            dialog = {
                title: dialog.title || '提示',
                content: dialog.content || '',
                cancelText: dialog.cancelText || '取消',
                okText: dialog.okText || '确定',
                onCancel: dialog.onCancel || function () {},
                onOk: dialog.onOk || function () {}
            };

            this.dialogs.push(dialog);
        };
    }
}