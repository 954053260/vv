<template>
  <div id="activityDetail" class="container bc-page">
    <div class="ad-content">
      <header v-if="marker.images" class="aa-header bb1-ddd">
        <swiper :options="swiperOption">
          <swiper-slide v-for="slide in marker.images">
            <div class="aa-slide row row-center"><img :src="host + slide"/></div>
          </swiper-slide>
        </swiper>
      </header>
      <div class="ad-title bc-fff">
        <div class="ad-title-tags">
          <span>{{marker.activityType.desc}}</span>
        </div>
        <div class="row">
          <div class="col ad-title-left">
            {{marker.title}}
          </div>
          <a class="ad-title-right" @click="collectActivity">
            <i class="icon ion-ios-heart-outline"></i>
            <p>收藏</p>
          </a>
        </div>
      </div>
      <ul class="ad-list">
        <li class="ad-item">
          <i class="icon ion-ios-clock-outline"></i>
          <span>活动时间</span>
          <span>{{marker.beginTime | date('MM月dd日 HH:mm')}} - {{marker.endTime | date('MM月dd日 HH:mm')}}</span>
        </li>
        <li class="ad-item">
          <i class="icon ion-ios-flag-outline"></i>
          <span>主办方</span>
          <span>{{marker.linkMan}}</span>
        </li>
        <li class="ad-item">
          <i class="icon ion-ios-pricetag-outline"></i>
          <span>活动费用</span>
          <span>{{marker.fee}}元</span>
        </li>
        <li class="ad-item">
          <i class="icon ion-ios-personadd-outline"></i>
          <span>已报名人数</span>
          <span>{{marker.limitCount}}人</span>
        </li>
        <li class="mt10 ad-item">
          <i class="icon ion-ios-location-outline"></i>
          <span>活动地点</span>
          <p>{{marker.address}}</p>
        </li>
        <li class="ad-item">
          <i class="icon ion-ios-paper-outline"></i>
          <span>活动介绍</span>
          <p>{{marker.content}}</p>
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
      marker: function () {
        return this.$store.state.map.marker;
      }
    },
    methods: {
      collectActivity: function () {
        this.$loading.show('收藏...');
        this.$http.post('/user/activity/collect', {data: {
          token: this.$store.state.user.info.token,
          activityNo: this.marker.activityNo
        }}).then((data) => {
          this.$loading.hide();
          if (data.code == 0) {
            this.$toast.info('收藏成功');
          } else {
            this.$toast.info('收藏失败');
          }
        }, () => {
          this.$toast.info('收藏失败');
          this.$loading.hide();
        });
      },
      doActivity: function () {
        this.$loading.show('参与...');
        this.$http.post('/user/activity/takePartIn', {data: {
          token: this.$store.state.user.info.token,
          activityNo: this.marker.activityNo
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

