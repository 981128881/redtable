<template>
  <view style="margin: 32rpx; overflow: hidden">
    <!-- 搜索栏 购物车 -->
    <u-row justify="space-between" gutter="10">
      <u-col span="11">
        <u-search
          placeholder="请输入关键词"
          shape="square"
          :clearabled="true"
          height="80"
          searchIconColor="#000000"
          searchIconSize="32rpx"
          :showAction="false"
          @search="search()"
        >
        </u-search>
      </u-col>
      <u-col span="1" align="center">
        <view @click="toLink('/pages/shoppingCart/index')">
          <u-icon
            name="shopping-cart"
            color="#000000"
            size="40rpx"
            bold
          ></u-icon>
        </view>
      </u-col>
    </u-row>
    <!-- banner -->
    <u-row>
      <view class="row-top">
        <u-col span="12" align="center">
          <u--image
            :showLoading="true"
            :src="banner"
            width="686rpx"
            height="184rpx"
            radius="8rpx"
          >
          </u--image>
        </u-col>
      </view>
    </u-row>
    <!-- 今天吃什么 -->
    <u-row>
      <view class="row-top">
        <u-col>
          <p class="headline">今天吃什么？</p>
        </u-col>
      </view>
    </u-row>
    <u-row>
      <view style="margin-top: 32rpx; width: 686rpx; height: 258rpx">
        <slideshow :list="themes" height="258rpx"></slideshow>
      </view>
    </u-row>
    <!-- 至尊奢华，照片永存 -->
    <u-row>
      <view class="row-top">
        <u-col>
          <p class="headline">至尊奢华，照片永存</p>
        </u-col>
      </view>
    </u-row>
    <u-row>
      <view style="margin-top: 32rpx; width: 686rpx">
        <swiper class="swipe swipe-photo" circular interval="2000">
          <swiper-item v-for="(item, i) in flex" :key="i">
            <view class="swpierBox">
              <view class="swpierBox-view-photo" @click="toStore(item)">
                <image :src="item.imgUrl"></image>
                <view class="card">
                  <span>{{ item.region }}</span>
                  <span>{{ item.desc }}</span>
                  <h2>{{ item.name }}</h2>
                  <p>{{ item.price }}</p>
                  <view class="red-round-btn">
                    <image :src="'/static/buynow_ico.png'"></image>
                    <span>在线订购</span>
                  </view>
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>
    </u-row>
    <u-row>
      <view class="row-top">
        <u-col>
          <p class="headline">旅行就是要吃！吃！吃！</p>
        </u-col>
      </view>
    </u-row>
    <u-row>
      <view style="margin-top: 32rpx; width: 720rpx">
        <u-scroll-list :indicator="false" class="swipe swipe-travel">
          <view
            v-for="(item, index) in tour"
            :key="index"
            @click="toSpecial(item)"
          >
            <view class="swpierBox">
              <view class="swpierBox-view-travel">
                <image :src="item.imgUrl"></image>
                <view class="card card-top">
                  <span class="must"> Must </span>
                  <span class="eat"> eat </span>
                  <h2 class="scenic">{{ item.name }}</h2>
                </view>
              </view>
            </view>
          </view>
        </u-scroll-list>
      </view>
    </u-row>
    <u-row>
      <view style="margin-top: 20rpx">
        <u-col>
          <p class="headline">现购、现吃！</p>
        </u-col>
      </view>
    </u-row>
    <u-row>
      <view style="margin-top: 32rpx; width: 720rpx">
        <u-scroll-list :indicator="false" class="swipe swipe-buy">
          <view
            v-for="(item, index) in instance"
            :key="index"
            @click="toStore(item)"
          >
            <view class="swpierBox">
              <view class="swpierBox-view-buy">
                <image :src="item.imgUrl"></image>
                <view class="card">
                  <view class="area">{{ item.region }}</view>
                  <span class="h5">{{ item.name }}</span>
                  <h2 class="h2">{{ item.menu }}</h2>
                  <p>
                    <image :src="'/static/buynow_ico.png'"></image>
                    {{ item.price }}
                  </p>
                  <view class="discounts">
                    <span>优惠</span>
                    <span>打折</span>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </u-scroll-list>
      </view>
    </u-row>
    <u-row>
      <view class="row-top">
        <u-col>
          <p class="headline">小众巷子，地道美食！</p>
        </u-col>
      </view>
    </u-row>
    <u-row>
      <view style="margin-top: 32rpx; width: 720rpx">
        <u-scroll-list :indicator="false" class="swipe swipe-buy">
          <view
            v-for="(item, index) in street"
            :key="index"
            @click="toStore(item)"
          >
            <view class="swpierBox">
              <view class="swpierBox-view-buy">
                <image :src="item.imgUrl"></image>
                <view class="card">
                  <view class="area">{{ item.region }}</view>
                  <span class="describe">{{ item.desc }}</span>
                  <h2 class="h2">{{ item.name }}</h2>
                  <p>
                    <image :src="'/static/buynow_ico.png'"></image>
                    {{ item.price }}
                  </p>
                  <view class="discounts">
                    <span>优惠</span>
                    <span>打折</span>
                    <span class="safe" v-if="item.award !== ''">{{
                      item.award
                    }}</span>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </u-scroll-list>
      </view>
    </u-row>
    <u-row>
      <view class="row-top">
        <u-col>
          <p class="headline">韩国人气美食店铺榜</p>
        </u-col>
      </view>
    </u-row>
    <u-row>
      <view style="margin-top: 32rpx; width: 720rpx">
        <u-scroll-list :indicator="false" class="swipe swipe-buy">
          <view
            v-for="(item, index) in best"
            :key="index"
            @click="toStore(item)"
          >
            <view class="swpierBox">
              <view class="swpierBox-view-buy">
                <image :src="item.imgUrl"></image>
                <view class="card">
                  <view class="area">{{ item.region }}</view>
                  <span class="describe">{{ item.desc }}</span>
                  <h2 class="h2">{{ item.name }}</h2>
                  <p>
                    <image :src="'/static/buynow_ico.png'"></image>
                    {{ item.price }}
                  </p>
                  <view class="discounts">
                    <span>优惠</span>
                    <span>打折</span>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </u-scroll-list>
      </view>
    </u-row>
    <u-row>
      <view class="row-top">
        <u-col>
          <p class="headline">超实惠推荐</p>
        </u-col>
      </view>
    </u-row>
    <u-row>
      <view style="margin-top: 32rpx; width: 720rpx">
        <u-scroll-list :indicator="false" class="swipe swipe-cheap">
          <view
            v-for="(item, index) in good_value"
            :key="index"
            @click="toStore(item)"
          >
            <view class="swpierBox">
              <view class="swpierBox-view-cheap">
                <image :src="item.imgUrl"></image>
                <view class="card">
                  <span>{{ item.region }}</span>
                  <span>{{ item.desc }}</span>
                  <h2>{{ item.name }}</h2>
                  <p>{{ item.price }}</p>
                  <view class="redbtn">
                    <b>在线订购</b>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </u-scroll-list>
      </view>
    </u-row>
    <!-- 选择市 -->
    <u-row>
      <view style="margin-top: 32rpx; width: 720rpx; position: relative">
        <u-col>
          <p class="headline">Must Go #</p>
        </u-col>
      </view>
    </u-row>
    <u-row>
      <view style="margin-top: 32rpx; width: 720rpx">
        <u-scroll-list :indicator="false" class="swipe swipe-travel">
          <view
            v-for="(item, index) in city"
            :key="index"
            @click="checkedCity(item)"
          >
            <view class="swpierBox">
              <view class="swpierBox-view-travel">
                <image :src="item.imgUrl"></image>
                <view class="card">
                  <p class="place">{{ item.name }}</p>
                  <p class="amount">{{ item.count | unitConverter }}个店铺</p>
                </view>
                <view class="checked" v-if="item.id == cityId">
                  <u-icon
                    name="checkmark"
                    color="#FFFFFF"
                    size="40rpx"
                  ></u-icon>
                </view>
              </view>
            </view>
          </view>
        </u-scroll-list>
      </view>
    </u-row>
    <!-- 选择区 -->
    <u-row>
      <view style="margin-top: 32rpx; width: 720rpx; position: relative">
        <u-col>
          <p class="headline">Must Go #</p>
          <span class="more" @click="toCity()">更多</span>
        </u-col>
        <p class="introduction">{{ cityDesc }}</p>
      </view>
    </u-row>
    <u-row>
      <view style="margin-top: 32rpx; width: 720rpx">
        <u-scroll-list :indicator="false" class="swipe swipe-travel">
          <view
            v-for="(item, index) in district"
            :key="index"
            @click="checkedDistrict(item)"
          >
            <view class="swpierBox">
              <view class="swpierBox-view-travel">
                <image :src="item.imgUrl"></image>
                <view class="card">
                  <p class="place">{{ item.name }}</p>
                  <p class="amount">{{ item.count | unitConverter }}个店铺</p>
                </view>
                <view class="checked" v-if="item.id == districtId">
                  <u-icon
                    name="checkmark"
                    color="#FFFFFF"
                    size="40rpx"
                  ></u-icon>
                </view>
              </view>
            </view>
          </view>
        </u-scroll-list>
      </view>
    </u-row>
    <!-- 选择区下的品类 -->
    <u-row>
      <view style="margin-top: 32rpx; width: 720rpx; position: relative">
        <u-col>
          <p class="headline">Must Eat #</p>
          <span class="more" @click="toCity()">更多</span>
        </u-col>
      </view>
    </u-row>
    <u-row>
      <view style="margin-top: 32rpx; width: 720rpx">
        <u-scroll-list :indicator="false" class="swipe swipe-travel">
          <view
            v-for="(item, index) in category"
            :key="index"
            @click="toSpecial(item)"
          >
            <view class="swpierBox" v-if="item.count">
              <view class="swpierBox-view-travel">
                <image :src="item.imgUrl"></image>
                <view class="card">
                  <p class="place">{{ item.name }}</p>
                  <p class="amount">{{ item.count | unitConverter }}个店铺</p>
                </view>
              </view>
            </view>
          </view>
        </u-scroll-list>
      </view>
    </u-row>
    <u-row>
      <view class="rail">
        <image :src="'/static/buynow_ico.png'"></image>支持支付&预订
        <image :src="'/static/reservation_ico.png'"></image>仅支持预定
      </view>
    </u-row>
    <!-- 选择区下的品类的店铺 -->
    <view v-for="(categories, i) in storeList" :key="i">
      <u-row>
        <view style="margin-top: 32rpx; width: 720rpx; position: relative">
          <u-col>
            <p class="headline">
              # {{ categories.topic1 }} # {{ categories.topic2 }}
            </p>
            <span class="more" @click="toSpecial(categories)">more</span>
          </u-col>
          <p class="introduction">{{ categories.desc }}</p>
        </view>
      </u-row>
      <u-row>
        <view style="margin-top: 32rpx; width: 720rpx">
          <u-scroll-list :indicator="false" class="swipe swipe-place">
            <view
              v-for="(store, index) in categories.store"
              :key="index"
              @click="toStoreId(store.sid)"
            >
              <view class="swpierBox">
                <view class="swpierBox-view-place">
                  <image :src="store.image"></image>
                  <view class="card">
                    <h3 class="h3">
                      {{ store.storeName }}
                      <template v-if="store.branchName"
                        >({{ store.branchName }})
                      </template>
                    </h3>
                    <view class="star">
                      <u-icon
                        name="star-fill"
                        color="#FF4A52"
                        size="36rpx"
                      ></u-icon>
                      <span class="score"
                        >{{ store.score || "0.0" }} ({{
                          store.count || 0 | unitConverter
                        }})</span
                      >
                    </view>
                    <span class="food">{{ store.menu }}</span>
                    <span class="food-info" v-if="store.label">{{
                      store.label
                    }}</span>
                    <h3 class="price">
                      {{ store.price | unitConverter }}
                      <span>{{ store.currency }}</span>
                    </h3>
                    <p class="order">
                      <image :src="'/static/buynow_ico.png'"></image>
                      支付&预订
                    </p>
                  </view>
                  <view class="heart" @click.stop="collect(i, index)">
                    <u-icon
                      name="heart"
                      color="#FFFFFF"
                      size="40rpx"
                      v-if="store.is_collect == 0"
                    ></u-icon>
                    <u-icon
                      name="heart-fill"
                      color="#FF4A52"
                      size="40rpx"
                      v-if="store.is_collect == 1"
                    ></u-icon>
                  </view>
                </view>
              </view>
            </view>
          </u-scroll-list>
        </view>
      </u-row>
    </view>
    <!-- 公司信息 -->
    <view class="company-info">
      <p>(株)REDTABLE 代表 都亥镕</p>
      <p>营业执照编号：206-86-50534</p>
      <p>通信销售业申报号码：2022-中区-1568</p>
      <p>旅游事业者（一般旅游业）登录号码：第2022-000073号</p>
      <p>首尔特别市中区明洞3街6号开阳大厦7楼</p>
      <p>T 82-2-6964-7955</p>
    </view>

    <!-- 弹窗 -->
    <u-popup :show="show" mode="center" @close="close(0)" @open="open()">
      <image class="popUp" src="/static/popup.png"></image>
      <view class="popUp-btn">
        <u-button @click="close(1)">
          <span>三天内不显示</span>
        </u-button>
        <u-button @click="close(0)">
          <span>关闭</span>
        </u-button>
      </view>
    </u-popup>
    <!-- 客服 -->
    <view class="service">
      <image
        src="/static/service.png"
        @click="
          toLink('/pages/webView/index?url=https://tourgpt.redtable.global/')
        "
      ></image>
    </view>
  </view>
