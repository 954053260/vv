<template>
  <div id="authentication" class="container bc-page">
    <header class="au-header">身份验证后，可参加平台活动</header>
    <ul class="au-list bc-fff">
      <li class="au-item row">
        <span>真实姓名</span>
        <label class="col">
          <input class="c-999" type="text" placeholder="请输入" v-model="realname">
        </label>
      </li>
      <li class="au-item row">
        <span>身份证号</span>
        <label class="col pr">
          <input class="c-999" type="number" placeholder="请输入" v-model="idCardNo"
                 @blur="validateCardNo"
                 @focus="isCardNo = true"/>
          <span v-show="!isCardNo" class="au-point">请输入正确的身份证号！</span>
        </label>
      </li>
    </ul>
    <a class="au-btn" @click="submit">去认证</a>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'authentication',
    created: function () {

    },
    data: function () {
      return {
        type: 1,
        isCardNo: true,
        realname: '',
        idCardNo: ''
      }
    },
    computed: {},
    methods: {
      validateCardNo: function () {
        if (!/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/g.test(this.idCardNo)) {
          this.isCardNo = false;
        } else {
          this.isCardNo = true;
        }
      },
      submit: function () {
        this.$loading.show('提交中...');
        this.$http.post('/user/realname/approve', {
          data: {
            token: this.$store.state.user.info.token,
            realname: this.realname,
            idCardNo: this.idCardNo
          }
        }).then((data) => {
          this.$loading.hide();
          if (data.code == 0) {
            this.$toast.info('认证成功');
            this.$store.dispatch('getUserInfo', this.$store.state.user.info.token).then(() => {
            }, () => {
              this.$toast.info('获取用户信息失败！')
            });
            this.$router.back();
          } else {
            this.$toast.info(data.msg);
          }
        }, () => {
          this.$toast.info('认证失败');
          this.$loading.hide();
        });
      }
    }
  }
</script>
<style scoped>

</style>
