<template>
  <div id="chat" class="container bc-page">
    <div class="chat" ref="chatList">
      <vue-pull-refresh :on-refresh="onRefresh">
        <div class="chat-list">
          <div v-for="item in chats" class="chat-item">
            <div v-if="item.fromUserNo == friendUserNo" class="row">
              <img :src="host + item.fromAvatar">
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
              <img :src="host + item.fromAvatar">
            </div>
          </div>
        </div>
      </vue-pull-refresh>
    </div>
    <form class="chat-input" target="form-submit">
      <label>
        <input type="text" name="test" style="display:none"/>
        <input type="text" ref="input" @focus="scrollBottom" @keydown="sendMsg($event)" v-model="msg">
      </label>
    </form>
  </div>
</template>
<script type="text/ecmascript-6">
  import vuePullRefresh from 'vue-pull-refresh';
  export default {
    name: 'chat',
    created: function () {
      this.friendUserNo = this.$route.query.friendUserNo;
      this.isLoading = true;
      this.$loading.show('获取消息列表...');
      this.$http.get('/user/chat/message/recent/list', {data: {
        friendUserNo: this.friendUserNo,
        token: this.token,
        count: 10
      }}).then((data) => {
        this.isLoading = false;
        this.$loading.hide();
        if (data.code == 0) {
          this.chats = data.datas.messages;
        } else {
          this.$toast.info('获取消息列表失败');
        }
      }, function () {
        this.isLoading = false;
        this.$loading.hide();
        this.$toast.info('获取消息列表失败');
      });
    },
    mounted: function () {
      this.interval = setInterval(this.getMessages, 1000);
    },
    destroyed: function () {
      clearInterval(this.interval);
    },
    components: {vuePullRefresh},
    data: function () {
      return {
        isLoading: false,
        msg: '',
        chats: [],
        friendUserNo: ''
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
      getMessages: function () {
        var startTime;

        if (this.isLoading) {
          return;
        }

        startTime = Number(this.chats[this.chats.length - 1].createTime) + 1;
        this.isLoading = true;
        this.$http.get('/user/chat/message/recent/list', {data: {
          friendUserNo: this.friendUserNo,
          token: this.token,
          count: 10,
          startTime: startTime
        }}).then((data) => {
          this.isLoading = false;
          if (data.code == 0) {
            this.chats = this.chats.concat(data.datas.messages);
            if (data.datas.messages.length) {
              this.scrollBottom();
            }
          } else {
            this.$toast.info('获取消息列表失败');
          }
        }, function () {
          this.isLoading = false;
          this.$toast.info('获取消息列表失败');
        });
      },
      onRefresh: function () {

        if (this.$refs.chatList.scrollTop != 0) {
          return;
        }

        return new Promise((resolve, reject) => {

          if (this.$refs.chatList.scrollTop != 0) {
            return resolve();
          }

          var endTime =  Number(this.chats[0].createTime) - 1;
          this.$http.get('/user/chat/message/history/list', {data: {
            friendUserNo: this.friendUserNo,
            token: this.token,
            count: 10,
            endTime: endTime
          }}).then((data) => {
            if (data.code == 0) {
              resolve();
              this.chats = data.datas.messages.concat(this.chats);
            } else {
              reject();
              this.$toast.info('获取消息列表失败');
            }
          }, function () {
            reject();
            this.$toast.info('获取消息列表失败');
          });
        });
      },
      sendMsg: function (e) {
        var msg = this.msg;
        if (e.keyCode == 13 && msg) {
          this.msg = '';
          this.$refs.input.blur();
          this.$http.post('/user/chat/message/send', {data: {
            token: this.token,
            toUserNo: this.$route.query.friendUserNo,
            msgType: 1,
            content: msg
          }}).then((data) => {
            if (data.code == 0) {
              this.getMessages();
              this.$refs.input.blur();
            } else {
              this.$toast.info('发送失败');
            }
          }, () => {
            this.$toast.info('发送失败');
          });
        }
      },
      scrollBottom: function () {
        setTimeout(() => {
          var $chatList = this.$refs.chatList;
          $chatList.scrollTop = $chatList.scrollHeight;
        }, 50);
      }
    }
  }
</script>


