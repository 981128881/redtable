<template>
  <view>
    <image :src="info.storeImgurl" class="banner"></image>
    <view class="content">
      <p class="name">
        {{ info.translate_name }}
        <template v-if="info.translate_branch_name"
          >( {{ info.translate_branch_name }})</template
        >
      </p>
      <view class="area">
        <span>{{ info.area }}</span>
      </view>
      <view class="star">
        <u-icon name="star-fill" color="#FF4A52" size="36rpx"></u-icon>
        <span class="score"
          >{{ info.rti_star || "0.0" }}({{
            info.show_cnt || 0 | unitConverter
          }})</span
        >
      </view>
    </view>
    <view
      class="discount"
      v-for="(item, index) in info.promotions"
      :key="index"
    >
      <p>{{ item.translate_name }}</p>
      <span class="discount-red">打{{ item.max_discount_rate * 100 }}%</span>
      <span class="discount-info"
        >(最多可减{{
          parseInt(item.max_discount_price) | unitConverter
        }}KRW)截止{{ item.date_to }}</span
      >
    </view>
    <view class="details">
      <p>
        <image :src="'/static/location.png'"></image>
        <span>{{ info.address_road }}</span>
      </p>
      <p>
        <image :src="'/static/phone.png'"></image>
        <span>{{ info.telephone }}</span>
      </p>
      <p>
        <image :src="'/static/time.png'"></image>
        <span>{{ info.optime }}</span>
      </p>
      <p>
        <image :src="'/static/flag.png'"></image>
        <span>{{ info.translate_description }}</span>
      </p>
    </view>
    <view class="caption">
      <p class="subtitle">招牌菜</p>
      <span class="more" @click="toStoreMenu()">更多</span>
      <u-scroll-list :indicator="false" class="swipe swipe-place">
        <view
          v-for="(item, index) in products"
          :key="index"
          @click="toProductInfo(item.id)"
        >
          <view class="swpierBox">
            <view class="swpierBox-view-place">
              <image :src="item.imgUrl"></image>
              <view class="card">
                <p>{{ item.translate_name }}</p>
                <p>
                  {{ item.price | unitConverter
                  }}<span>{{ item.currency }}</span>
                </p>
              </view>
              <view class="heart" @click.stop="collect('product', item, index)">
                <u-icon
                  name="heart"
                  color="#FFFFFF"
                  size="40rpx"
                  v-if="item.is_bookmarked == 0"
                ></u-icon>
                <u-icon
                  name="heart-fill"
                  color="#FF4A52"
                  size="40rpx"
                  v-if="item.is_bookmarked == 1"
                ></u-icon>
              </view>
            </view>
          </view>
        </view>
      </u-scroll-list>
    </view>
    <view class="other">
      <p class="subtitle" v-if="awards.length > 0">Award</p>
      <view
        v-for="(item, index) in awards"
        :key="index"
        v-if="awards.length > 0"
      >
        <span class="description">
          {{ item.translate_type || "" }} {{ item.translate_grade || "" }}
          {{ item.year || "" }}
        </span>
      </view>
      <p class="subtitle" v-if="medias.length > 0">Media</p>
      <view
        v-for="(item, index) in medias"
        :key="index"
        v-if="medias.length > 0"
      >
        <span class="description">
          {{ item.translate_media || "" }} {{ item.translate_title || "" }}
          {{ item.round || "" }} {{ item.date || "" }}
        </span>
      </view>
      <p class="subtitle" v-if="buyNow.length > 0">Buy Now</p>
      <view
        class="external"
        v-for="(item, index) in buyNow"
        :key="index"
        v-if="buyNow.length > 0"
      >
        <view class="external-link" @click="toStore(item)">{{
          item.ota_name
        }}</view>
      </view>
      <p class="subtitle">Reviews & Images</p>
      <view class="external">
        <view class="external-link" @click="toLink('Google')">Google</view>
        <view class="external-link" @click="toLink('Naver')">Naver</view>
        <view class="external-link" @click="toLink('Tripadvisor')"
          >Tripadvisor</view
        >
        <view class="external-link" @click="toLink('Ctrip')">Ctrip</view>
      </view>
    </view>
    <view class="other">
      <p class="subtitle">预定日期</p>
      <calendarwatch
        :dot_week_lists="dot_week_lists"
        :dot_remove_lists="dot_remove_lists"
      ></calendarwatch>
      <view v-for="(item, index) in info.optime" :key="index">
        <span class="description">{{ item }}</span>
      </view>
    </view>
    <view class="other">
      <p class="subtitle">设施信息</p>
      <u-checkbox-group size="32" iconSize="32" disabled>
        <u-checkbox
          v-for="(item, index) in facilityOptions"
          :key="index"
          :name="item.name"
          :label="item.name"
          :checked="item.checked"
          activeColor="red"
          size="32"
          labelSize="32"
        ></u-checkbox>
      </u-checkbox-group>
    </view>
    <view class="other">
      <p class="subtitle">位置信息</p>
      <span class="description" @click="copyBtn">{{ info.address_road }}</span>
      <map
        style="width: 100%; height: 300px"
        :latitude="latitude"
        :longitude="longitude"
        :markers="covers"
      ></map>
      <!-- <view class="container">
				<web-view :src="'https://www.nyyear.com/index.html'" :fullscreen="false"></web-view>
			</view> -->
    </view>
    <view class="other">
      <p class="subtitle">History</p>
      <u-list>
        <u-list-item v-for="(item, index) in historyList" :key="index">
          <view class="list-item">
            <view class="user">
              <view class="user-profile">
                <image :src="item.imgUrl"></image>
              </view>
              <view class="user-info">
                <view>{{ nameToMasking(item.user_name) || "Guest" }}</view>
                <span class="description">{{ item.created_at_utc }}(UTC)</span>
              </view>
            </view>
            <p>{{ item.event || "" }}</p>
          </view>
        </u-list-item>
      </u-list>
    </view>
    <view class="list-more" @click="historyLoadMore()">更多</view>
    <!-- 公司信息 -->
    <view class="company-info">
      <p>(株)REDTABLE 代表 都亥镕</p>
      <p>营业执照编号：206-86-50534</p>
      <p>通信销售业申报号码：2022-中区-1568</p>
      <p>旅游事业者（一般旅游业）登录号码：第2022-000073号</p>
      <p>首尔特别市中区明洞3街6号开阳大厦7楼</p>
      <p>T 82-2-6964-7955</p>
    </view>
    <view class="footer">
      <view class="footer-heart" @click.stop="collect('store')">
        <u-icon
          name="heart"
          color="#FFFFFF"
          size="40rpx"
          v-if="info.is_bookmarked == 0"
        ></u-icon>
        <u-icon
          name="heart-fill"
          color="#FF4A52"
          size="40rpx"
          v-if="info.is_bookmarked == 1"
        ></u-icon>
      </view>
      <view class="order" @click="toStoreMenu()">
        <image :src="'/static/buynow_ico.png'"></image>
        <span>在线订购</span>
      </view>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import calendarwatch from "../../components/calendarwatch/calendarwatch.vue";
