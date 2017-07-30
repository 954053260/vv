<template>
    <transition :name="transitionName">
        <div class="confirm-position" :style="{'margin-top': marginTop}">
            <div class="confirm">
                <h3 class="confirm-title">{{title}}</h3>
                <div class="confirm-content">
                    <p v-html="content"></p>
                </div>
                <div class="confirm-buttons">
                    <button class="btn mr10 bc-bbb c-fff" @click="cancel()">{{cancelText}}</button>
                    <button class="btn bc-main c-fff" @click="ok()">{{okText}}</button>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    export default {
        created: function () {

        },
        mounted: function () {
            this.marginTop = -this.$el.offsetHeight/2 + 'px';
        },
        props: ['transitionName','title','content','cancelText','okText'],
        data: function () {
            return {
                marginTop: '-86px'
            }
        },
        methods: {
            ok: function () {
                this.$emit('on-ok');
            },
            cancel: function () {
                this.$emit('on-cancel');
            }
        }
    }
</script>
<style scoped>
</style>
