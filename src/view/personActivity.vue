<template>
  <div id="personActivity" class="container bc-page">
    <header class="p10 bc-main">
      <label class="pa-input-search">
        <input placeholder="请输入关键字搜索">
        <i class="icon ion-search"></i>
      </label>
    </header>
    <ul class="pa-list">
      <li v-for="item in activities" class="pa-item" @click="toDetail(item)">
        <img v-if="item.images" :src="host + item.images[0]" width="120" height="80"/>
        <div>
          <p class="mt5 f16 font-hide">{{item.title}}</p>
          <p class="mt10 f14 c-999">{{item.beginTime | date('yyyy-MM-dd HH:mm')}}</p>
          <p class="mt5 f14 c-999 font-hide">{{item.address}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'personActivity',
    created: function () {
      this.type = this.$route.query.type;
      this.getActivity();
    },
    data: function () {
      return {
        type: 0,
        activities: []
      }
    },
    computed: {
      host: function () {
        return this.$store.state.host;
      }
    },
    methods: {
      getActivity: function () {

        var url = 'user/activity/';

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

        this.$loading.show('获取活动...');
        this.$http.get(url, {data: {
          token: this.$store.state.user.info.token,
          pageNumber: 1,
          pageSize: 10
        }}).then((data) => {
          this.$loading.hide();
          if (data.code == 0) {
            this.activities = this.activities.concat(data.datas.page.content);
          } else {
            this.$toast.info('获取活动失败');
          }
        }, () => {
          this.$toast.info('获取活动失败');
          this.$loading.hide();
        });
      },
      toDetail: function (mark) {
        console.log('mark', mark)
        this.$store.commit('SET_MARKER', mark);
        this.$router.push('/app/activityDetail');
      }
    }
  }
</script>

