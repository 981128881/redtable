<template>
  <view class="content">
    <view class="first">
      <view class="btns">
        <view :class="firstBtn.cls">{{ firstBtn.text }}</view>
        <view class="btn-default" @click="toStore()">卖场信息</view>
        <view class="btn-red" v-if="cancelBtn === true" @click="cancel()">{{
          orderZh.order_cancel_btn
        }}</view>
      </view>
      <view class="order-name">{{ info.order.title }}</view>
    </view>
    <view class="info">
      <u-row>
        <u-col span="4">
          <view class="label">订单号码</view>
        </u-col>
        <u-col span="8">
          <view class="text">{{ info.order.order_no }}</view>
        </u-col>
      </u-row>
    </view>
    <view class="info">
      <u-row>
        <u-col span="4">
          <view class="label">访问预定日期</view>
        </u-col>
        <u-col span="8">
          <view class="text">{{ info.voucher.reserved_at }}</view>
        </u-col>
      </u-row>
    </view>
    <view class="info">
      <u-row>
        <u-col span="4">
          <view class="label">订购日期</view>
        </u-col>
        <u-col span="8">
          <view class="text">{{ info.order.order_at }}</view>
        </u-col>
      </u-row>
    </view>
    <view class="info">
      <u-row>
        <u-col span="4">
          <view class="label">订购金额</view>
        </u-col>
        <u-col span="8">
          <view class="text">{{ info.order.order_price }}</view>
        </u-col>
      </u-row>
    </view>
    <view class="info">
      <u-row>
        <u-col span="4">
          <view class="label">支付金额</view>
        </u-col>
        <u-col span="8">
          <view class="text">{{ info.order.pay_sum }}</view>
        </u-col>
      </u-row>
    </view>
    <view class="qr-box">
      <canvas
        canvas-id="qrcode"
        v-show="qrShow"
        style="width: 300rpx; margin: 0 auto"
      />
    </view>
    <view class="title"> 客户信息 </view>
    <view class="info">
      <u-row>
        <u-col span="4">
          <view class="label">订购人</view>
        </u-col>
        <u-col span="8">
          <view class="text">{{ info.order.name }}</view>
        </u-col>
      </u-row>
    </view>
    <view class="info">
      <u-row>
        <u-col span="4">
          <view class="label">联系号</view>
        </u-col>
        <u-col span="8">
          <view class="text">{{ info.order.phone }}</view>
        </u-col>
      </u-row>
    </view>
    <view class="info">
      <u-row>
        <u-col span="4">
          <view class="label">访问预定人数</view>
        </u-col>
        <u-col span="8">
          <view class="text">{{ info.voucher.person }}</view>
        </u-col>
      </u-row>
    </view>
    <view class="info">
      <u-row>
        <u-col span="4">
          <view class="label">其他要求事项</view>
        </u-col>
        <u-col span="8">
          <view class="text">{{ info.order.memo || "" }}</view>
        </u-col>
      </u-row>
    </view>
    <view v-for="(item, index) in info.products" :key="index">
      <view class="title">
        {{ item.product_name_translate }} × {{ item.quantity }}
      </view>
      <view class="info">
        <u-row>
          <u-col span="4">
            <view class="label">价格</view>
          </u-col>
          <u-col span="8">
            <view class="text">{{ item.product_price }}</view>
          </u-col>
        </u-row>
      </view>
      <view class="info">
        <u-row>
          <u-col span="4">
            <view class="label">状态</view>
          </u-col>
          <u-col span="2">
            <view class="text">{{ statusToText(item.status) }}</view>
          </u-col>
          <u-col span="2">
            <view
              class="btn-red"
              v-if="item.cancel === true"
              @click="cancel(item.id, index)"
              >取消</view
            >
          </u-col>
        </u-row>
      </view>
    </view>
  </view>
</template>

