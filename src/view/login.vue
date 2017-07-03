<template>
  <div id="login" class="container">
    <img class="login-logo" src="static/img/logo.jpg">
    <div class="login-content">
      <div class="login-input pr row">
        <i class="icon ion-android-phone-portrait"></i>
        <input class="col" type="number" placeholder="请输入手机号" v-model="phone"
               :class="{'c-999': !phone, 'c-666': phone}"
               @blur="validatePhone()"
               @focus="isPhone = true">
        <p v-show="!isPhone" class="login-point">请输入正确的手机号！</p>
      </div>
      <div class="row">
        <div class="login-input row col">
          <i class="icon ion-locked"></i>
          <input class="col" :class="{'c-999': !code, 'c-666': code}" type="number" placeholder="短信验证码" v-model="code">
        </div>
        <button class="login-code-btn" @click="getCode">{{codeText}}</button>
      </div>
      <checkbox v-model="isAgree" name="login-check">
        <span class="c-ff9800">我已阅读并同意签署《用户注册协议》</span>
      </checkbox>
      <a class="login-btn" @click="doLogin">登录</a>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'login',
    created: function () {

    },
    data: function () {
      return {
        isAgree: true,
        codeText: '验证码',
        phone: '',
        isPhone: true,
        code: ''
      }
    },
    computed: {
      user: function () {
        return this.$store.state.user.info;
      }
    },
    methods: {
      validatePhone: function () {
        if (!/^1(3|4|5|7|8)\d{9}$/g.test(this.phone)) {
          this.isPhone = false;
        } else {
          this.isPhone = true;
        }
      },
      doLogin: function () {
        if (this.validate()) {

          if (!this.code) {
            return this.$toast.info('请输入验证码！')
          }

          this.$loading.show('登录中...');
          this.$store.dispatch('login', {
            mobile: this.phone,
            smsCode: this.code,
            openid: '404f4fe64b1b070c12e6f3b0058cd87e'
          }).then((data) => {
            this.$store.dispatch('getUserInfo', this.user.token).then(() => {
              this.$loading.hide();
              this.$router.back();
            }, () => {
              this.$loading.hide();
              this.$toast.info('获取用户信息失败！')
            })
            }, () => {
            this.$loading.hide();
            this.$toast.info('登录失败！')
          });
        }


      },
      getCode: function () {
        if (this.validate()) {
          this.codeText = 60;

          var interval = setInterval(() => {
            if (this.codeText) {
              this.codeText--;
            } else {
              this.codeText = '重新获取';
              clearInterval(interval);
            }
          }, 1000);

          this.$http.post('/common/smsCode', {data: {mobile: this.phone}})
                  .then((data) => {
                    if (data.code == 0) {
                      this.code = data.msg.replace('短信验证码：', '');
                    } else {
                      this.$toast.info('获取验证码失败！');
                    }
                  }, () => {
                    clearInterval(interval);
                    this.codeText = '验证码';
                    this.$toast.info('获取验证码失败！')
                  });
        }
      },
      validate: function () {
        if (!this.isAgree) {
          this.$toast.info('不同意签署《用户注册协议》,不能注册！')
          return false;
        }

        if (!this.phone) {
          this.$toast.info('请输入手机号！');
          return false;
        }

        if (!this.isPhone) {
          this.$toast.info('手机号格式错误！');
          return false;
        }

        return true;
      },
      back: function () {
        this.$router.back();
      }
    }
  }
</script>

