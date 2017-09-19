<template>
  <div id="activityDetail" class="container bc-page">
    <div v-if="activity">
      <div class="ad-content" :class="{'active': activity.activityStatus.value == '106' || userNo == activity.publisherUserNo}">
        <scroller :on-infinite="getComments" ref="scroller" :noDataText="activity.activityStatus.value == '106' ? '没有更多数据' : ''">
          <header v-if="activity.images" class="ad-header">
            <swiper :options="swiperOption">
              <swiper-slide v-for="slide in activity.images">
                <div class="ad-slide row row-center">
                  <img :src="host + slide" @click="previewImage(host + slide)"/>
                </div>
              </swiper-slide>
              <div v-if="activity.images.length > 1" class="swiper-pagination" slot="pagination"></div>
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
              <div v-if="userNo != activity.publisherUserNo" class="ad-title-right row row-center">
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
              <a v-if="userNo == activity.publisherUserNo" class="ad-title-left col lh30 f16">
                <span class="fr c-ff9800">{{activity.averageScore}}分好评</span>
                <p class="c-main font-hide" :class="{'c-000': !user.user.userType || user.user.userType.value != 2}">{{activity.publisherNickname}}</p>
              </a>
              <router-link v-if="userNo != activity.publisherUserNo" class="ad-title-left col lh30 f16" :to="'/hostInfo?publisherUserNo='+ activity.publisherUserNo">
                <img class="fr w30 h30" src="static/icon/icon-right.png">
                <span class="fr c-ff9800">{{activity.averageScore}}分好评</span>
                <p class="c-main font-hide" :class="{'c-000': activity.activityOrganizationType.value == 1}">{{activity.publisherNickname}}</p>
              </router-link>
              <div v-if="userNo != activity.publisherUserNo" class="ad-title-right">
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
                <p class="lh25 c-666" v-html="content"></p>
              </div>
            </div>
          </div>
          <div v-if="activity.activityStatus.value != '106' && activity.partakeUsers && activity.partakeUsers.length" class="bb1-eee">
            <div class="ad-item mt10 bt1-eee c-main">
              {{activity.partakeUsers.length}}人报名参与
            </div>
            <div v-if="index < 5 || isShowMoreUser" class="ad-item bt1-eee" v-for="(item, index) in activity.partakeUsers">
              <router-link :to="'/hostInfo?publisherUserNo='+ item.userNo">
                <img :src="item.avatar" class="brp50" style="width: 1.0666666666666667rem; height: 1.0666666666666667rem">
                <span class="ml10" :class="{'c-main': item.userType.value == 2, 'c-000': item.userType.value == 1}">{{item.nickname}}</span>
                <div v-if="item.gender && item.gender.value == 1" class="dp-ib ml10 bc-main" style="padding: 2px 12px 4px;border-radius: 11px;">
                  <img src="static/icon/icon-boy.png" style="width: 0.32rem; height: 0.32rem">
                </div>
                <div v-if="item.gender && item.gender.value == 2" class="dp-ib ml10 bc-E9B4FF" style="padding: 2px 12px 4px;border-radius: 11px;">
                  <img src="static/icon/icon-girl.png"  style="width: 0.32rem; height: 0.32rem">
                </div>
              </router-link>
            </div>
            <p v-if="activity.partakeUsers.length > 5 && !isShowMoreUser" class="p10 tc f16 c-666">
              <a @click="isShowMoreUser = true">查看更多</a>
            </p>
          </div>
          <div v-if="activity.activityStatus.value == '106'">
            <div class="ad-item mt10">
              <img class="comment-title dp-ib vm" src="static/icon/icon-chats.png">
              <span class="dp-ib vm">用户评价</span>
              <span class="dp-ib vm c-999">（{{comments.total}}）</span>
            </div>
            <ul>
              <li v-for="item in comments.list" class="ad-comment-item">
                <img :src="item.publishAvatar">
                <span class="name">{{item.publishNickname}}</span>
                <span class="time">{{item.createTime | date('MM月dd日 HH:mm')}}</span>
                <p>{{item.content}}</p>
              </li>
            </ul>
          </div>
        </scroller>
      </div>
      <div v-if="userNo != activity.publisherUserNo">
        <div v-if="activity.activityStatus.value != '100'">
          <a v-if="!activity.isPartaked && activity.activityStatus.value != '104' && activity.activityStatus.value != '106'"
             :class="{'bc-999': activity.participantCount == activity.limitCount, 'bc-main': activity.participantCount < activity.limitCount}"
             class="ad-foot c-fff" @click="submitActivity()">
            {{activity.participantCount == activity.limitCount ? '报名人数已满' : '我要参加'}}
          </a>
          <a v-if="activity.isPartaked && activity.activityStatus.value != '106' && activity.isPartaked"
             class="ad-foot bc-999 c-fff" @click="cancelActivity()">
            我要取消
          </a>
          <a v-if="activity.activityStatus.value == '104' && !activity.isPartaked" class="ad-foot bc-ccc">截止报名</a>
          <!--<a v-if="activity.activityStatus.value == '105'" class="ad-foot bc-999 c-fff">已开始</a>-->
          <!--<a v-if="activity.activityStatus.value == '106'" class="ad-foot bc-999 c-fff">已结束</a>-->
        </div>
        <a v-if="activity.activityStatus.value == '100'" class="ad-foot bc-999 c-fff">待审核</a>
      </div>
    </div>
    <div v-show="!isSubscribe">
      <div class="mask" style="z-index: 10000;"></div>
      <div style="position: absolute;z-index: 10000;top: 50%;left: 5%;margin-top: -226px;color: rgb(255, 255, 255);background: rgba(182, 182, 29, 0.8);width: 90%;border-radius: 8px;">
        <div style="text-align: center;">
          <div style="position: absolute;width: 100px;height: 58px;top: -58px;left: 50%;margin-left: -50px;background: rgba(182, 182, 29, 0.8);border-top-left-radius: 60px;border-top-right-radius: 60px;"></div>
          <img src="static/img/follow-vv.png" style="position: relative;display: block;margin: -43px auto 0;width: 82px;height: 86px;">
          <img src="static/img/follow-close.png" style="position: absolute;right: 10px;top: 10px;width: 17px;height: 17px;"
               @click="deleteFollow">
          <p style="font-size: 33px;margin-top: 15px;">报名成功</p>
          <p style="font-size: 20px;margin-top: 15px;">长按二维码</p>
          <p style="font-size: 16px;margin-top: 15px;margin-bottom: 50px;">关注VV活动，微信获取报名通知</p>
          <img src="static/img/follow-qrCode.png" style="display: block;margin: 0 auto;width: 200px;height: 200px;">
          <img src="static/img/follow-hand.png" style="display: block;margin: -10px auto 0;width: 69px;height: 115px;">
        </div>
      </div>
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
        activityNo: this.$route.query.activityNo
      }}).then((data) => {
        this.$loading.hide();
        if (data.code == 0) {
          this.activity = data.datas.activity;
          this.$wx.share(
                  this.activity.title,
                  location.href.split('#')[0] + '&router=' + location.href.split('#')[1],
                  this.activity.images ? this.host + this.activity.images[0] : this.host + '/static/img/logo.jpg',
                  this.activity.content
          );
        } else {
          this.$toast.info(data.msg);
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
        isSubscribe: true,
        swiperOption: {
          autoplay: 3000,
          setWrapperSize :true,
          pagination : '.swiper-pagination',
          paginationClickable :true,
          mousewheelControl : true,
          observeParents:true,
        },
        isShowMoreUser: false,
        activity: null,
        comments: {total: 0, pageNumber: 1, list: [], isComplete: false}
      }
    },
    computed: {
      host: function () {
        return this.$store.state.host;
      },
      userNo: function () {
        return this.$store.state.user.info.user.userNo;
      },
      user: function () {
        return this.$store.state.user.info;
      },
      content: function () {
        return this.activity.content.replace(/\n|\r\n/g, '<br/>')
      },
      isSubscribeVV:  function () {
        return this.$store.state.user.info.isSubscribeVV
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
            this.$toast.info(data.msg);
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
            this.$toast.info(data.msg);
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
            this.comments.total = data.datas.page.total;
            this.comments.list = this.comments.list.concat(data.datas.page.content);
            this.pageNumber += 1;

            if (!data.datas.page.hasNext) {
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
        if (!this.user.user.mobile) {
          this.$dialog.confirm({
            content: '绑定手机号，才能参与活动!',
            okText: '前往绑定',
            onOk: () => {
              this.$router.push('/personInfo?tab=4');
            }
          });
          return;
        }

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
            this.isSubscribe = this.isSubscribeVV;
            this.activity.participantCount += 1;
            this.activity.isPartaked = true;
            this.$router.back();
          } else {
            this.$toast.info(data.msg);
          }

        }, () => {
          this.$toast.info('参与失败');
          this.$loading.hide();
        });
      },
      toChat: function () {
        this.$router.push('/chat?friendUserNo=' + this.activity.publisherUserNo +
                '&friendType=' + this.activity.activityOrganizationType.value +
                '&linkMan=' + this.activity.publisherNickname);
      },
      previewImage: function (url) {
        var urls = [];
        this.activity.images.forEach((url) => {
          urls.push(this.host + url);
        });
        this.$wx.previewImage(url, urls);
      },
      deleteFollow: function () {
        this.isSubscribe = true;
      }
    }
  }
</script>

