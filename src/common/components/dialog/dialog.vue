<template>
    <transition :name="transitionName">
        <div class="confirm-position">
            <div class="confirm">
                <h3 class="confirm-title">{{title}}</h3>
                <div class="confirm-content">
                    <p v-html="content"></p>
                </div>
                <div class="confirm-buttons">
                    <button class="btn mr10" @click="cancel()">{{cancelText}}</button>
                    <button class="btn btn-39f" @click="ok()">{{okText}}</button>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    export default {
        created: function () {

        },
        props: ['transitionName','title','content','cancelText','okText'],
        data: function () {
            return {

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