</template>

<script>
import slideshow from "../../components/slideshow/slideshow.vue";
export default {
  components: {
    slideshow,
  },
  props: {},
  data() {
    return {
      // 弹窗
      show: false,
      banner: this.$imageHost + "/asset/banner/v2/main_banner_zh-Hans.jpg",
      // 今天吃什么
      themes: [],
      // 至尊奢华，照片永存
      flex: [],
      // 旅行就是要吃！吃！吃！
      tour: [],
      // 现购、现吃！
      instance: [],
      // 小众巷子，地道美食！
      street: [],
      // 韩国人气美食店铺榜
      best: [],
      // 超实惠推荐
      good_value: [],
      // Must Go #
      city: [],
      district: [],
      category: [],
      storeList: [],
      cityId: 0,
      districtId: 0,
      cityDesc: "",
    };
  },
  onLoad() {
    // this.$request.getToken();
    this.getList();
  },
  methods: {
    // 选择市
    checkedCity(item) {
      this.district = [];
      let newDistrict = [];
      item.district.map((row, i) => {
        newDistrict.push({
          id: row.id,
          imgUrl: this.$imageHost + row.commercial_area_file_path,
          name: row.translate_commercial_area_name,
          count: row.cnt,
        });
      });
      // 选择市的描述
      this.cityDesc = item.desc ?? "";
      // 根据选择市获取其下所有区
      this.district = newDistrict;
      // 选中的市
      this.cityId = item.id;
      // 选择市的默认区
      this.checkedDistrict(this.district[0]);
    },
    // 选择区
    checkedDistrict(item) {
      this.category = [];
      this.storeList = [];
      uni.request({
        url: this.$apiHost + "/front/must-eat/main",
        method: "get",
        data: {
          s_commercial_area_id: item.id,
          s_channel: "redtable",
          limit: 10,
          s_lang: "zh-Hans",
          // s_must_eat_id: '',
        },
        success: (res) => {
          let newCategory = [],
            newCategories = [];
          res.data.must_eats.map((row, i) => {
            // 选中区下的所有品类
            newCategory.push({
              id: row.id,
              imgUrl: this.$imageHost + row.must_eat_file_path,
              name: row.translate_must_eat_name,
              count: row.must_eat_count,
              link:
                "/pages/special/index?s_commercial_area_id=" +
                item.id +
                "&s_must_eat_id=" +
                row.id,
            });
            // 品类对应的店铺
            const categories = res.data.data[row.id].stores;
            let newStore = [];
            categories.map((cate, n) => {
              let img = cate.product_image ?? cate.store_image;
              newStore.push({
                id: row.id,
                sid: cate.store_id,
                pid: cate.product_id,
                image: this.$imageHost + img,
                storeName: cate.translate_store_name,
                branchName: cate.translate_branch_name,
                score: cate.rti_star,
                count: cate.show_cnt,
                menu: cate.translate_product_name,
                label: cate.translate_label_name,
                price: cate.price,
                currency: cate.currency,
                is_collect: cate.is_store_bookmarked,
              });
            });
            if (newStore.length > 0) {
              newCategories.push({
                topic1: row.translate_commercial_area_name,
                topic2: row.translate_must_eat_name ?? row.must_eat_name,
                desc: row.translate_must_eat_description ?? "",
                store: newStore,
                link:
                  "/pages/special/index?s_commercial_area_id=" +
                  row.commercial_area_id +
                  "&s_must_eat_id=" +
                  row.id,
              });
            }
          });
          this.category = newCategory;
          console.log(newCategory);
          this.storeList = newCategories;
        },
      });
      // 选中的区
      this.districtId = item.id;
    },
    // 获取首页数据
    getList() {
      // Must Go
      uni.request({
        url: this.$apiHost + "/common/select-city",
        method: "get",
        data: {
          s_lang: "zh-Hans",
        },
        success: (res) => {
          const city = res.data.data;
          let newCity = [];
          for (let item in city) {
            let image = city[item].location_file_path;
            newCity.push({
              id: city[item].id,
              imgUrl: this.$imageHost + image,
              name: city[item].translate_name2,
              count: city[item].cnt,
              district: city[item].commercial_areas,
              desc: city[item].translate_description,
            });
          }
          this.city = newCity;
          this.checkedCity(this.city[0]);
        },
      });
      // 其他
      uni.request({
        url: this.$apiHost + "/front/theme/main",
        method: "get",
        data: {
          s_commercial_area_id: "231",
          s_channel: "redtable",
          s_lang: "zh-Hans",
        },
        success: (res) => {
          const { themes, flex, tour, instance, street, best, good_value } =
            res.data;
          let newThemes = [],
            newFlex = [],
            newTour = [],
            newInstance = [],
            newStreet = [],
            newBest = [],
            newGoodValue = [];
          themes.map((item, index) => {
            newThemes.push({
              url: item["zh-Hans"],
              link:
                "/pages/special/index?s_commercial_area_id=" +
                item["com_area_id"] +
                "&s_must_eat_id=" +
                item["musteat_id"],
            });
          });
          flex.map((item, index) => {
            newFlex.push({
              id: item.id,
              imgUrl: item.image,
              region: item.region["zh-Hans"],
              desc: item.desc["zh-Hans"],
              name: item.name["zh-Hans"],
              price: item.price,
            });
          });
          tour.map((item, index) => {
            newTour.push({
              imgUrl: item.image,
              name: item.name["zh-Hans"],
              link:
                "/pages/special/index?s_commercial_area_id=" +
                item["com_area_id"] +
                "&s_must_eat_id=" +
                item["must_eat_id"],
            });
          });
          instance.map((item, index) => {
            newInstance.push({
              id: item.id,
              imgUrl: item.image,
              region: item.region["zh-Hans"],
              menu: item.menu["zh-Hans"],
              name: item.name["zh-Hans"],
              price: item.price,
            });
          });
          street.map((item, index) => {
            newStreet.push({
              id: item.id,
              imgUrl: item.image,
              region: item.region["zh-Hans"],
              desc: item.desc["zh-Hans"],
              name: item.name["zh-Hans"],
              price: item.price,
              award: item.award["zh-Hans"],
            });
          });
          best.map((item, index) => {
            newBest.push({
              id: item.id,
              imgUrl: item.image,
              region: item.region["zh-Hans"],
              desc: item.desc["zh-Hans"],
              name: item.name["zh-Hans"],
              price: item.price,
            });
          });
          good_value.map((item, index) => {
            newGoodValue.push({
              id: item.id,
              imgUrl: item.image,
              region: item.region["zh-Hans"],
              desc: item.desc["zh-Hans"],
              name: item.name["zh-Hans"],
              price: item.price,
            });
          });
          this.themes = newThemes;
          this.flex = newFlex;
          this.tour = newTour;
          this.instance = newInstance;
          this.street = newStreet;
          this.best = newBest;
          this.good_value = newGoodValue;
        },
      });
    },
    open() {
      console.log("open");
    },
    close(flag) {
      this.show = false;
    },
    search(value) {
      uni.navigateTo({
        url: "/pages/search/index?keyword=" + value,
      });
    },
    toLink(url) {
      uni.navigateTo({ url });
    },
    toSpecial(item) {
      uni.navigateTo({
        url: item.link,
      });
    },
    toStore(item) {
      uni.navigateTo({
        url: "/pages/store/index?id=" + item.id,
      });
    },
    toStoreId(id) {
      uni.navigateTo({
        url: "/pages/store/index?id=" + id,
      });
    },
    toCity() {
      // uni.$emit('city',{cid:this.cityId})
      // uni.switchTab({
      // 	url: '/pages/city/index'
      // })
      uni.reLaunch({
        url: "/pages/city/index?cid=" + this.cityId,
      });
    },
    // 收藏
    collect(i, index) {
      const token = uni.getStorageSync("token");
      const { pid, sid } = this.storeList[i].store[index];
      uni.request({
        url: this.$apiHost + "/front/user/bookmark",
        method: "POST",
        data: {
          product_id: pid,
          store_id: sid,
        },
        header: {
          Authorization: "Bearer " + token,
        },
        success: (res) => {
          if (res.data.status !== "success") return;
          if (res.data.data === null) {
            console.log("取消");
            this.storeList[i].store[index].is_collect = 0;
          } else {
            console.log("收藏");
            this.storeList[i].store[index].is_collect = 1;
          }
        },
      });
    },
  },
};
</script>

