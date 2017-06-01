<template>
  <div id="home">
    <header class="header row">
      <a @click="toggleUserMenu(true)" class="br1-ddd"><i class="icon ion-person c-main"></i></a>
      <input type="text" class="col" placeholder="请输入关键字搜索">
      <a @click="toggleChat(true)" class="bl1-ddd"><i class="icon ion-chatbubbles c-main"></i></a>
    </header>
    <a class="refresh-btn" @click="refresh()">
      <i class="icon ion-android-refresh"></i>
    </a>
    <router-link class="plus-btn" to="/app/addActivity">
      <i class="icon ion-paper-airplane"></i>
    </router-link>
    <a class="location-btn" @click="location()">
      <i class="icon ion-pinpoint"></i>
    </a>
    <a class="filter-btn" @click="toggleFilter()">
      <i class="icon " :class="{'ion-arrow-left-a': showFilter, 'ion-arrow-right-a': !showFilter}"></i>
    </a>
    <div class="select-content">
      <div class="row">
        <transition name="fade">
          <div v-if="showFilter" class="pr row col z-2">
            <m-select class="col lh30 mr10" :list="userTypeList" v-model="userType"></m-select>
            <m-select class="col lh30 mr10" :list="typeList" v-model="type"></m-select>
            <m-select class="col lh30" :list="dateList" v-model="date"></m-select>
          </div>
        </transition>
      </div>
    </div>
    <div v-if="showUserMenu" class="mask" @click="toggleUserMenu(false)"></div>
    <transition name="slide-left">
      <div v-if="showUserMenu" class="user-menu">
        <div class="p20-10 bc-main">
          <router-link to="/app/personInfo">
            <img src="../assets/user.jpg" class="dp-ib vm w40 h40 brp50">
            <span class="dp-ib vm f20 c-fff">Tony</span>
          </router-link>
        </div>
        <ul class="list">
          <li class="item item-icon-right">
            <router-link to="/app/personActivity?type=1">
              <span class="fl"><i class="user-menu-icon-left icon ion-person-add c-main"></i></span>
              参与的活动
              <i class="icon ion-ios-arrow-right f20"></i>
            </router-link>
          </li>
          <li class="item item-icon-right">
            <router-link to="/app/personActivity?type=2">
              <span class="fl"><i class="user-menu-icon-left icon ion-paper-airplane c-main"></i></span>
              发布的活动
              <i class="icon ion-ios-arrow-right f20"></i>
            </router-link>
          </li>
          <li class="item item-icon-right">
            <router-link to="/app/personActivity?type=3">
              <span class="fl"><i class="user-menu-icon-left icon ion-heart c-main"></i></span>
              收藏的活动
              <i class="icon ion-ios-arrow-right f20"></i>
            </router-link>
          </li>
          <li class="item item-icon-right">
            <router-link to="/app/about">
              <span class="fl"><i class="user-menu-icon-left icon ion-information-circled c-main"></i></span>
              关于我们
              <i class="icon ion-ios-arrow-right f20"></i>
            </router-link>
          </li>
        </ul>
      </div>
    </transition>
    <div v-if="showChat" class="mask" @click="toggleChat(false)"></div>
    <transition name="slide-right">
      <div v-if="showChat" class="chat">
        <ul ref="chatList" class="chat-list">
          <li v-for="item in chats" class="chat-item">
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
        <div class="chat-input">
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
      this.$map.loadMap((map) => {
        map.doLocation();

        var markers = [
          {
            no: 1,
            iconColor: 'blue',
            title: '活动1',
            center: '113.0759,22.9170'
          },
          {
            no: 2,
            iconColor: 'blue',
            title: '活动2',
            center: '113.2769,23.1170'
          },
          {
            no: 3,
            iconColor: 'red',
            title: '活动3',
            center: '113.4779,23.3170'
          },
          {
            no: 4,
            iconColor: 'red',
            title: '活动4',
            center: '113.0759,23.1170'
          },
          {
            no: 5,
            iconColor: 'red',
            title: '活动5',
            center: '113.2769,22.9670'
          },
          {
            no: 6,
            iconColor: 'red',
            title: '活动6',
            center: '113.4779,23.0170'
          }
        ];

        markers.forEach((item) => {
          var marker = map.createMarker(item);
          this.markers.push(marker);
          AMap.event.addListener(marker, 'click', () => {
            this.$toast.info(item.title);
          });
        });

      });
    },
    components: {mSelect},
    data: function () {
      return {
        markers: [],
        userTypeList: [ '好友', '个人','群体'],
        userType: '好友',
        type: '全部',
        typeList: ['全部', '运动', '文化', '学习', '娱乐', '工业', '旅行', '商业', '其他'],
        type: '全部',
        dateList: ['全部', '当天', '一周内', '一月内'],
        date: '全部',
        showFilter: false,
        showUserMenu: false,
        showChat: false,
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
      user:  state => state.user.user,
    }),
    methods: {
      refresh: function () {
        this.$loading.show('刷新活动...');
        setTimeout(() => {
          this.$map.gd.remove(this.markers);
          this.$loading.hide();
        }, 1000);
      },
      location: function () {
        this.$loading.show('定位中...');
        this.$map.doLocation( (data) => {
          this.$toast.info(data.msg);
          this.$loading.hide();
        });
      },
      toggleFilter: function () {
        this.showFilter = !this.showFilter;
      },
      toggleUserMenu: function (bool) {

        if (this.$store.state.user.user.phone) {

          if (typeof bool === 'boolean') {
            this.showUserMenu = bool;
          } else {
            this.showUserMenu = !this.showUserMenu;
          }

        } else {
          this.$login.show((data) => {
            this.$store.state.user.user = {
              phone: '18675823512',
              name: 'Tony'
            };
          });
        }

      },
      toggleChat: function (bool) {
        if (typeof bool === 'boolean') {
          this.showChat = bool;
        } else {
          this.showChat = !this.showChat;
        }

        if (this.showChat) {
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
<style scoped>
  #home{
    height: 100%;
    overflow: auto;
  }
  .header{
    position: fixed;
    top: 10px;
    left: 10px;
    right: 10px;
    padding: 5px 0;
    background: #fff;
    box-shadow: 0 0 5px #aaa;
    border-radius: 4px;
  }
  .header > a{
    width: 40px;
    font-size: 23px;
    text-align: center;
  }
  .header > input{
    padding: 0 10px;
    line-height: 26px;
    border: none;
  }
  .refresh-btn,
  .plus-btn,
  .location-btn,
  .filter-btn{
    position: fixed;
    z-index: 1000;
    text-align: center;
    background: #fff;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    box-shadow: 0 0 5px #aaa;
  }
  .refresh-btn i,
  .plus-btn i,
  .location-btn i,
  .filter-btn i{
    font-size: 20px;
    color: #2bd3b2;
  }
  .filter-btn{
    left: 15px;
    top: 65px;
    line-height: 35px;
  }
  .refresh-btn{
    left: 15px;
    bottom: 40px;
    line-height: 36px;
  }
  .plus-btn{
    right: 15px;
    top: 65px;
    line-height: 35px;
  }
  .location-btn{
    right: 15px;
    bottom: 40px;
    line-height: 35px;
  }
  .filter-btn{
    text-align: center;
    background: #fff;
    width: 35px;
    height: 35px;
    line-height: 37px;
    border-radius: 50%;
    box-shadow: 0 0 5px #aaa;
  }
  .select-content{
    position: fixed;
    top: 65px;
    left: 60px;
    right: 60px;
  }
  .user-menu{
   position: relative;
    z-index: 10000;
    margin-right: auto;
    width: 80%;
    height: 100%;
    background: #fff;
    overflow: auto;
  }
  .user-menu-icon-left{
    position: relative;
    top: -4px;
    padding-right: 10px;
    font-size: 20px;
  }
  .user-menu-icon-left.ion-person-add{
    right: -3px;
  }
  .chat{
    position: relative;
    z-index: 10000;
    margin-left: auto;
    width: 80%;
    height: 100%;
    background: #ddd;
  }
  .chat-list{
    padding: 0 10px;
    height: 100%;
    overflow: auto;
  }
  .chat-item{
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .chat-item:last-child{
    margin-bottom: 72px;
  }
  .chat-item img{
    border-radius: 4px;
  }
  .chat-item .col{
    padding-left: 10px;
    overflow: hidden;
  }
  .chat-item .item-type .col{
    padding-left: 0;
    padding-right: 10px;
  }
  .chat-item .name{
    font-size: 12px;
    color: #666;
  }
  .chat-item .text{
    position: relative;
    display: inline-block;
    margin-top: 5px;
    padding: 10px;
    font-size: 14px;
    color: #333;
    background: #fff;
    border-radius: 4px;
  }
  .chat-item .text:before{
    content: '';
    position: absolute;
    top: 5px;
    left: -8px;
    width: 0;
    height: 0;
    font-size: 0;
    border-bottom: 6px solid rgba(0, 0, 0, 0);
    border-top: 6px solid rgba(0, 0, 0, 0);
    border-right: 9px solid #FFF;
    border-left: none;
  }
  .chat-item .item-type .text{
    float: right;
    color: #fff;
    background: #25A5F7;
  }
  .chat-item .item-type .text:before{
    left: inherit;
    right: -8px;
    border-bottom:6px solid rgba(0, 0, 0, 0);
    border-top:6px solid rgba(0, 0, 0, 0);
    border-left: 9px solid #25A5F7;
    border-right: none;
  }
  .chat-input{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  .chat-input label{
    display: block;
    margin: 5px 10px;
    border-radius: 4px;
  }
  .chat-input input{
    text-indent: 5px;
    width: 100%;
    line-height: 30px;
    border: none;
    background: #fff;
  }
</style>