import { switchReview } from "../../common/js/history.js";
import { getOption } from "../../common/js/facility.js";
export default {
  components: {
    calendarwatch,
  },
  props: {},
  data() {
    return {
      option: {},
      info: {},
      products: [],
      awards: [],
      medias: [],
      buyNow: [],
      dot_week_lists: [],
      dot_remove_lists: [],
      facilityOptions: [],
      history: [],
      historyList: [],
      noData: false,
      limit: 10,
      // url: '/hybrid/html/map.html?',
      // url: 'https://www.nyyear.com/index.html',
      // 腾讯地图
      latitude: 37.561785,
      longitude: 126.984258,
      covers: [],
      current: 1,
    };
  },
  onLoad(option) {
    this.option = option;
    this.getList();
  },
  methods: {
    copyBtn(e) {
      // var that = this;
      uni.setClipboardData({
        data: "dfsdfsdfsdfsdfsdfs",
        success: function (res) {
          uni.showToast({
            title: "复制成功",
          });
        },
        fail: function (res) {
          uni.showToast({
            title: "复制失败",
          });
        },
      });
    },
    // 获取数据
    getList() {
      uni.request({
        url: this.$apiHost + "/front/store/" + this.option.id,
        method: "get",
        data: {
          s_lang: "zh-Hans",
        },
        success: (res) => {
          console.log("success", res.data);
          this.getCollect();
          const {
            data,
            promotions,
            products,
            awards,
            medias,
            ota_links,
            store_bisuness_times,
            store_holidays,
            store_holiday_temps,
            store_holiday_publics,
            options,
            live_events,
          } = res.data;
          let area_type = "",
            area_city = "",
            area_district = "",
            newProducts = [],
            newOptions = [];
          area_type = data.translate_store_label_name ?? data.store_label_name;
          area_city = data.location_translate_name2 ?? data.location_name2;
          area_district = data.location_translate_name3 ?? data.location_name3;
          area_type += " / " + area_city + " " + area_district;

          // 招牌菜
          products.map((item, index) => {
            newProducts.push({
              ...item,
              // price: item.price && Number(item.price).toLocaleString('ko-kr'),
              imgUrl: this.$imageHost + item.product_image,
              // link: '/pages/special/index?s_commercial_area_id=' + item.id +
              // 	'&s_must_eat_id=' + item.id
            });
          });
          // 预定日期: store_bisuness_times取星期几,其余3个在星期几的范围内刨除日期
          store_bisuness_times.map((item, index) => {
            this.dot_week_lists.push(item.day);
          });
          store_holidays.map((item, index) => {
            this.dot_remove_lists.push(item.date);
          });
          store_holiday_temps.map((item, index) => {
            this.dot_remove_lists.push(item.date);
          });
          store_holiday_publics.map((item, index) => {
            this.dot_remove_lists.push(item.date);
          });
          // 设施信息
          let facility = getOption(data.option);
          for (let item in options) {
            let checked = false;
            if (facility.indexOf(options[item].value) > -1) {
              checked = true;
            }
            newOptions.push({
              name: options[item].name["zh-Hans"],
              value: options[item].value,
              checked: checked,
            });
          }
          this.info = data;
          this.info.storeImgurl = this.$imageHost + data.store_image;
          this.info.area = area_type;
          this.info.promotions = promotions;
          this.info.optime = data.translate_optime
            ? data.translate_optime.split("｜")
            : "";
          this.products = newProducts;
          this.awards = awards;
          this.medias = medias;
          this.buyNow = ota_links;
          this.latitude = parseFloat(data.latitude).toFixed(6);
          this.longitude = parseFloat(data.longitude).toFixed(6);
          this.facilityOptions = newOptions;
          this.history = live_events;
          this.historyLoadMore();
        },
      });
    },
    toStoreMenu() {
      uni.navigateTo({
        url: "/pages/storeMenu/index?id=" + this.option.id,
      });
    },
    toProductInfo(id) {
      uni.navigateTo({
        url: `/pages/productionInfo/index?id=${id}`,
      });
    },
    toLink(type) {
      const { name } = this.info;
      let url = "";
      switch (type) {
        case "Google":
          url =
            "https://www.google.com/search?q=" +
            name +
            "&sxsrf=ALiCzsbmQJ7QykDtW8md9xxoQKePYT5wCA%3A1656584302771&source=hp&ei=bni9YveTLJH3-Qa-y7ngBw&iflsig=AJiK0e8AAAAAYr2GfppF8oBM0bKP1d9l2IH0loXVhmkG&ved=0ahUKEwj3gp63-dT4AhWRe94KHb5lDnwQ4dUDCAk&uact=5&oq=%EA%B3%B0%EA%B5%AD%EC%8B%9C%EC%A7%91&gs_lcp=Cgdnd3Mtd2l6EAMyCwguEIAEEMcBEK8BMgUIABCABDIFCAAQgAQyCwguEIAEEMcBEK8BMgQIABAeMgQIABAeMgYIABAeEA8yBAgAEB4yBAgAEB4yBggAEB4QDzoECCMQJzoLCAAQgAQQsQMQgwE6BAguEAM6BAgAEAM6BQguEIAEOhEILhCABBCxAxCDARDHARCvAToICAAQgAQQsQM6CAguEIAEELEDOgsILhCABBCxAxDUAlAAWO4IYIcKaAJwAHgCgAF-iAGpCZIBBDEuMTCYAQCgAQE&sclient=gws-wiz";
          break;
        case "Naver":
          url =
            "https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=" +
            name;
          break;
        case "Tripadvisor":
          url = "https://www.tripadvisor.co.kr/Search?q=" + name;
          break;
        case "Ctrip":
          url =
            "https://kr.trip.com/global-search/searchlist/search/?keyword=" +
            name;
          break;
      }
      console.log("url", url);
    },
    // 收藏
    collect(type, item, index) {
      const token = uni.getStorageSync("token");
      let param = {};
      if (type === "store") {
        param.store_id = this.info.id;
      }
      if (type === "product") {
        param.store_id = item.store_id;
        param.product_id = item.id;
      }
      uni.request({
        url: this.$apiHost + "/front/user/bookmark",
        method: "POST",
        data: param,
        header: {
          Authorization: "Bearer " + token,
        },
        success: (res) => {
          if (res.data.status !== "success") return;
          if (res.data.data === null) {
            console.log("取消");
            if (type === "store") this.info.is_bookmarked = 0;
            if (type === "product") this.products[index].is_bookmarked = 0;
            return;
          }
          console.log("收藏");
          if (type === "store") this.info.is_bookmarked = 1;
          if (type === "product") this.products[index].is_bookmarked = 1;
        },
      });
    },
    // 获取当前店铺是否被收藏
    getCollect() {
      const token = uni.getStorageSync("token");
      console.log(this.option);
      uni.request({
        url: this.$apiHost + "/front/user/bookmark",
        header: {
          Authorization: "Bearer " + token,
        },
        data: {
          store_id: this.option.id,
        },
        method: "GET",
        success: ({ data, statusCode, header }) => {
          const collectList = data.data.filter(
            (ele) => !ele.product_id && ele.store_id == this.option.id
          );
          if (collectList.length) {
            this.info.is_bookmarked = 1;
          }
        },
      });
    },
    historyLoadMore() {
      if (this.noData == true) {
        this.$refs.uToast.show({
          message: "没有了",
          type: "default",
        });
        return;
      }
      uni.request({
        url: this.$apiHost + "/front/live-event",
        method: "get",
        data: {
          s_order1: "created_at_utc",
          s_order2: 1,
          s_store_id: this.option.id,
          s_lang: "zh-Hans",
          offset: this.current,
        },
        success: (res) => {
          let data = res.data.data;
          if (!data.length) {
            this.noData = true;
            this.$refs.uToast.show({
              message: "没有更多了",
              type: "default",
            });
            return;
          }
          ++this.current;
          let mapData = data.map((item) => {
            let url = item.ip2nation_code
              ? "/asset/image/flags/1x1/" + item.ip2nation_code + ".svg"
              : "/asset/image/error_img.png";
            return {
              ...item,
              imgUrl: this.$imageHost + url,
              event: switchReview(item),
            };
          });
          this.historyList.push(...mapData);
        },
      });
    },

    // 隐藏用户名
    nameToMasking(name) {
      if (!name) return null;
      const length = name.length;
      const visibleCount = Math.ceil(length / 4);
      const hiddenCount = length - visibleCount * 2;
      const initial = name.substr(0, visibleCount);
      const masking = String("*").repeat(hiddenCount);
      const last = name.substr(visibleCount * -1, visibleCount);
      return `${initial}${masking}${last}`;
    },
  },
};
</script>

