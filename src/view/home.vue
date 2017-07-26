<template>
  <div id="home">
    <header class="home-header clear-float">
      <img src="static/icon/icon-search.png">
      <form>
        <label>
          <input type="text" name="test" style="display:none"/>
          <input type="search" :class="{'c-b3b3b3': !keyword, 'c-666': keyword}" v-model="keyword" placeholder="请输入关键字搜索"
                 @change="changeKeyword">
        </label>
      </form>
    </header>
    <a class="home-user-btn" @click="toggleUserMenu(true)">
      <img src="static/icon/icon-user-fill.png">
    </a>
    <a class="home-chat-btn" @click="toggleChat(true)">
      <span v-if="hasMessage" class="point"></span>
      <img src="static/icon/icon-chat-fill.png">
    </a>
    <a class="home-refresh-btn" @click="refresh()">
     <img src="static/icon/icon-refresh.png">
    </a>
    <a class="home-plus-btn" @click="addActivity">
      <img src="static/icon/icon-add-marker.png">
    </a>
    <a class="home-location-btn" @click="location()">
      <img src="static/icon/icon-location-fill.png">
    </a>
    <a class="home-filter-btn" :class="{active: isFilter}" @click="toggleFilter()">
      <img src="static/icon/icon-list.png">
    </a>
    <div class="home-select-content">
      <transition name="fade">
        <div v-show="isFilter" class="pr row col z-2">
          <m-select ref="organization" class="col mr5" :list="activityOrganizationTypes" bindValue="desc" v-model="organizationTypesIndex"
                    @click.native="hideSelect(['types', 'dateRange'])"
                    @input="changeOrganization"></m-select>
          <m-select ref="types" class="col mr5" :list="activityTypes" bindValue="desc" v-model="typeIndex"
                    @click.native="hideSelect(['organization', 'dateRange'])"
                    @input="changeTypes"></m-select>
          <m-select ref="dateRange" class="col" :list="dateRange" bindValue="desc" v-model="dateIndex"
                    @click.native="hideSelect(['organization', 'types'])"
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
            <p class="lh20 f13"><span ng-if="user.user.signature">“</span>{{user.user.signature}}<span ng-if="user.user.signature">”</span></p>
          </div>
        </div>
        <ul class="home-user-list clear-float">
          <li class="home-user-item">
            <router-link to="/app/personActivityJoin">
              <img src="static/icon/icon-flag.png">
              <img src="static/icon/icon-right.png">
              <p class="f16">参与的活动</p>
            </router-link>
          </li>
          <li class="home-user-item">
            <router-link to="/app/personActivityAdd">
              <img src="static/icon/icon-release.png">
              <img src="static/icon/icon-right.png">
              <p class="f16">发布的活动</p>
            </router-link>
          </li>
          <li class="home-user-item">
            <router-link to="/app/personActivityCollection">
              <img src="static/icon/icon-star.png">
              <img src="static/icon/icon-right.png">
              <p class="f16">收藏的活动</p>
            </router-link>
          </li>
          <li class="home-user-item">
            <router-link to="/app/authentication">
              <img src="static/icon/icon-card.png">
              <img src="static/icon/icon-right.png">
              <span>{{user.user.idCardNo ? '已认证' :  '未认证'}}</span>
              <p>实名认证</p>
            </router-link>
          </li>
          <li class="home-user-item">
            <router-link to="/app/apply">
              <img src="static/icon/icon-authenticate.png">
              <img src="static/icon/icon-right.png">
              <span>{{user.user.userType.value == 2 ? '已认证' :  '未认证'}}</span>
              <p>群体用户申请</p>
            </router-link>
          </li>
          <li class="home-user-item">
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
            <router-link :to="'/app/chat?friendUserNo=' + item.friendUserNo">
              <img :src="host + item.friendAvatar">
              <div class="home-chat-content">
                <p class="name">{{item.friendNickName}}<span class="time">{{item.lastChatTime | dateStyle}}</span></p>
                <div>
                  <span v-if="!item.isReaded" class="point"></span>
                  <p class="text font-hide">{{item.lastMessageContent}}</p>
                </div>
              </div>
            </router-link>
            <!--<a class="item-options">删除</a>-->
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
      this.$map.loadMap((map) => {
        map.getPositionPicker().start();
      });
      this.getFriend((data) => {
        data.datas.friends.forEach((item) => {
          if (!item.isReaded) {
            this.hasMessage = true;
          }
        });
      });
    },
    components: {mSelect},
    data: function () {
      return {
        isFilter: false,
        isUserMenu: false,
        isChat: false,
        hasMessage: false,
        friends: [],
        keyword: ''
      }
    },
    computed: mapState({
      host: state => state.host,
      user: state => state.user.info,
      activityOrganizationTypes: state => state.map.activityOrganizationTypes,
      activityTypes: state => state.map.activityTypes,
      dateRange: state => state.map.dateRange,
      dateIndex: state => state.map.dateIndex,
      typeIndex: state => state.map.typeIndex,
      organizationTypesIndex: state => state.map.organizationTypesIndex,
    }),
    methods: {
      hideSelect: function (arr) {
        arr.forEach((item) => {
          this.$refs[item].show = false;
        });
      },
      getFriend: function (success, fail) {
        if (this.user.token) {
          this.$http.get('/user/chat/friend/list', {data: {
            token: this.user.token
          }}).then((data) => {
            if (data.code == 0) {
              success(data);
            } else {
              fail && fail(data.msg);
            }
          }, fail);
        }
      },
      location: function () {
        this.hideSelect(['organization', 'dateRange', 'types']);
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
        this.hideSelect(['organization', 'dateRange', 'types']);
        this.isFilter = !this.isFilter;
      },
      toggleUserMenu: function (bool) {
        this.hideSelect(['organization', 'dateRange', 'types']);
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
        this.hideSelect(['organization', 'dateRange', 'types']);
        if (!this.user.token) {
          return  this.$router.push('/app/login');
        }

        if (typeof bool === 'boolean') {
          if (bool) {
            this.$loading.show('获取朋友列表');
            this.getFriend((data) => {
              this.$loading.hide();
              this.friends = data.datas.friends;
              this.isChat = true;
            }, () => {
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
        this.hideSelect(['organization', 'dateRange', 'types']);
        if (this.user.token) {
          if (this.user.user.idCardNo) {
            this.$router.push('/app/addActivity');
          } else {
            this.$toast.info('没有实名认证不能发布活动');
          }
        } else {
          this.$router.push('/app/login');
        }
      },
      changeTypes: function (value) {
        this.$store.state.map.typeIndex = value;
        this.$map.loadMap((map) => {
          map.getPositionPicker().start();
        });
      },
      changeRange: function (value) {
        this.$store.state.map.dateIndex = value;
        this.$map.loadMap((map) => {
          map.getPositionPicker().start();
        });
      },
      changeOrganization: function (value) {
        this.$store.state.map.organizationTypesIndex = value;
        this.$map.loadMap((map) => {
          map.getPositionPicker().start();
        });
      },
      changeKeyword: function () {
        this.$store.state.map.keyword = this.keyword;
        this.$map.loadMap((map) => {
          map.getPositionPicker().start();
        });
      },
      refresh: function () {
        this.hideSelect(['organization', 'dateRange', 'types']);
        this.$store.state.isRefresh = true;
        this.$map.loadMap((map) => {
          map.getPositionPicker().start();
        });
      }
    }
  }
</script>
