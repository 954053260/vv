<template>
    <div id="mSelect" class="m-select">
        <div class="m-select-content" @click="toggle">
            {{text}}
            <img src="static/icon/icon-bottom.png">
        </div>
        <transition name="fade">
            <div v-if="show" class="m-select-list-content">
                <ul class="m-select-list">
                    <li v-for="(item, index) in list" @click="select(index)">{{item[bindValue]}}</li>
                </ul>
            </div>
        </transition>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        name:'mSelect',
        created: function () {

        },
        props: ['value', 'list', 'bindValue'],
        data: function () {
            return {
                text: this.list[this.value][this.bindValue],
                show: false
            }
        },
        methods: {
            toggle: function () {
                this.show = !this.show;
            },
            select: function (index) {
                this.text = this.list[index][this.bindValue];
                this.$emit('input', index);
                this.toggle();
            }
        }
    }
</script>

