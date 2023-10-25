<template>
  <view style="margin: 32rpx">
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
    <!-- 标签栏 -->
    <view class="tabs-list">
      <u-tabs :list="tabs" lineColor="#FF4A52" @click="click"></u-tabs>
    </view>
    <!-- 分页 -->
    <view class="u-page">
      <u-row justify="space-between" gutter="10">
        <u-list @scrolltolower="scrolltolower" height="calc(100vh - 300rpx)">
          <u-list-item class="listItem">
            <u-list-item
              class="setListItem"
              v-for="(item, index) in list"
              :key="index"
            >
              <view class="itemBox" @click="toStore(item)">
                <view>
                  <image class="itemImg" :src="item.imgUrl"></image>
                </view>
                <h3 class="shop-name">{{ item.translate_store_name }}</h3>
                <view class="star">
                  <u-icon
                    name="star-fill"
                    color="#FF4A52"
                    size="36rpx"
                  ></u-icon>
                  <span class="score"
                    >{{ item.rti_star || "0.0" }}
                    (
                    {{ item.show_cnt || 0 | unitConverter }}
                    )</span
                  >
                </view>
                <template v-if="item.product_id">
                  <span class="food">{{ item.translate_product_name }}</span>
                  <span class="food-info">{{
                    item.translate_store_label_name
                  }}</span>
                  <h3 class="price">
                    {{ item.product_price | unitConverter }}
                    <span>{{ item.currency }}</span>
                  </h3>
                  <p class="order">
                    <image :src="'/static/buynow_ico.png'"></image>
                    在线订购
                  </p>
                </template>
                <view class="heart" @click.stop="collect(index)">
                  <u-icon
                    name="heart"
                    color="#FFFFFF"
                    size="40rpx"
                    v-if="item.is_collect == 0"
                  ></u-icon>
                  <u-icon
                    name="heart-fill"
                    color="#FF4A52"
                    size="40rpx"
                    v-if="item.is_collect == 1"
                  ></u-icon>
                </view>
              </view>
            </u-list-item>
          </u-list-item>
        </u-list>
      </u-row>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 滑到底部加载更多
      offset: 1,
      noData: false,
      tabs: [
        {
          name: "必吃1",
        },
      ],
      list: [],
    };
  },
  onLoad() {},
  onShow: function () {
    if (uni.getStorageSync("token")) {
      this.getList();
    } else {
      uni.navigateTo({
        url: "/pages/login/index",
      });
    }
  },
  methods: {
    getList(datas) {
      uni.request({
        url: this.$apiHost + "/front/user/bookmark",
        method: "get",
        data: {
          s_lang: "zh-Hans",
          offset: this.offset,
          limit: 10,
        },
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        success: (res) => {
          this.offset++;
          if (res.data.data.length < 10) {
            this.noData = true;
          }
          for (let item in res.data.data) {
            let image = res.data.data[item].store_image;
            this.list.push({
              ...res.data.data[item],
              imgUrl: this.$imageHost + image,
              is_collect: 1,
            });
          }
        },
      });
    },
    click(item) {
      console.log("item", item);
    },
    // 滑到底部
    scrolltolower() {
      this.loadmore();
    },
    // 加载更多
    loadmore() {
      if (this.noData == true) {
        console.log("this.noData == true");
        return;
      }
      this.getList();
    },
    // 收藏
    collect(index) {
      const token = uni.getStorageSync("token");
      const { product_id, store_id } = this.list[index];
      uni.request({
        url: this.$apiHost + "/front/user/bookmark",
        method: "POST",
        data: {
          product_id,
          store_id,
        },
        header: {
          Authorization: "Bearer " + token,
        },
        success: (res) => {
          if (res.data.status !== "success") return;
          //取消
          if (res.data.data === null) {
            this.list[index].is_collect = 0;
            return;
          }
          //收藏
          this.list[index].is_collect = 1;
        },
      });
    },
    toStore(item) {
      uni.navigateTo({
        url: "/pages/store/index?id=" + item.store_id,
      });
    },
    search(value) {
      uni.navigateTo({
        url: "/pages/search/index?keyword=" + value,
      });
    },
    toLink(url) {
      uni.navigateTo({ url });
    },
  },
};
</script>

<style lang="scss">
.tabs-list {
  margin-top: 16rpx;
  margin-left: -32rpx;
  width: 754rpx;
  height: 100rpx;
  background: #f8f8f8;
  border-radius: 0rpx 0rpx 0rpx 0rpx;
  opacity: 1;
  border: 2rpx solid #e8e8e8;
}

.u-tabs__wrapper__nav__line {
  width: 44rpx !important;
  height: 8rpx !important;
}

.u-list-item {
  flex-direction: row !important;
  flex-shrink: 1 !important;
  flex-wrap: wrap !important;
  justify-content: space-between !important;
  margin-top: 16rpx !important;
}

.listItem {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.setListItem {
  flex: 0;
}

.itemBox {
  margin-bottom: 20rpx;
  width: 328rpx;
  height: 598rpx;
  background: #ffffff;
  border-radius: 8rpx 8rpx 8rpx 8rpx;
  opacity: 1;
  border: 2rpx solid #e8e8e8;
  position: relative;

  .heart {
    position: absolute;
    top: 12rpx;
    right: 10rpx;
  }
}

.itemImg {
  width: 328rpx;
  height: 208rpx;
  background: #e4e4e4;
  border-radius: 8rpx 8rpx 8rpx 8rpx;
  opacity: 1;
}

.shop-name {
  margin-top: 16rpx;
  margin-left: 16rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
}

.star {
  position: relative;
  margin: 16rpx;
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
  margin: 16rpx;
  font-size: 24rpx;
  font-weight: bold;
  color: #333333;
  line-height: 28rpx;
  display: block;
}

.food-info {
  margin-left: 16rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #888888;
  line-height: 28rpx;
  display: block;
}

.price {
  margin: 16rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.price span {
  margin-left: 8rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #888888;
}

.order {
  position: absolute;
  margin-left: 16rpx;
  bottom: 16rpx;
  width: 264rpx;
  height: 24rpx;
  font-size: 24rpx !important;
  font-weight: 400 !important;
  color: #888888;
}

.order image {
  width: 32rpx;
  height: 32rpx;
  float: left;
}
</style>
