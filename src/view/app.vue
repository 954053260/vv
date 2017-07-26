<template>
  <div id="app" :style="{ height: height + 'px' }">
    <router-view></router-view>
    <div v-if="isInfo" class="mask-no z-999" @click="hideInfo()"></div>
    <transition name="slide-up">
      <div v-if="isInfo" class="app-info-window">
        <h2><span class="font-hide">{{info.title}}</span></h2>
        <ul class="app-list">
          <li class="app-item">
            <div class="row">
              <p class="w60">举办者</p>
              <p class="col c-666">{{info.publisherNickname}}</p>
            </div>
          </li>
          <li class="app-item app-item-auto">
            <div class="row">
              <p class="w60">地点</p>
              <p class="col c-666">{{info.address}}</p>
            </div>
          </li>
          <li class="app-item">
            <div class="row">
              <p class="w60">时间</p>
              <p class="col c-666">{{info.beginTime | date('MM月dd日 HH:mm')}} - {{info.endTime | date('MM月dd日 HH:mm')}}</p>
            </div>
          </li>
          <li class="app-item">
            <div class="row">
              <div class="row col">
                <p class="w60">类型</p>
                <p class="col c-666">{{info.activityType.desc}}</p>
              </div>
              <div class="row col">
                <p class="w60">状态</p>
                <p class="col c-666">{{info.activityStatus.desc}}</p>
              </div>
            </div>
          </li>
        </ul>
        <div class="app-info-window-buttons row">
          <a v-if="!info.isCollected"class="col br1-eee" @click="collectActivity()">
            <img class="pr dp-ib vm w30" src="static/icon/icon-star.png" style="top: -0.053334rem">
            <span class="dp-ib vm">收藏</span>
          </a>
          <a v-if="info.isCollected" class="col br1-eee" @click="collectActivity()">
            <img class="pr dp-ib vm w30" src="static/icon/icon-star-fill.png" style="top: -0.053334rem">
            <span class="dp-ib vm">已收藏</span>
          </a>
          <a class="col bc-main c-fff" @click="toDetail()">详情</a>
        </div>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
  import {mapState} from 'vuex'

  export default {
    name:'app',
    created: function () {
      this.height = document.documentElement.clientHeight || document.body.clientHeight;

      this.$map.loadMap((map) => {
        map.doLocation();
        var markers = [];

        this.positionPicker = map.positionPicker((data) => {

          var params = {
            keyword: this.keyword,
            centerLongitude: data.position.lng,
            centerLatitude: data.position.lat,
            distance: map.mapScale[map.gd.getZoom()]*5
          };

          var activityType = this.activityTypes[this.typeIndex].value;
          var timeRange = this.dateRange[this.dateIndex].value;
          var activityOrganizationType = this.activityOrganizationTypes[this.organizationTypesIndex].value;

          if (activityType) {
            params.activityType = activityType;
          }

          if (timeRange) {
            params.timeRange = timeRange;
          }

          if (activityOrganizationType) {
            params.activityOrganizationType = activityOrganizationType;
          }

          if (this.token) {
            params.token = this.token;
          }

          this.$store.commit('SET_POSITION_RESULT', data);

          this.$store.dispatch('refreshMarker', params).then(() => {
            if (this.$store.state.isRefresh) {
              this.$store.state.isRefresh = false;
              this.$toast.info('刷新成功');
            }

            markers.forEach((item) => {
              this.$map.gd.remove(item);
            });

            this.markers.forEach((item) => {
              var marker = map.createMarker(item);
              AMap.event.addListener(marker, 'click', () => {
                this.showInfo(item.info);
              });
              markers.push(marker);
            });

          }, () => {
            if (this.$store.state.isRefresh) {
              this.$store.state.isRefresh = false;
              this.$toast.info('数据暂无更新');
            }
          });
        }, () => {
          this.$toast.info('地址获取失败');
        });
        this.positionPicker.show();
      });
    },
    mounted: function () {

    },
    destoryed: function () {
      this.positionPicker && this.positionPicker.remove();
    },
    components: {

    },
    data: function () {
      return {
        height: 0,
        isInfo: false,
        info: {}
      }
    },
    computed: mapState({
      token: state => state.user.info.token,
      keyword:  state => state.map.keyword,
      markers:  state => state.map.markers,
      positionResult:  state => state.map.positionResult,
      activityOrganizationTypes:  state => state.map.activityOrganizationTypes,
      activityTypes:  state => state.map.activityTypes,
      dateRange:  state => state.map.dateRange,
      dateIndex:  state => state.map.dateIndex,
      typeIndex:  state => state.map.typeIndex,
      organizationTypesIndex:  state => state.map.organizationTypesIndex
    }),
    methods: {
      showInfo: function (data) {
        this.info = data;
        this.isInfo = true;
      },
      hideInfo: function () {
        this.isInfo = false;
      },
      toDetail: function () {
        this.isInfo = false;

        if (this.$store.state.user.info.token) {
          this.$router.push('/app/activityDetail?activityNo=' +  this.info.activityNo);
        } else {
          this.$router.push('/app/login');
        }

      },
      collectActivity: function () {
        this.isInfo = false;
        
        if (this.$store.state.user.info.token) {
          var isCollected = this.info.isCollected;
          var url = isCollected ? '/user/activity/collection/cancel' : '/user/activity/collect';
          this.$loading.show(isCollected ? '取消...' : '收藏...');
          this.$http.post(url, {data: {
            token: this.token,
            activityNo: this.info.activityNo
          }}).then((data) => {
            this.$loading.hide();

            if (data.code == 0) {
              this.$toast.info(isCollected ? '取消成功' : '收藏成功');
              this.info.isCollected = !isCollected;
              this.$map.loadMap((map) => {
                map.getPositionPicker().start();
              });
            } else {
              this.$toast.info(data.msg);
            }

          }, () => {
            this.$toast.info(isCollected ? '取消失败' : '收藏失败');
            this.$loading.hide();
          });
        } else {
          this.$router.push('/app/login');
        }
      }
    }
  }
</script>


