<template>
    <div class="checkbox">
        <label class="checkbox-content">
            <img v-show="checked" src="static/icon/icon-check.png">
            <img v-show="!checked" src="static/icon/icon-circle.png">
            <input type="checkbox"  style="display: none"
                   :checked="checked"
                   :name="name"
                   @change="change">
            <span><slot></slot></span>
        </label>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        name:'checkbox',
        created: function () {

        },
        props: ['name', 'value'],
        data: function () {
            return {
                checked: this.value
            }
        },
        methods: {
            change: function (event) {
                this.checked = event.target.checked;
                this.$emit('input', event.target.checked);
            }
        }
    }
</script>
<style scoped>
    .checkbox{
        display: inline-block;
    }
    .checkbox-content{
        display: block;
        height: 0.8rem;
        line-height: 0.8rem;
    }
    .checkbox-content > img,
    .checkbox-content > span{
        display: inline-block;
        vertical-align: middle;
    }
    .checkbox-content > img{
        width: 0.533333333rem;
        height: 0.533333333rem;
    }
    .checkbox-content > span{
        font-size: 14px;
        color: #666;
    }
</style>
