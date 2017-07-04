<template>
  <div id="personActivity" class="container">
    <div v-if="type == 1">
      <div class="pa-tabs row">
        <a class="col">
          <span class="active">进行中</span>
        </a>
        <a class="col">
          <span>已结束</span>
        </a>
        <a class="col">
          <span>待评价</span>
        </a>
      </div>
      <div class="pa-search clear-float">
        <img src="static/icon/icon-search.png">
        <label>
          <input type="text" :class="{'c-999': !keyword, 'c-666': keyword}" v-model="keyword" placeholder="请输入关键字搜索">
        </label>
      </div>
      <ul class="pa-list bt1-eee">
        <li v-for="item in activities" @click="toDetail(item.activityNo)">
          <div class="pa-item">
            <img v-if="item.images" :src="host + item.images[0]"/>
            <img v-if="item.image" :src="host + item.image"/>
            <div>
              <p class="title">{{item.title}}</p>
              <div class="text">
                <p class="c-999">时间：{{item.beginTime | date('yyyy-MM-dd HH:mm')}}</p>
                <p class="font-hide c-999">地点：{{item.address}}</p>
              </div>
            </div>
          </div>
          <div class="pa-buttons">
            <a class="pa-btn">联系客服</a>
            <a class="pa-btn">取消参加</a>
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

