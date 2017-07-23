<template>
  <div id="activityDetail" class="container bc-page">
    <div v-if="activity">
      <div class="ad-content" :class="{'active': activity.activityStatus.value == '106'}">
        <scroller :on-infinite="getComments" ref="scroller" :noDataText="activity.activityStatus.value == '106' ? '没有更多数据' : ''">
          <header v-if="activity.images" class="ad-header">
            <swiper :options="swiperOption">
              <swiper-slide v-for="slide in activity.images">
                <div class="ad-slide row row-center"><img :src="host + slide"/></div>
              </swiper-slide>
            </swiper>
          </header>
          <div class="ad-title">
            <div class="row pb15 bb1-eee">
              <div class="col ad-title-left">
                <span class="ad-title-borer"></span>
                <h2 class="font-hide">{{activity.title}}</h2>
                <div class="ad-title-tags c-ff9800 f16">
                  <span>#{{activity.activityType.desc}}#</span>
                  <span :class="{'c-999': activity.activityStatus.value != 103}">#{{activity.activityStatus.desc}}#</span>
                </div>
              </div>
              <div class="ad-title-right row row-center">
                <a v-if="activity.isCollected" @click="collectActivity">
                  <img src="static/icon/icon-star-fill.png">
                  <p class="c-main">已收藏</p>
                </a>
                <a v-else="!activity.isCollected" @click="collectActivity">
                  <img src="static/icon/icon-star.png">
                  <p class="c-main">收藏</p>
                </a>
              </div>
            </div>
          </div>
          <div class="ad-title bb1-eee">
            <div class="row row-center">
              <!--<a class="ad-title-left col lh30 f16">-->
                <!--<img class="fr w30 h30" src="static/icon/icon-right.png">-->
                <!--<p class="c-000 font-hide">{{activity.linkMan}}</p>-->
              <!--</a>-->
              <router-link class="ad-title-left col lh30 f16" :to="'/app/hostInfo?publisherUserNo='+ activity.publisherUserNo">
                <img class="fr w30 h30" src="static/icon/icon-right.png">
                <!--<span class="fr c-ff9800">4.8好评</span>-->
                <p class="c-000 font-hide">{{activity.linkMan}}</p>
              </router-link>
              <div class="ad-title-right">
                <a @click="toChat()">
                  <img src="static/icon/icon-chat.png">
                </a>
              </div>
            </div>
          </div>
          <div class="ad-item row lh30 mt10">
            <img src="static/icon/icon-address.png">
            <p class="col">{{activity.address}}</p>
          </div>
          <div class="ad-item row lh30">
            <img src="static/icon/icon-time.png">
            <p class="col">{{activity.beginTime | date('MM月dd日 HH:mm')}} - {{activity.endTime | date('MM月dd日 HH:mm')}}</p>
          </div>
          <div class="ad-item mt10">
            <div class="row lh30">
              <div class="row col">
                <img src="static/icon/icon-rmb.png">
                <p class="col c-main">{{activity.fee}}元/人</p>
              </div>
              <div class="row col">
                <img src="static/icon/icon-user.png">
                <p class="col c-main">{{activity.participantCount}}/{{activity.limitCount}}人参与</p>
              </div>
            </div>
          </div>
          <div class="ad-item">
            <div class="row">
              <img src="static/icon/icon-desc.png">
              <div class="col lh30">
                <p>活动介绍</p>
                <p class="lh25 c-666">{{activity.content}}</p>
              </div>
            </div>
          </div>
          <div v-if="activity.activityStatus.value == '106'">
            <div class="ad-item mt10">
              <img class="comment-title dp-ib vm" src="static/icon/icon-chats.png">
              <span class="dp-ib vm">用户评价</span>
              <!--<span class="dp-ib vm c-999">（123）</span>-->
            </div>
            <ul>
              <li v-for="item in comments.list" class="ad-comment-item">
                <img :src="host + item.publishAvatar">
                <span class="name">{{item.publishNickname}}</span>
                <span class="time">{{item.createTime | date('MM月dd日 HH:mm')}}</span>
                <p>{{item.content}}</p>
              </li>
            </ul>
          </div>
        </scroller>
      </div>
      <section v-if="activity.activityStatus.value != '100'">
        <a v-if="!activity.isPartaked && activity.activityStatus.value != '104' && activity.activityStatus.value != '105' && activity.activityStatus.value != '106'"
           :class="{'bc-999': activity.participantCount == activity.limitCount, 'bc-main': activity.participantCount < activity.limitCount}"
           class="ad-foot c-fff" @click="submitActivity()">
          {{activity.participantCount == activity.limitCount ? '报名人数已满' : '我要参加'}}
        </a>
        <a v-if="activity.isPartaked && activity.activityStatus.value != '105' && activity.activityStatus.value != '106' && activity.isPartaked"
           class="ad-foot bc-999 c-fff" @click="cancelActivity()">
          我要取消
        </a>
        <a v-if="activity.activityStatus.value == '104' && !activity.isPartaked" class="ad-foot bc-ccc">截止报名</a>
        <a v-if="activity.activityStatus.value == '105'" class="ad-foot bc-999 c-fff">已开始</a>
        <!--<a v-if="activity.activityStatus.value == '106'" class="ad-foot bc-999 c-fff">已结束</a>-->
      </section>
      <a v-if="activity.activityStatus.value == '100'" class="ad-foot bc-999 c-fff">待审核</a>
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
        activity: null,
        comments: {pageNumber: 1, list: [], isComplete: false}
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
            this.activity.participantCount -= 1;
            this.activity.isPartaked = false;
          } else {
            this.$toast.info('取消失败');
          }

        }, () => {
          this.$toast.info('取消失败');
          this.$loading.hide();
        });
      },
      getComments: function () {
        if (this.comments.isComplete) {
          this.$refs.scroller.finishInfinite(true);
          return;
        }

        this.$http.get('/activity/evaluate/list', {data: {
          activityNo:  this.$route.query.activityNo,
          pageNumber: this.comments.pageNumber,
          pageSize: 10
        }}).then((data) => {
          if (data.code == 0) {
            this.comments.list = this.comments.list.concat(data.datas.page.content);
            this.pageNumber += 1;

            if (data.datas.page.content.length < 10) {
              this.comments.isComplete = true;
              this.$refs.scroller.finishInfinite(true);
            } else {
              this.$refs.scroller.finishInfinite(false);
            }

          } else {
            this.$refs.scroller.finishInfinite(true);
            this.$toast.info(data.msg);
          }
        }, () => {
          this.$refs.scroller.finishInfinite(true);
          this.$toast.info('获取活动评价失败');
        });
      },
      submitActivity: function () {
        if (this.activity.participantCount == this.activity.limitCount) {
          this.$toast.info('活动报名人数已满!');
          return;
        }

        this.$loading.show('参与...');
        this.$http.post('/user/activity/takePartIn', {data: {
          token: this.$store.state.user.info.token,
          activityNo: this.$route.query.activityNo
        }}).then((data) => {
          this.$loading.hide();

          if (data.code == 0) {
            this.$toast.info('参与成功');
            this.activity.participantCount += 1;
            this.activity.isPartaked = true;
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

