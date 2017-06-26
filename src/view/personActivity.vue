<template>
  <div id="personActivity" class="container bc-page">
    <header class="p10 bc-main">
      <label class="pa-input-search">
        <input placeholder="请输入关键字搜索">
        <i class="icon ion-search"></i>
      </label>
    </header>
    <ul class="pa-list">
      <li v-for="item in activities" class="pa-item" @click="toDetail(item.activityNo)">
        <img v-if="item.images" :src="host + item.images[0]" width="120" height="80"/>
        <img v-if="item.image" :src="host + item.image" width="120" height="80"/>
        <div>
          <div class="row mt5 f16">
            <p class="col font-hide">{{item.title}}</p>
            <a v-if="type == 1" @click.stop="toEvaluate(item)"
                         class="ml10 bc-main c-fff f12" style="padding: 2px 5px;">
              去评价
            </a>
          </div>
          <p class="mt10 f14 c-999">{{item.beginTime | date('yyyy-MM-dd HH:mm')}}</p>
          <p class="mt5 f14 c-999 font-hide">{{item.address}}</p>
        </div>
      </li>
    </ul>
    <infinite-loading :on-infinite="getActivity" ref="infiniteLoading">
      <div slot="no-results">
        <span class="c-999">加载完成</span>
      </div>
      <div slot="spinner">
        <img width="30" height="30" src="static/img/hourglass.gif" class="dp-ib vm">
        <span class="dp-ib vm">加载中...</span>
      </div>
    </infinite-loading>
  </div>
</template>
<script type="text/ecmascript-6">
  import InfiniteLoading from 'vue-infinite-loading';
  export default {
    name: 'personActivity',
    created: function () {
      this.type = this.$route.query.type;
    },
    data: function () {
      return {
        type: 0,
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
      getActivity: function () {
        var url = '/user/activity/';

        switch (parseInt(this.type)) {
          case 1:
            url += 'partake';
            break;
          case 2:
            url += 'publication';
            break;
          case 3:
            url += 'collection';
            break;
        }

        this.$http.get(url, {data: {
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
            this.$toast.info('获取活动失败');
          }
        }, () => {
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

