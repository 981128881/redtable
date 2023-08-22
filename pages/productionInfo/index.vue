<template>
  <div>
    <navigator class="fixed" open-type="navigateBack">
      <u-icon name="arrow-left" color="#ffffff" size="48"></u-icon>
    </navigator>

    <div style="padding-bottom: 30rpx" v-if="productImageUrl">
      <u-image width="750rpx" height="600rpx" :src="productImageUrl"></u-image>
      <ul class="breadcrumbs">
        <li>
          <div class="address">{{ store.translate_name }}</div>
          <u-icon
            custom-style="margin: 0 18rpx"
            name="arrow-right"
            color="#888888"
            size="24"
          ></u-icon>
        </li>
        <li>
          <div class="address">{{ store.translate_branch_name }}</div>
          <!-- <u-icon
            custom-style="margin: 0 18rpx"
            name="arrow-right"
            color="#888888"
            size="24"
          ></u-icon> -->
        </li>
      </ul>
      <div class="title">{{ dataInfo.translate_name }}</div>
      <div class="sub-title">{{ dataInfo.translate_label_name }}</div>
      <div class="price">
        <div class="text">{{ dataInfo.price }}</div>
        <div class="symbol">{{ store.currency }}</div>
      </div>
      <div class="number-box">
        <u-number-box
          integer
          v-model="value"
          @change="valChange"
          :min="dataInfo.minimum_buy_count"
          :max="maxNum"
        ></u-number-box>
      </div>

      <!-- <div class="info-content">
        <div class="info-title">烹饪</div>
        <div class="info-content-info">14号正常#888888</div>
      </div>

      <div class="info-content">
        <div class="info-title">主料</div>
        <div class="info-content-info">14号正常#888888</div>
      </div> -->

      <div class="info-content">
        <div class="info-title">
          {{ product.product_introduction }}
        </div>
        <div class="info-content-info">
          <div v-if="dataInfo.description">{{ dataInfo.description }}</div>
          <div>{{ guide["zh-Hans"].guide02 }}</div>
          <div>{{ guide["zh-Hans"].guide03 }}</div>
          <div>{{ dataInfo.translate_includes }}</div>
        </div>
        <div class="btn-box">
          <u-button custom-style="width:320rpx; margin: 0" @click="handleToShop"
            >店铺</u-button
          >
          <u-button
            custom-style="width:320rpx; margin: 0"
            @click="handleToAllProducts"
            >所有商品</u-button
          >
        </div>
      </div>

      <div class="info-content">
        <div class="info-title">
          {{ guide["zh-Hans"].guide04 }}
        </div>
        <div class="info-content-info">{{ guide["zh-Hans"].guide05 }}</div>
      </div>
      <div class="info-content">
        <div class="info-title">
          {{ guide["zh-Hans"].guide07 }}
        </div>
        <div class="info-content-info">
          {{
            dataInfo[minimum_buy_count] > 1
              ? guide["zh-Hans"].guide09
              : guide["zh-Hans"].guide08
          }}
        </div>
      </div>
      <div class="info-content">
        <div class="info-title">
          {{ guide["zh-Hans"].guide10 }}
        </div>
        <div
          class="info-content-info"
          v-if="
            store_contract.reserve_date_required !== 1 ||
            store_contract.reserve_time_required !== 1
          "
        >
          {{ guide["zh-Hans"].guide12 }}
        </div>
        <div class="info-content-info" v-else>
          {{ guide["zh-Hans"].guide11 + dataInfo.cancel_before_Days }}
        </div>
      </div>
      <div class="info-content">
        <div class="info-title">
          {{ guide["zh-Hans"].guide13 }}
        </div>
        <div class="info-content-info">
          <div class="single">{{ guide["zh-Hans"].guide14 }}</div>
          <div class="single">{{ guide["zh-Hans"].guide15 }}</div>
          <div class="single">{{ guide["zh-Hans"].guide17 }}</div>
          <div class="single">{{ guide["zh-Hans"].guide18 }}</div>
          <div class="single">{{ guide["zh-Hans"].guide19 }}</div>
          <div class="single" v-if="guide['zh-Hans'].guide20">
            {{ guide["zh-Hans"].guide20 }}
          </div>
        </div>
      </div>
      <div class="info-content">
        <div class="info-title">
          {{ guide["zh-Hans"].guide21 }}
        </div>
        <div class="info-content-info">{{ guide["zh-Hans"].guide22 }}</div>
      </div>

      <u-button
        color="#FF4A52"
        custom-style="width: 690rpx; margin: 30rpx auto;"
        @click="handleSubmit"
        >{{ totalAndPrice }}</u-button
      >
    </div>
    <u-toast ref="uToast"></u-toast>
    <u-modal
      :show="showModal"
      showCancelButton
      title="提示"
      :content="cartjs.add_3 + ' ' + cartjs.remove_all_alert"
      @confirm="handleConfirm"
      @cancel="showModal = false"
    ></u-modal>
  </div>
</template>

