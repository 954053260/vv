<template>
  <div id="about" class="container">
    <div class="about-bg tc">
      <img class="about-logo" src="static/img/logo.jpg">
      <p class="f16">VV</p>
      <p class="f12 c-999">v 1.0.0</p>
      <div class="mt10 lh30 f14">
        全球第一个基于用户地图位置<br>
        提供活动的平台，<br>
        VV一下，<br>
        随时随地，活动尽收
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'about',
    created: function () {

    },
    data: function () {
      return {

      }
    },
    computed: {},
    methods: {
      back: function () {
        this.$router.back();
      }
    }
  }
</script>
<style scoped>

</style>
