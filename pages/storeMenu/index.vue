<template>
  <div>
    <div class="title" v-if="signatureMenuList.length">
      {{ storejs.signature_menu }}
    </div>
    <ul>
      <li
        v-for="item in signatureMenuList"
        :key="item.id"
        @click="handleEnterInfo(item)"
      >
        <div class="pic">
          <u-icon
            custom-style="position: absolute; top: 20rpx; right:20rpx; z-index: 99"
            size="48rpx"
            :color="item.is_bookmarked ? '#FF4A52' : '#fff'"
            :name="item.is_bookmarked ? 'heart-fill' : 'heart'"
            @tap.stop="handleToggleWish(item)"
          ></u-icon>
          <u-image
            :src="item.product_image"
            width="240rpx"
            height="200rpx"
          ></u-image>
        </div>
        <div class="text-content">
          <div class="dish-name">
            <div class="left">{{ item.translate_name }}</div>
            <!-- <div class="right">(420g)</div> -->
          </div>
          <!-- <div class="sub-title">撒旦教昂克赛拉撒旦教昂克赛拉</div> -->
          <div class="price">
            <div class="text">{{ item.price }}</div>
            <div class="symbol">{{ item.currency }}</div>
          </div>
        </div>
      </li>
    </ul>
    <div class="title">{{ productjs.normal_store }}</div>
    <ul>
      <li
        v-for="item in mainMenuList"
        :key="item.id"
        @click="handleEnterInfo(item)"
      >
        <div class="pic">
          <u-icon
            custom-style="position: absolute; top: 20rpx; right:20rpx; z-index: 99"
            size="48rpx"
            :color="item.is_bookmarked ? '#FF4A52' : '#fff'"
            :name="item.is_bookmarked ? 'heart-fill' : 'heart'"
            @tap.stop="handleToggleWish(item)"
          ></u-icon>
          <u-image
            :src="item.product_image"
            width="240rpx"
            height="200rpx"
          ></u-image>
        </div>
        <div class="text-content">
          <div class="dish-name">
            <div class="left">{{ item.translate_name }}</div>
            <!-- <div class="right">(420g)</div> -->
          </div>
          <!-- <div class="sub-title">撒旦教昂克赛拉撒旦教昂克赛拉</div> -->
          <div class="price">
            <div class="text">{{ item.price }}</div>
            <div class="symbol">{{ item.currency }}</div>
          </div>
        </div>
      </li>
    </ul>
    <u-toast ref="uToast"></u-toast>
  </div>
</template>

<script>
import { store as storejs } from "../../zh-Hans/store.js";
import { product as productjs } from "../../zh-Hans/prodcut.js";
export default {
  data() {
    return {
      storejs,
      productjs,
      signatureMenuList: [],
      mainMenuList: [],
      store: {},
      storeId: "",
    };
  },
  onLoad(option) {
    this.storeId = option.id;
  },
  onShow() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      uni.request({
        url: this.$apiHost + `/front/product`,
        data: {
          s_store_id: this.storeId,
          // s_lang: 'zh-Hans',
          // s_order1: 'T10.sorting',
          // s_order2: 'desc',
          // s_status: 'normal',
          // limit: 100
        },
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        success: (res) => {
          let data = res.data.data.map((item) => {
            return {
              ...item,
              product_image: this.$imageHost + item.product_image,
            };
          });
          this.mainMenuList = data;
          this.signatureMenuList = JSON.parse(JSON.stringify(data)).filter(
            (item) => item.is_main === 1
          );
          this.store = res.data.store;
          const { translate_name, translate_branch_name } = this.store;

          uni.setNavigationBarTitle({
            title: `${translate_name}${translate_branch_name ? "(" : ""}${
              translate_branch_name || ""
            }${translate_branch_name ? ")" : ""}`,
          });
        },
      });
    },

    handleToggleWish(row) {
      console.log(row.id, row.store_id);
      uni.request({
        url: this.$apiHost + `/front/user/bookmark`,
        data: {
          product_id: row.id,
          store_id: row.store_id,
        },
        method: "post",
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        success: (res) => {
          const data = res.data;
          const error = {
            type: "error",
            icon: false,
            title: "提示",
            message: data.status,
            iconUrl: "https://cdn.uviewui.com/uview/demo/toast/error.png",
          };
          const success = {
            type: "success",
            title: "提示",
            message: data.status,
            iconUrl: "https://cdn.uviewui.com/uview/demo/toast/success.png",
          };
          const params = data.status === "success" ? success : error;

          this.$refs.uToast.show({
            ...params,
            complete: () => {
              this.getInfo();
            },
          });
        },
      });
    },

    handleEnterInfo(row) {
      uni.navigateTo({
        url: `/pages/productionInfo/index?id=${row.id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background-color: #fff;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #131313;
  padding: 32rpx;
}

ul {
  li {
    display: flex;
    width: 686rpx;
    height: 200rpx;
    padding: 20rpx 32rpx;
    border-bottom: 2rpx solid #e8e8e8;

    .pic {
      position: relative;
      width: 240rpx;
      height: 200rpx;
    }

    .text-content {
      width: 446rpx;
      padding-left: 16rpx;
      box-sizing: border-box;

      .dish-name {
        display: flex;
        width: 430rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;

        .left {
          max-width: 430rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .sub-title {
        font-size: 24rpx;
        font-weight: 400;
        color: #888888;
        margin-top: 16rpx;
      }

      .price {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        margin-top: 125rpx;

        .text {
          font-size: 32rpx;
          font-weight: bold;
          color: #000;
          margin-right: 8rpx;
        }

        .symbol {
          font-size: 24rpx;
          font-weight: 400;
          color: #888888;
        }
      }
    }
  }
}
</style>
