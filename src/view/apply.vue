<template>
  <div id="apply" class="container bc-page">
    <div class="apply-bg">
      <router-link class="apply-group-button" to="/applyGroup?type=1">
        <img src="static/img/apply-group.png"/>
      </router-link>
      <router-link class="apply-other-button" to="/applyGroup?type=2">
        <img src="static/img/apply-other.png"/>
      </router-link>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'apply',
    created: function () {

    },
    data: function () {
      return {

      }
    },
    computed: {},
    methods: {

    }
  }
</script>
<style scoped>

</style>
