<template>
  <div id="evaluate" class="container">

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
        score: 10,
        content: '',
        images: []
      }
    },
    computed: {
      host: function () {
        return this.$store.state.host;
      },
      scoreList: function () {
        var list = [0, 0, 0, 0, 0], i;

        for(i = 0;i < parseInt(this.score/2); i++) {
          list[i] = 2;
        }

        return list;
      }
    },
    methods: {
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
      mark: function (number) {
        this.score = number*2;
      },
      submit: function () {
        this.$loading.show('提交评价...');
            this.$http.post('/user/activity/evaluate/publish', {
              data: {
                token: this.$store.state.user.info.token,
                activityPartakeId: this.$route.query.activityPartakeId,
                score: this.score,
                content: this.content,
                images: this.images.join()
              }
            }).then((data) => {
              this.$loading.hide();
              if (data.code == 0) {
                this.$toast.info('提交评价成功');
                this.$router.back();
              } else {
                this.$toast.info('提交评价失败');
              }
            }, () => {
              this.$toast.info('提交评价失败');
              this.$loading.hide();
            });
      }
    }
  }
</script>
<style scoped>

</style>
