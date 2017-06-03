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

    <div v-if="isInfo" class="mask" @click="hideInfo()"></div>
    <transition name="slide-up">
      <div v-if="isInfo" class="home-info-window">
        <h2>{{info.title}}</h2>
        <ul class="home-info-window-content list">
          <li class="aa-item item">
            <label class="row lh30">
              <span class="dp-ib pr10 w60 tr">举办者</span>
              <p class="col c-999">{{info.user.name}}</p>
            </label>
          </li>
          <li class="aa-item item">
            <label class="row lh30">
              <span class="dp-ib pr10 w60 tr">地点</span>
              <p class="col c-999">{{info.address}}</p>
            </label>
          </li>
          <li class="aa-item item">
            <label class="row lh30">
              <span class="dp-ib pr10 w60 tr">开始时间</span>
              <p class="col c-999">{{info.startDate | date('yyyy年MM月dd日 HH时mm分')}}</p>
            </label>
          </li>
          <li class="aa-item item">
            <label class="row lh30">
              <span class="dp-ib pr10 w60 tr">结束时间</span>
              <p class="col c-999">{{info.endDate | date('yyyy年MM月dd日 HH时mm分')}}</p>
            </label>
          </li>
          <li class="aa-item item">
            <label class="row lh30">
              <span class="dp-ib pr10 w60 tr">简介</span>
              <p class="col c-999">{{info.desc}}</p>
            </label>
          </li>
        </ul>
        <div class="home-info-window-buttons row">
          <a class="col br1-ddd">收藏</a>
          <a class="col">参与</a>
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
            title: '决战赤壁',
            center: '113.0759,22.9170',
            info: {
              title: '决战赤壁',
              user: {
                name: '孔明'
              },
              address: '湖北省蒲圻市西北36公里的长江南岸',
              startDate: new Date(),
              endDate: new Date(),
              desc: '它也是中国历史上第一次在长江流域进行的大规模江河作战，标志着中国军事政治中心不再限于黄河流域。孙刘联军最后以火攻大破曹军，曹操北回，孙、刘各自夺去荆州的一部分'
            }
          },
          {
            no: 2,
            iconColor: 'blue',
            title: '割须弃袍',
            center: '113.2769,23.1170',
            info: {
              title: '马孟起',
              user: {
                name: '马孟起'
              },
              address: '陕西省渭南市潼关县北',
              startDate: new Date(),
              endDate: new Date(),
              desc: '“操在乱军中，只听得西凉军大叫：“穿红袍的是曹操！”操就马上急脱下红袍。又听得大叫：“长髯者是曹操！”操惊慌，掣所佩刀断其髯。超遂令人叫拏短髯者是曹操。操闻之，即扯旗角包颈而逃'
            }
          },
          {
            no: 3,
            iconColor: 'red',
            title: ' 单骑救主',
            center: '113.4779,23.3170',
            info: {
              title: ' 赵子龙单骑救主',
              user: {
                name: '赵子龙'
              },
              address: '湖北省宜昌市县级市当阳市中心城区的长坂坡',
              startDate: new Date(),
              endDate: new Date(),
              desc: '荆州刘表病死其子刘琮不战而降，刘备率众十余万退走江陵。曹操知江陵有军资害怕被刘备占据就亲率5000虎豹骑一日一夜奔袭三百里追至当阳长坂将刘备击溃，乱军之中刘备弃家小带张飞诸葛亮赵云等十余骑退走，路上赵云单枪匹马杀回长坂坡，与虎豹骑且战且退，最终救出后主母子'
            }
          },
          {
            no: 4,
            iconColor: 'red',
            title: '过五斩六',
            center: '113.0759,23.1170',
            info: {
              title: '过五关斩六将',
              user: {
                name: '关云长'
              },
              address: '河南省许昌',
              startDate: new Date(),
              endDate: new Date(),
              desc: '过东岭关时杀孔秀；过洛阳城时杀韩福、孟坦；过汜水关时杀卞喜；过荥阳时杀太守王植；过黄河渡口时杀秦琪，“过五关斩六将”因此得名。'
            }
          },
          {
            no: 5,
            iconColor: 'red',
            title: '桃园结义',
            center: '113.2769,22.9670',
            info: {
              title: '桃园三结义',
              user: {
                name: '刘玄德'
              },
              address: '河北涿州市涿郡',
              startDate: new Date(),
              endDate: new Date(),
              desc: '东汉末年，朝政腐败，再加上连年灾荒，人民生活非常困苦。刘备有意拯救百姓，张飞、关羽又愿与刘备共同干一番事业。三人情投意合，选定张飞庄后一桃园。此时正值桃花盛开，景色美丽，张飞准备了青牛白马，作为祭品，焚香礼拜，宣誓完毕；三个人按年岁认了兄弟。刘备年长做了大哥，关羽第二，张飞最小做了弟弟'
            }
          },
          {
            no: 6,
            iconColor: 'red',
            title: '煮酒论英雄',
            center: '113.4779,23.0170',
            info: {
              title: '煮酒论英雄',
              user: {
                name: '曹孟德'
              },
              address: '河南省许昌',
              startDate: new Date(),
              endDate: new Date(),
              desc: '操以手指玄德，然后自指曰：“天下英雄，唯使君与操耳。”煮酒论英雄煮酒论英雄玄德闻言，吃了一惊，手中所执匙箸，不觉落于地下。时正值天雨将至，雷声大作。玄德乃从容拾箸曰：“一震之威，乃至于此！”电视《三国演义》这一集也煞是好看，青梅煮酒，天外龙挂，气象森森。可是，不管小说也好，电视也好，过去几年的“三国热”中，评点三国的人，大都舍却此篇，不知何故'
            }
          }
        ];

        markers.forEach((item) => {
          var marker = map.createMarker(item);
          this.markers.push(marker);
          AMap.event.addListener(marker, 'click', () => {
            this.showInfo(item.info);
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
        isFilter: false,
        isUserMenu: false,
        isChat: false,
        isInfo: false,
        info: {},
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
        this.isFilter = !this.isFilter;
      },
      toggleUserMenu: function (bool) {

        if (this.$store.state.user.user.phone) {

          if (typeof bool === 'boolean') {
            this.isUserMenu = bool;
          } else {
            this.isUserMenu = !this.isUserMenu;
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
          this.isChat = bool;
        } else {
          this.isChat = !this.isChat;
        }

        if (this.isChat) {
          this.scrollBottom();
        }

      },
      showInfo: function (data) {
        this.info = data;
        this.isInfo = true;
      },
      hideInfo: function () {
        this.isInfo = false;
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
