<template>
  <div id="home">
    <header class="home-header row">
      <a @click="toggleUserMenu(true)" class="br1-ddd"><i class="icon ion-person c-main"></i></a>
      <input type="text" class="col" placeholder="请输入关键字搜索">
      <a @click="toggleChat(true)" class="bl1-ddd"><i class="icon ion-chatbubbles c-main"></i></a>
    </header>

    <a class="home-refresh-btn" @click="refresh()">
      <i class="icon ion-ios-refresh-empty"></i>
    </a>
    <router-link class="home-plus-btn" to="/app/addActivity">
      <i class="icon ion-android-add"></i>
    </router-link>
    <a class="home-location-btn" @click="location()">
      <i class="icon ion-ios-location-outline"></i>
    </a>
    <a class="home-filter-btn" @click="toggleFilter()">
      <i class="icon ion-ios-settings-strong"></i>
    </a>

    <div class="home-select-content">
      <div class="row">
        <transition name="fade">
          <div v-if="isFilter" class="pr row col z-2">
            <m-select class="col lh30 mr10" :list="userTypeList" v-model="userType"></m-select>
            <m-select class="col lh30 mr10" :list="typeList" v-model="type"></m-select>
            <m-select class="col lh30" :list="dateList" v-model="date"></m-select>
          </div>
        </transition>
      </div>
    </div>

    <div v-if="isUserMenu" class="mask" @click="toggleUserMenu(false)"></div>
    <transition name="slide-left">
      <div v-if="isUserMenu" class="home-user-menu">
        <div class="p20-10 bc-main">
          <router-link to="/app/personInfo">
            <img src="../assets/user.jpg" class="dp-ib vm w40 h40 brp50">
            <span class="dp-ib vm f20 c-fff">Tony</span>
          </router-link>
        </div>
        <ul class="list">
          <li class="item item-icon-right">
            <router-link to="/app/personActivity?type=1">
              <span class="fl"><i class="home-user-menu-icon-left icon ion-person-add c-main"></i></span>
              参与的活动
              <i class="icon ion-ios-arrow-right f20"></i>
            </router-link>
          </li>
          <li class="item item-icon-right">
            <router-link to="/app/personActivity?type=2">
              <span class="fl"><i class="home-user-menu-icon-left icon ion-paper-airplane c-main"></i></span>
              发布的活动
              <i class="icon ion-ios-arrow-right f20"></i>
            </router-link>
          </li>
          <li class="item item-icon-right">
            <router-link to="/app/personActivity?type=3">
              <span class="fl"><i class="home-user-menu-icon-left icon ion-heart c-main"></i></span>
              收藏的活动
              <i class="icon ion-ios-arrow-right f20"></i>
            </router-link>
          </li>
          <li class="item item-icon-right">
            <router-link to="/app/about">
              <span class="fl"><i class="home-user-menu-icon-left icon ion-information-circled c-main"></i></span>
              关于我们
              <i class="icon ion-ios-arrow-right f20"></i>
            </router-link>
          </li>
        </ul>
      </div>
    </transition>

    <div v-if="isChat" class="mask" @click="toggleChat(false)"></div>
    <transition name="slide-right">
      <div v-if="isChat" class="home-chat">
        <ul ref="chatList" class="home-chat-list">
          <li v-for="item in chats" class="home-chat-item">
            <div v-if="item.type == 1" class="row">
              <img src="../assets/user.jpg" width="40" height="40">
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
              <img src="../assets/user.jpg" width="40" height="40">
            </div>
          </li>
        </ul>
        <div class="home-chat-input">
          <label>
            <input @keydown="sendMsg($event)" v-model="msg">
          </label>
        </div>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
  import mSelect from '../common/mSelect.vue'
  import {mapState} from 'vuex'

  export default {
    name: 'home',
    created: function () {

    },
    components: {mSelect},
    data: function () {
      return {
        userTypeList: [ '好友', '个人','群体'],
        userType: '好友',
        type: '全部',
        typeList: ['全部', '运动', '文化', '学习', '娱乐', '工业', '旅行', '商业', '其他'],
        type: '全部',
        dateList: ['全部', '当天', '一周内', '一月内'],
        date: '全部',
        isFilter: false,
        isUserMenu: false,
        isChat: false,
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
        ],
        msg: ''
      }
    },
    computed: mapState({
      user:  state => state.user.info,
    }),
    methods: {
      refresh: function () {
        this.$loading.show('刷新活动...');
        setTimeout(() => {
          this.$loading.hide();
        }, 1000);
      },
      location: function () {
        this.$loading.show('定位中...');
        this.$map.loadMap((map) => {
          map.doLocation(
                  (data) => {
                    this.$toast.info('定位成功');
                    this.$loading.hide();
                  },
                  (data) => {
                    this.$toast.info('定位失败');
                    this.$loading.hide();
                  }
          );
        });

      },
      toggleFilter: function () {
        this.isFilter = !this.isFilter;
      },
      toggleUserMenu: function (bool) {

        if (this.user.token) {

          if (typeof bool === 'boolean') {
            this.isUserMenu = bool;
          } else {
            this.isUserMenu = !this.isUserMenu;
          }

        } else {

          this.$router.push('/app/login');

        }

      },
      toggleChat: function (bool) {
        if (typeof bool === 'boolean') {
          this.isChat = bool;
        } else {
          this.isChat = !this.isChat;
        }

        if (this.isChat) {
          this.scrollBottom();
        }

      },
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
      }
    }
  }
</script>
