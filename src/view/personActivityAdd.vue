<template>
  <div id="personActivityAdd" class="container bt1-eee">
    <form class="pa-search clear-float">
      <img src="static/icon/icon-search.png">
      <label>
        <input type="text" name="test" style="display:none"/>
        <input type="search" :class="{'c-999': !keyword, 'c-666': keyword}" v-model="keyword" placeholder="请输入关键字搜索"
               @change="changeKeyword">
      </label>
    </form>
    <div class="pa-list">
      <scroller :on-infinite="getActivity" ref="scroller">
        <ul style="min-height: 1px;">
          <li v-for="item in activities.list" @click="toDetail(item.activityNo)">
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
            <div class="pa-buttons">
              <a v-if="item.activityStatus.value < 104 && item.activityStatus.value !=102" class="pa-btn" @click.stop="cancelActivity(index, item.activityNo)">取消</a>
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
        activities: {list: [], isComplete: false}
      }
    },
    computed: {
      host: function () {
        return this.$store.state.host;
      }
    },
    components: {InfiniteLoading},
    methods: {
      getActivity: function (done) {
        if (this.activities.isComplete) {
          this.$refs.scroller.finishInfinite(true);
          return;
        }

        this.$http.get('/user/activity/publication', {data: {
          token: this.$store.state.user.info.token,
          keyword: this.keyword,
          pageNumber: this.pageNumber,
          pageSize: 10
        }}).then((data) => {
          done();
          if (data.code == 0) {
            this.activities.list = this.activities.list.concat(data.datas.page.content);
            this.pageNumber += 1;

            if (!data.datas.page.hasNext) {
              this.activities.isComplete = true;
              this.$refs.scroller.finishInfinite(true);
            } else {
              this.$refs.scroller.finishInfinite(false);
            }

          } else {
            this.$refs.scroller.finishInfinite(true);
            this.$toast.info(data.msg);
          }
        }, () => {
          done();
          this.$refs.scroller.finishInfinite(true);
          this.$toast.info('获取活动失败');
        });
      },
      changeKeyword: function () {
        this.pageNumber = 1;
        this.activities.list = [];
        this.activities.isComplete = false;
        this.$refs.scroller.finishInfinite(false);
      },
      cancelActivity: function (index, activityNo) {
        this.$loading.show('取消...');
        this.$http.post('/user/activity/cancel', {data: {
          token: this.$store.state.user.info.token,
          activityNo: activityNo
        }}).then((data) => {
          this.$loading.hide();

          if (data.code == 0) {
            this.activities.list.splice(index, 1);
            this.$toast.info('取消成功');
          } else {
            this.$toast.info(data.msg);
          }

        }, () => {
          this.$toast.info('取消成功');
          this.$loading.hide();
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

