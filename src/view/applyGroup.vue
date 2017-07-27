<template>
  <div id="applyGroup" class="container bc-page">
    <p class="ag-text">完成资料填写后我们会尽快完成审核</p>
    <ul class="ag-list bc-fff">
      <li class="ag-item row">
        <span>负责人姓名</span>
        <label class="col">
          <input class="c-999" type="text" placeholder="请输入" v-model="realname">
        </label>
      </li>
      <li class="ag-item row">
        <span>{{type == 1 ? '企业' : '团体'}}名称</span>
        <label class="col">
          <input class="c-999" type="text" placeholder="请输入" v-model="name">
        </label>
      </li>
      <li class="ag-item row">
        <span>联系电话</span>
        <label class="col pr">
          <input class="c-999" type="number" placeholder="请输入" v-model="phone"/>
        </label>
      </li>
      <li v-if="type == 1" class="ag-item row">
        <span>营业执照号</span>
        <label class="col pr">
          <input class="c-999" type="number" placeholder="请输入" v-model="business"/>
        </label>
      </li>
    </ul>
    <p class="ag-text">{{type == 1 ? '请上传纸质版的营业执照复印件盖公章' : '请上传纸质版的盖章证明材料'}}</p>
    <div v-show="!swiperSlides.length" class="ag-add-content">
      <a @click="uploadImage">
        <img src="static/icon/icon-add-2.png">
      </a>
    </div>
    <swiper v-if="swiperSlides.length" :options="swiperOption">
      <swiper-slide v-for="(slide, index) in swiperSlides">
        <div class="ag-slide row row-center">
          <img :src="host + slide"/>
          <a class="ag-delete" @click="deleteImage(index)">
            <img src="static/icon/icon-close.png">
          </a>
          <a class="ag-add" @click="uploadImage">
            <img src="static/icon/icon-add.png">
          </a>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <p class="ag-text tc" style="margin-top: 1.17333rem">以上资料平台会完全保密，绝不泄露</p>
    <a class="ag-btn" @click="submit">去认证</a>
  </div>
</template>
<script type="text/ecmascript-6">
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default {
    name: 'applyGroup',
    created: function () {
      this.type = this.$route.query.type;
    },
    components: {swiper, swiperSlide},
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
        type: '',
        name: '',
        realname: '',
        phone: '',
        business: ''
      }
    },
    computed: {
      host: function () {
        return this.$store.state.host;
      }
    },
    methods: {
      deleteImage: function (index) {
        this.$dialog.confirm({
          content: '确定要删除本张图片吗？',
          onOk: () => {
            this.swiperSlides.splice(index, 1);
          }
        });
      },
      uploadImage: function () {
        this.$file.upload({
          success: (data) => {
            this.$loading.show('上传图片');
            this.$store.dispatch('fileUpload', data)
                    .then((data) => {
                      this.$loading.hide();
                      this.swiperSlides.push(data.datas.uris[0]);
                    }, () => {
                      this.$loading.hide();
                      this.$toast.info('上传失败');
                    })
          },
          fail: (err) => {
            this.$toast.info(err.msg);
          }
        });
      },
      submit: function () {
        this.$loading.show('提交中...');
        this.$http.post('/user/approve/apply', {
          data: {
            token: this.$store.state.user.info.token,
            approveType: this.type == 1 ? '1' : '100',
            director: this.realname,
            name: this.name,
            organCode: this.business,
            linkPhone: this.phone,
            attachments: this.swiperSlides.join()
          }
        }).then((data) => {
          this.$loading.hide();
          if (data.code == 0) {
            this.$toast.info('提交成功');
            this.$router.back();
          } else {
            this.$toast.info(data.msg);
          }
        }, () => {
          this.$toast.info('提交失败');
          this.$loading.hide();
        });
      }
    }
  }
</script>
<style scoped>

</style>
