<template>
  <div id="addActivity" class="container bc-page">
    <header class="header">
      <img src="../assets/test3.jpg" class="dp-b w">
    </header>
    <ul class="list">
      <li class="item mt10">
        <label class="row lh30">
          <span class="dp-ib w70 tr">活动标题：</span>
          <input class="col c-666" type="text" placeholder="请输入">
        </label>
      </li>
      <li class="item mt10">
        <label class="row lh30">
          <span class="dp-ib w70 tr">开始时间：</span>
          <p class="col c-666" :class="{'f12 c-bbb': startDate == '请选择'}" @click="selectDate($event, 'start')">
            {{startDate | date('yyyy-MM-dd HH:mm')}}
          </p>
          <date-picker ref="start" v-model="startDate"></date-picker>
        </label>
      </li>
      <li class="item">
        <label class="row lh30">
          <span class="dp-ib w70 tr">结束时间：</span>
          <p class="col c-666" :class="{'f12 c-bbb': endDate == '请选择'}" @click="selectDate($event, 'end')">
            {{endDate | date('yyyy-MM-dd HH:mm')}}
          </p>
          <date-picker ref="end" v-model="endDate"></date-picker>
        </label>
      </li>
      <li class="item mt10">
        <label class="row lh30">
          <span class="dp-ib w70 tr">活动地点：</span>
          <input class="col c-666" type="number" placeholder="请选择">
        </label>
      </li>
      <li class="item">
        <label class="row lh30">
          <span class="dp-ib w70 tr">活动人数：</span>
          <input class="col c-666" type="text" placeholder="请输入">
        </label>
      </li>
      <li class="item">
        <label class="row lh30">
          <span class="dp-ib w70 tr">活动费用：</span>
          <input class="col c-666" type="number" placeholder="请输入">
        </label>
      </li>
      <li class="item">
        <label class="row lh30">
          <span class="dp-ib w70 tr">活动类型：</span>
          <input class="col c-666" type="text" placeholder="请选择">
        </label>
      </li>
      <li class="item mt10">
        <label class="row lh30">
          <textarea class="col c-666" placeholder="填写活动说明（可以插入图片）"></textarea>
        </label>
      </li>
    </ul>
    <div class="p20">
      <button class="btn btn-full bc-main c-fff" @click="saveActivity">发布</button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import datePicker from '../common/datePicker.vue'

  export default {
    name: 'addActivity',
    created: function () {

    },
    components: {datePicker},
    data: function () {
      return {
        startDate: '请选择',
        endDate: '请选择'
      }
    },
    computed: {},
    methods: {
      selectDate: function (e, type) {
        e.preventDefault();

        if (type == 'start') {
          this.$refs.start.toggle(true);
        } else {
          this.$refs.end.toggle(true);
        }

      },
      saveActivity: function () {
        this.$router.back();
      }
    }
  }
</script>
<style scoped>
  .header img{
    max-height: 150px
  }
  .item{
    padding: 5px 10px;
  }
  .item input{
    line-height: 30px;
    border: none;
  }
  .item textarea{
    resize: none;
    min-height: 50px;
    padding: 7px 0;
    border: none;
  }
</style>