<style lang="scss">
.row-top {
  margin-top: 32rpx;
}

.headline {
  font-size: 32rpx;
  font-weight: bold;
  color: #131313;
}

.popUp {
  width: 750rpx;
  height: 750rpx;
}

.popUp-btn {
  display: flex;
}

.popUp-btn span {
  font-size: 32rpx;
  font-weight: 400;
  color: #707070;
}

.indicator {
  @include flex(row);
  justify-content: center;

  &__dot {
    height: 6px;
    width: 6px;
    border-radius: 100px;
    background-color: rgba(255, 255, 255, 0.35);
    margin: 0 5px;
    transition: background-color 0.3s;

    &--active {
      background-color: #ffffff;
    }
  }
}

.indicator-num {
  padding: 2px 0;
  background-color: rgba(0, 0, 0, 0.35);
  border-radius: 100px;
  width: 35px;
  @include flex;
  justify-content: center;

  &__text {
    color: #ffffff;
    font-size: 12px;
  }
}

.swipe {
  /deep/ .uni-swiper-dot {
    margin-right: 16rpx;
    width: 28rpx;
    height: 3px;
    border-radius: 8rpx;
  }
}

.swipe .swpierBox {
  height: 100%;
  display: flex;
}

.swipe-photo {
  height: 400rpx;
}

