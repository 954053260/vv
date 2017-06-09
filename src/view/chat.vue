<template>
  <div id="chat" class="container bc-page">
    <div class="chat">
      <ul ref="chatList" class="chat-list">
        <li v-for="item in chats" class="chat-item">
          <div v-if="item.type == 1" class="row">
            <img src="static/img/user.jpg" width="40" height="40">
            <div class="col">
              <p class="name">{{item.name}}</p>
              <p class="text">{{item.text}}</p>
            </div>
          </div>
          <div v-else class="row item-type">
            <div class="col">
              <p class="name tr">{{item.name}}</p>
              <p class="text">{{item.text}}</p>
            </div>
            <img src="static/img/user.jpg" width="40" height="40">
          </div>
        </li>
      </ul>
      <div class="chat-input">
        <label>
          <input @keydown="sendMsg($event)" v-model="msg">
        </label>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name:'app',
    created: function () {

    },
    mounted: function () {

    },
    components: {

    },
    data: function () {
      return {
        msg: '',
        chats: [
          {
            name: '老王',
            text: 'Hello！',
            type: 1
          },
          {
            name: '老王',
            text: '@all 出来水！',
            type: 1
          },
          {
            name: 'tony',
            text: '你好！',
            type: 2
          },
          {
            name: '老赵',
            text: '你是谁？',
            type: 1
          },
          {
            name: '老王',
            text: 'Hello！',
            type: 1
          },
          {
            name: '老王',
            text: '@all 出来水！',
            type: 1
          },
          {
            name: 'tony',
            text: '大水比！',
            type: 2
          },
          {
            name: '老赵',
            text: '大水比大水比大水比？',
            type: 1
          },
          {
            name: 'tony',
            text: '大水比！',
            type: 2
          },
          {
            name: '老赵',
            text: '大水比大水比大水比？',
            type: 1
          }
        ]
      }
    },
    computed: {

    },
    methods: {
      sendMsg: function (e) {
        if (e.keyCode == 13 && this.msg) {
          this.chats.push({
            name: 'tony',
            text: this.msg,
            type: 2
          });
          this.msg = '';
          this.scrollBottom();
        }
      },
      scrollBottom: function () {
        setTimeout(() => {
          var $chatList = this.$refs.chatList;
          $chatList.scrollTop = $chatList.scrollHeight;
        }, 50);
      },
    }
  }
</script>


