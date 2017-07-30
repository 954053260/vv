<template>
  <div id="hostInfo" class="container bc-page">
    <div v-if="info" class="h">
      <scroller :on-infinite="getActivity" ref="scroller">
        <header class="hi-header">
          <img :src="host + info.avatar">
          <p>{{info.nickname}}</p>
          <p v-if="info.signature">“{{info.signature}}”</p>
        </header>
        <div v-if="info.userType.value == 1" class="hi-hobby mb10">
          <span class="borer"></span>
          <span>兴趣爱好</span>
          <div v-if="info.hobbies" class="mt10 lh20 f14">
            <span class="hobby" v-for="(hobby, index) in info.hobbies"><span v-if="index">，</span>{{hobby.tagName}}</span>
          </div>
        </div>
        <div class="pa-tabs row">
          <a class="col" @click="selectTab(0)">
            <span :class="{active: tab == 0}">进行中</span>
          </a>
          <a class="col" @click="selectTab(1)">
            <span :class="{active: tab == 1}">已结束</span>
          </a>
        </div>
        <ul>
          <li v-for="(item, index) in activities[tab].list" @click="toDetail(item.activityNo)">
            <div class="pa-item">
              <img v-if="item.images" :src="host + item.images[0]"/>
              <img v-if="item.image" :src="host + item.image"/>
              <div>
                <div>
                  <div class="fr pl5 c-ff9800 f16">
                    <span>#{{item.activityType.desc}}#</span>
                    <span :class="{'c-999': item.activityStatus.value != 103}">#{{item.activityStatus.desc}}#</span>
                  </div>
                </div>
                <p class="title font-hide">{{item.title}}</p>
                <div class="text">
                  <p class="c-999">时间：{{item.beginTime | date('MM/dd HH:mm')}} - {{item.endTime | date('MM/dd HH:mm')}}</p>
                  <p class="font-hide c-999">地点：{{item.address}}</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </scroller>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name:'hostInfo',
    created: function () {
      this.$loading.show('获取主办方信息...');
      this.$http.get('/user/activity/publisher', {data: {
        token: this.$store.state.user.info.token,
        publisherUserNo:  this.$route.query.publisherUserNo
      }}).then((data) => {
        this.$loading.hide();
        if (data.code == 0) {
          this.info = data.datas.publisher;
        } else {
          this.$toast.info(data.msg);
        }
      }, () => {
        this.$toast.info('获取主办方信息失败');
        this.$loading.hide();
      });
    },
    mounted: function () {

    },
    data: function () {
      return {
        info: '',
        tab: 0,
        activities: [
          {pageNumber: 1, isComplete: false, list: []},
          {pageNumber: 1, isComplete: false, list: []}
        ]
      }
    },
    computed: {
      host: function () {
        return this.$store.state.host;
      }
    },
    methods: {
      selectTab: function (tab) {
        this.tab = tab;

        if (!this.activities[tab].isComplete) {
          this.$refs.scroller.finishInfinite(false);
        }
      },
      getActivity: function () {
        var tab = this.tab;

        if (this.activities[tab].isComplete) {
          return this.$refs.scroller.finishInfinite(true);
        }

        this.$http.get('/user/activity/publication', {data: {
          token: this.$store.state.user.info.token,
          pageNumber: this.activities[tab].pageNumber,
          pageSize: 10,
          status: this.tab ? 'finish' : 'underway',
          publisherUserNo:this.$route.query.publisherUserNo
        }}).then((data) => {
          if (data.code == 0) {
            this.activities[tab].list = this.activities[tab].list.concat(data.datas.page.content);
            this.activities[tab].pageNumber += 1;

            if (!data.datas.page.hasNext) {
              this.activities[tab].isComplete = true;
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
          this.$toast.info('获取活动失败');
        });
      },
      toDetail: function (activityNo) {
        this.$router.push('/app/activityDetail?activityNo=' +  activityNo);
      }
    }
  }
</script>


