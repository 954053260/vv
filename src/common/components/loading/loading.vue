<template>
    <transition :name="transitionName">
        <div>
            <div class="mask z-1000"></div>
            <div class="loading">
                <img src="../../../assets/hourglass.gif">
                <span>{{text}}</span>
            </div>
        </div>
    </transition>
</template>
<script type="text/ecmascript-6">
    export default {
        name:'loading',
        created: function () {

        },
        props: ['transitionName','text'],
        data: function () {
            return {

            }
        },
        methods: {

        }
    }
</script>
<style scoped>
    .loading{
        position: fixed;
        left: 50%;
        top: 40%;
        margin-left: -76px;
        margin-top: -21px;
        padding: 5px 25px;
        z-index: 10000;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
    }
    .loading img{
        width: 30px;
        height: 30px;
    }
    .loading span{
        font-size: 14px;
        color: #666;
    }
    .loading img, .loading span{
        display: inline-block;
        vertical-align: middle;
    }
</style>
