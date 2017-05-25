<template>
  <div id="about" class="container p10">
    <p>vv 1.0<a class="c-main" @click="back">返回</a></p>
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
