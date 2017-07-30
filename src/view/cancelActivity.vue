<template>
  <div id="cancelActivity" class="container bc-page">
    <p class="ag-text">为了保障参与者的权利与知情性，请注明原因</p>
    <p class="p15-12 f16 bc-fff">活动取消原因</p>
    <div class="pr bt1-eee bb1-eee p20 f14 bc-fff">
      <textarea class="w b-none c-999" type="text" maxlength="400" placeholder="请描述活动取消的原因，如：因天气原因取消活动。" v-model="content" style="resize: none; min-height: 3.7333333333333334rem"></textarea>
      <span class="pa" style="bottom: 0.2666666rem; right: 0.2666666rem;">{{content.length}}/400</span>
    </div>
    <a class="ag-btn" style="margin-top: 0.53333333333rem;" @click="cancelActivity">确认取消</a>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'cancelActivity',
    created: function () {

    },
    data: function () {
      return {
        content: ''
      }
    },
    computed: {

    },
    methods: {
      cancelActivity: function () {
        this.$dialog.confirm({
          content: '取消后无法恢复该活动',
          onOk: () => {
            this.$loading.show('取消...');
            this.$http.post('/user/activity/cancel', {data: {
              token: this.$store.state.user.info.token,
              activityNo: this.$route.query.activityNo,
              content: this.content
            }}).then((data) => {
              this.$loading.hide();
              if (data.code == 0) {
                this.$toast.info('取消成功');
                this.$router.back();
              } else {
                this.$toast.info(data.msg);
              }
            }, () => {
              this.$toast.info('取消失败');
              this.$loading.hide();
            });
          }
        });
      }
    }
  }
</script>
<style scoped>

</style>
