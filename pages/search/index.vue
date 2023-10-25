<template>
  <view class="content">
    <view class="btns">
      <view
        :class="type == 'store' ? 'btn-red' : 'btn-default'"
        @click="changeType()"
        >店铺</view
      >
      <view
        :class="type == 'product' ? 'btn-red' : 'btn-default'"
        @click="changeType()"
        >商品</view
      >
    </view>
    <view>
      <u-list
        @scrolltolower="scrolltolower"
        height="1200rpx"
        :preLoadScreen="page * 4"
      >
        <u-list-item v-for="(item, index) in storeList" :key="index">
          <view class="card" @click="toLink(item)">
            <image :src="item.imgUrl"></image>
            <view class="introduction">
              <h3 class="h3">
                {{
                  type == "store"
                    ? item.translate_name
                    : item.translate_store_name
                }}
                <span v-if="item.branchName !== ''"
                  >({{ item.branchName }})</span
                >
              </h3>
              <view class="star">
                <u-icon name="star-fill" color="#FF4A52" size="36rpx"></u-icon>
                <span class="score"
                  >{{ item.rti_star }}({{
                    item.show_cnt | unitConverter
                  }})</span
                >
              </view>
              <span class="food" v-if="item.translate_product_name">{{
                item.translate_product_name
              }}</span>
              <span class="food-info" v-if="item.translate_store_label_name">{{
                item.translate_store_label_name
              }}</span>
              <h3 class="price">
                <!-- {{item.product_price}} -->
                {{
                  type == "store"
                    ? item.product_price
                    : item.price | unitConverter
                }}
                <!-- <span>KRW</span> -->
              </h3>
            </view>
            <view class="order">
              <image :src="'/static/buynow_ico.png'"></image>
            </view>
            <view class="heart" @click.stop="collect(item, index)">
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
        </u-list-item>
      </u-list>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      option: {},
      keyword: "",
      type: "store",
      storeList: [],
      // 滑到底部加载更多
      offset: 1,
      noData: false,
    };
  },
  onLoad(option) {
    this.option = option;
    // this.getList();
    this.loadmore();
  },
  methods: {
    scrolltolower() {
      this.loadmore();
    },
    changeType() {
      this.type = this.type === "store" ? "product" : "store";
      (this.storeList = []),
        (this.offset = 1),
        (this.noData = false),
        this.loadmore();
    },
    toLink(item) {
      let type = this.type === "store" ? "store" : "productionInfo";
      uni.navigateTo({
        url: "/pages/" + type + "/index?id=" + item.id,
      });
    },
    // 收藏
    collect(item, index) {
      const token = uni.getStorageSync("token");
      let sid = this.type === "store" ? item.id : item.store_id;
      let pid = this.type === "product" ? item.id : item.product_id;
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
          if (res.data.data !== null) {
            console.log("收藏");
            this.storeList[index].is_bookmarked = 1;
          } else {
            console.log("取消");
            this.storeList[index].is_bookmarked = 0;
          }
        },
      });
    },
    // 获取列表数据
    // getList() {
    // 	this.loadmore()
    // },
    loadmore() {
      if (this.noData == true) {
        console.log("this.noData == true");
        return;
      }
      uni.request({
        url: this.$apiHost + "/front/" + this.type,
        method: "get",
        data: {
          s_keyword: this.option.keyword,
          s_lang: "zh-Hans",
          s_order1: "T10.sorting",
          s_order2: "desc",
          s_status: "normal",
          s_store_status: "normal",
          offset: this.offset,
        },
        success: (res) => {
          this.offset++;
          if (res.data.data.length < 10) {
            this.noData = true;
          }
          this.storeListPush(res.data.data);
        },
      });
    },
    storeListPush(datas) {
      datas.map((data, i) => {
        // let img = data.product_image ?? data.store_image
        let img = data.store_image;
        let branch =
          this.type == "store"
            ? data.translate_branch_name
            : data.translate_store_branch_name;
        let currentData = {
          ...data,
          imgUrl: this.$imageHost + img,
          branchName: branch || "",
        };
        this.storeList.push(currentData);
      });
      console.log("this.storeList", this.storeList);
    },
  },
};
</script>

<style lang="scss">
.content {
  .card {
    margin: 0 32rpx 32rpx;
    width: 686rpx;
    height: 276rpx;
    border-radius: 8rpx;
    border: 2rpx solid #e8e8e8;
    display: flex;
    position: relative;
  }

  .card image {
    width: 276rpx;
    height: 276rpx;
    border-top-left-radius: 8rpx;
    border-bottom-left-radius: 8rpx;
  }

  .introduction {
    margin: 16rpx;
    width: 378rpx;
  }

  .order {
    position: absolute;
    top: 16rpx;
    left: 16rpx;
  }

  .order image {
    width: 44rpx;
    height: 44rpx;
  }

  .heart {
    position: absolute;
    top: 16rpx;
    left: 220rpx;
  }

  .h3 {
    margin-top: 16rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #000000;
    line-height: 28rpx;
  }

  .star {
    margin-top: 16rpx;
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
    display: block;
  }

  .food-info {
    margin-top: 20rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #888888;
    line-height: 28rpx;
    display: block;
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
}

.btns {
  margin: 40rpx 36rpx;
  font-size: 28rpx;
  font-weight: bold;
  text-align: center;
  line-height: 60rpx;
  display: flex;

  .btn-red {
    padding: 10rpx 18rpx;
    background: #fe4a52;
    border: 2rpx solid #e8e8e8;
    border-radius: 6rpx;
    color: #ffffff;
    width: 186rpx;
    height: 60rpx;
  }

  .btn-default {
    padding: 10rpx 18rpx;
    background: #ffffff;
    border: 2rpx solid #e8e8e8;
    border-radius: 6rpx;
    color: #888888;
    width: 186rpx;
    height: 60rpx;
  }

  :nth-child(n + 2) {
    margin-left: 16rpx;
  }
}
</style>
