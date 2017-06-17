<template>
  <div id="activityDetail" class="container bc-page">
    <div class="ad-content">
      <header v-if="markers[markerIndex].info.images" class="aa-header bb1-ddd">
        <swiper :options="swiperOption">
          <swiper-slide v-for="slide in markers[markerIndex].info.images">
            <div class="aa-slide row row-center"><img :src="host + slide"/></div>
          </swiper-slide>
        </swiper>
      </header>
      <div class="ad-title bc-fff">
        <div class="ad-title-tags">
          <span>{{markers[markerIndex].info.activityType.desc}}</span>
        </div>
        <div class="row">
          <div class="col ad-title-left">
            {{markers[markerIndex].info.title}}
          </div>
          <a class="ad-title-right">
            <i class="icon ion-ios-heart-outline"></i>
            <p>我想去</p>
          </a>
        </div>
      </div>
      <ul class="ad-list">
        <li class="ad-item">
          <i class="icon ion-ios-clock-outline"></i>
          <span>活动时间</span>
          <span>{{markers[markerIndex].info.beginTime | date('MM月dd日 HH:mm')}} - {{markers[markerIndex].info.endTime | date('MM月dd日 HH:mm')}}</span>
        </li>
        <!--<li class="ad-item">-->
          <!--<i class="icon ion-ios-location-outline"></i>-->
          <!--<span>活动地点</span>-->
          <!--<span>{{markers[markerIndex].info.address}}</span>-->
        <!--</li>-->
        <li class="ad-item">
          <i class="icon ion-ios-flag-outline"></i>
          <span>主办方</span>
          <span>{{markers[markerIndex].info.linkMan}}</span>
        </li>
        <li class="ad-item">
          <i class="icon ion-ios-pricetag-outline"></i>
          <span>活动费用</span>
          <span>{{markers[markerIndex].info.fee}}元</span>
        </li>
        <li class="ad-item">
          <i class="icon ion-ios-personadd-outline"></i>
          <span>已报名人数</span>
          <span>{{markers[markerIndex].info.limitCount}}人</span>
        </li>
        <li class="mt10 ad-item">
          <i class="icon ion-ios-location-outline"></i>
          <span>活动地点</span>
          <p>{{markers[markerIndex].info.address}}</p>
        </li>
        <li class="ad-item">
          <i class="icon ion-ios-paper-outline"></i>
          <span>活动介绍</span>
          <p>{{markers[markerIndex].info.content}}</p>
        </li>
      </ul>
    </div>
    <a class="ad-confirm-btn" @click="doActivity()">我要参加</a>
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

