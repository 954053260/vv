<template>
  <div id="personActivity" class="container bc-page">
    <header class="p10 bc-main">
      <label class="input-search">
        <input placeholder="请输入关键字搜索">
        <i class="icon ion-search"></i>
      </label>
    </header>
    <ul>
      <li v-for="item in activities" class="row mt10 mb10 p10 bc-fff">
        <img src="../assets/test3.jpg" width="120" height="80">
        <div class="col pl10">
          <p class="mt5 f16">{{item.title}}</p>
          <p class="mt10 f13">{{item.date | date('yyyy年MM月dd日 HH:mm')}}</p>
          <p class="mt5 f13">{{item.address}}</p>
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
    },
    data: function () {
      return {
        type: 0,
        activities: [
          {
            title: '活动一',
            date: new Date(),
            address: '广州市白云区'
          },
          {
            title: '活动二',
            date: new Date(),
            address: '广州市白云区'
          },
          {
            title: '活动三',
            date: new Date(),
            address: '广州市白云区'
          },
          {
            title: '活动四',
            date: new Date(),
            address: '广州市白云区'
          },
          {
            title: '活动五',
            date: new Date(),
            address: '广州市白云区'
          },
          {
            title: '活动六',
            date: new Date(),
            address: '广州市白云区'
          }
        ]
      }
    },
    computed: {},
    methods: {

    }
  }
</script>
<style scoped>
  .input-search{
    display: block;
    position: relative;
    padding: 0 10px;
    line-height: 30px;
    background: #fff;
    border-radius: 13px;
  }
  .input-search input{
    line-height: 25px;
    width: 100%;
    border: none;
  }
  .input-search .ion-search{
    position: absolute;
    top: 1px;
    right: 15px;
    font-size: 20px;
    color: #999;
  }
</style>
