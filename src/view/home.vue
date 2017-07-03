<template>
  <div id="home">
    <header class="home-header clear-float">
      <img src="static/icon/icon-search.png">
      <label>
        <input type="text" :class="{'c-999': !keyword, 'c-666': keyword}" v-model="keyword" placeholder="请输入关键字搜索">
      </label>
    </header>
    <a class="home-user-btn" @click="toggleUserMenu(true)">
      <img src="static/icon/icon-user.png">
    </a>
    <a class="home-chat-btn" @click="toggleChat(true)">
      <img src="static/icon/icon-chat-fill.png">
    </a>
    <a class="home-refresh-btn" @click="refresh()">
     <img src="static/icon/icon-refresh.png">
    </a>
    <a class="home-plus-btn" @click="addActivity">
      <img src="static/icon/icon-add-marker.png">
    </a>
    <a class="home-location-btn" @click="location()">
      <img src="static/icon/icon-location.png">
    </a>
    <a class="home-filter-btn" @click="toggleFilter()">
      <img src="static/icon/icon-list.png">
    </a>
    <div class="home-select-content">
      <transition name="fade">
        <div v-if="isFilter" class="pr row col z-2">
          <m-select class="col lh30 mr5" :list="activityOrganizationTypes" bindValue="desc" v-model="organizationTypesIndex"
                    @input="changeOrganization"></m-select>
          <m-select class="col lh30 mr5" :list="activityTypes" bindValue="desc" v-model="typeIndex"
                    @input="changeTypes"></m-select>
          <m-select class="col lh30" :list="dateRange" bindValue="desc" v-model="dateIndex"
                    @input="changeRange"></m-select>
        </div>
      </transition>
    </div>
    <div v-if="isUserMenu" class="mask z-999" @click="toggleUserMenu(false)"></div>
    <transition name="slide-left">
      <div v-if="isUserMenu" class="home-user-menu">
        <div class="home-user-menu-header">
          <router-link to="/app/personInfo">
            <img src="static/icon/icon-edit.png">
          </router-link>
          <img :src="host + user.user.avatar">
          <div class="c-fff">
            <p class="f16">{{user.user.nickname}}</p>
            <p class="lh20 f13">“{{user.user.signature}}”</p>
          </div>
        </div>
        <ul class="home-user-list clear-float">
          <li>
            <router-link to="/app/personActivity?type=1">
              <img src="static/icon/icon-flag.png">
              <img src="static/icon/icon-right.png">
              <p class="f16">参与的活动</p>
            </router-link>
          </li>
          <li>
            <router-link to="/app/personActivity?type=2">
              <img src="static/icon/icon-release.png">
              <img src="static/icon/icon-right.png">
              <p class="f16">发布的活动</p>
            </router-link>
          </li>
          <li>
            <router-link to="/app/personActivity?type=3">
              <img src="static/icon/icon-star.png">
              <img src="static/icon/icon-right.png">
              <p class="f16">收藏的活动</p>
            </router-link>
          </li>
          <li>
            <router-link to="/app/authentication">
              <img src="static/icon/icon-authenticate.png">
              <img src="static/icon/icon-right.png">
              <span v-if="!user.user.idCardNo">未认证</span>
              <p>实名认证</p>
            </router-link>
          </li>
          <li>
            <router-link to="/app/about">
              <img src="static/icon/icon-about.png">
              <img src="static/icon/icon-right.png">
              <p class="f16">关于我们</p>
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
        friends: [],
        keyword: ''
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
