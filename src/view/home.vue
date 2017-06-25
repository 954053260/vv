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
    <a class="home-plus-btn" @click="addActivity">
      <i class="icon ion-android-add"></i>
    </a>
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
            <m-select class="col lh30 mr10" :list="activityOrganizationTypes" bindValue="desc" v-model="organizationTypesIndex"
                      @input="changeOrganization"></m-select>
            <m-select class="col lh30 mr10" :list="activityTypes" bindValue="desc" v-model="typeIndex"
                      @input="changeTypes"></m-select>
            <m-select class="col lh30" :list="dateRange" bindValue="desc" v-model="dateIndex"
                      @input="changeRange"></m-select>
          </div>
        </transition>
      </div>
    </div>
    <div v-if="isUserMenu" class="mask z-999" @click="toggleUserMenu(false)"></div>
    <transition name="slide-left">
      <div v-if="isUserMenu" class="home-user-menu">
        <div class="p20-10 bc-main">
          <router-link to="/app/personInfo">
            <img :src="host + user.user.avatar" class="dp-ib vm w40 h40 brp50">
            <span class="dp-ib vm f20 c-fff">{{user.user.nickname}}</span>
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
    <div v-if="isChat" class="mask z-999" @click="toggleChat(false)"></div>
    <transition name="slide-right">
      <div v-if="isChat" class="home-chat bc-page home-chat-list">
        <ul>
          <li class="home-chat-item" v-for="item in friends">
            <router-link class="row" :to="'/app/chat?friendUserNo=' + item.friendUserNo">
              <img :src="host + item.friendAvatar" width="40" height="40">
              <div class="home-chat-content col">
                <p class="name">{{item.friendNickName}}<span class="time">{{item.lastChatTime | date('MM/dd HH:mm')}}</span></p>
                <p class="text">{{item.lastMessageContent}}</p>
              </div>
            </router-link>
          </li>
        </ul>
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
        isFilter: false,
        isUserMenu: false,
        isChat: false,
        friends: []
      }
    },
    computed: mapState({
      host:  state => state.host,
      user:  state => state.user.info,
      activityOrganizationTypes:  state => state.map.activityOrganizationTypes,
      activityTypes:  state => state.map.activityTypes,
      dateRange:  state => state.map.dateRange,
      dateIndex:  state => state.map.dateIndex,
      typeIndex:  state => state.map.typeIndex,
      organizationTypesIndex:  state => state.map.organizationTypesIndex,
    }),
    methods: {
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
        if (!this.user.token) {
          return  this.$router.push('/app/login');
        }

        if (typeof bool === 'boolean') {

          if (bool) {
            this.$loading.show('获取朋友列表');
            this.$http.get('/user/chat/friend/list', {data: {
              token: this.user.token
            }}).then((data) => {
              this.$loading.hide();
              if (data.code == 0) {
                this.friends = data.datas.friends;
                this.isChat = true;
              } else {
                this.$toast.info(data.msg);
              }
            }, function () {
              this.$loading.hide();
              this.$toast.info('获取朋友列表失败');
            });
          } else {
            this.isChat = false;
          }

        } else {
          this.isChat = !this.isChat;
        }
      },
      addActivity: function () {
        if (this.user.token) {
          this.$router.push('/app/addActivity');
        } else {
          this.$router.push('/app/login');
        }
      },
      changeTypes: function (value) {
        this.$store.state.map.typeIndex = value;
        this.refresh();
      },
      changeRange: function (value) {
        this.$store.state.map.dateIndex = value;
        this.refresh();
      },
      changeOrganization: function (value) {
        this.$store.state.map.organizationTypesIndex = value;
        this.refresh();
      },
      refresh: function () {
        this.$map.loadMap((map) => {
          map.getPositionPicker().start();
        });
      }
    }
  }
</script>