<script>
import { product } from "../../zh-Hans/prodcut.js";
import { cart as cartjs } from "../../zh-Hans/cart";
export default {
  data() {
    return {
      cartjs,
      product,
      productionId: "",
      dataInfo: {},
      store: {},
      guide: {},
      store_contract: {},
      productImageUrl: "",
      value: 1,
      maxNum: 1,
      showModal: false,
    };
  },
  onLoad(option) {
    this.productionId = option.id;
    this.getProductionInfo();
  },
  methods: {
    // 获取商品详情
    getProductionInfo() {
      uni.request({
        url: this.$apiHost + `/front/product/${this.productionId}`,
        method: "get",
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        data: {
          lang: "zh-Hans",
          s_channel: "www",
        },
        success: (res) => {
          this.dataInfo = res.data.data;
          this.store = res.data.store;
          this.guide = res.data.guide;
          this.store_contract = res.data;
          this.productImageUrl = this.$imageHost + this.dataInfo.product_image;
          this.value = this.dataInfo.minimum_buy_count;
          this.maxNum =
            this.dataInfo.maximum_buy_count < 0
              ? 9999
              : this.dataInfo.maximum_buy_count;
        },
      });
    },

    handleToShop() {
      uni.navigateTo({
        url: `/pages/store/index?id=${this.dataInfo.store_id}`,
      });
    },

    handleToAllProducts() {
      uni.navigateTo({
        url: `/pages/storeMenu/index?id=${this.dataInfo.store_id}`,
      });
    },

    async handleSubmit() {
      // 获取购物车是否有商品存在
      const isHasProduction = await uni.request({
        url: this.$apiHost + `/front/cart/total`,
        method: "POST",
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
      });
      if (
        isHasProduction[1].data.data.products.length &&
        isHasProduction[1].data.data.store.id !== this.store_contract.store.id
      ) {
        this.showModal = true;
      } else {
        this.addCart();
      }
    },

    handleConfirm() {
      uni.request({
        url: this.$apiHost + `/front/cart/allDelete`,
        method: "POST",
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        success: (res) => {
          if (res.data.status === "success") {
            this.addCart();
          }
        },
      });
    },

    addCart() {
      uni.request({
        url: this.$apiHost + `/front/cart`,
        method: "POST",
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        data: {
          product_id: this.productionId,
          quantity: this.value,
        },
        success: (res) => {
          if (res.data.status === "success") {
            this.showModal = false;
            this.$refs.uToast.show({
              type: "success",
              message: "添加成功",
              iconUrl: "https://cdn.uviewui.com/uview/demo/toast/default.png",
            });
            setTimeout(() => {
              uni.navigateTo({ url: "/pages/shoppingCart/index" });
            }, 300);
          }
        },
      });
    },

    valChange(e) {
      this.value = e.value;
    },
  },
  computed: {
    totalAndPrice() {
      const num = this.value;
      const price = this.value * this.dataInfo.price;
      return `${num}个(${price} ${this.store.currency})`;
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background-color: #fff;
}

.fixed {
  position: fixed;
  top: 60rpx;
  left: 30rpx;
  z-index: 999;
  .u-icon__icon {
    color: #fff !important;
  }
}

.breadcrumbs {
  width: 780rpx;
  padding: 40rpx 32rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #888888;
  display: flex;

  li {
    display: flex;
    align-items: center;

    &:last-of-type {
      .address {
        color: #ff4a52;
        text-decoration: underline;
      }
    }
  }
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #181818;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 32rpx;
}

.sub-title {
  font-size: 24rpx;
  font-weight: 400;
  color: #888888;
  margin-top: 16rpx;
  padding: 0 32rpx;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 0 32rpx;

  .text {
    font-size: 50rpx;
    font-weight: bold;
    color: #181818;
  }

  .symbol {
    font-size: 40rpx;
    font-weight: bold;
    color: #888888;
    margin-left: 10rpx;
  }
}

.number-box {
  width: 750rpx;
  padding-right: 32rpx;
  display: flex;
  justify-content: flex-end;
  margin-top: 32rpx;

  /deep/ {
    .u-number-box__minus,
    .u-number-box__plus {
      width: 72rpx !important;
      height: 72rpx !important;
      border-radius: 72rpx !important;
      border: 6rpx solid #333333;
      background-color: transparent !important;
      margin: 0 20rpx;
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
      width: 100rpx !important;
      font-size: 40rpx !important;
      background-color: transparent !important;
      font-weight: bold;
    }
  }
}

.info-content {
  padding: 38rpx 32rpx;
  border-bottom: 2rpx solid #e8e8e8;

  .info-title {
    width: 750rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #131313;
  }

  .info-content-info {
    padding-top: 32rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #888888;

    .single {
      padding: 20rpx;

      &:not(:last-of-type) {
        border-bottom: 1px solid #e8e8e8;
      }
    }
  }

  .btn-box {
    display: flex;
    justify-content: space-between;
    margin-top: 16rpx;
  }
}
</style>