<script>
import uQRCode from "../../common/js/uqrcode.js";
import { order as orderZh } from "../../zh-Hans/order";
import { product as productZh } from "../../zh-Hans/prodcut.js";
export default {
  data() {
    return {
      orderZh,
      option: {},
      info: {},
      firstBtn: {},
      cancelBtn: false,
      qrShow: false,
    };
  },
  onLoad(option) {
    this.option = option;
    this.getInfo();
  },
  methods: {
    // 获取数据
    getInfo() {
      const token = uni.getStorageSync("token");
      // const token = 'xbCXQ7DwwFM0VbrR1BQQpyUIv29yqV7garpzTJJtajVV7bNeImvqnzCayNMNo3Tk'
      uni.request({
        url: this.$apiHost + "/front/order/" + this.option.order_no,
        method: "GET",
        data: {
          s_lang: "zh-Hans",
        },
        header: {
          Authorization: "Bearer " + token,
        },
        success: (res) => {
          const { order } = res.data.data;
          this.firstBtn.cls =
            order.status === "paid" || order.status === "particial_cancel"
              ? "btn-green"
              : "btn-red";
          this.firstBtn.text = orderZh[`order_` + order.status];
          this.info = res.data.data;
          this.showCancelBtn();
          this.qrFun(order.order_no);
        },
      });
    },
    // 取消按钮是否显示
    showCancelBtn() {
      const {
        order,
        voucher,
        cancel_remain_days,
        is_possible_cancel_business_period,
      } = this.info;
      if (order.order_type === "reserve") {
        if (order.status === "ready") this.cancelBtn = true;
      } else {
        if (cancel_remain_days >= 0) {
          if (voucher.status === "ready") {
            if (
              order.status === "paid" ||
              order.status === "particial_cancel"
            ) {
              if (is_possible_cancel_business_period) this.cancelBtn = true;
            }
          }
        }
      }
      this.showProductCancelBtn();
    },
    // 商品取消按钮
    showProductCancelBtn() {
      const count = this.info.products.filter(
        (v) => v.status === "normal"
      ).length;
      this.info.products.map((item, index) => {
        // if(item.status === "normal" &&this.cancelBtn === true &&count > 1 &&item.promotion_price === 0){
        // 	console.log("if---true")
        // 	this.info.products[index].cancel = true
        // }

        this.info.products[index].cancel =
          item.status === "normal" &&
          this.cancelBtn === true &&
          count > 1 &&
          item.promotion_price == 0;
      });
      console.log(this.info.products);
    },
    statusToText(status) {
      return productZh[`order_product_` + status];
    },
    // 生成二维码
    qrFun: function (text) {
      this.qrShow = true;
      uQRCode.make({
        canvasId: "qrcode",
        componentInstance: this,
        text: text,
        size: 150,
        margin: 0,
        backgroundColor: "#ffffff",
        foregroundColor: "#000000",
        fileType: "jpg",
        errorCorrectLevel: uQRCode.errorCorrectLevel.H,
        success: (res) => {},
      });
    },
    toStore() {
      uni.navigateTo({
        url: "/pages/store/index?id=" + this.info.store.id,
      });
    },
    cancel(id, index) {
      const token = uni.getStorageSync("token");
      // const token =
      //   "xbCXQ7DwwFM0VbrR1BQQpyUIv29yqV7garpzTJJtajVV7bNeImvqnzCayNMNo3Tk";
      let param = this.option.order_no;
      param += id ? "/" + id : "";
      uni.request({
        url: this.$apiHost + "/front/order/" + param,
        method: "DELETE",
        header: {
          Authorization: "Bearer " + token,
        },
        success: (res) => {
          if (res.data.status === "success") {
            uni.$u.toast("取消成功");
            // this.info.products[index].cancel = false
            this.$set(this.info.products[index], "cancel", false);
          }
        },
      });
    },
  },
};
</script>

<style lang="scss">
.first {
  background: #f8f8f8;
  padding: 20rpx 32rpx;
  border: 2rpx solid #e8e8e8;
  font-size: 24rpx;
  font-weight: 400;

  .order-name {
    margin-top: 20rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
  }

  .btns {
    display: flex;

    :nth-child(n + 2) {
      margin-left: 16rpx;
    }
  }
}

.btn-red {
  padding: 10rpx 18rpx;
  background: #fe4a52;
  border: 2rpx solid #e8e8e8;
  border-radius: 6rpx;
  color: #ffffff;
  text-align: center;
}

.btn-green {
  padding: 10rpx 18rpx;
  background: #37c15e;
  border: 2rpx solid #e8e8e8;
  border-radius: 6rpx;
  color: #ffffff;
}

.btn-default {
  padding: 10rpx 18rpx;
  background: #ffffff;
  border: 2rpx solid #e8e8e8;
  border-radius: 6rpx;
  color: #333333;
}

.title {
  padding-left: 32rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: #f8f8f8;
  border: 2rpx solid #e8e8e8;
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.info {
  padding: 40rpx 32rpx;
  border-bottom: 2rpx solid #e8e8e8;
  font-size: 28rpx;

  .label {
    font-weight: 400;
    color: #999999;
  }

  .text {
    font-weight: bold;
    color: #333333;
  }
}

.qr-box {
  margin: 20rpx auto;
}
</style>
