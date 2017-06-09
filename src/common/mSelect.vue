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
        padding-left: 5px;
        padding-right: 5px;
        position: relative;
        border: 1px solid #ddd;
        background: #fff;
    }
    .content{
        color: #999;
        font-size: 14px;
    }
    .content > .icon{
        color: #333;
    }
    .list-content{
        position: absolute;
        left: -1px;
        width: 100%;
        color: #333;
        font-size: 14px;
        background: #fff;
        border: 1px solid #ddd;
        max-height: 200px;
        overflow: auto;
    }
    .list-content li{
        padding: 5px;
    }
    .list-content::-webkit-scrollbar-track-piece {
        background-color: rgba(0, 0, 0, 0);
        border-left: 1px solid rgba(0, 0, 0, 0);
    }
    .list-content::-webkit-scrollbar {
        width: 5px;
        height: 13px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }
    .list-content::-webkit-scrollbar-thumb {
        background-color: #ccc;
        background-clip: padding-box;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        min-height: 28px;
    }
    .list-content::-webkit-scrollbar-thumb:hover {
        background-color: #ccc;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }
</style>
