<template>
  <view>
    <view class="shop-name">{{ store.translate_name }}</view>
    <template v-if="promotions.length">
      <view class="campaign">宣传活动</view>
      <view
        v-for="(item, index) in promotions"
        :key="item.promotion_id"
        :class="[item.checked ? 'active' : '', 'campaign-info']"
        @click="handleCheckActiveProduction(index)"
      >
        <u-image
          width="140rpx"
          height="120rpx"
          :src="item.promotion_file_path"
        ></u-image>
        <view class="right">
          <view class="top">{{ item.translate_name }}</view>
          <view class="bottom">
            优惠{{ item.max_discount_rate * 100 }}%
            <template v-if="item.max_discount_price"
              >(最多打{{
                (item.max_discount_rate * item.max_discount_price)
                  | unitConverter
              }}折扣)</template
            >
          </view>
        </view>
      </view>
    </template>
    <view class="customer">{{ orderjs.customer_info }}</view>
    <view class="customer-info">
      <u--form
        labelPosition="left"
        :model="userInfo"
        :rules="rules"
        ref="uForm"
      >
        <u-form-item
          :label="orderjs.order_name"
          prop="name"
          labelWidth="200rpx"
          ref="userInfo.name"
        >
          <u--input
            placeholderClass="c-input-placeholder"
            v-model="userInfo.name"
            border="none"
            customStyle="padding: 8rpx; background: #F8F8F8; border: 2rpx solid #E8E8E8;"
          ></u--input>
        </u-form-item>
        <u-form-item
          :label="orderjs.contact_number"
          prop="phone"
          labelWidth="200rpx"
          ref="userInfo.phone"
        >
          <u--input
            type="number"
            placeholderClass="c-input-placeholder"
            :placeholder="orderjs.order_number_input"
            v-model="userInfo.phone"
            border="none"
            customStyle="padding: 8rpx; background: #F8F8F8; border: 2rpx solid #E8E8E8;"
          ></u--input>
          <view class="tips">
            {{ orderjs.agree_phone_msg }}
          </view>
        </u-form-item>
        <u-form-item
          :label="orderjs.order_email"
          prop="email"
          labelWidth="200rpx"
          ref="userInfo.email"
        >
          <u--input
            placeholderClass="c-input-placeholder"
            v-model="userInfo.email"
            border="none"
            customStyle="padding: 8rpx; background: #F8F8F8; border: 2rpx solid #E8E8E8;"
          ></u--input>
          <view class="tips">
            {{ orderjs.order_email_check }}
          </view>
        </u-form-item>
      </u--form>
    </view>

    <view class="customer">{{ orderjs.visiting_info }}</view>
    <view class="customer-info">
      <u--form
        labelPosition="left"
        :model="userInfo"
        :rules="rules"
        ref="uForm1"
      >
        <u-form-item
          :label="orderjs.order_date"
          prop="day"
          labelWidth="200rpx"
          ref="userInfo.day"
        >
          <view @click="handleShowTime">
            <u--input
              disabled
              placeholderClass="c-input-placeholder"
              :placeholder="orderjs_order_date_select"
              v-model="userInfo.day"
              border="none"
              customStyle="padding: 8rpx; background: #F8F8F8; border: 2rpx solid #E8E8E8;"
            ></u--input>
          </view>
        </u-form-item>
        <u-form-item
          :label="orderjs.order_time"
          prop="time"
          labelWidth="200rpx"
          ref="userInfo.time"
        >
          <view style="display: flex; justify-content: space-between">
            <view style="width: 45%" @click="handleShowDateTime">
              <u--input
                disabled
                type="number"
                placeholderClass="c-input-placeholder"
                v-model="userInfo.time[0]"
                border="none"
                suffixIcon="arrow-down"
                customStyle="padding: 8rpx; background: #F8F8F8; border: 2rpx solid #E8E8E8;"
              ></u--input>
            </view>
            <view style="width: 45%" @click="handleShowDateTime">
              <u--input
                disabled
                type="number"
                placeholderClass="c-input-placeholder"
                v-model="userInfo.time[1]"
                border="none"
                suffixIcon="arrow-down"
                customStyle="padding: 8rpx; background: #F8F8F8; border: 2rpx solid #E8E8E8;"
              ></u--input>
            </view>
          </view>
        </u-form-item>
        <u-form-item
          :label="orderjs.order_number_visitor"
          prop="number"
          labelWidth="200rpx"
          ref="userInfo.number"
        >
          <u--input
            type="number"
            placeholderClass="c-input-placeholder"
            v-model="userInfo.number"
            border="none"
            customStyle="padding: 8rpx; background: #F8F8F8; border: 2rpx solid #E8E8E8;"
          ></u--input>
        </u-form-item>
        <u-form-item
          :label="orderjs.order_memo"
          prop="notes"
          labelWidth="200rpx"
          ref="userInfo.notes"
        >
          <u--textarea
            placeholderClass="c-input-placeholder"
            v-model="userInfo.notes"
            border="none"
            height="120"
            customStyle="padding: 8rpx; background: #F8F8F8; border: 2rpx solid #E8E8E8;"
          ></u--textarea>
        </u-form-item>
      </u--form>
    </view>
    <view class="customer">REDTABLE POINT:{{ residuePoint }}</view>
    <view class="point-info">
      <view>사용가능한 포인트는0P입니다.</view>
      <view>사용할 포인트는0P입니다.{{ userInfo.point || 0 }}</view>
      <view class="btn">
        <view style="width: 470rpx">
          <u--input
            ref="onInputNumberVal"
            type="number"
            customStyle=" background: #F8F8F8; border: 2rpx solid #E8E8E8;"
            border="surround"
            v-model="userInfo.point"
            @input="formatterInput"
          />
        </view>
        <u-button
          color="#FF4A52"
          text="Point사용"
          :customStyle="{ width: '200rpx' }"
          @click="consumeAllPoint"
        ></u-button>
      </view>
    </view>

    <view class="settlement">
      <view class="header">
        <view>预计结算金额</view>
        <view>
          <span style="font-size: 32rpx">{{ paymentAmount }}</span>
          <span style="margin-left: 10rpx">KRW</span>
        </view>
      </view>
      <view class="item">
        <view>订购金额</view>
        <view>
          <span style="font-size: 28rpx">{{
            (total.total_price * 1 + promotionalPrice * 1) | unitConverter
          }}</span>
          <span style="margin-left: 10rpx">KRW</span>
        </view>
      </view>
      <view class="item" style="color: #ff4a52">
        <view>使用积分</view>
        <view>
          <span style="font-size: 28rpx">{{ userInfo.point || 0 }}</span
          ><span style="margin-left: 10rpx">KRW</span>
        </view>
      </view>
    </view>
    <view
      style="
        background: #fff;
        padding: 30rpx;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 99;
      "
    >
      <u-button
        :disabled="disabled"
        color="#FF4A52"
        custom-style="width: 690rpx"
        @click="handleSubmit"
        >{{ paymentAmount }} KRW 支付</u-button
      >
    </view>

    <van-calendar
      v-if="show"
      :show="showCalendar"
      @confirm="onCalendarConfirm"
      @close="onCalendarClose"
      :min-date="minDate"
      :max-date="maxDate"
      :formatter="formatter"
      color="#FF4A52"
    />
    <!-- :min-date="minDate"
      :max-date="maxDate" -->
    <u-picker
      ref="uPicker"
      v-if="showDateTime"
      :columns="columns"
      @confirm="onTimeConfirm"
      @cancel="onTimeClose"
      itemHeight="100"
      :show="showDateTime"
      @change="changeHandler"
      :defaultIndex="defaultIndex"
    ></u-picker>

    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import qs from "qs";
