<template>
  <div id="personInfo" class="container bc-page">
    <div class="ad-content">
      <header class="p20-10 tc bc-main">
        <img :src="host + avatar" class="db-ib vm w100 h100 brp50" @click="uploadAvatar">
      </header>
      <ul class="list">
        <li class="pi-item item mt10">
          <label class="row lh30">
            <span class="dp-ib w70 tr">昵称：</span>
            <span v-show="!isEdit" class="col c-666">{{nickname}}</span>
            <input v-show="isEdit" class="col c-666" type="text" placeholder="请输入昵称" v-model="nickname">
          </label>
        </li>
        <li class="pi-item item">
          <label class="row lh30">
            <span class="dp-ib w70 tr">性别：</span>
            <span class="col" :class="{'c-666': gender, 'c-999': !gender}">{{gender || '身份认证确定性别'}}</span>
          </label>
        </li>
        <li class="pi-item item pr">
          <label class="row lh30">
            <span class="dp-ib w70 tr">手机号：</span>
            <span v-show="!isEdit" class="col c-666">{{mobile}}</span>
            <input v-show="isEdit" class="col c-666" type="text" :disabled="disabled" placeholder="请输入手机号" v-model="mobile"
                   @focus="isPhone = true" @blur="validatePhone()">
            <p v-show="!isPhone" class="login-point" style="left: 70px;">请输入正确的手机号！</p>
          </label>
        </li>
        <li class="pi-item item mt10">
          <label class="row lh30">
            <span class="dp-ib w70 tr">个性签名：</span>
            <span v-show="!isEdit" class="col c-666">{{signature || '添加个性签名'}}</span>
            <input v-show="isEdit" class="col c-666" type="text" :disabled="disabled" placeholder="添加个性签名" v-model="signature">
          </label>
        </li>
        <li class="pi-item item">
          <label class="row lh30">
            <span class="dp-ib w70 tr">兴趣爱好：</span>
            <input class="col c-666" type="text" disabled="disabled" placeholder="添加兴趣爱好，逗号隔开" v-model="hobby">
          </label>
        </li>
      </ul>
    </div>
    <a class="ad-confirm-btn" @click="saveInfo()">{{isEdit ?  '保存' : '编辑'}}</a>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'personInfo',
    created: function () {
      this.avatar = this.$store.state.user.info.user.avatar;
      this.nickname = this.$store.state.user.info.user.nickname;
      this.gender = this.$store.state.user.info.user.gender;
      this.mobile = this.$store.state.user.info.user.mobile;
      this.signature = this.$store.state.user.info.user.signature;
      this.hobbies = this.$store.state.user.info.user.hobbies;
    },
    data: function () {
      return {
        isPhone: true,
        isEdit: false,
        avatar: '',
        nickname: '',
        gender: '',
        mobile: '',
        signature: '失败是成功之母，go! go！go！',
        hobbies: []
      }
    },
    computed: {
      host: function () {
        return this.$store.state.host;
      }
    },
    methods: {
      validatePhone: function () {
        if (!/^1(3|4|5|7|8)\d{9}$/g.test(this.mobile)) {
          this.isPhone = false;
        } else {
          this.isPhone = true;
        }
      },
      uploadAvatar: function () {
          this.$file.upload({
            success: (data) => {
              this.$loading.show('上传图片');
              this.$store.dispatch('fileUpload', data)
                      .then((data) => {
                        this.$loading.hide();
                        this.avatar = data.datas.uris[0];
                      }, () => {
                        this.$loading.hide();
                        this.$toast.info('上传失败');
                      })
            },
            fail: (err) => {
              this.$toast.info(err.msg);
            }
          });
      },
      saveInfo: function () {
        if (!this.isEdit) {
          return this.isEdit = true;
        }
        this.$loading.show('保存信息中...');
        this.$http.post('/user/update', {data: {
          token: this.$store.state.user.info.token,
          nickname: this.nickname,
          avatar: this.avatar,
          signature: this.signature,
          hobbies: this.hobbies
        }
        }).
        then((data) => {
          this.$loading.hide();
          this.isEdit = false;

          if (data.code == 0) {
            this.$toast.info('保持信息成功');
          } else {
            this.$toast.info('保持信息失败');
          }

        }, () => {
          this.$loading.hide();
          this.isEdit = false;
          this.$toast.info('保持信息失败');
        });
      }
    }
  }
</script>

