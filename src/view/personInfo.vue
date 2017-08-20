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
                <span v-if="user.user.userType && user.user.userType.value == 2" class="col c-main tr">{{nickname}}</span>
                <label v-else class="col pr">
                    <input class="c-999" type="text" placeholder="请输入昵称" v-model="nickname" maxlength="10"
                           @focus="isNickname = true" @blur="validateNickname()">
                    <p v-show="!isNickname" class="pi-point">昵称长度2-20字符！</p>
                </label>
            </li>
            <li class="pi-item row">
              <span>性别</span>
              <span class="col c-999 tr">{{(gender && gender.desc) || '身份认证确定性别'}}</span>
            </li>
            <li class="pi-item row">
              <span>手机号</span>
              <span class="col c-999 tr">{{mobile}}</span>
              <!--<label class="col pr" style='display: none'>-->
                <!--<input class="c-999" type="number" placeholder="请输入手机号" v-model="mobile"-->
                       <!--@focus="isPhone = true" @blur="validatePhone()">-->
                <!--<p v-show="!isPhone" class="pi-point">请输入正确的手机号！</p>-->
              <!--</label>-->
            </li>
            <li class="pi-item pi-item-auto row">
              <span>个性签名</span>
              <a class="col c-999 tr" @click="showSignature">
                {{signature || '添加个性签名'}}
              </a>
            </li>
            <li class="pi-item pi-item-auto row">
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
      <div class="pi-page-header bb1-eee">
        <a class="fr" @click="tab = 1">
          <span>完成</span>
          <img src="static/icon/icon-complete.png">
        </a>
        <p class="f18">你对什么感兴趣？</p>
        <p class="mt10 c-999">选择你想要看到的内容吧</p>
      </div>
      <div v-for="(item, outIndex) in tags"
           :class="{'c-main': outIndex%1 == 0, 'c-ff9800': outIndex%2 == 0, 'c-green': outIndex%3 == 0, 'c-1e90ff': outIndex%4 == 0}">
        <p class="p10 fb">{{item.tagCategoryName}}</p>
        <div class="clear-float">
            <span v-for="(tag, index) in item.tags" class="pi-tag" @click="selectTag(outIndex, index)"
                  :class="{'bc-main  c-fff': tag.is && outIndex%1 == 0,
                  'bc-ff9800  c-fff': tag.is && outIndex%2 == 0,
                  'bc-green  c-fff': tag.is && outIndex%3 == 0,
                  'bc-1e90ff  c-fff': tag.is && outIndex%4 == 0,
                  'type': item.tagCategoryName == '运动'}">{{tag.tagName}}</span>
        </div>
      </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-show="tab == 3" class="bc-fff h f16">
        <div class="pi-page-header">
          <a class="fr" @click="tab = 1">
            <span>完成</span>
            <img src="static/icon/icon-complete.png">
          </a>
          <p class="f18">有趣的签名显个性</p>
          <p class="mt10 c-999">请填写你的签名吧</p>
        </div>
        <div class="pr bt1-eee bb1-eee p20">
          <textarea class="w b-none c-999" type="text" placeholder="添加个性签名" v-model="signature" style="resize: none; min-height: 1.3333333333333333rem"></textarea>
          <span class="pa c-666" style="bottom: 0.2666666rem; right: 0.2666666rem;">{{signature.length}}/20</span>
        </div>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'personInfo',
    created: function () {
      this.avatar = this.user.user.avatar || '';
      this.nickname = this.user.user.nickname || '';
      this.gender = this.user.user.gender || '';
      this.mobile = this.user.user.mobile || '';
      this.signature = this.user.user.signature || '';
      this.hobbies = this.user.user.hobbies || [];
    },
    data: function () {
      return {
        isEdit: false,
        isNickname: true,
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
      validateNickname: function () {
        var length = this.nickname.replace(/[^\x00-\xff]/g,"aa").length;
        if (length < 2 || length > 20) {
          this.isNickname = false;
        } else {
          this.isNickname = true;
        }
      },
      validatePhone: function () {
        if (!/^1(3|4|5|7|8)\d{9}$/g.test(this.mobile)) {
          this.isPhone = false;
        } else {
          this.isPhone = true;
        }
      },
      uploadAvatar: function () {
        this.$file.upload({
          max: 1,
          success: (data) => {
            this.$loading.show('上传图片');
            this.$store.dispatch('fileUpload', data)
                    .then((data) => {
                      this.$loading.hide();
                      this.avatar = data.datas.uris[0];
                    }, () => {
                      this.$loading.hide();
                      this.$toast.info('上传失败');
                    });
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
            this.$toast.info(data.msg);
          }

        }, () => {
          this.$toast.info('获取标签失败');
          this.$loading.hide();
        });

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
      showSignature: function () {
        this.tab = 3;
      },
      saveInfo: function () {
         var hobbies = [];
         var param = {token: this.$store.state.user.info.token};

        if (!this.isEdit) {
          return;
        }
     
        this.hobbies.forEach(function (item) {
          hobbies.push(item.id);
        });

        param.hobbies = hobbies.join();
        this.avatar && (param.avatar = this.avatar);
        this.nickname && (param.nickname = this.nickname);
        this.signature && (param.signature = this.signature);
        // this.mobile && (data.mobile = this.mobile);
        this.$loading.show('保存信息中...');
        this.$http.post('/user/update', {data: param}).
        then((data) => {
          this.$loading.hide();
          if (data.code == 0) {
            param.nickname && (this.$store.state.user.info.user.nickname = param.nickname);
            param.signature && (this.$store.state.user.info.user.signature = param.signature);
            param.avatar && (this.$store.state.user.info.user.avatar = param.avatar);
            this.$store.state.user.info.user.hobbies = this.hobbies;
            this.$router.back();
            this.$toast.info('保存信息成功');
          } else {
            this.$toast.info(data.msg);
          }

        }, () => {
          this.$loading.hide();
          this.$toast.info('保存信息失败');
        });
      }
    },
    watch: {
      'tab': function () {
        switch (String(this.tab)) {
          case '1':
            document.title = '个人中心';
            break;
          case '2':
            document.title = '兴趣爱好';
            break;
          case '3':
            document.title = '个性签名';
            break;
        }
      },
      'nickname': function (val, oldVal) {
        if (oldVal) {
          this.isEdit = true;
        }
      },
      'avatar': function (val, oldVal) {
        if (oldVal) {
          this.isEdit = true;
        }
      },
      'mobile': function (val, oldVal) {
        if (oldVal) {
          this.isEdit = true;
        }
      },
      'signature': function (val, oldVal) {
        if (val.length > 20) {
          this.signature = this.signature.substr(0, 20);
        }
        if (oldVal) {
          this.isEdit = true;
        }
      },
      'hobbies': function (val, oldVal) {
        if (oldVal.length) {
          this.isEdit = true;
        }
      }
    }
  }
</script>

