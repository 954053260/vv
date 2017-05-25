<template>
    <transition :name="transitionName">
        <div class="toast-notice">
            <p class="toast-message">
                <i class="toast-icon icon ion-information-circled"></i>{{message}}
            </p>
        </div>
    </transition>
</template>
<script>
    export default {
        created: function () {

        },
        props: ['transitionName','message'],
        data: function () {
            return {

            }
        }
    }
</script>
<style scoped>
</style>
