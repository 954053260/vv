<template>
  <div id="addActivity">
    <div v-show="show" class="container bc-page">
      <header class="aa-header bb1-ddd">
        <swiper v-if="swiperSlides.length > 1" :options="swiperOption">
          <swiper-slide v-for="slide in swiperSlides">
            <div class="aa-slide row row-center"><img :src="host + slide"/></div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div v-if="swiperSlides.length == 1" class="aa-slide row row-center">
          <img :src="swiperSlides[0]"/>
        </div>
        <a class="aa-addImg-btn" :class="{'active': swiperSlides.length}" @click="addImg()">
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
        <li class="aa-item item mt10 bt1-ddd">
          <div class="row lh30">
            <span class="dp-ib w70">活动地址</span>
            <p class="col c-666"  @click="selectAddress()">
              {{address.address}}
            </p>
          </div>
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
        <li class="aa-item item">
          <div class="row lh30">
            <span class="dp-ib w70">活动类型</span>
            <p class="col c-666"  @click="selectType()">
              {{activityTypes[typeIndex].desc}}
            </p>
            <picker ref="type" :list="activityTypes" bindValue="desc" v-model="typeIndex" ></picker>
          </div>
        </li>
        <li class="aa-item item">
          <div class="row lh30">
            <span class="dp-ib w70">活动类型</span>
            <p class="col c-666"  @click="selectOrganization()">
              {{activityOrganizationTypes[organizationTypesIndex].desc}}
            </p>
            <picker ref="organization" :list="activityOrganizationTypes" bindValue="desc" v-model="organizationTypesIndex" ></picker>
          </div>
        </li>
        <li class="aa-item item mt10 bt1-ddd">
          <label class="row lh30">
            <textarea class="col c-666" placeholder="填写活动说明" v-model="content"></textarea>
          </label>
        </li>
      </ul>
      <div class="p20">
        <button class="btn btn-full bc-main c-fff" @click="saveActivity">发布</button>
      </div>
    </div>
    <transition name="slide-bottom">
      <div v-if="!show" class="aa-address-page">
        <div class="bc-main clear-float">
          <button class="btn btn-clear c-fff fl" @click="cancelAddress()">取消</button>
          <button class="btn btn-clear c-fff fr" @click="confirmAddress()">确定</button>
        </div>
        <ul class="p10 lh25">
          <li class="mb10">
            <b>经纬度:</b>
            <p>{{positionResult.lat}},{{positionResult.lng}}</p>
          </li>
          <li class="mb10">
            <b>地址:</b>
            <p class="c-main">{{positionResult.address}}</p>
          </li>
          <!--<li v-show="positionResult.nearestJunction" class="mb10">-->
            <!--<b>最近的路口:</b>-->
            <!--<p>{{positionResult.nearestJunction}}</p>-->
          <!--</li>-->
          <!--<li v-show="positionResult.nearestRoad" class="mb10">-->
            <!--<b>最近的路:</b>-->
            <!--<p>{{positionResult.nearestRoad}}</p>-->
          <!--</li>-->
          <!--<li v-show="positionResult.nearestPOI" class="mb10">-->
            <!--<b>最近的标注点:</b>-->
            <!--<p>{{positionResult.nearestPOI}}</p>-->
          <!--</li>-->
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
        organizationTypesIndex: 0,
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
      activityOrganizationTypes:  function () {
        return this.$store.state.map.activityOrganizationTypes.slice(1);
      },
      activityTypes:  function () {
        return this.$store.state.map.activityTypes;
      },
      positionResult: function () {
        return this.$store.state.map.positionResult;
      },
      user: function () {
        return this.$store.state.user.info;
      }
    },
    methods: {
      addImg: function () {
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
        })
      },
      selectDate: function (type) {
        if (type == 'start') {
          this.$refs.start.toggle(true);
        } else {
          this.$refs.end.toggle(true);
        }
      },
      selectType: function () {
        this.$refs.type.toggle(true);
      },
      selectOrganization: function () {
        this.$refs.organization.toggle(true);
      },
      selectAddress: function () {
        this.show = false;
      },
      confirmAddress: function () {
        this.address = this.positionResult;
        this.show = true;
      },
      cancelAddress: function () {
        this.show = true;
      },
      saveActivity: function () {
        this.$loading.show('提交活动...');
        this.$http.post('user/activity/create', {
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
            activityType: this.activityTypes[this.typeIndex].value,
            activityOrganizationType: this.activityOrganizationTypes[this.organizationTypesIndex].value,
            linkMan: this.user.user.realname || '赵先生',
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

        }, (err) => {
          this.$toast.info('提交活动失败');
          this.$loading.hide();
        })
      }
    }
  }
</script>

