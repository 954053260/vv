<template>
  <div id="addActivity" class="container bc-page">
    <header class="header">
      <img src="../assets/test3.jpg" class="dp-b w">
    </header>
    <ul class="list">
      <li class="item mt10">
        <label class="row lh30">
          <span class="dp-ib w70">活动标题</span>
          <input class="col c-666" type="text">
        </label>
      </li>
      <li class="item mt10">
        <label class="row lh30">
          <span class="dp-ib w70">开始时间</span>
          <p class="col c-666" @click="selectDate($event, 'start')">
            {{startDate | date('yyyy-MM-dd HH:mm')}}
          </p>
          <date-picker ref="start" v-model="startDate"></date-picker>
        </label>
      </li>
      <li class="item">
        <label class="row lh30">
          <span class="dp-ib w70">结束时间</span>
          <p class="col c-666"  @click="selectDate($event, 'end')">
            {{endDate | date('yyyy-MM-dd HH:mm')}}
          </p>
          <date-picker ref="end" v-model="endDate"></date-picker>
        </label>
      </li>
      <li class="item mt10 bt1-ddd">
        <label class="row lh30">
          <span class="dp-ib w70">活动地区</span>
          <input class="col c-666" type="number">
        </label>
      </li>
      <li class="item">
        <label class="row lh30">
          <span class="dp-ib w70">详细地址</span>
          <input class="col c-666" type="number">
        </label>
      </li>
      <li class="item mt10 bt1-ddd">
        <label class="row lh30">
          <span class="dp-ib w70">活动人数</span>
          <input class="col c-666" type="number">
        </label>
      </li>
      <li class="item">
        <label class="row lh30">
          <span class="dp-ib w70">活动费用</span>
          <input class="col c-666" type="number">
        </label>
      </li>
      <li class="item">
        <label class="row lh30">
          <span class="dp-ib w70">活动类型</span>
          <p class="col c-666"  @click="selectType($event)">
            {{type}}
          </p>
          <picker ref="type" :list="typeList" v-model="type" ></picker>
        </label>
      </li>
      <li class="item mt10 bt1-ddd">
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
  import picker from '../common/picker.vue'
  import mSelect from '../common/mSelect.vue'

  export default {
    name: 'addActivity',
    created: function () {

    },
    components: {datePicker, picker, mSelect},
    data: function () {
      return {
        typeList: ['全部', '运动', '文化', '学习', '娱乐', '工业', '旅行', '商业', '其他'],
        type: '全部',
        startDate: '',
        endDate: ''
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
      selectType: function (e) {
        e.preventDefault();
        this.$refs.type.toggle(true);
      },
      saveActivity: function () {
        this.$router.back();
      }
    }
  }
</script>
<style scoped>
  .header img{
    height: 150px
  }
  .item{
    padding: 5px 10px;
  }
  .item input{
    line-height: 30px;
    height: 30px;
    border: none;
  }
  .item textarea{
    resize: none;
    min-height: 50px;
    padding: 7px 0;
    border: none;
  }
</style>
