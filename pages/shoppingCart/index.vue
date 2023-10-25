<template>
  <div>
    <ul>
      <li v-for="(item, index) in dataList" :key="item.cart_id">
        <u-image
          :src="item.product_image"
          width="240rpx"
          height="200rpx"
        ></u-image>
        <div class="text-content">
          <div class="dish-name">
            <div class="left">{{ item.translate_name }}</div>
            <!-- <div class="right">(420g)</div> -->
            <u-icon
              custom-style="position: absolute; top: 0rpx; right:0rpx; font-weight: bold;"
              size="48rpx"
              color="#888"
              name="close"
              @click="handleDel(item)"
            ></u-icon>
          </div>
          <div class="number-box">
            <u-number-box
              integer
              v-model="item.quantity"
              @change="(value) => valChange(value, item, index)"
              :min="item.minimum_buy_count"
              :max="maxNum"
              asyncChange
            ></u-number-box>
          </div>
          <div class="price">
            <div class="text">
              {{ (item.quantity * item.price) | unitConverter }}
            </div>
            <div class="symbol">{{ item.currency }}</div>
          </div>
        </div>
      </li>
    </ul>
    <div class="buy-btn" @click="handleAppend" v-if="dataList.length">
      {{ cartjs.other_product_add }}
    </div>
    <div class="none-btn" @click="handleAppend" v-else>
      <h3>{{ cartjs.blank_basket }}</h3>
      <div style="color: #777777; font-size: 26rpx; margin-top: 8rpx">
        {{ cartjs.blank_basket_msg }}
      </div>
    </div>
    <div
      v-if="dataList.length"
      style="
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #fff;
        padding: 30rpx 0;
        z-index: 88;
      "
    >
      <u-button
        color="#FF4A52"
        custom-style="width: 690rpx;"
        @click="handleBuy"
        >{{ totalAndPrice }}</u-button
      >
    </div>
    <u-toast ref="uToast"></u-toast>
  </div>
</template>

<script>
import { cart as cartjs } from "../../zh-Hans/cart";
export default {
  data() {
    return {
      cartjs,
      maxNum: 9999,
      dataList: [],
      store: {},
      currentDel: {},
    };
  },
  onLoad() {
    this.getShopCar();
  },
  methods: {
    getShopCar() {
      uni.request({
        url: this.$apiHost + `/front/cart?s_lang=zh-Hans`,
        method: "get",
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
          this.dataList = data;
          this.store = res.data.store;
        },
      });
    },
    async valChange(value, row) {
      const data1 = await uni.request({
        url: this.$apiHost + `/front/cart/${row.cart_id}`,
        method: "PUT",
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        data: {
          quantity: value.value,
        },
      });
      const data2 = await uni.request({
        url: this.$apiHost + `/front/cart/total`,
        method: "POST",
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        data: {
          quantity: value.value,
        },
      });
      if (
        data1[1].data.status == "success" &&
        data2[1].data.status == "success"
      ) {
        this.getShopCar();
      } else {
        uni.showToast({
          title: "修改失败",
          icon: "error",
        });
      }
    },

    handleDel(row) {
      uni.showModal({
        title: "提示",
        content: "是否删除当前商品？",
        success: (res) => {
          if (res.confirm) {
            this.handleConfirm();
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
      this.currentDel = row;
    },

    handleConfirm() {
      uni.request({
        url: this.$apiHost + `/front/cart/${this.currentDel.cart_id}`,
        method: "DELETE",
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        success: (res) => {
          if (res.data.status === "success") {
            this.$refs.uToast.show({
              type: "success",
              message: "删除成功！",
              iconUrl: "https://cdn.uviewui.com/uview/demo/toast/default.png",
            });
            this.getShopCar();
          }
        },
      });
    },
    handleAppend() {
      uni.navigateTo({
        url: `/pages/storeMenu/index?id=${this.store.id}`,
      });
    },

    handleBuy() {
      uni.navigateTo({
        url: "/pages/orderNow/index",
      });
    },
    unitConverter(value) {
      if (!value) return 0;
      // 获取整数部分
      const intPart = Math.trunc(value);
      // 整数部分处理，增加,
      const intPartFormat = intPart
        .toString()
        .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
      // 预定义小数部分
      let floatPart = "";
      // 将数值截取为小数部分和整数部分
      const valueArray = value.toString().split(".");
      if (valueArray.length === 2 && valueArray[1] > 0) {
        // 有小数部分
        floatPart = valueArray[1].toString(); // 取得小数部分
        return intPartFormat + "." + floatPart;
      }
      return intPartFormat + floatPart;
    },
  },
  computed: {
    totalAndPrice() {
      const num = this.dataList.reduce((a, b) => {
        return a + b.quantity;
      }, 0);
      const price = this.dataList.reduce((a, b) => {
        return a + b.price * b.quantity;
      }, 0);
      return `${num}立即支付(${this.unitConverter(price)} ${
        this.store && this.store.currency
      })`;
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  li {
    display: flex;
    width: 686rpx;
    height: 200rox;
    padding: 32rpx;
    border-bottom: 2rpx solid #e8e8e8;

    .pic {
      position: relative;
      width: 240rpx;
      height: 200rpx;
    }

    .text-content {
      width: 446rpx;
      padding-left: 16rpx;
      height: 240rpx;
      box-sizing: border-box;

      .dish-name {
        position: relative;
        display: flex;
        width: 430rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;

        .left {
          max-width: 240rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .number-box {
        width: 430rpx;
        padding-right: 32rpx;
        display: flex;
        justify-content: flex-end;
        margin-top: 32rpx;
      }

      /deep/ {
        .u-number-box__minus {
          margin-right: 20rpx;
        }

        .u-number-box__plus {
          margin-left: 20rpx;
        }

        .u-number-box__minus,
        .u-number-box__plus {
          width: 72rpx !important;
          height: 72rpx !important;
          border-radius: 72rpx !important;
          border: 6rpx solid #333333;
          background-color: transparent !important;
        }

        .u-number-box__plus {
          border-color: #ff4a52;
        }

        .u-icon__icon.uicon-plus {
          color: #ff4a52 !important;
        }

        .u-icon__icon {
          color: #333333 !important;
          font-size: 34rpx !important;
        }

        .u-number-box__input {
          width: 50rpx !important;
          font-size: 40rpx !important;
          background-color: transparent !important;
          font-weight: bold;
        }
      }

      .price {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        margin-top: 32rpx;

        .text {
          font-size: 40rpx;
          font-weight: bold;
          color: #181818;
        }

        .symbol {
          font-size: 30rpx;
          font-weight: bold;
          color: #888888;
          margin-left: 10rpx;
        }
      }
    }
  }
}

.buy-btn {
  width: 300rpx;
  padding-bottom: 150rpx;
  margin: 48rpx auto;
  text-align: center;
  color: #ff4a52;
  text-decoration: underline;
}
.none-btn {
  width: 400rpx;
  margin: 48rpx auto;
  text-align: center;
}
</style>