.swpierBox-view-photo {
  position: relative;
  width: 686rpx;
  height: 400rpx;
  // margin-right: 10rpx;

  image {
    width: 686rpx;
    height: 400rpx;
    border-radius: 8rpx;
  }

  .card {
    position: absolute;
    top: 20rpx;
    left: 0;
    padding-left: 30rpx;
    width: 638rpx;
    height: 380rpx;
    color: #ffffff;
    display: flex;
    flex-direction: column;
  }

  .card span {
    margin-top: 16rpx;
    font-size: 24rpx;
    font-weight: 400;
  }

  .card h2 {
    margin-top: 26rpx;
    font-size: 48rpx;
    font-weight: bold;
  }

  .card p {
    margin-top: 20rpx;
    font-size: 32rpx;
    font-weight: 400;
  }
}

.red-round-btn {
  margin-top: 50rpx;
  margin-left: 402rpx;
  width: 226rpx;
  height: 60rpx;
  background: #ff4a52;
  border-radius: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.red-round-btn image {
  width: 48rpx;
  height: 48rpx;
}

.red-round-btn span {
  margin: 0 !important;
  font-size: 28rpx;
  font-weight: 400;
}

.swipe-travel {
  height: 220rpx;
}

.swpierBox-view-travel {
  position: relative;
  width: 284rpx;
  height: 220rpx;
  margin-right: 20rpx;

  image {
    width: 284rpx;
    height: 220rpx;
    border-radius: 8rpx;
  }

  .card {
    position: absolute;
    top: 0;
    left: 0;
    color: #ffffff;
    width: 284rpx;
    height: 170rpx;
  }

  .card-top {
    margin-top: 30rpx;
  }

  .checked {
    position: absolute;
    top: 0rpx;
    left: 220rpx;
  }
}

.must {
  margin-left: 82rpx;
  padding: 2rpx 4rpx;
  font-weight: bold;
  font-size: 24rpx;
  background-color: #000000;
  border-radius: 4rpx;
  line-height: 0rpx;
}

.eat {
  padding: 2rpx 4rpx;
  font-weight: bold;
  font-size: 24rpx;
  background-color: #ff4a52;
  border-radius: 0rpx 4rpx 4rpx 0rpx;
}

.scenic {
  margin-top: 10rpx;
  font-size: 64rpx;
  font-weight: 400;
  text-align: center;
}

.swipe-buy {
  height: 486rpx;
}

.swpierBox-view-buy {
  position: relative;
  width: 294rpx;
  margin-right: 10rpx;

  image {
    width: 264rpx;
    height: 200rpx;
    border-radius: 8rpx;
  }

  .card {
    top: 0;
    left: 0;
    width: 264rpx;
    margin-bottom: 20rpx;
  }

  .card p {
    margin-top: 20rpx;
    font-size: 1em;
    font-weight: 700;
    line-height: 16px;
  }

  .card p image {
    width: 24px;
    height: 24px;
    float: left;
    margin-top: -3px;
    margin-right: 5px;
    margin-left: -2px;
  }
}

.discounts {
  width: 260rpx;
  height: 40rpx;
  margin-top: 26rpx;
}

.discounts :first-child {
  padding: 6rpx;
  background: #ff4a52;
  border-radius: 4rpx 0rpx 0rpx 4rpx;
  opacity: 1;
  border: 2rpx solid #ff4a52;
  font-size: 24rpx;
  font-weight: 400;
  color: #ffffff;
  line-height: 0rpx;
}

.discounts :nth-child(2) {
  padding: 6rpx;
  background: #ffffff;
  border-radius: 0rpx 4rpx 4rpx 0rpx;
  opacity: 1;
  border: 2rpx solid #ff4a52;
  font-size: 24rpx;
  font-weight: 400;
  color: #ff4a52;
  line-height: 0rpx;
}

.safe {
  margin-left: 10rpx;
  padding: 6rpx;
  background: #ffffff;
  border-radius: 4rpx 4rpx 4rpx 4rpx;
  opacity: 1;
  border: 2rpx solid #10ad95;
  font-size: 24rpx;
  font-weight: 400;
  color: #10ad95;
  line-height: 0rpx;
}

.area {
  // width: 116rpx;
  // height: 26rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #333333;
  margin-top: 20rpx;
}

.describe {
  width: 116rpx;
  height: 26rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #333333;
  line-height: 0rpx;
  white-space: pre-wrap;
}

.h5 {
  // margin-top: 20rpx;
  width: 112rpx;
  height: 28rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #888888;
}

.h2 {
  margin-top: 16rpx;
  // height: 30rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  overflow: hidden;
}

.swipe-cheap {
  height: 400rpx;
}

.swpierBox-view-cheap {
  position: relative;
  width: 284rpx;
  height: 400rpx;
  margin-right: 10rpx;

  image {
    width: 284rpx;
    height: 400rpx;
    border-radius: 8rpx;
  }

  .card {
    position: absolute;
    top: 0;
    left: 0;
    width: 284rpx;
    height: 400rpx;
    color: #ffffff;
    display: flex;
    flex-direction: column;
  }

  .card span {
    margin-top: 16rpx;
    padding-left: 20rpx;
    font-size: 24rpx;
    font-weight: 400;
  }

  .card h2 {
    margin-top: 30rpx;
    padding-left: 20rpx;
    font-size: 40rpx;
    font-weight: bold;
  }

  .card p {
    margin-top: 16rpx;
    padding-left: 20rpx;
    font-size: 32rpx;
    font-weight: bold;
  }
}

.redbtn {
  position: absolute;
  bottom: 0rpx;
  width: 284rpx;
  height: 64rpx;
  background: rgba(255, 74, 82, 0.8);
  border-radius: 0rpx 0rpx 4rpx 4rpx;
}

.redbtn b {
  margin-top: 30rpx;
  text-align: center;
  line-height: 0rpx;
}

.more {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 28rpx;
  font-weight: 400;
  color: #777777;
}

.introduction {
  font-size: 28rpx;
  font-weight: 400;
  color: #888888;
}

.place {
  margin-top: 20rpx;
  margin-left: 20rpx;
  font-size: 40rpx;
  font-weight: 400;
  color: #ffffff;
}

.amount {
  margin-top: 20rpx;
  margin-left: 20rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #ffffff;
}

.rail {
  width: 686rpx;
  height: 88rpx;
  background: #f3f3f3;
  border-radius: 4rpx 4rpx 4rpx 4rpx;
  opacity: 1;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  font-weight: 400;
  color: #888888;
}

.rail image {
  margin-left: 20rpx;
  margin-right: 10rpx;
  width: 48rpx;
  height: 48rpx;
}

.swipe-place {
  height: 650rpx;
}

.swpierBox-view-place {
  position: relative;
  width: 294rpx;
  height: 640rpx;
  margin-right: 10rpx;
  border-radius: 8rpx;
  border: 2rpx solid #e8e8e8;

  image {
    width: 294rpx;
    height: 200rpx;
    border-top-left-radius: 8rpx;
    border-top-right-radius: 8rpx;
  }

  .card {
    top: 0;
    left: 0;
    margin-left: 20rpx;
    width: 264rpx;
    height: 200rpx;
  }

  .card p {
    margin-top: 20rpx;
    font-size: 1em;
    font-weight: 700;
    line-height: 16px;
  }

  .card p image {
    width: 44rpx;
    height: 44rpx;
    float: left;
    margin-top: -3px;
    margin-right: 5px;
    margin-left: -2px;
  }

  .heart {
    position: absolute;
    top: 12rpx;
    left: 220rpx;
  }
}

.h3 {
  margin-top: 16rpx;
  margin-bottom: 8rpx;
  width: 244rpx;
  height: 56rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #000000;
  line-height: 28rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-all;
}

.star {
  position: relative;
}

.score {
  position: absolute;
  top: 6rpx;
  left: 40rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #777777;
  line-height: 28rpx;
}

.food {
  margin-top: 20rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #000000;
  line-height: 28rpx;
  display: inline-block;
}

.food-info {
  font-size: 24rpx;
  font-weight: 400;
  color: #888888;
  line-height: 28rpx;
  display: inline-block;
}

.price {
  margin-top: 20rpx;
  font-size: 32rpx;
  font-weight: 400;
  color: #000000;
  line-height: 28rpx;
}

.price span {
  font-size: 24rpx;
  font-weight: 400;
  color: #777777;
  line-height: 28rpx;
}

.order {
  width: 264rpx;
  height: 24rpx;
  font-size: 24rpx !important;
  font-weight: 400 !important;
  color: #888888;
}

.service {
  position: fixed;
  right: 20rpx;
  bottom: 20rpx;
  image {
    width: 80rpx;
    height: 80rpx;
  }
}
.company-info {
  background-color: #f3f3f3;
  padding: 40rpx;
  p {
    margin-bottom: 14rpx;
    color: #999;
    font-size: 24rpx;
  }
}
</style>
