<template>
  <div id="addActivity">
    <div v-show="show" class="container bc-page">
      <header class="aa-header">
        <swiper v-if="swiperSlides.length > 1" :options="swiperOption">
          <swiper-slide v-for="(slide, index) in swiperSlides">
            <div class="aa-slide row row-center">
              <a class="aa-delete-btn" @click="deleteImg(index)">
                <img src="static/icon/icon-close.png">
              </a>
              <img :src="host + slide"/>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div v-if="swiperSlides.length == 1" class="aa-slide row row-center">
          <a class="aa-delete-btn" @click="deleteImg(0)">
            <img src="static/icon/icon-close.png">
          </a>
          <img :src="host + swiperSlides[0]"/>
        </div>
        <a v-show="swiperSlides.length < 6" class="aa-add-btn" :class="{'active': swiperSlides.length}" @click="addImg()">
         <img src="static/icon/icon-add.png">
        </a>
      </header>
      <ul class="aa-list">
        <li class="aa-item row">
          <span>活动标题</span>
          <label class="col tr">
            <input class="c-999" type="text" placeholder="请输入" v-model="aTitle">
          </label>
        </li>
        <li class="aa-item row mt10">
          <span>开始时间</span>
          <p class="col c-999 tr" @click="selectDate('start')">
            <span>{{startDate | date('yyyy-MM-dd HH:mm')}}</span>
            <span v-if="!startDate">请选择<img src="static/icon/icon-bottom-2.png"/></span>
          </p>
          <date-picker ref="start" v-model="startDate"></date-picker>
        </li>
        <li class="aa-item row">
          <span>结束时间</span>
          <p class="col c-999 tr" @click="selectDate('end')">
            <span>{{endDate | date('yyyy-MM-dd HH:mm')}}</span>
            <span v-if="!endDate">请选择<img src="static/icon/icon-bottom-2.png"/></span>
          </p>
          <date-picker ref="end" v-model="endDate" :start="startDate"></date-picker>
        </li>
        <li class="aa-item row">
          <span>活动地址</span>
          <label class="col pr" style="padding-right: 1.27466rem;">
            <input class="c-999" type="text" v-model="address.address" @focus="toTextEnd($event)">
            <a class="aa-address-btn" @click="selectAddress()">
              <img src="static/icon/icon-location.png">
            </a>
          </label>
        </li>
        <li class="aa-item row mt10">
          <span>活动人数</span>
          <label class="col tr">
            <input class="c-999" type="text" placeholder="请输入" v-model="limitCount">
          </label>
        </li>
        <li class="aa-item row">
          <span>活动费用</span>
          <label class="col tr">
            <input class="c-999" type="text" placeholder="请输入" v-model="fee">
          </label>
        </li>
        <li class="aa-item row" style="border-bottom: none;">
          <span>活动类别</span>
          <!--<p class="col c-999 tr">-->
            <!--{{activityTypes[typeIndex].desc}}-->
          <!--</p>-->
        </li>
        <li class="pb10 bc-fff bb1-eee">
          <span v-for="(type, index) in activityTypes" class="aa-tag" :class="{active: type.desc == activityTypes[typeIndex].desc}"
                @click="selectType(index)">{{type.desc}}</span>
        </li>
        <li class="aa-textarea" >
          <textarea placeholder="填写详细活动介绍" v-model="content"></textarea>
        </li>
      </ul>
      <a class="aa-submit-btn" @click="saveActivity()">发布</a>
    </div>
    <transition name="slide-bottom">
      <div v-if="!show" class="aa-address-page">
        <header>
          <a class="fl c-fff ml10" @click="cancelAddress()">取消</a>
          <a class="fr c-fff mr10" @click="confirmAddress()">确定</a>
        </header>
        <p class="clear-float">
          <a class="fr aa-location-btn" @click="location()">
            <img src="static/icon/icon-location.png">
          </a>
          <span class="dp-ib lh30">地址</span>
        </p>
        <p class="lh25 c-999">
          {{positionResult.address}}
        </p>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import datePicker from '../common/datePicker.vue'
  import picker from '../common/picker.vue'
  import mSelect from '../common/mSelect.vue'

  export default {
    name: 'addActivity',
    created: function () {

    },
    mounted: function () {

    },
    components: {datePicker, picker, mSelect, swiper, swiperSlide},
    data: function () {
      return {
        swiperOption: {
          autoplay: 30000,
          setWrapperSize :true,
          pagination : '.swiper-pagination',
          paginationClickable :true,
          mousewheelControl : true,
          observeParents:true,
        },
        swiperSlides: [],
        show: true,
        typeIndex: 0,
        aTitle: '',
        content: '',
        limitCount: '',
        fee: '',
        startDate: '',
        endDate: '',
        address: {}
      }
    },
    computed: {
      host: function () {
        return this.$store.state.host;
      },
      activityTypes:  function () {
        return this.$store.state.map.activityTypes.slice(1);
      },
      positionResult: function () {
        return this.$store.state.map.positionResult;
      },
      user: function () {
        return this.$store.state.user.info;
      }
    },
    methods: {
      toTextEnd: function (e) {
        var input = e.target;
//        var range;
        var value = input.value;
        this.address.address = '';
        setTimeout(() => {
          this.address.address = value;
        });
//        input.focus();
//        setTimeout(function () {
//          if (document.selection) {
//            var sel = input.createTextRange();
//            sel.moveStart('character', input.value.length);
//            sel.collapse();
//            sel.select();
//          } else if (typeof input.selectionStart == 'number' && typeof input.selectionEnd == 'number') {
//            input.selectionStart = input.selectionEnd = input.value.length;
//          }
//        });

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
      addImg: function () {
        if (this.swiperSlides.length < 6) {
          this.$file.upload({
            success: (data, type) => {
              this.$loading.show('上传图片');
              this.$store.dispatch('fileUpload', data)
                      .then((data) => {
                        this.$loading.hide();
                        this.swiperSlides = this.swiperSlides.concat(data.datas.uris);
                      }, () => {
                        this.$loading.hide();
                        this.$toast.info('上传失败');
                      })
            },
            fail: () => {
              this.$toast.info('上传失败');
            }
          });
        } else {
          this.$toast.info('最多上传5张');
        }
      },
      deleteImg: function (index) {
        this.$dialog.confirm({
          content: '确定要删除本张图片吗？',
          onOk: () => {
            this.swiperSlides.splice(index, 1);
          }
        });
      },
      selectDate: function (type) {
        if (type == 'start') {
          this.$refs.start.toggle(true);
        } else {
          this.$refs.end.toggle(true);
        }
      },
      selectType: function (index) {
        this.typeIndex = index;
      },
      selectOrganization: function () {
        this.$refs.organization.toggle(true);
      },
      selectAddress: function () {
        this.$map.loadMap((map) => {
          map.gd.setZoom(17);
          this.show = false;
        });
      },
      confirmAddress: function () {
        this.address = this.positionResult;
        this.show = true;
      },
      cancelAddress: function () {
        this.show = true;
      },
      saveActivity: function () {

        if (this.aTitle == '') {
          return this.$toast.info('活动标题不能为空！');
        }

        if (this.content == '') {
          return this.$toast.info('活动简介不能为空！');
        }

        if (this.startDate == '') {
          return this.$toast.info('活动开始时间不能为空！');
        }

        if (this.endDate == '') {
          return this.$toast.info('活动结束时间不能为空！');
        }

        if (!this.address.address) {
          return this.$toast.info('活动地址不能为空！');
        }

        this.$loading.show('提交活动...');
        this.$map.loadMap((map) => {
          map.gd.getCity((data) => {
            this.$http.post('/user/activity/create', {
              data: {
                title: this.aTitle,
                content: this.content,
                image: this.swiperSlides.join(','),
                beginTime: this.startDate.getTime(),
                endTime: this.endDate.getTime(),
                address: this.address.address,
                latitude: this.address.lat,
                longitude: this.address.lng,
                limitCount: this.limitCount,
                fee: this.fee,
                cityCode: data.citycode,
                cityName: data.city,
                activityType: this.activityTypes[this.typeIndex].value,
                activityOrganizationType: this.user.user.userType.value,
                linkMan: this.user.user.realname || this.user.user.nickname,
                linkPhone: this.user.user.mobile,
                token: this.user.token
              }
            }).then((data) => {
              this.$loading.hide();

              if (data.code == 0) {
                this.$toast.info('提交活动成功');
                this.$router.back();
              } else {
                this.$toast.info('提交活动失败');
              }

            }, () => {
              this.$toast.info('提交活动失败');
              this.$loading.hide();
            });
          });
        });

      }
    }
  }
</script>

