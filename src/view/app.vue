<template>
  <div id="app" :style="{ height: height + 'px' }">
    <router-view></router-view>
    <div v-if="isInfo" class="mask" @click="hideInfo()"></div>
    <transition name="slide-up">
      <div v-if="isInfo" class="app-info-window">
        <h2>{{info.title}}</h2>
        <ul class="app-info-window-content list">
          <li class="aa-item item">
            <div class="row lh30">
              <span class="dp-ib pr10 w60 tr">举办者</span>
              <p class="col c-999">{{info.linkMan}}</p>
            </div>
          </li>
          <li class="aa-item item">
            <div class="row lh30">
              <span class="dp-ib pr10 w60 tr">地点</span>
              <p class="col c-999">{{info.address}}</p>
            </div>
          </li>
          <li class="aa-item item">
            <div class="row lh30">
              <span class="dp-ib pr10 w60 tr">开始时间</span>
              <p class="col c-999">{{info.beginTime | date('yyyy年MM月dd日 HH时mm分')}}</p>
            </div>
          </li>
          <li class="aa-item item">
            <div class="row lh30">
              <span class="dp-ib pr10 w60 tr">结束时间</span>
              <p class="col c-999">{{info.endTime | date('yyyy年MM月dd日 HH时mm分')}}</p>
            </div>
          </li>
          <li class="aa-item item">
            <div class="row lh30">
              <span class="dp-ib pr10 w60 tr">类型</span>
              <p class="col c-999">{{info.activityOrganizationType.desc}}</p>
            </div>
          </li>
          <li class="aa-item item" style="border-bottom: none">
            <div class="row lh30">
              <span class="dp-ib pr10 w60 tr">状态</span>
              <p class="col c-ff9800">{{info.activityStatus.desc}}</p>
              <!--<p v-if="info.status == 1" class="col c-red">审核中</p>-->
              <!--<p v-if="info.status == 2" class="col c-main">报名中</p>-->
              <!--<p v-if="info.status == 3" class="col c-ff9800">进行中</p>-->
              <!--<p v-if="info.status == 4" class="col c-999">已截止</p>-->
            </div>
          </li>
        </ul>
        <div class="app-info-window-buttons row">
          <a class="col br1-ddd" @click="collect()">收藏</a>
          <a class="col" @click="toDetail()">详情</a>
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
            centerLongitude: data.position.lng,
            centerLatitude: data.position.lat
          };

          var activityType = this.activityTypes[this.typeIndex].value;
          var timeRange = this.dateRange[this.dateIndex].value;
          var activityOrganizationType = this.activityOrganizationTypes[this.organizationTypesIndex].value;

          if (activityType) {params.activityType = activityType};
          if (timeRange) {params.timeRange = timeRange};
          if (activityOrganizationType) {params.activityOrganizationType = activityOrganizationType};

          this.$store.commit('SET_POSITION_RESULT', data);

          this.$store.dispatch('refreshMarker', params).then(() => {
            markers.forEach((item) => {
              this.$map.gd.remove(item);
            });
            this.markers.forEach((item, i) => {
              var marker = map.createMarker(item);
              AMap.event.addListener(marker, 'click', () => {
                this.$store.commit('SET_MARKER_INDEX', i);
                this.showInfo(item.info);
              });
              markers.push(marker);
            });
          }, () => {

          });
        }, (error) => {
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
      markers:  state => state.map.markers,
      positionResult:  state => state.map.positionResult,
      activityOrganizationTypes:  state => state.map.activityOrganizationTypes,
      activityTypes:  state => state.map.activityTypes,
      dateRange:  state => state.map.dateRange,
      dateIndex:  state => state.map.dateIndex,
      typeIndex:  state => state.map.typeIndex,
      organizationTypesIndex:  state => state.map.organizationTypesIndex,
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
        if (this.$store.state.user.info.token) {
          this.$router.push('/app/activityDetail');
        } else {
          this.$router.push('/app/login');
        }
      },
      collect: function () {

      }
    }
  }
</script>


