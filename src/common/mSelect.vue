<template>
    <div id="mSelect" class="mSelect">
        <div class="content" @click="toggle">
            {{value}}
            <i class="icon ion-arrow-down-b"></i>
        </div>
        <transition name="fade">
            <ul v-if="show" class="list-content">
                <li v-for="item in list" @click="select(item)">{{item}}</li>
            </ul>
        </transition>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        name:'mSelect',
        created: function () {

        },
        props: ['value', 'list'],
        data: function () {
            return {
                show: false
            }
        },
        methods: {
            toggle: function () {
                this.show = !this.show;
            },
            select: function (item) {
                this.$emit('input', item);
                this.toggle();
            }
        }
    }
</script>
<style scoped>
    .mSelect{
        position: relative;
        border: 1px solid #ddd;
        background: #fff;
    }
    .content{
        padding: 10px 0;
        color: #999;
        font-size: 14px;
        text-align: center;
    }
    .content > .icon{
        color: #333;
    }
    .list-content{
        position: absolute;
        left: -1px;
        top: 36px;
        width: 100%;
        color: #333;
        font-size: 14px;
        background: #fff;
        border: 1px solid #ddd;
    }
    .list-content li{
        padding: 5px;
    }
</style>
