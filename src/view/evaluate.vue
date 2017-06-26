<template>
  <div id="evaluate" class="container">
    <p class="m20 tc">{{title}}</p>
    <div class="m20">
      <div class="tc c-main" style="font-size: 30px">
        <i v-for="(item, index) in scoreList" class="icon ml10 mr10"
           :class="{'ion-ios-star': item == 2, 'ion-ios-star-half': item == 1, 'ion-ios-star-outline': item == 0}"
           @click="mark(index + 1)"></i>
        <p class="fl lh40 f16 c-666">评分</p>
      </div>
    </div>
    <div class="m20 p10 b1-ddd">
      <textarea class="w h100 b-none" placeholder="请输入评价" style="resize: none"></textarea>
    </div>
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
        score: 10
      }
    },
    computed: {
      scoreList: function () {
        var list = [0, 0, 0, 0, 0], i;

        for(i = 0;i < parseInt(this.score/2); i++) {
          list[i] = 2;
        }

        return list;
      }
    },
    methods: {
      mark: function (number) {
        this.score = number*2;
      },
      back: function () {

      }
    }
  }
</script>
<style scoped>

</style>
