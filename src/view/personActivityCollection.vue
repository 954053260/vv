<template>
  <div id="personActivityCollection" class="container bc-page">
    <div class="bc-fff">
      <div class="pa-search clear-float">
        <img src="static/icon/icon-search.png">
        <label>
          <input type="text" :class="{'c-b3b3b3': !keyword, 'c-666': keyword}" v-model="keyword" placeholder="请输入关键字搜索">
        </label>
      </div>
    </div>
    <ul class="pa-list">
      <li v-for="item in activities" @click="toDetail(item.activityNo)">
        <div class="pa-item">
          <img v-if="item.images" :src="host + item.images[0]"/>
          <img v-if="item.image" :src="host + item.image"/>
          <div>
            <div>
              <div class="fr pl5 c-ff9800 f16">
                <!--<span>#{{item.activityType.desc}}#</span>-->
                <span>#活动类型#</span>
                <span :class="{'c-999': item.activityStatus.value != 103}">#{{item.activityStatus.desc}}#</span>
              </div>
              <p class="title font-hide">{{item.title}}</p>
            </div>
            <div class="text">
              <p class="c-999">时间：{{item.beginTime | date('MM/dd HH:mm')}} - {{item.endTime | date('MM/dd HH:mm')}}</p>
              <p class="font-hide c-999">地点：{{item.address}}</p>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <infinite-loading :on-infinite="getActivity" ref="infiniteLoading">
      <div slot="no-results">
        <span class="c-999">~暂无更多数据~</span>
      </div>
      <div slot="spinner" class="infinite-spinner">
        <img src="static/img/hourglass.gif">
        <span class="text">加载中...</span>
      </div>
    </infinite-loading>
  </div>
</template>
<script type="text/ecmascript-6">
  import InfiniteLoading from 'vue-infinite-loading';
  export default {
    name: 'personActivityCollection',
    created: function () {

    },
    data: function () {
      return {
        keyword: '',
        pageNumber: 1,
        activities: []
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
        this.$http.get('/user/activity/collection', {data: {
          token: this.$store.state.user.info.token,
          pageNumber: this.pageNumber,
          pageSize: 10
        }}).then((data) => {
          if (data.code == 0) {
            this.activities = this.activities.concat(data.datas.page.content);
            this.pageNumber += 1;

            if (data.datas.page.content.length < 10) {
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
            } else {
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
            }

          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
            this.$toast.info('获取活动失败');
          }
        }, () => {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          this.$toast.info('获取活动失败');
        });
      },
      toDetail: function (activityNo) {
        this.$router.push('/app/activityDetail?activityNo=' +  activityNo);
      },
      toEvaluate: function (item) {
        this.$router.push('/app/evaluate?title=' + item.title + '&activityPartakeId=' + item.activityPartakeId);
      }
    }
  }
</script>

