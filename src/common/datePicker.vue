<template>
    <div id="datePicker">
        <div v-if="show" class="mask z-1000" @click="toggle(false)"></div>
        <transition name="slide-bottom">
            <div v-if="show" class="date-picker">
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
        name:'datePicker',
        created: function () {
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth();
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var months = [];
            var hours = [];
            var minutes = [];
            var i = 0;
            this.data.forEach((item, index) => {
                switch (index) {
                    case 0:
                        item.currentIndex = 10;
                        item.list = this.createYear(year);
                        break;
                    case 1:
                        for (i = 0; i < 12; i++) {
                            months.push(i + 1 + '月');
                        }
                        item.currentIndex = month;
                        item.list = months;
                        break;
                    case 2:
                        item.currentIndex = day - 1;
                        item.list = this.createDay(year, month);
                        break;
                    case 3:
                        for (i = 0; i < 24; i++) {
                            hours.push(i + 1 + '时');
                        }
                        item.currentIndex = hour - 1;
                        item.list = hours;
                        break;
                    case 4:
                        for (i = 0; i <= 60; i++) {
                            minutes.push(i + '分');
                        }
                        item.currentIndex = minute - 1;
                        item.list = minutes;
                        break;

                }
            });
        },
        props: ['value'],
        data: function () {
            return {
                show: false,
                data: [
                    {
                        flex: 1,
                        list: [],
                        textAlign: 'center'
                    },
                    {
                        flex: 1,
                        list: [],
                        textAlign: 'center'
                    },
                    {
                        flex: 1,
                        list: [],
                        textAlign: 'center'
                    },
                    {
                        flex: 1,
                        list: [],
                        textAlign: 'center'
                    },
                    {
                        flex: 1,
                        list: [],
                        textAlign: 'center'
                    }
                ]
            }
        },
        methods: {
            createYear: function (year) {
                var years = [];
                year -= 10;

                for (var i = 0; i < 21;i ++) {
                    years.push(year + i + '年');
                }

                return years;
            },
            createDay: function (year, month) {
                var days = [];
                var l = new Date(year, month + 1, 0).getDate();
                for (var i = 0; i < l; i++) {
                    days.push(i + 1 + '日');
                }

                return days;
            },
            getDate: function () {
                var date = [];

                this.data.forEach((item) => {
                    date.push(item.list[item.currentIndex]);
                });

                return new Date(date[0].replace('年', ''), date[1].replace('月', '') - 1, date[2].replace('日', ''), date[3].replace('时', ''), date[4].replace('分', ''));
            },
            change: function (gIndex, iIndex) {
                this.data[gIndex].currentIndex = iIndex;
                var year;
                var month;
                var list;
                var currentIndex;

                if (gIndex == 0 || gIndex == 1) {
                    year = this.data[0].list[this.data[0].currentIndex].replace('年', '');
                    month = this.data[1].list[this.data[1].currentIndex].replace('月', '') - 1;
                    list = this.createDay(year, month, 0);
                    currentIndex = this.data[2].currentIndex;

                    if ((currentIndex + 1) > list.length) {
                        currentIndex = list.length - 1;
                    }

                    this.data[2] = {
                        flex: 1,
                        list: list,
                        currentIndex: currentIndex,
                        textAlign: 'center'
                    };
                    this.$refs.smoothPicker.setGroupData(2, this.data[2]);
                }
            },
            confirm: function () {
                this.toggle(false);
                this.$emit('input', this.getDate());
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
    .date-picker{
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 10000;
        width: 100%;
    }
</style>
