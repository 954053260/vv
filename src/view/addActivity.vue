<template>
  <div id="addActivity">
    <div v-show="show" class="container bc-page">
      <header class="aa-header">
        <img src="../assets/test3.jpg" class="dp-b w">
      </header>
      <ul class="list">
        <li class="aa-item item mt10">
          <label class="row lh30">
            <span class="dp-ib w70">活动标题</span>
            <input class="col c-666" type="text">
          </label>
        </li>
        <li class="aa-item item mt10 bt1-ddd">
          <label class="row lh30">
            <span class="dp-ib w70">开始时间</span>
            <p class="col c-666" @click="selectDate($event, 'start')">
              {{startDate | date('yyyy-MM-dd HH:mm')}}
            </p>
            <date-picker ref="start" v-model="startDate"></date-picker>
          </label>
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
            <input class="col c-666" type="number">
          </label>
        </li>
        <li class="aa-item item">
          <label class="row lh30">
            <span class="dp-ib w70">活动费用</span>
            <input class="col c-666" type="number">
          </label>
        </li>
        <li class="aa-item item">
          <div class="row lh30">
            <span class="dp-ib w70">活动类型</span>
            <p class="col c-666"  @click="selectType()">
              {{type}}
            </p>
            <picker ref="type" :list="typeList" v-model="type" ></picker>
          </div>
        </li>
        <li class="aa-item item mt10 bt1-ddd">
          <label class="row lh30">
            <textarea class="col c-666" placeholder="填写活动说明（可以插入图片）"></textarea>
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
            <p>{{positionResult.position && positionResult.position.lat}},{{positionResult.position && positionResult.position.lng}}</p>
          </li>
          <li class="mb10">
            <b>地址:</b>
            <p class="c-main">{{positionResult.address}}</p>
          </li>
          <li v-show="positionResult.nearestJunction" class="mb10">
            <b>最近的路口:</b>
            <p>{{positionResult.nearestJunction}}</p>
          </li>
          <li v-show="positionResult.nearestRoad" class="mb10">
            <b>最近的路:</b>
            <p>{{positionResult.nearestRoad}}</p>
          </li>
          <li v-show="positionResult.nearestPOI" class="mb10">
            <b>最近的标注点:</b>
            <p>{{positionResult.nearestPOI}}</p>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
  import datePicker from '../common/datePicker.vue'
  import picker from '../common/picker.vue'
  import mSelect from '../common/mSelect.vue'

  export default {
    name: 'addActivity',
    created: function () {

    },
    mounted: function () {

    },
    components: {datePicker, picker, mSelect},
    data: function () {
      return {
        show: true,
        typeList: ['全部', '运动', '文化', '学习', '娱乐', '工业', '旅行', '商业', '其他'],
        type: '全部',
        startDate: '',
        endDate: '',
        address: {},
        positionResult: {}
      }
    },
    computed: {},
    methods: {
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
      selectAddress: function () {
        this.show = false;
        this.$map.loadMap((map) => {
          this.positionPicker = map.positionPicker((data) => {
            this.positionResult = data;
          }, (error) => {
            this.$toast.info('地址获取失败');
          });
          this.positionPicker.show();
        });
      },
      confirmAddress: function () {
        this.address = this.positionResult;
        this.show = true;
        this.positionPicker.remove();
      },
      cancelAddress: function () {
        this.show = true;
        this.positionPicker.remove();
      },
      saveActivity: function () {
        this.$router.back();
      }
    }
  }
</script>

