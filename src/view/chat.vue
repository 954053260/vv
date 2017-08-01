<template>
  <div id="chat" class="container bc-eee">
    <div class="chat">
      <scroller ref="scroller" :on-refresh="onRefresh">
        <div class="chat-list">
          <div v-for="item in chats" class="chat-item">
            <div v-if="item.fromUserNo == friendUserNo" class="row">
              <img :src="host + item.fromAvatar">
              <div class="col">
                <p class="name" :class="{'c-main': friendType == 2}">{{item.fromNickName}}　{{item.createTime | dateStyle}}</p>
                <p class="text">{{item.content}}</p>
              </div>
            </div>
            <div v-else class="row item-type">
              <div class="col">
                <p class="name tr" :class="{'c-main': user.user.userType && user.user.userType.value == 2}">{{item.createTime | dateStyle}}　{{item.fromNickName}}</p>
                <p class="text">{{item.content}}</p>
              </div>
              <img :src="host + item.fromAvatar">
            </div>
          </div>
        </div>
      </scroller>
    </div>
    <form class="chat-input" target="form-submit">
      <div>
        <label>
          <input type="text" name="test" style="display:none"/>
          <input type="text" ref="input" @focus="scrollBottom" @click="inputScroll($event)" @keydown="keydown($event)" v-model="msg">
        </label>
        <a @click="sendMsg()">发送</a>
      </div>
    </form>
  </div>
</template>
<script type="text/ecmascript-6">
  import vuePullRefresh from 'vue-pull-refresh';
  export default {
    name: 'chat',
    created: function () {
      this.friendUserNo = this.$route.query.friendUserNo;
      this.friendType = this.$route.query.friendType;
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
          this.scrollBottom();
        } else {
          this.$toast.info(data.msg);
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
        friendUserNo: '',
        friendType: ''
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
      inputScroll: function (e) {
        var target = e.target;
        // 使用定时器是为了让输入框上滑时更加自然
        setTimeout(function(){
          target.scrollIntoView(true);
        }, 150);
      },
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
            this.$toast.info(data.msg);
          }
        }, function () {
          this.isLoading = false;
          this.$toast.info('获取消息列表失败');
        });
      },
      onRefresh: function (done) {
        var endTime =  Number(this.chats[0].createTime) - 1;
        this.$http.get('/user/chat/message/history/list', {data: {
          friendUserNo: this.friendUserNo,
          token: this.token,
          count: 10,
          endTime: endTime
        }}).then((data) => {
          done();
          if (data.code == 0) {
            data.datas.messages.sort(function (a, b) {
              return new Date(a.createTime) -  new Date(b.createTime);
            });
            this.chats = data.datas.messages.concat(this.chats);
          } else {
            this.$toast.info(data.msg);
          }
        }, function () {
          done();
          this.$toast.info('获取消息列表失败');
        });
      },
      keydown: function (e) {
        if (e.keyCode == 13) {
          this.sendMsg();
        }
      },
      sendMsg: function () {
        var msg = this.msg;
        if (msg) {
          this.msg = '';
          this.$http.post('/user/chat/message/send', {data: {
            token: this.token,
            toUserNo: this.$route.query.friendUserNo,
            msgType: 1,
            content: msg
          }}).then((data) => {
            if (data.code == 0) {
              this.getMessages();
            } else {
              this.$toast.info(data.msg);
            }
          }, () => {
            this.$toast.info('发送失败');
          });
        }
      },
      scrollBottom: function () {
        setTimeout(() => {
          this.$refs.scroller.scrollTo(0, 9999999);
        }, 50);
      }
    }
  }
</script>


