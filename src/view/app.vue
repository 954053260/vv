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
              <p class="col c-999">{{info.user.name}}</p>
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
              <p class="col c-999">{{info.startDate | date('yyyy年MM月dd日 HH时mm分')}}</p>
            </div>
          </li>
          <li class="aa-item item">
            <div class="row lh30">
              <span class="dp-ib pr10 w60 tr">结束时间</span>
              <p class="col c-999">{{info.endDate | date('yyyy年MM月dd日 HH时mm分')}}</p>
            </div>
          </li>
          <li class="aa-item item">
            <div class="row lh30">
              <span class="dp-ib pr10 w60 tr">类型</span>
              <p class="col c-999">{{info.typeText}}</p>
            </div>
          </li>
          <li class="aa-item item" style="border-bottom: none">
            <div class="row lh30">
              <span class="dp-ib pr10 w60 tr">状态</span>
              <p v-if="info.status == 1" class="col c-red">审核中</p>
              <p v-if="info.status == 2" class="col c-main">报名中</p>
              <p v-if="info.status == 3" class="col c-ff9800">进行中</p>
              <p v-if="info.status == 4" class="col c-999">已截止</p>
            </div>
          </li>
        </ul>
        <div class="app-info-window-buttons row">
          <a class="col br1-ddd">收藏</a>
          <router-link class="col" to="/app/activityDetail">详情</router-link>
        </div>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name:'app',
    created: function () {
      this.height = document.documentElement.clientHeight || document.body.clientHeight;

      this.$map.loadMap((map) => {
        map.doLocation();

        var markers = [];

        this.positionPicker = map.positionPicker((data) => {
          var lat = data.position.lat;
          var lng = data.position.lng;

          this.$store.dispatch('setPositionResult', data);

          markers.forEach((item) => {
            this.$map.gd.remove(item);
          });

          this.markers.forEach((item, i) => {

            var random = Math.random()*0.02;

            if (i % 2) {
              item.center = (lng + random) + ',' + (lat + random);
            } else
            if (i % 3){
              item.center = (lng + random) + ',' + (lat - random);
            } else
            if (i % 4) {
              item.center = (lng - random) + ',' + (lat - random);
            } else {
              item.center = (lng - random) + ',' + (lat + random);
            }

            var marker = map.createMarker(item);
            AMap.event.addListener(marker, 'click', () => {
              this.showInfo(item.info);
            });
            markers.push(marker);
          });

        }, (error) => {
          this.$toast.info('地址获取失败');
        });

        this.positionPicker.show();

      });
    },
    mounted: function () {

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
    computed: {
      markers: function () {
        return this.$store.state.map.markers;
      },
      positionResult: function () {
        return this.$store.state.map.positionResult;
      }
    },
    methods: {
      showInfo: function (data) {
        this.info = data;
        this.isInfo = true;
      },
      hideInfo: function () {
        this.isInfo = false;
      }
    }
  }
</script>


