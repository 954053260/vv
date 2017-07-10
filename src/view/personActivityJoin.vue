<template>
  <div id="personActivityJoin" class="container hidden">
    <div class="pa-tabs row">
      <a class="col" @click="selectTab(0)">
        <span :class="{active: tab == 0}">进行中</span>
      </a>
      <a class="col" @click="selectTab(1)">
        <span :class="{active: tab == 1}">已结束</span>
      </a>
      <a class="col" @click="selectTab(2)">
        <span :class="{active: tab == 2}">待评价</span>
      </a>
    </div>
    <form class="pa-search clear-float">
      <img src="static/icon/icon-search.png">
      <label>
        <input type="text" name="test" style="display:none"/>
        <input type="search" :class="{'c-999': !keyword, 'c-666': keyword}" v-model="keyword" placeholder="请输入关键字搜索">
      </label>
    </form>
    <div class="pa-list has-tabs">
      <scroller v-if="tab == 0" :on-infinite="getActivity" ref="scroller0">
        <ul>
          <li v-for="(item, index) in activities[0].list" @click="toDetail(item.activityNo)">
            <p class="pl10 lh44 f16 bb1-eee">主办方：广百百货</p>
            <div class="pa-item">
              <img v-if="item.images" :src="host + item.images[0]"/>
              <img v-if="item.image" :src="host + item.image"/>
              <div>
                <p class="title font-hide">{{item.title}}</p>
                <div class="text">
                  <p class="c-999">时间：{{item.beginTime | date('MM/dd HH:mm')}} - {{item.endTime | date('MM/dd HH:mm')}}</p>
                  <p class="font-hide c-999">地点：{{item.address}}</p>
                </div>
              </div>
            </div>
            <div class="pa-buttons">
              <a class="pa-btn" @click.stop="toChat(item.publisherUserNo)">联系客服</a>
              <a class="pa-btn" @click.stop="cancelActivity(index, item.activityNo)">取消参加</a>
            </div>
          </li>
        </ul>
      </scroller>
      <scroller v-if="tab == 1" :on-infinite="getActivity" ref="scroller1">
        <ul>
          <li v-for="(item, index) in activities[1].list" @click="toDetail(item.activityNo)">
            <p class="pl10 lh44 f16 bb1-eee">主办方：广百百货</p>
            <div class="pa-item">
              <img v-if="item.images" :src="host + item.images[0]"/>
              <img v-if="item.image" :src="host + item.image"/>
              <div>
                <p class="title font-hide">{{item.title}}</p>
                <div class="text">
                  <p class="c-999">时间：{{item.beginTime | date('MM/dd HH:mm')}} - {{item.endTime | date('MM/dd HH:mm')}}</p>
                  <p class="font-hide c-999">地点：{{item.address}}</p>
                </div>
              </div>
            </div>
            <div class="pa-buttons">
              <a class="pa-btn" @click.stop="toChat(item.publisherUserNo)">联系客服</a>
              <a class="pa-btn" @click.stop="cancelActivity(index, item.activityNo)">取消参加</a>
            </div>
          </li>
        </ul>
      </scroller>
      <scroller v-if="tab == 2" :on-infinite="getActivity" ref="scroller2">
        <ul>
          <li v-for="(item, index) in activities[2].list" @click="toDetail(item.activityNo)">
            <p class="pl10 lh44 f16 bb1-eee">主办方：广百百货</p>
            <div class="pa-item">
              <img v-if="item.images" :src="host + item.images[0]"/>
              <img v-if="item.image" :src="host + item.image"/>
              <div>
                <p class="title font-hide">{{item.title}}</p>
                <div class="text">
                  <p class="c-999">时间：{{item.beginTime | date('MM/dd HH:mm')}} - {{item.endTime | date('MM/dd HH:mm')}}</p>
                  <p class="font-hide c-999">地点：{{item.address}}</p>
                </div>
              </div>
            </div>
            <div class="pa-buttons">
              <a class="pa-btn" @click.stop="toChat(item.publisherUserNo)">联系客服</a>
              <a class="pa-btn" @click.stop="cancelActivity(index, item.activityNo)">取消参加</a>
            </div>
          </li>
        </ul>
      </scroller>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import InfiniteLoading from 'vue-infinite-loading';
  export default {
    name: 'personActivityJoin',
    created: function () {

    },
    data: function () {
      return {
        tab: 0,
        keyword: '',
        activities: [
          {pageNumber: 1, isComplete: false, list: []},
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
    components: {InfiniteLoading},
    methods: {
      selectTab: function (tab) {
        this.tab = tab;
      },
      getActivity: function () {

        var scroller = this.$refs['scroller' + this.tab];

        this.$http.get('/user/activity/partake', {data: {
          token: this.$store.state.user.info.token,
          pageNumber: this.activities[this.tab].pageNumber,
          pageSize: 10
        }}).then((data) => {
          if (data.code == 0) {
            this.activities[this.tab].list = this.activities[this.tab].list.concat(data.datas.page.content);
            this.activities[this.tab].pageNumber += 1;

            if (data.datas.page.content.length < 10) {
              this.activities[this.tab].isComplete = true;
              scroller.finishInfinite(true);
            }

          } else {
            scroller.finishInfinite(true);
            this.$toast.info('获取活动失败');
          }
        }, () => {
          scroller.finishInfinite(true);
          this.$toast.info('获取活动失败');
        });
      },
      cancelActivity: function (index, activityNo) {
        this.$loading.show( '取消...');
        this.$http.post('/user/activity/partake/cancel', {data: {
          token: this.$store.state.user.info.token,
          activityNo: activityNo
        }}).then((data) => {
          this.$loading.hide();

          if (data.code == 0) {
            this.$toast.info('取消成功');
            this.activities.splice(index, 1);
          } else {
            this.$toast.info('取消失败');
          }

        }, () => {
          this.$toast.info('取消失败');
          this.$loading.hide();
        });
      },
      toDetail: function (activityNo) {
        this.$router.push('/app/activityDetail?activityNo=' +  activityNo);
      },
      toEvaluate: function (item) {
        this.$router.push('/app/evaluate?title=' + item.title + '&activityPartakeId=' + item.activityPartakeId);
      },
      toChat: function (publisherUserNo, linkMan) {
        this.$router.push('/app/chat?friendUserNo=' + publisherUserNo + '&linkMan=' + linkMan);
      }
    }
  }
</script>

