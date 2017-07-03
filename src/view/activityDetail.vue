<template>
  <div id="activityDetail" class="container bc-page">
    <div v-if="activity" class="ad-content">
      <header v-if="activity.images" class="aa-header bb1-ddd">
        <swiper :options="swiperOption">
          <swiper-slide v-for="slide in activity.images">
            <div class="aa-slide row row-center"><img :src="host + slide"/></div>
          </swiper-slide>
        </swiper>
      </header>
      <div class="ad-title bc-fff">
        <div class="ad-title-tags">
          <span>{{activity.activityType.desc}}</span>
        </div>
        <div class="row">
          <div class="col ad-title-left">
            {{activity.title}}
          </div>
          <a class="ad-title-right" @click="collectActivity">
            <i class="icon ion-ios-heart-outline"></i>
            <p>{{activity.isCollected ? '取消收藏' : '收藏'}}</p>
          </a>
        </div>
      </div>
      <ul class="ad-list">
        <li class="ad-item">
          <i class="icon ion-ios-clock-outline"></i>
          <span>时间</span>
          <span>{{activity.beginTime | date('MM月dd日 HH:mm')}} - {{activity.endTime | date('MM月dd日 HH:mm')}}</span>
        </li>
        <li class="ad-item">
          <i class="icon ion-ios-location-outline"></i>
          <span>活动地点</span>
          <p>{{activity.address}}</p>
        </li>
        <li class="ad-item">
          <i class="icon ion-ios-flag-outline"></i>
          <span>主办方</span>
          <span>{{activity.linkMan}}</span>
        </li>
        <li class="ad-item">
          <i class="icon ion-ios-pricetag-outline"></i>
          <span>活动费用</span>
          <span>{{activity.fee}}元</span>
        </li>
        <li class="ad-item">
          <i class="icon ion-ios-personadd-outline"></i>
          <span>已报名人数</span>
          <span>{{activity.participantCount}}/{{activity.limitCount}}人</span>
        </li>
        <li class="ad-item">
          <i class="icon ion-ios-paper-outline"></i>
          <span>活动介绍</span>
          <p>{{activity.content}}</p>
        </li>
      </ul>
    </div>
    <div class="ad-confirm-btn row">
      <a class="w45 tc f20 bc-fff c-666 bt1-ddd" @click="toChat()"><i class="pr icon ion-chatbubble-working" style="top: -2px"></i></a>
      <a v-if="activity.activityStatus.value == '106'" class="col bc-ccc">活动已开始</a>
      <a v-if="activity.activityStatus.value == '107'" class="col bc-ccc">活动已结束</a>
      <a v-if="activity.activityStatus.value != '106' && activity.activityStatus.value != '107' && activity.isPartaked" class="col" @click="cancelActivity()">取消参加</a>
      <a v-if="activity.activityStatus.value != '105' && activity.activityStatus.value != '106' && activity.activityStatus.value != '107' && !activity.isPartaked" class="col" @click="submitActivity()">我要参加</a>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    name: 'activityDetail',
    created: function () {
      this.$loading.show('获取活动详情...');
      this.$http.get('/activity/detail', {data: {
        token: this.$store.state.user.info.token,
        activityNo:  this.$route.query.activityNo
      }}).then((data) => {
        this.$loading.hide();
        if (data.code == 0) {
          this.activity = data.datas.activity;
        } else {
          this.$toast.info('获取活动详情失败');
        }
      }, () => {
        this.$toast.info('获取活动详情失败');
        this.$loading.hide();
      });
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
        },
        activity: null
      }
    },
    computed: {
      host: function () {
        return this.$store.state.host;
      }
    },
    methods: {
      collectActivity: function () {
        var isCollected = this.activity.isCollected;
        var url = isCollected ? '/user/activity/collection/cancel' : '/user/activity/collect';
        this.$loading.show(isCollected ? '取消...' : '收藏...');
        this.$http.post(url, {data: {
          token: this.$store.state.user.info.token,
          activityNo: this.$route.query.activityNo
        }}).then((data) => {
          this.$loading.hide();
          if (data.code == 0) {
            this.$toast.info(isCollected ? '取消成功' : '收藏成功');
            this.activity.isCollected = !isCollected;
          } else {
            this.$toast.info(isCollected ? '取消失败' : '收藏失败');
          }
        }, () => {
          this.$toast.info(isCollected ? '取消失败' : '收藏失败');
          this.$loading.hide();
        });
      },
      cancelActivity: function () {
        this.$loading.show( '取消...');
        this.$http.post('/user/activity/partake/cancel', {data: {
          token: this.$store.state.user.info.token,
          activityNo: this.$route.query.activityNo
        }}).then((data) => {
          this.$loading.hide();
          if (data.code == 0) {
            this.$toast.info('取消成功');
            this.activity.isPartaked != this.activity.isPartaked;
            this.$router.back();
          } else {
            this.$toast.info('取消失败');
          }
        }, () => {
          this.$toast.info('取消失败');
          this.$loading.hide();
        });
      },
      submitActivity: function () {
        this.$loading.show('参与...');
        this.$http.post('/user/activity/takePartIn', {data: {
          token: this.$store.state.user.info.token,
          activityNo: this.$route.query.activityNo
        }}).then((data) => {
          this.$loading.hide();
          if (data.code == 0) {
            this.$toast.info('参与成功');
            this.activity.isPartaked != this.activity.isPartaked;
            this.$router.back();
          } else {
            this.$toast.info('参与失败');
          }
        }, () => {
          this.$toast.info('参与失败');
          this.$loading.hide();
        });
      },
      toChat: function () {
        this.$router.push('/app/chat?friendUserNo=' + this.activity.publisherUserNo + '&linkMan=' + this.activity.linkMan);
      }
    }
  }
</script>