const moment = require("../../utils/moment.min.js");
import { order as orderjs } from "../../zh-Hans/order";
var SECKEY = "8974934DE4E0047AECCFF472BC735AC8";
function SHA256(s) {
  var chrsz = 8;
  var hexcase = 0;

  function safe_add(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function S(X, n) {
    return (X >>> n) | (X << (32 - n));
  }
  function R(X, n) {
    return X >>> n;
  }
  function Ch(x, y, z) {
    return (x & y) ^ (~x & z);
  }
  function Maj(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
  }
  function Sigma0256(x) {
    return S(x, 2) ^ S(x, 13) ^ S(x, 22);
  }
  function Sigma1256(x) {
    return S(x, 6) ^ S(x, 11) ^ S(x, 25);
  }
  function Gamma0256(x) {
    return S(x, 7) ^ S(x, 18) ^ R(x, 3);
  }
  function Gamma1256(x) {
    return S(x, 17) ^ S(x, 19) ^ R(x, 10);
  }

  function core_sha256(m, l) {
    var K = new Array(
      0x428a2f98,
      0x71374491,
      0xb5c0fbcf,
      0xe9b5dba5,
      0x3956c25b,
      0x59f111f1,
      0x923f82a4,
      0xab1c5ed5,
      0xd807aa98,
      0x12835b01,
      0x243185be,
      0x550c7dc3,
      0x72be5d74,
      0x80deb1fe,
      0x9bdc06a7,
      0xc19bf174,
      0xe49b69c1,
      0xefbe4786,
      0xfc19dc6,
      0x240ca1cc,
      0x2de92c6f,
      0x4a7484aa,
      0x5cb0a9dc,
      0x76f988da,
      0x983e5152,
      0xa831c66d,
      0xb00327c8,
      0xbf597fc7,
      0xc6e00bf3,
      0xd5a79147,
      0x6ca6351,
      0x14292967,
      0x27b70a85,
      0x2e1b2138,
      0x4d2c6dfc,
      0x53380d13,
      0x650a7354,
      0x766a0abb,
      0x81c2c92e,
      0x92722c85,
      0xa2bfe8a1,
      0xa81a664b,
      0xc24b8b70,
      0xc76c51a3,
      0xd192e819,
      0xd6990624,
      0xf40e3585,
      0x106aa070,
      0x19a4c116,
      0x1e376c08,
      0x2748774c,
      0x34b0bcb5,
      0x391c0cb3,
      0x4ed8aa4a,
      0x5b9cca4f,
      0x682e6ff3,
      0x748f82ee,
      0x78a5636f,
      0x84c87814,
      0x8cc70208,
      0x90befffa,
      0xa4506ceb,
      0xbef9a3f7,
      0xc67178f2
    );

    var HASH = new Array(
      0x6a09e667,
      0xbb67ae85,
      0x3c6ef372,
      0xa54ff53a,
      0x510e527f,
      0x9b05688c,
      0x1f83d9ab,
      0x5be0cd19
    );

    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;

    m[l >> 5] |= 0x80 << (24 - (l % 32));
    m[(((l + 64) >> 9) << 4) + 15] = l;

    for (var i = 0; i < m.length; i += 16) {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];

      for (var j = 0; j < 64; j++) {
        if (j < 16) W[j] = m[j + i];
        else
          W[j] = safe_add(
            safe_add(
              safe_add(Gamma1256(W[j - 2]), W[j - 7]),
              Gamma0256(W[j - 15])
            ),
            W[j - 16]
          );

        T1 = safe_add(
          safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]),
          W[j]
        );
        T2 = safe_add(Sigma0256(a), Maj(a, b, c));

        h = g;
        g = f;
        f = e;
        e = safe_add(d, T1);
        d = c;
        c = b;
        b = a;
        a = safe_add(T1, T2);
      }

      HASH[0] = safe_add(a, HASH[0]);
      HASH[1] = safe_add(b, HASH[1]);
      HASH[2] = safe_add(c, HASH[2]);
      HASH[3] = safe_add(d, HASH[3]);
      HASH[4] = safe_add(e, HASH[4]);
      HASH[5] = safe_add(f, HASH[5]);
      HASH[6] = safe_add(g, HASH[6]);
      HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
  }

  function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - (i % 32));
    }
    return bin;
  }

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  }

  function binb2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str +=
        hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8 + 4)) & 0xf) +
        hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 0xf);
    }
    return str;
  }

  s = Utf8Encode(s);
  return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}
