<template>
  <div id="chat" class="container bc-page">
    <div class="chat">
      <ul ref="chatList" class="chat-list">
        <li v-for="item in chats" class="chat-item">
          <div v-if="item.toUserNo == token" class="row">
            <img :src="host + item.fromAvatar" width="40" height="40">
            <div class="col">
              <p class="name">{{item.fromNickName}}</p>
              <p class="text">{{item.content}}</p>
            </div>
          </div>
          <div v-else class="row item-type">
            <div class="col">
              <p class="name tr">{{item.fromNickName}}</p>
              <p class="text">{{item.content}}</p>
            </div>
            <img :src="host + item.fromAvatar" width="40" height="40">
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
      this.$loading.show('获取消息列表...');
      this.$http.get('/user/chat/message/list', {data: {
        friendUserNo: this.$route.query.friendUserNo,
        token: this.token,
        pageNumber: 1,
        pageSize: 10
      }}).then((data) => {
        this.$loading.hide();
        if (data.code == 0) {
          this.chats = this.chats.concat(data.datas.page.content);
          this.chats.sort(function (a, b) {
            return a.createTime > b.createTime;
          });
        } else {
          this.$toast.info('获取消息列表失败');
        }
      }, function () {
        this.$loading.hide();
        this.$toast.info('获取消息列表失败');
      })
    },
    mounted: function () {

    },
    components: {

    },
    data: function () {
      return {
        msg: '',
        chats: []
      }
    },
    computed: {
      host: function () {
        return this.$store.state.host;
      },
      user:  function () {
        return this.$store.state.user.info;
      },
      token: function () {
        return this.$store.state.user.info.token;
      }
    },
    methods: {
      sendMsg: function (e) {
        if (e.keyCode == 13 && this.msg) {
          this.$loading.show('发送消息');
          this.$http.post('/user/chat/message/send', {data: {
            token: this.token,
            toUserNo: this.$route.query.friendUserNo,
            msgType: 1,
            content: this.msg
          }}).then((data) => {
            this.$loading.hide();
            if (data.code == 0) {
              this.chats.push({
                name: 'tony',
                fromAvatar: this.user.user.avatar,
                fromNickName: this.user.user.nickname,
                content: this.msg,
                createTime: new Date().getTime()
              });
              this.msg = '';
              this.scrollBottom();
            } else {
              this.$toast.info('发送失败');
            }
          }, () => {
            this.$loading.hide();
            this.$toast.info('发送失败');
          });

        }
      },
      scrollBottom: function () {
        setTimeout(() => {
          var $chatList = this.$refs.chatList;
          $chatList.scrollTop = $chatList.scrollHeight;
        }, 50);
      },
      getChats: function () {

      }
    }
  }
</script>


