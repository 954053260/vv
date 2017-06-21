<template>
  <div id="addActivity">
    <div v-show="show" class="container bc-page">
      <div class="ad-content">
        <header class="aa-header bb1-ddd">
          <swiper v-if="swiperSlides.length > 1" :options="swiperOption">
            <swiper-slide v-for="(slide, index) in swiperSlides">
              <div class="aa-slide row row-center">
                <a class="aa-deleteImg-btn" @click="deleteImg(index)"><i class="icon ion-android-close"></i></a>
                <img :src="host + slide"/>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
          <div v-if="swiperSlides.length == 1" class="aa-slide row row-center">
            <a class="aa-deleteImg-btn" @click="deleteImg(0)"><i class="icon ion-android-close"></i></a>
            <img :src="host + swiperSlides[0]"/>
          </div>
          <a v-show="swiperSlides.length < 6" class="aa-addImg-btn" :class="{'active': swiperSlides.length}" @click="addImg()">
            <i class="icon ion-android-add"></i>
          </a>
        </header>
        <ul class="list">
          <li class="aa-item item mt10">
            <label class="row lh30">
              <span class="dp-ib w70">活动标题</span>
              <input class="col c-666" type="text" v-model="aTitle">
            </label>
          </li>
          <li class="aa-item item mt10 bt1-ddd">
            <div class="row lh30">
              <span class="dp-ib w70">开始时间</span>
              <p class="col c-666" @click="selectDate('start')">
                {{startDate | date('yyyy-MM-dd HH:mm')}}
              </p>
              <date-picker ref="start" v-model="startDate"></date-picker>
            </div>
          </li>
          <li class="aa-item item">
            <div class="row lh30">
              <span class="dp-ib w70">结束时间</span>
              <p class="col c-666"  @click="selectDate('end')">
                {{endDate | date('yyyy-MM-dd HH:mm')}}
              </p>
              <date-picker ref="end" v-model="endDate"></date-picker>
            </div>
          </li>
          <li class="aa-item item pr mt10 bt1-ddd">
            <label class="row lh30">
              <span class="dp-ib w70">活动地址</span>
              <input class="col c-666" type="text" v-model="address.address">
              <a class="aa-address-btn" @click="selectAddress()">
                <i class="icon ion-ios-location-outline"></i>
              </a>
            </label>
          </li>
          <li class="aa-item item mt10 bt1-ddd">
            <label class="row lh30">
              <span class="dp-ib w70">活动人数</span>
              <input class="col c-666" type="number" v-model="limitCount">
            </label>
          </li>
          <li class="aa-item item">
            <label class="row lh30">
              <span class="dp-ib w70">活动费用</span>
              <input class="col c-666" type="number" v-model="fee">
            </label>
          </li>
          <li class="aa-item item" style="border-bottom: none;">
            <div class="row lh30">
              <span class="dp-ib w70">活动类别</span>
              <p class="col c-666">
                {{activityTypes[typeIndex].desc}}
              </p>
            </div>
          </li>
          <li class="aa-item item" style="padding: 0 10px;">
              <span v-for="(type, index) in activityTypes" class="aa-tag" @click="selectType(index)">{{type.desc}}</span>
          </li>
          <li class="aa-item item mt10 bt1-ddd">
            <label class="row lh30">
              <textarea class="col c-666" placeholder="填写活动说明" v-model="content"></textarea>
            </label>
          </li>
        </ul>
      </div>
      <a class="ad-confirm-btn" @click="saveActivity()">发布</a>
    </div>
    <transition name="slide-bottom">
      <div v-if="!show" class="aa-address-page">
        <div class="bc-main clear-float">
          <button class="btn btn-clear c-fff fl" @click="cancelAddress()">取消</button>
          <button class="btn btn-clear c-fff fr" @click="confirmAddress()">确定</button>
        </div>
        <ul class="p10 lh25">
          <li class="pr mb10">
            <a class="aa-location-btn" @click="location()">
              <i class="icon ion-ios-location-outline"></i>
            </a>
            <b class="c-333">地址:</b>
            <p class="mt10 c-666">{{positionResult.address}}</p>
          </li>
        </ul>
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
          autoplay: 3000,
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
                      }, (err) => {
                        this.$loading.hide();
                        this.$toast.info('上传失败');
                      })
            },
            fail: (err) => {
              this.$toast.info(err.msg);
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

