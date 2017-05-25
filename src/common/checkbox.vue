<template>
    <div id="checkbox" class="checkbox">
        <label class="checkbox-content">
            <i class="icon" :class="{'ion-android-checkbox': checked, 'ion-android-checkbox-outline-blank': !checked}"></i>
            <input type="checkbox"  style="display: none"
                   :disabled="disabled"
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
        props: ['name','disabled'],
        data: function () {
            return {
                checked: this.value
            }
        },
        methods: {
            change: function (event) {

                if (this.disabled) {
                    return false;
                }

                this.checked = event.target.checked;
                this.$emit('input', this.checked);
            }
        }
    }
</script>
<style scoped>
    .checkbox{
        display: inline-block;
    }
    .checkbox-content > i,
    .checkbox-content > span{
        display: inline-block;
        vertical-align: middle;
    }
    .checkbox-content > i{
        color: #39f;
        font-size: 18px;
    }
    .checkbox-content > span{
        margin-top: -2px;
        font-size: 14px;
        color: #666;
    }
</style>
