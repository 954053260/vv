<template>
  <div id="activityDetail" class="container bc-page">
    <div class="ad-content">
      <header class="aa-header">
        <img src="../assets/test3.jpg" class="dp-b w">
      </header>
      <ul class="list">
        <li class="aa-item item mt10">
          <label class="row lh30">
            <span class="dp-ib mr10 w70 tr">活动标题</span>
            <p class="col c-666">{{markers[markerIndex].info.title}}</p>
          </label>
        </li>
        <li class="aa-item item">
          <label class="row lh30">
            <span class="dp-ib mr10 w70 tr">举办者</span>
            <p class="col c-666">{{markers[markerIndex].info.user.name}}</p>
          </label>
        </li>
        <li class="aa-item item">
          <label class="row lh30">
            <span class="dp-ib mr10 w70 tr">开始时间</span>
            <p class="col c-666">
              {{markers[markerIndex].info.startDate | date('yyyy-MM-dd HH:mm')}}
            </p>
          </label>
        </li>
        <li class="aa-item item">
          <label class="row lh30">
            <span class="dp-ib mr10 w70 tr">结束时间</span>
            <p class="col c-666">
              {{markers[markerIndex].info.endDate | date('yyyy-MM-dd HH:mm')}}
            </p>
          </label>
        </li>
        <li class="aa-item item">
          <label class="row lh30">
            <span class="dp-ib mr10 w70 tr">活动地点</span>
            <p class="col c-666">{{markers[markerIndex].info.address}}</p>
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
    </div>
    <div class="app-info-window-buttons row">
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
          this.$loading.show('参与...');
          console.log('sss', this.markerIndex)
          console.log('aaa', this.markers)
          this.$http.post('user/activity/takePartIn', {data: {
            token: this.$store.state.user.info.token,
            activityNo: this.markers[this.markerIndex].activityNo
          }}).then((data) => {
            this.$loading.hide();
            if (data.code == 0) {
              this.$toast.info('参与成功');
              this.$router.back();
            } else {
              this.$toast.info('参与失败');
            }
          }, () => {
            this.$toast.info('参与失败');
            this.$loading.hide();
          });
        }
      }
    },
    computed: {
      markers: function () {
        return this.$store.state.map.markers;
      },
      markerIndex: function () {
        return this.$store.state.map.markerIndex;
      }
    },
    methods: {

    }
  }
</script>

