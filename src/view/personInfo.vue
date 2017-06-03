<template>
  <div id="personInfo" class="container bc-page">
    <header class="p20-10 tc bc-main">
      <img src="../assets/user.jpg" class="db-ib vm w100 h100 brp50">
    </header>
    <ul class="list">
      <li class="pi-item item mt10">
        <label class="row lh30">
          <span class="dp-ib w70 tr">昵称：</span>
          <input class="col c-666" type="text" placeholder="请输入昵称" v-model="user.name">
        </label>
      </li>
      <li class="pi-item item">
        <label class="row lh30">
          <span class="dp-ib w70 tr">性别：</span>
          <input class="col c-666" type="text" placeholder="请选择性别" v-model="user.sex">
        </label>
      </li>
      <li class="pi-item item">
        <label class="row lh30">
          <span class="dp-ib w70 tr">手机号：</span>
          <input class="col c-666" type="text" placeholder="请输入手机号" v-model="user.phone">
        </label>
      </li>
      <li class="pi-item item mt10">
        <label class="row lh30">
          <span class="dp-ib w70 tr">个性签名：</span>
          <input class="col c-666" type="text" placeholder="添加个性签名" v-model="user.introduce">
        </label>
      </li>
      <li class="pi-item item">
        <label class="row lh30">
          <span class="dp-ib w70 tr">兴趣爱好：</span>
          <input class="col c-666" type="text" placeholder="添加兴趣爱好，逗号隔开" v-model="user.hobby">
        </label>
      </li>
    </ul>
    <div class="m20 pt20">
      <button class="btn btn-full bc-main c-fff" @click="saveInfo">保存</button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'personInfo',
    created: function () {

    },
    data: function () {
      return {
        user: {
          name: 'Tony',
          sex: '男',
          phone: 18828282838,
          introduce: '失败是成功之母，go! go！go！',
          hobby:'读书、电影、游戏、旅游、篮球'
        }
      }
    },
    computed: {},
    methods: {
      saveInfo: function () {
        this.$router.back();
      }
    }
  }
</script>

