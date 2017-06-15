<template>
  <div id="activityDetail" class="container bc-page">
    <div class="ad-content">
      <header v-if="markers[markerIndex].info.images" class="aa-header bb1-ddd">
        <swiper :options="swiperOption">
          <swiper-slide v-for="slide in markers[markerIndex].info.images">
            <div class="aa-slide row row-center"><img :src="host + slide"/></div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
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
            <p class="col c-666">{{markers[markerIndex].info.linkMan}}</p>
          </label>
        </li>
        <li class="aa-item item">
          <label class="row lh30">
            <span class="dp-ib mr10 w70 tr">开始时间</span>
            <p class="col c-666">
              {{markers[markerIndex].info.beginTime | date('yyyy-MM-dd HH:mm')}}
            </p>
          </label>
        </li>
        <li class="aa-item item">
          <label class="row lh30">
            <span class="dp-ib mr10 w70 tr">结束时间</span>
            <p class="col c-666">
              {{markers[markerIndex].info.endTime | date('yyyy-MM-dd HH:mm')}}
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
            <p class="col c-666">{{markers[markerIndex].info.limitCount}}</p>
          </label>
        </li>
        <li class="aa-item item">
          <label class="row lh30">
            <span class="dp-ib mr10 w70 tr">活动费用</span>
            <p class="col c-666">{{markers[markerIndex].info.fee}}</p>
          </label>
        </li>
        <li class="aa-item item">
          <label class="row lh30">
            <span class="dp-ib mr10 w70 tr">活动详情</span>
            <p class="col c-666">{{markers[markerIndex].info.content}}</p>
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
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    name: 'activityDetail',
    created: function () {

    },
    mounted: function () {

    },
    components: {swiper, swiperSlide},
    data: function () {
      return {
        swiperOption: {
          autoplay: 3000,
          setWrapperSize :true,
          pagination : '.swiper-pagination',
          paginationClickable :true,
          mousewheelControl : true,
          observeParents:true,
        }
      }
    },
    computed: {
      host: function () {
        return this.$store.state.host;
      },
      markers: function () {
        return this.$store.state.map.markers;
      },
      markerIndex: function () {
        return this.$store.state.map.markerIndex;
      }
    },
    methods: {
      doActivity: function () {
        this.$loading.show('参与...');
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
  }
</script>

