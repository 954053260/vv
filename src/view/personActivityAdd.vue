<template>
  <div id="personActivityAdd" class="container bt1-eee">
    <form class="pa-search clear-float">
      <img src="static/icon/icon-search.png">
      <label>
        <input type="text" name="test" style="display:none"/>
        <input type="search" :class="{'c-999': !keyword, 'c-666': keyword}" v-model="keyword" placeholder="请输入关键字搜索">
      </label>
    </form>
    <div class="pa-list">
      <scroller :on-infinite="getActivity" ref="scroller">
        <ul style="min-height: 1px;">
          <li v-for="item in activities" @click="toDetail(item.activityNo)">
            <div class="pa-item">
              <img v-if="item.images" :src="host + item.images[0]"/>
              <img v-if="item.image" :src="host + item.image"/>
              <div>
                <div>
                  <div class="fr pl5 c-ff9800 f16">
                    <span>#{{item.activityType.desc}}#</span>
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
      </scroller>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import InfiniteLoading from 'vue-infinite-loading';
  export default {
    name: 'personActivityAdd',
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
      getActivity: function (done) {
        this.$http.get('/user/activity/publication', {data: {
          token: this.$store.state.user.info.token,
          pageNumber: this.pageNumber,
          pageSize: 10
        }}).then((data) => {
          done();
          if (data.code == 0) {
            this.activities = this.activities.concat(data.datas.page.content);
            this.pageNumber += 1;

            if (data.datas.page.content.length < 10) {
              this.$refs.scroller.finishInfinite(true);
            } else {
              this.$refs.scroller.finishInfinite(true);
            }

          } else {
            this.$refs.scroller.finishInfinite(true);
            this.$toast.info('获取活动失败');
          }
        }, () => {
          done();
          this.$refs.scroller.finishInfinite(true);
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

