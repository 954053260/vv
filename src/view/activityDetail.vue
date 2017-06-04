<template>
  <div id="activityDetail" class="container bc-page">
    <header class="aa-header">
      <img src="../assets/test3.jpg" class="dp-b w">
    </header>
    <ul class="list">
      <li class="aa-item item mt10">
        <label class="row lh30">
          <span class="dp-ib mr10 w70 tr">活动标题</span>
          <p class="col c-666">环绕大学城骑行</p>
        </label>
      </li>
      <li class="aa-item item">
        <label class="row lh30">
          <span class="dp-ib mr10 w70 tr">举办者</span>
          <p class="col c-666">小名</p>
        </label>
      </li>
      <li class="aa-item item">
        <label class="row lh30">
          <span class="dp-ib mr10 w70 tr">开始时间</span>
          <p class="col c-666">
            {{new Date() | date('yyyy-MM-dd HH:mm')}}
          </p>
        </label>
      </li>
      <li class="aa-item item">
        <label class="row lh30">
          <span class="dp-ib mr10 w70 tr">结束时间</span>
          <p class="col c-666">
            {{new Date() | date('yyyy-MM-dd HH:mm')}}
          </p>
        </label>
      </li>
      <li class="aa-item item">
        <label class="row lh30">
          <span class="dp-ib mr10 w70 tr">活动地点</span>
          <p class="col c-666">中心湖</p>
        </label>
      </li>
      <li class="aa-item item">
        <label class="row lh30">
          <span class="dp-ib mr10 w70 tr">已报名人数</span>
          <p class="col c-666">30</p>
        </label>
      </li>
      <li class="aa-item item">
        <label class="row lh30">
          <span class="dp-ib mr10 w70 tr">活动费用</span>
          <p class="col c-666">免费</p>
        </label>
      </li>
    </ul>
    <div class="home-info-window-buttons row">
      <a class="col br1-ddd">收藏</a>
      <a class="col" @click="doActivity()">参与</a>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">

  export default {
    name: 'activityDetail',
    created: function () {

    },
    mounted: function () {
    },
    data: function () {
      return {
        doActivity: function () {
          this.$router.back();
        }
      }
    },
    computed: {},
    methods: {

    }
  }
</script>

