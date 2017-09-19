<template>
  <div id="authentication" class="container" :class="{'bc-page': !user.user.idCardNo}">
    <div v-if="user.user.idCardNo" class="au-success">
      <img src="static/img/authentication-success.png">
      <div class="f16 c-999 tc">
        <p class="f18 c-000">你已完成实名认证</p>
        <p class="name">真实姓名：{{realname}}</p>
        <p>身份证号：{{idCardNo}}</p>
      </div>
    </div>
    <div v-else>
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
            <input class="c-999" type="text" placeholder="请输入" v-model="idCardNo"
                   @blur="validateCardNo"
                   @focus="isCardNo = true"/>
            <span v-show="!isCardNo" class="au-point">请输入正确的身份证号！</span>
          </label>
        </li>
      </ul>
      <a class="au-btn" @click="submit">去认证</a>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'authentication',
    created: function () {
      if (this.user.user.idCardNo) {
        var nameList = this.user.user.realname.split('');
        var cardList = this.user.user.idCardNo.split('');
        nameList.forEach((item, i) => {
          if (i) {
            this.realname += '*';
          } else {
            this.realname += item;
          }
        });

        cardList.forEach((item, i) => {
          if (1 < i && i < (cardList.length - 4)) {
            this.idCardNo += '*';
          } else {
            this.idCardNo += item;
          }
        });
      }
    },
    data: function () {
      return {
        type: 1,
        isCardNo: true,
        realname: '',
        idCardNo: ''
      }
    },
    computed: {
      user: function () {
        return this.$store.state.user.info;
      }
    },
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
            this.$store.state.user.info.user.realname = this.realname;
            this.$store.state.user.info.user.idCardNo = this.idCardNo;
//            this.$store.dispatch('getUserInfo', this.$store.state.user.info.token).then(() => {
//            }, () => {
//              this.$toast.info('获取用户信息失败！')
//            });
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
