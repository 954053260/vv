<template>
    <div class="checkbox">
        <label class="checkbox-content">
            <i class="icon" :class="{'ion-android-checkbox': checked, 'ion-android-checkbox-outline-blank': !checked}"></i>
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
        height: 20px;
        line-height: 20px;
    }
    .checkbox-content > i,
    .checkbox-content > span{
        display: inline-block;
        vertical-align: middle;
    }
    .checkbox-content > i{
        position: relative;
        top: 1px;
        color: #2bd3b2;
        font-size: 20px;
    }
    .checkbox-content > span{
        font-size: 14px;
        color: #666;
    }
</style>
