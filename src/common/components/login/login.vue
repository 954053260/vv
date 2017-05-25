<template>
    <div id="login" class="login">
        <h3 class="login-title">登录</h3>
        <div>
            <div class="login-input-content">
                <i class="icon ion-android-phone-portrait"></i>
                <div class="login-input">
                    <input placeholder="请输入手机号" v-model="phone">
                </div>
            </div>
            <div class="login-input-content">
                <i class="icon ion-locked"></i>
                <button class="code-btn" @click="getCode">{{codeText}}</button>
                <div class="login-input">
                    <input type="number" placeholder="短信验证码" v-model="code">
                </div>
            </div>
            <a class="login-btn btn bc-main c-fff" @click="login">{{isLogin ? '登录中...' : '登录'}}</a>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        name:'login',
        created: function () {

        },
        props: [],
        data: function () {
            return {
                phone: '',
                code: '',
                codeText: '验证码',
                isLogin: false
            }
        },
        methods: {
            getCode: function () {

                if (/s$/.test(this.codeText)) {
                    return ;
                }

                if (!this.phone) {
                    return this.$toast.info('请输入手机号！');
                }

                var time = 60;
                this.codeText = time + 's';
                var interval = setInterval(() => {
                    if (time) {
                        time -= 1;
                        this.codeText = time + 's';
                    } else {
                        clearInterval(interval);
                        this.codeText = '重新获取';
                    }
                }, 1000);
            },
            login: function () {

                this.isLogin = true;
                setTimeout(() => {
                    this.$emit('login', {
                        phone: this.phone,
                        code: this.code
                    });
                },500);
            }
        }
    }
</script>
<style scoped>
    .login{
        position: fixed;
        left: 50%;
        margin-left: -145px;
        width: 258px;
        padding: 15px;
        background: #fff;
        border: 1px solid #ddd;
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
        transition: all .3s ease-in;
        z-index: 10000;
    }
    .login-title{
        font-size: 16px;
        color: #00B8E6;
        text-align: center;
    }
    .login-input-content{
        margin-top: 10px;
        overflow: hidden;
    }
    .login-input-content > i {
        float: left;
        text-align: center;
        width: 39px;
        height: 38px;
        font-size: 20px;
        color: #00B8E6;
        border: 1px solid #ddd;
        border-right: none;
        line-height: 38px;
    }
    .login-input-content > .login-input{
        display: block;
        padding: 5px;
        border: 1px solid #ddd;
        overflow: hidden;
        height: 28px;
        line-height: 26px;
    }
    .login-input input{
        width: 100%;
        border: none;
    }
    .code-btn{
        float: right;
        line-height: 38px;
        border: none;
        color: #fff;
        font-size: 13px;
        background: #00B8E6;
        width: 80px;
    }
    .login-btn{
        margin-top: 10px;
        line-height: 20px;
        display: block;
        text-align: center;
    }
</style>