function getKey(paramStr) {
  var paramStrSort = paramStr.split("").sort().join("");
  var beforStr = SECKEY + "?" + paramStrSort;
  var afterStr = SHA256(beforStr);
  var upperCaseStr = afterStr.toUpperCase();
  return upperCaseStr;
}

export default {
  data() {
    return {
      orderjs,
      userInfo: {
        name: "",
        phone: "",
        email: "",
        day: "",
        time: [],
        point: "",
        notes: "",
        number: "",
      },
      allPoint: 0, // 积分
      rules: {
        name: {
          type: "string",
          required: true,
          message: "请填写订购人",
          trigger: ["blur", "change"],
        },
        phone: [
          {
            type: "string",
            required: true,
            message: "请填写手机号",
            trigger: ["blur", "change"],
            validator: (rule, value, callback) => {
              const re = /^[1-9]\d{6,15}$/;
              if (re.test(value)) {
                callback();
              } else {
                callback(new Error("请输入正确的手机号！"));
              }
            },
          },
        ],
        email: {
          type: "email",
          required: true,
          message: "请填写email",
          validator: (rule, value, callback) => {
            if (uni.$u.test.email(value)) {
              callback();
            } else {
              callback(new Error("email不正确"));
            }
          },
          trigger: ["blur", "change"],
        },
        day: {
          type: "string",
          required: true,
          message: "请填写订购日期",
          trigger: ["change", "blur"],
        },
        time: {
          required: true,
          validator: async (rule, value, callback) => {
            const { time } = this.userInfo;
            if (time.length === 0) {
              callback(new Error("请填写预订时间"));
            }
            callback();
          },
          trigger: ["blur", "change"],
        },
      },
      showCalendar: false,
      showDateTime: false,
      defaultIndex: [],
      store: {},
      customList: [],
      show: false,
      columns: [],
      columnData: [],
      total: {},
      promotions: [], // 促销活动
      promotionalPrice: 0,
      minDate: new Date().getTime(),
      maxDate: new Date().getTime(),
      disabled: false,
    };
  },

  onLoad(option) {
    this.onGetActive();
    this.getShopCar();
    this.getPoint();
  },
  onReady() {
    //如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
    this.$refs.uForm.setRules(this.rules);
    this.$refs.uForm1.setRules(this.rules);
  },
  methods: {
    onValidate() {
      this.$refs.uForm1.validate();
    },

    handleSubmit() {
      this.$refs.uForm.validate().then(() => {
        this.$refs.uForm1.validate().then(() => {
          this.disabled = true;
          uni.showLoading({
            title: "加载中...",
          });
          uni.login({
            provider: "weixin",
            onlyAuthorize: true, // 微信登录仅请求授权认证
            success: (event) => {
              //客户端成功获取授权临时票据（code）,向业务服务器发起登录请求。
              uni.request({
                url: this.$apiHost + "/wechat/login",
                data: {
                  code: event.code,
                },
                success: (tokenRes) => {
                  // 保存token
                  uni.setStorageSync("token", tokenRes.data.rt_api_key);
                  const {
                    name,
                    phone,
                    email,
                    day,
                    time,
                    notes,
                    number,
                    point,
                  } = this.userInfo;
                  const HH = time[0] < 10 ? "0" + time[0] : time[0];
                  const mm = time[1] < 10 ? "0" + time[1] : time[1];
                  uni.request({
                    url: this.$apiHost + `/front/order`,
                    method: "POST",
                    header: {
                      Authorization: "Bearer " + uni.getStorageSync("token"),
                    },
                    data: {
                      name,
                      email,
                      phone,
                      order_type: "general",
                      payment_gateway: "wechatpay",
                      reserve_day: day,
                      reserve_date: `${HH}:${mm}`,
                      memo: notes,
                      person: number || 0,
                      order_lang: "zh-Hans",
                      card_price: this.paymentAmount,
                      kcp_price: 0,
                      barogage_price: 0,
                      redtable_price: point || 0,
                      promotion_price: 0,
                      eqtype: "N",
                      restype: "JSON",
                    },
                    success: (res) => {
                      const resp = res.data;
                      let data = {
                        ver: 100,
                        mid: "P12000000146",
                        servicetype: "S001",
                        reqtype: "N",
                        statusurl:
                          "https://redtable.global/order/icb/wechatpay/status",
                        returnurl: "http://localhost:3000/api/icb/return",
                        refer_url: "https://redtable.global",
                        restype: "JSON",
                        mname: "redtable",
                        trade_information: JSON.stringify({
                          goods_detail: [
                            {
                              wxpay_goods_id: "5331",
                              goods_name: resp.data.title,
                              quantity: 1,
                            },
                          ],
                        }),
                        refno: resp.data.order_no,
                        reqcur: "KRW",
                        reqamt: resp.order_pay.price,
                        buyername: resp.data.name,
                        product: resp.data.title,
                        tel: resp.data.phone,
                        email: resp.data.email,
                        param1: tokenRes.data.openid,
                        param2: "Bearer " + uni.getStorageSync("token"),
                      };
                      // 调用ICB接口
                      uni.request({
                        url: "https://online.funpay.co.kr/payment/payment.icb",
                        data: {
                          ...data,
                          fgkey: getKey(decodeURIComponent(qs.stringify(data))),
                        },
                        header: {
                          "Content-Type": "application/x-www-form-urlencoded",
                        },
                        method: "POST",
                        success: (res) => {
                          uni.hideLoading();
                          let data = JSON.parse(
                            decodeURIComponent(res.data.resmsg)
                          );
                          // 发起weixin支付
                          wx.requestPayment({
                            appId: data.appId,
                            timeStamp: data.timeStamp,
                            nonceStr: data.nonceStr,
                            package: data.package,
                            signType: data.signType,
                            paySign: data.paySign,
                            success: (res) => {
                              uni.showToast({
                                title: "支付成功",
                                icon: "success",
                                mask: true,
                              });
                              setTimeout(() => {
                                uni.switchTab({ url: "/pages/order/index" });
                              }, 1500);
                            },
                            fail: (res) => {
                              uni.showModal({
                                title: "提示",
                                content: "支付失败，请稍后重试！",
                                showCancel: false,
                              });
                            },
                            complete: (res) => {
                              this.disabled = true;
                            },
                          });
                        },
                        fail: (err) => {
                          uni.showModal({
                            title: "提示",
                            content: "支付失败，请稍后重试！",
                            showCancel: false,
                          });
                        },
                      });
                    },
                  });
                },
              });
            },
            fail: function (err) {
              console.log("err", err);
              // 登录授权失败
              // err.code是错误码
            },
          });
        });
      });
    },

    // 获取小时
    // getTime() {
    //   uni.request({
    //     url: this.$apiHost + `/front/store/${this.store.id}`,
    //     header: {
    //       Authorization: "Bearer " + uni.getStorageSync("token"),
    //     },
    //     method: "GET",
    //     success: (res) => {
    //       console.log(res);
    //     },
    //   });
    // },
    // 选择时间，去除不可选日期
    formatter(day) {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const d = new Date(day.date);
      const year = d.getFullYear();
      const month =
        d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
      const date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
      if (
        !currentPage.data.customList.includes(year + "-" + month + "-" + date)
      ) {
        day.type = "disabled";
      } else {
        // day.type = "";
      }
      return day;
    },

    // 获得可选择的日期
    getCalendar() {
      const d = new Date();
      const year = d.getFullYear();
      const month =
        d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
      const date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();

      const day = this.userInfo.day || year + "-" + month + "-" + date;

      uni.request({
        url:
          this.$apiHost + `/front/store/${this.store.id}/business-day/${day}`,
        method: "get",
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        success: (res) => {
          this.customList = res.data.data;
          this.show = true;
        },
      });
    },

    getShopCar() {
      uni.request({
        url: this.$apiHost + `/front/cart?s_lang=zh-Hans`,
        method: "get",
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        success: (res) => {
          this.store = res.data.store;
          this.getCalendar();
        },
      });
    },

    onGetActive() {
      uni.request({
        url: this.$apiHost + `/front/cart/total`,
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        method: "post",
        data: {
          lang: "zh-Hans",
          s_channel: "www",
        },
        params: {
          // promotion_id:
        },
        success: (res) => {
          if (res.data.status == "success") {
            this.total = res.data.data;

            // 活动商品
            let promotions = JSON.parse(
              JSON.stringify(res.data.data.promotions)
            );
            promotions.forEach((item) => {
              item.checked = false;
            });
            this.promotions = promotions;

            // 最小、最大可选择日期
            const min = this.total.store_contract.reserve_after_days;
            const max = this.total.store_contract.reserve_max_days;
            this.minDate = new Date(
              moment().add(min, "days").format("YYYY-MM-DD")
            ).getTime();
            this.maxDate = new Date(
              moment().add(max, "days").format("YYYY-MM-DD")
            ).getTime();

            console.log(this.minDate);
            console.log(this.maxDate);

            const { store_bisuness_time } = res.data.data;
            if (store_bisuness_time.length) {
              // 如果不中午休息
              if (!store_bisuness_time[0].break_start) {
                const { columns: columns1, columnData: columnData1 } =
                  this.generateColumnsAndColumnData(
                    store_bisuness_time[0].open,
                    store_bisuness_time[0].close
                  );
                this.columns = [columns1, columnData1[0]];
                this.columnData = columnData1;
              } else {
                const { columns: columns1, columnData: columnData1 } =
                  this.generateColumnsAndColumnData(
                    store_bisuness_time[0].open,
                    store_bisuness_time[0].break_start
                  );
                const { columns: columns2, columnData: columnData2 } =
                  this.generateColumnsAndColumnData(
                    store_bisuness_time[0].break_end,
                    store_bisuness_time[0].close
                  );
                this.columns = [[...columns1, ...columns2], columnData1[0]];
                this.columnData = [...columnData1, ...columnData2];
              }
            }
          }
        },
      });
    },

    // 选中活动中的商品
    handleCheckActiveProduction(index) {
      this.$set(
        this.promotions[index],
        "checked",
        !this.promotions[index].checked
      );
      const checkActiveProductions = this.promotions.filter(
        (item) => item.checked
      );
      if (checkActiveProductions.length !== 0) {
        const total = checkActiveProductions.reduce((a, b) => {
          return a + b.max_discount_price * (1 - b.max_discount_rate);
        }, 0);
        this.promotionalPrice = total;
        return;
      }
      this.promotionalPrice = 0;
    },

    changeHandler(e) {
      const {
        columnIndex,
        value,
        values, // values为当前变化列的数组内容
        index,
        // 微信小程序无法将picker实例传出来，只能通过ref操作
        picker = this.$refs.uPicker,
      } = e;
      // 当第一列值发生变化时，变化第二列(后一列)对应的选项
      if (columnIndex === 0) {
        // picker为选择器this实例，变化第二列对应的选项
        picker.setColumnValues(1, this.columnData[index]);
      }
    },

    // 获取积分
    getPoint() {
      uni.request({
        url: this.$apiHost + `/front/user/profile`,
        method: "GET",
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        success: (res) => {
          const { cash_point, b2b_point, reward_point } = res.data.data;
          this.allPoint = cash_point + b2b_point + reward_point;
          // this.allPoint = 10000;
        },
      });
    },

    // 使用所有积分
    consumeAllPoint() {
      if (this.allPoint > this.total.total_price * 1 + this.promotionalPrice) {
        this.userInfo.point =
          this.total.total_price * 1 + this.promotionalPrice;
      } else {
        this.userInfo.point = this.allPoint;
      }
    },

    formatterInput(val) {
      // 不能以0开头
      if (val == 0) {
        console.log(11111);
        this.userInfo.point = "";
      }

      // 1. 不得少于0积分。
      if (val < 0) {
        this.userInfo.point = "";
        return;
      }

      // 2. 不得多于初始积分
      if (val > this.allPoint) {
        this.userInfo.point = "";
        return;
      }

      // 3. 不得多于总商品价格
      if (val > Number(this.total.total_price * 1 + this.promotionalPrice)) {
        this.userInfo.point = "";
        return;
      }
    },

    handleShowTime() {
      this.showCalendar = true;
    },
    onCalendarConfirm(event) {
      this.userInfo.day = this.formatDate(event.detail);
      this.showCalendar = false;
      this.onValidate();
    },
    formatDate(date) {
      date = new Date(date);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onCalendarClose() {
      this.showCalendar = false;
    },

    handleShowDateTime() {
      const { day } = this.userInfo;
      if (!day) {
        this.$refs.uToast.show({
          type: "default",
          message: "请填写订购日期",
        });
        return;
      }
      // this.$set(this.defaultIndex, 0, this.userInfo.time[0]);
      // this.$set(this.defaultIndex, 1, this.userInfo.time[1]);
      this.showDateTime = true;
    },
    onTimeConfirm({ value, indexs }) {
      this.$set(this.userInfo.time, 0, value[0]);
      this.$set(this.userInfo.time, 1, value[1]);
      this.showDateTime = false;
      this.defaultIndex = indexs;
      this.onValidate();
    },
    onTimeClose() {
      this.showDateTime = false;
      this.onValidate();
    },
    generateColumnsAndColumnData(startTime, endTime) {
      let columns = [],
        columnData = [];
      for (
        let i = Number(startTime.slice(0, 2));
        i <= Number(endTime.slice(0, 2));
        i++
      ) {
        columns.push(i);
      }
      for (let i = columns[0]; i <= columns[columns.length - 1]; i++) {
        let startMinute = 0,
          endMinute = 50;
        if (i === columns[0]) startMinute = Number(startTime.slice(3));
        if (i === columns[columns.length - 1])
          endMinute = Number(endTime.slice(3));

        let arr = [];
        for (let i = startMinute; i <= endMinute; i += 10) {
          if (i == 0) {
            arr.push(i + "0");
          } else {
            arr.push(i);
          }
        }
        columnData.push(arr);
      }

      return { columns, columnData };
    },
  },
  computed: {
    // 剩余积分
    residuePoint() {
      return this.allPoint - this.userInfo.point;
    },
    // 支付金额
    paymentAmount() {
      return (
        this.total.total_price -
        (this.userInfo.point || 0) +
        this.promotionalPrice
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.shop-name {
  width: 750rpx;
  height: 96rpx;
  line-height: 96rpx;
  padding-left: 32rpx;
  box-sizing: border-box;
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  background: #f8f8f8;
  border: 2rpx solid #e8e8e8;
}

.campaign {
  padding: 16rpx 0;
  margin-top: 8rpx;
  padding-left: 32rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.campaign-info {
  width: 746rpx;
  display: flex;
  padding: 24rpx 32rpx;
  // box-sizing: border-box;
  width: 750rpx;
  height: 166rpx;
  margin: auto;
  &.active {
    background: rgba(255, 74, 82, 0.05);
    border: 2rpx solid rgba(255, 74, 82, 0.2);
  }

  .right {
    width: 514rpx;
    margin-left: 32rpx;

    .top {
      margin-top: 8rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #551a8b;
    }

    .bottom {
      font-size: 32rpx;
      font-weight: 400;
      color: #551a8b;
      margin-top: 16rpx;
    }
  }
}

.customer {
  width: 750rpx;
  padding-left: 32rpx;
  padding-top: 48rpx;
  box-sizing: border-box;
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  border-top: 2rpx solid #e8e8e8;
  margin-top: 48rpx;
}

.customer-info {
  width: 750rpx;
  padding: 0 32rpx;
  box-sizing: border-box;
}

/deep/.c-input-placeholder {
  font-size: 28rpx !important;
  font-weight: 400;
  color: #999999 !important;
}

.tips {
  font-size: 24rpx;
  font-weight: 400;
  color: #999999;
  margin-top: 8rpx;
  line-height: 36rpx;
}

.point-info {
  font-size: 32rpx;
  font-weight: 400;
  color: #333333;
  padding: 32rpx;

  .btn {
    width: 100%;
    margin-top: 32rpx;
    display: flex;
    justify-content: space-between;
  }
}

.settlement {
  width: 690rpx;
  margin: 0 auto 160rpx;
  border: 1px solid #ccc;
  padding: 0 20rpx;
  box-sizing: border-box;
  border-radius: 10rpx;
  padding-bottom: 20rpx;

  .header {
    font-size: 28rpx;
    display: flex;
    justify-content: space-between;
    padding: 20rpx 0;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
  }
  .item {
    font-size: 24rpx;
    display: flex;
    justify-content: space-between;
    color: #333;
    margin-top: 20rpx;
  }
}
</style>
