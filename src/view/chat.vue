<template>
  <div id="chat" class="container bc-page">
    <div class="chat" ref="chatList">
      <vue-pull-refresh :on-refresh="onRefresh">
        <ul class="chat-list">
          <li v-for="item in chats" class="chat-item">
            <div v-if="item.toUserNo == token" class="row">
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
          </li>
        </ul>
      </vue-pull-refresh>
    </div>
    <form class="chat-input" target="form-submit">
      <label>
        <input type="text" @keydown="sendMsg($event)" v-model="msg">
      </label>
    </form>
    <iframe name="form-submit" style="display:none;"></iframe>
  </div>
</template>
<script type="text/ecmascript-6">
  import vuePullRefresh from 'vue-pull-refresh';
  export default {
    name:'app',
    created: function () {
      this.$loading.show('获取消息列表...');
      this.getMessages(() => {
        this.$loading.hide();
      }, () => {
        this.$loading.hide();
      });
    },
    mounted: function () {
      var isLoad = false;

      this.interval = setInterval(() => {
        if (isLoad) return;
        isLoad = true;
        this.$http.get('/user/chat/message/list', {data: {
          friendUserNo: this.$route.query.friendUserNo,
          token: this.token,
          pageNumber: 1,
          pageSize: 20
        }}).then((data) => {
          if (data.code == 0) {
             var last = this.chats[this.chats.length - 1];
            data.datas.page.content.forEach((item) => {
              if (!last || new Date(item.createTime) > new Date(last.createTime)) {
                this.chats.push(item);
              }
            });

            this.chats.sort(function (a, b) {
              return new Date(a.createTime) -  new Date(b.createTime);
            });

            if (this.isToBottom) {
              this.isToBottom = false;
              this.scrollBottom();
            }
          } else {
            this.$toast.info('获取消息列表失败');
          }

          isLoad = false;
        }, function () {
          isLoad = false;
          this.$toast.info('获取消息列表失败');
        });
      }, 1000);
    },
    destroyed: function () {
      clearInterval(this.interval);
    },
    components: {vuePullRefresh},
    data: function () {
      return {
        msg: '',
        pageNumber: 1,
        hasData: true,
        chats: [],
        isToBottom: false
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
      getMessages: function (success, fail) {
        if (!this.hasData) {
          setTimeout(() => {
            success();
          },1000);
          return;
        }

        this.$http.get('/user/chat/message/list', {data: {
          friendUserNo: this.$route.query.friendUserNo,
          token: this.token,
          pageNumber: this.pageNumber,
          pageSize: 10
        }}).then((data) => {
          if (data.code == 0) {
            success();
            var last = this.chats[this.chats.length - 1];
            data.datas.page.content.forEach((item) => {
              if (!last || new Date(item.createTime) > new Date(last.createTime)) {
                this.chats.push(item);
              }
            });

            this.chats.sort(function (a, b) {
              return new Date(a.createTime) -  new Date(b.createTime);
            });

            if (data.datas.page.content.length > 10) {
              this.hasData = false;
            }

          } else {
            fail();
            this.$toast.info('获取消息列表失败');
          }
        }, function () {
          this.$toast.info('获取消息列表失败');
          fail();
        });
      },
      onRefresh: function () {
        return new Promise((resolve, reject) => {
          this.getMessages(resolve, reject);
        });
      },
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
              this.msg = '';
              this.isToBottom = true;
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
      }
    }
  }
</script>


