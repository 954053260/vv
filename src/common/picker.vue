<template>
    <div>
        <div v-if="show" class="mask z-1000" @click="toggle(false)"></div>
        <transition name="slide-bottom">
            <div v-if="show" class="picker">
                <div class="bc-main clear-float">
                    <button class="btn btn-clear c-fff fl" @click="toggle(false)">取消</button>
                    <button class="btn btn-clear c-fff fr" @click="confirm()">确定</button>
                </div>
                <smooth-picker ref="smoothPicker" :data="data" :change="change" />
            </div>
        </transition>
    </div>
</template>
<script type="text/ecmascript-6">

    export default {
        name:'picker',
        created: function () {
           var list = [];
            this.list.forEach((item, i) =>{
                list.push(item[this.bindValue]);
                if (i == this.value) {
                    this.data[0].currentIndex = i;
                }
            });
            this.data[0].list = list;
        },
        props: ['value', 'bindValue', 'list'],
        data: function () {
            return {
                show: false,
                data: [
                    {
                        flex: 1,
                        list: [],
                        textAlign: 'center'
                    }
                ],
                current: ''
            }
        },
        methods: {
            change: function (gIndex, iIndex) {
                this.data[0].currentIndex = this.current =  iIndex;
            },
            confirm: function () {
                this.toggle(false);
                this.$emit('input', this.current);
            },
            toggle: function (bool) {
                if (typeof bool === 'boolean') {
                    this.show = bool;
                } else {
                    this.show = !this.show;
                }
            }
        }
    }
</script>
<style scoped>
    .picker{
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 10000;
        width: 100%;
    }
</style>
