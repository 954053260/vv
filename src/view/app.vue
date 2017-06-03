<template>
  <div id="app" :style="{ height: height + 'px' }">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name:'app',
    created: function () {
      this.height = document.documentElement.clientHeight || document.body.clientHeight;
    },
    mounted: function () {

    },
    components: {

    },
    data: function () {
      return {
        height: 0
      }
    },
    methods: {

    }
  }
</script>


