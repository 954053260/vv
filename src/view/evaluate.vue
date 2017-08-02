<template>
  <div id="evaluate" class="container bc-page">
    <p class="evaluate-content f16 c-999">我们期待你的每一个活动反馈</p>
    <div class="bc-fff bt1-eee">
      <p class="evaluate-content f18">综合评分</p>
      <div class="evaluate-mark-content">
        <div class="row">
          <p class="text">描述相符</p>
          <div class="col">
            <a v-for="(item, index) in trueScoreList" class="mark" @click="mark('true', index + 1)">
              <img v-if="item == 0" src="static/icon/icon-mark-3.png">
              <img v-if="item == 1" src="static/icon/icon-mark-2.png">
              <img v-if="item == 2" src="static/icon/icon-mark-1.png">
            </a>
          </div>
        </div>
        <div class="row">
          <p class="text">活动环境</p>
          <div class="col">
            <a v-for="(item, index) in environmentScoreList" class="mark" @click="mark('environment', index + 1)">
              <img v-if="item == 0" src="static/icon/icon-mark-3.png">
              <img v-if="item == 1" src="static/icon/icon-mark-2.png">
              <img v-if="item == 2" src="static/icon/icon-mark-1.png">
            </a>
          </div>
        </div>
        <div class="row">
          <p class="text">服务态度</p>
          <div class="col">
            <a v-for="(item, index) in serviceScoreList" class="mark" @click="mark('service', index + 1)">
              <img v-if="item == 0" src="static/icon/icon-mark-3.png">
              <img v-if="item == 1" src="static/icon/icon-mark-2.png">
              <img v-if="item == 2" src="static/icon/icon-mark-1.png">
            </a>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="bc-fff bt1-eee">-->
      <!--<p class="evaluate-content f18">活动标签</p>-->
      <!--<div class="evaluate-content-tag">-->
        <!--<div class="row" v-for="(tag, outer) in tags">-->
          <!--<div class="col" :class="{active: item.check, ml10: index, mr10: !index}" v-for="(item, index) in tag"-->
               <!--@click="selectTag(outer, index)">-->
            <!--{{item.text}}-->
            <!--<img v-if="item.check" src="static/icon/icon-check.png">-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <div class="bc-fff bt1-eee">
      <p class="evaluate-content f18">活动评价</p>
      <div class="evaluate-content-area">
        <textarea v-model="content" :class="{'c-000': content, 'c-999': !content}" placeholder="请描述你参加活动的过程，比如：活动氛围如何，活动怎样，我们期待你的建议"></textarea>
        <span class="point">{{content.length}}/200</span>
      </div>
    </div>
    <a class="au-btn" @click="submit">提交评价</a>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'evaluate',
    created: function () {
      this.title = this.$route.query.title;
    },
    data: function () {
      return {
        title: '',
        trueScore: 10,
        environmentScore: 10,
        serviceScore: 10,
        content: '',
//        tags: [
//          [{text: '主办方帮帮哒', check: false}, {text: '主办方不咋地', check: false}],
//          [{text: '环境高大上', check: false}, {text: '环境一般般', check: false}],
//          [{text: '活动准时开办', check: false}, {text: '活动开办延时', check: false}],
//          [{text: '气氛一级棒', check: false}, {text: '气氛尴尬', check: false}],
//          [{text: '帅哥美女敲鸡多', check: false}, {text: '没几个人参加', check: false}]
//        ],
        images: []
      }
    },
    computed: {
      host: function () {
        return this.$store.state.host;
      },
      trueScoreList: function () {
        var list = [0, 0, 0, 0, 0], i;

        for(i = 0;i < parseInt(this.trueScore/2); i++) {
          list[i] = 2;
        }

        return list;
      },
      environmentScoreList: function () {
        var list = [0, 0, 0, 0, 0], i;

        for(i = 0;i < parseInt(this.environmentScore/2); i++) {
          list[i] = 2;
        }

        return list;
      },
      serviceScoreList: function () {
        var list = [0, 0, 0, 0, 0], i;

        for(i = 0;i < parseInt(this.serviceScore/2); i++) {
          list[i] = 2;
        }

        return list;
      }
    },
    methods: {
      selectTag: function (outer, index) {
        this.tags[outer][index].check = !this.tags[outer][index].check;
      },
      addImg: function () {
        if (this.images.length < 6) {
          this.$file.upload({
            success: (data, type) => {
              this.$loading.show('上传图片');
              this.$store.dispatch('fileUpload', data)
                      .then((data) => {
                        this.$loading.hide();
                        this.images = this.images.concat(data.datas.uris);
                      }, () => {
                        this.$loading.hide();
                        this.$toast.info('上传失败');
                      })
            },
            fail: () => {
              this.$toast.info('上传失败');
            }
          });
        } else {
          this.$toast.info('最多上传5张');
        }
      },
      mark: function (type, number) {
        switch (type) {
          case 'true':
            this.trueScore =  number*2;
                break;
          case 'environment':
            this.environmentScore =  number*2;
            break;
          case 'service':
            this.serviceScore =  number*2;
            break;
        }
      },
      submit: function () {
        if (!this.content) {
         this.$toast.info('评价内容不能为空！');
         return;
        }

        this.$loading.show('提交评价...');
            this.$http.post('/user/activity/evaluate/publish', {
              data: {
                token: this.$store.state.user.info.token,
                activityPartakeId: this.$route.query.activityPartakeId,
                score: (this.trueScore + this.environmentScore + this.serviceScore)/6,
                content: this.content,
                images: this.images.join()
              }
            }).then((data) => {
              this.$loading.hide();
              if (data.code == 0) {
                this.$toast.info('提交评价成功');
                this.$router.back();
              } else {
                this.$toast.info(data.msg);
              }
            }, () => {
              this.$toast.info('提交评价失败');
              this.$loading.hide();
            });
      }
    },
    watch: {
      'content': function (val) {
        if (val.length > 200) {
          this.content = this.content.substr(0, 200);
        }
      }
    }
  }
</script>
<style scoped>

</style>