<style lang="scss">
.banner {
  width: 750rpx;
  height: 600rpx;
}

.content {
  margin: 28rpx 32rpx;
  width: 686rpx;
}

.name {
  font-size: 40rpx;
  font-weight: bold;
  color: #181818;
}

.subtitle {
  font-size: 32rpx;
  font-weight: bold;
  color: #131313;
}

.area {
  margin-top: 20rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #888888;
}

.star {
  margin-top: 20rpx;
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

.discount {
  margin: 20rpx 32rpx;
  padding: 32rpx 50rpx;
  border-radius: 8rpx;
  border: 2rpx dashed #e8e8e8;
}

.discount-red {
  font-size: 40rpx;
  font-weight: bold;
  color: #ff4a52;
}

.discount-info {
  font-size: 28rpx;
  color: #888888;
}

.details {
  margin: 0 32rpx;
}

.details p {
  margin-bottom: 20rpx;
  display: flex;
}

.details p image {
  margin-right: 12rpx;
  width: 28rpx;
  height: 28rpx;
}

.details p span {
  width: 646rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #888888;
}

.caption {
  position: relative;
  margin: 32rpx;
}

.more {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 28rpx;
  font-weight: 400;
  color: #777777;
}

.swipe {
  /deep/ .uni-swiper-dot {
    margin-right: 16rpx;
    width: 28rpx;
    height: 3px;
    border-radius: 8rpx;
  }
}

.swipe-place {
  height: 404rpx;
}

.swpierBox-view-place {
  position: relative;
  width: 284rpx;
  height: 404rpx;
  margin-right: 10rpx;
  border-radius: 8rpx;
  border: 2rpx solid #e8e8e8;

  image {
    width: 284rpx;
    height: 220rpx;
    border-radius: 8rpx;
  }

  .card {
    top: 0;
    left: 0;
    width: 284rpx;
    height: 184rpx;
  }

  .card p {
    font-size: 28rpx;
    font-weight: bold;
    color: #333333;
  }

  .heart {
    position: absolute;
    top: 12rpx;
    left: 220rpx;
  }
}

.other {
  margin: 0 32rpx;
}

.description {
  margin: 10rpx auto;
  font-size: 28rpx;
  font-weight: 400;
  color: #888888;
  display: block;
}

.external {
  margin-top: 10rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.external-link {
  text-align: center;
  width: 330rpx;
  height: 40px;
  line-height: 40px;
  border: 1px solid #dddddd;
  border-radius: 3px;
  margin-bottom: 5px;
}

/deep/ .u-checkbox-group {
  flex-wrap: wrap;
  margin-bottom: 32rpx;
}

/deep/ .u-checkbox {
  margin-top: 38rpx;
  width: 320rpx;
}

/deep/ .u-list {
  height: 100% !important;
  margin-top: 20rpx;
}

.list-item {
  border-bottom: 2rpx solid #e8e8e8;
}

.list-item p {
  margin-bottom: 32rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
}

.list-item p span {
  color: #ff4a52;
}

.user {
  display: flex;
  margin: 32rpx 0;
}

.user-profile {
  border-radius: 100%;
  width: 80rpx;
  height: 80rpx;
  border: 1px solid #eeeeee;
}

.user-profile image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 80rpx;
}

.user-info {
  margin-left: 16rpx;
  font-size: 32rpx;
  font-weight: 400;
  color: #333333;
}

.list-more {
  margin: 32rpx;
  border-radius: 6rpx;
  border: 2rpx solid #dddddd;
  font-size: 32rpx;
  font-weight: bold;
  line-height: 100rpx;
  color: #666666;
  text-align: center;
}

.company-info {
  padding: 60rpx 32rpx 200rpx;
  background: #f3f3f3;
  line-height: 40rpx;
  font-size: 24rpx;
  font-weight: 300;
  color: #888888;
}

.company-info span {
  display: block;
}

.footer {
  padding: 30rpx 32rpx;
  width: 100%;
  height: 100rpx;
  background-color: #ffffff;
  display: flex;
  position: fixed;
  bottom: 0;
}

.footer-heart {
  width: 100rpx;
  height: 100rpx;
  background: #dddddd;
  border-radius: 4rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.order {
  margin-left: 20rpx;
  width: 566rpx;
  border-radius: 4rpx;
  background: #ff4a52;
  font-size: 28rpx;
  font-weight: bold;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.order image {
  width: 48rpx;
  height: 48rpx;
}
.company-info {
  background-color: #f3f3f3;
  padding: 40rpx;
  margin-bottom: 160rpx;
  p {
    margin-bottom: 14rpx;
    color: #999;
    font-size: 24rpx;
  }
}
</style>
