<template>
  <div id="personInfo" class="container bc-page">
    <transition name="fade">
      <div v-show="tab == 1">
        <header class="pi-header">
          <img :src="host + avatar" @click="uploadAvatar">
        </header>
        <div class="bc-fff">
          <ul class="pi-list">
            <li class="pi-item row">
              <span>昵称</span>
              <label class="col">
                <input class="c-999" type="text" placeholder="请输入昵称" v-model="nickname">
              </label>
            </li>
            <li class="pi-item row">
              <span>性别</span>
              <span class="col c-999 tr">{{gender || '身份认证确定性别'}}</span>
            </li>
            <li class="pi-item row">
              <span>手机号</span>
              <label class="col pr">
                <input class="c-999" type="number" placeholder="请输入手机号" v-model="mobile"
                       @focus="isPhone = true" @blur="validatePhone()">
                <p v-show="!isPhone" class="pi-point">请输入正确的手机号！</p>
              </label>
            </li>
            <li class="pi-item pi-item-2 row">
              <span>个性签名</span>
              <label class="col">
                <textarea class="c-999 tr" :class="{'tr': !signature}" type="text" placeholder="添加个性签名" v-model="signature"></textarea>
              </label>
            </li>
            <li class="pi-item row">
              <span>兴趣爱好</span>
              <a class="col c-999 tr" :class="{'tr': hobbies.length == 0}" @click="showTags()">
                <span v-if="hobbies.length == 0">添加兴趣爱好，逗号隔开</span>
                <span v-for="(item, index) in hobbies"><span v-if="index">，</span>{{item.tagName}}</span>
              </a>
            </li>
          </ul>
        </div>
        <a class="pi-btn" :class="{active: isEdit}" @click="saveInfo">保存</a>
      </div>
    </transition>
    <transition name="fade">
    <div v-show="tab == 2" class="h f16 bc-fff">
        <div class="pi-tags-header">
          <p class="tr">
            <a @click="hideTags">
              <img class="w30" src="static/icon/icon-close.png">
            </a>
          </p>
          <p class="f18 tc c-main">你对什么感兴趣？</p>
          <p class="f14 tc c-999">选择你想要看到的内容吧</p>
        </div>
        <div class="row row-center" v-for="(item, outIndex) in tags"
             :class="{'c-main': outIndex%1 == 0, 'c-ff9800': outIndex%2 == 0, 'c-green': outIndex%3 == 0, 'c-1e90ff': outIndex%4 == 0}">
          <span class="w70 tc">{{item.tagTypeName}}</span>
          <div class="col">
            <span v-for="(tag, index) in item.tags" class="pi-tag" @click="selectTag(outIndex, index)"
                  :class="{'bc-main  c-fff': tag.is && outIndex%1 == 0,
                  'bc-ff9800  c-fff': tag.is && outIndex%2 == 0,
                  'bc-green  c-fff': tag.is && outIndex%3 == 0,
                  'bc-1e90ff  c-fff': tag.is && outIndex%4 == 0}">{{tag.tagName}}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'personInfo',
    created: function () {
      this.avatar = this.user.user.avatar;
      this.nickname = this.user.user.nickname;
      this.gender = this.user.user.gender;
      this.mobile = this.user.user.mobile;
      this.signature = this.user.user.signature;
      this.hobbies = this.user.user.hobbies;
    },
    data: function () {
      return {
        isEdit: false,
        isPhone: true,
        tab: 1,
        tags: [],
        avatar: '',
        nickname: '',
        gender: '',
        mobile: '',
        signature: '',
        hobbies: []
      }
    },
    computed: {
      host: function () {
        return this.$store.state.host;
      },
      user: function () {
        return this.$store.state.user.info;
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
      showTags: function () {

        if (this.tags.length > 0) {
          return this.tab = 2;
        }

        this.$loading.show('获取标签...');
        this.$http.get('/common/tags', {}).then((data) => {
          this.$loading.hide();

          if (data.code == 0) {
            data.datas.datas.forEach((item) => {
              item.tags.forEach((tag) => {
                this.hobbies.forEach((value) => {
                  if (tag.id == value.id) {
                    tag.is = true;
                  }
                });
              });
            });
            this.tags = data.datas.datas;
            this.tab = 2;
          } else {
            this.$toast.info('获取标签失败');
          }

        }, () => {
          this.$toast.info('获取标签失败');
          this.$loading.hide();
        });

      },
      hideTags: function () {
        this.tab = 1;
      },
      selectTag: function (outIndex,index) {
        var tag = this.tags[outIndex].tags[index];
        if (tag.is) {
          tag.is = false;
          this.hobbies.forEach((item, i) => {
            if (item.id == tag.id) {
              this.hobbies.splice(i, 1);
            }
          });
        } else {
          tag.is = true;
          this.hobbies.push(tag);
        }
      },
      saveInfo: function () {
        var hobbies = [];
        this.hobbies.forEach(function (item) {
          hobbies.push(item.id);
        });

        this.$loading.show('保存信息中...');
        this.$http.post('/user/update', {data: {
          token: this.$store.state.user.info.token,
          nickname: this.nickname,
          avatar: this.avatar,
          signature: this.signature,
          hobbies: hobbies
        }
        }).
        then((data) => {
          this.$loading.hide();
          if (data.code == 0) {
            this.$store.state.user.info.user.avatar = this.avatar;
            this.$store.state.user.info.user.hobbies = this.hobbies;
            this.$toast.info('保持信息成功');
          } else {
            this.$toast.info('保持信息失败');
          }

        }, () => {
          this.$loading.hide();
          this.$toast.info('保持信息失败');
        });
      }
    },
    watch: {
      'nickname': function (val, oldVal) {
        console.log(oldVal)
        if (oldVal) {
          this.isEdit = true;
        }
      },
      'avatar': function (val, oldVal) {
        console.log(oldVal)
        if (oldVal) {
          this.isEdit = true;
        }
      },
      'mobile': function (val, oldVal) {
        console.log(oldVal)
        if (oldVal) {
          this.isEdit = true;
        }
      },
      'signature': function (val, oldVal) {
        console.log(oldVal)
        if (oldVal) {
          this.isEdit = true;
        }
      },
      'hobbies': function (val, oldVal) {
        console.log(oldVal)
        if (oldVal.length) {
          this.isEdit = true;
        }
      }
    }
  }
</script>

