<template>
  <div>
    <div class="text">
      {{ csjs.guide }}
    </div>
    <div class="form">
      <u--form
        labelPosition="left"
        :model="userInfo"
        :rules="rules"
        ref="uForm"
      >
        <u-form-item prop="type" @click="show = true">
          <div class="title">{{ csjs.type }}</div>
          <u--input
            v-model="userInfo.type"
            disabled
            customStyle="padding: 8rpx; background: #F8F8F8; border: 2rpx solid #E8E8E8;"
            suffixIcon="arrow-down"
          >
          </u--input>
        </u-form-item>
        <u-form-item prop="phone">
          <div class="title">{{ orderjs.contact_number }}</div>
          <u-input
            type="number"
            placeholderClass="c-input-placeholder"
            placeholder="请输入用户号码（只填数字）"
            v-model="userInfo.phone"
            customStyle="padding: 8rpx; background: #F8F8F8; border: 2rpx solid #E8E8E8;"
          ></u-input>
        </u-form-item>
        <u-form-item prop="notes">
          <div class="title">{{ csjs.message }}</div>
          <u--textarea
            placeholderClass="c-input-placeholder"
            v-model="userInfo.notes"
            height="120"
            customStyle="padding: 8rpx; background: #F8F8F8; border: 2rpx solid #E8E8E8;"
          ></u--textarea>
        </u-form-item>
      </u--form>
    </div>
    <u-button
      @click="handleSubmit"
      color="#FF4A52"
      custom-style="width: 690rpx; margin: 30rpx auto;"
      >{{ csjs.inquire }}</u-button
    >
    <u-picker
      :show="show"
      :columns="columns"
      itemHeight="100"
      @confirm="onConfirm"
      @cancel="onClose"
      :defaultIndex="defaultIndex"
    ></u-picker>
  </div>
</template>

<script>
import { cs as csjs } from "../../zh-Hans/cs";
import { order as orderjs } from "../../zh-Hans/order";
export default {
  data() {
    return {
      orderjs,
      csjs,
      userInfo: {
        type: csjs["type-order"],
        phone: "",
        notes: "",
      },
      rules: {
        phone: {
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
        notes: {
          type: "string",
          required: true,
          message: "请填写内容",
          trigger: ["blur", "change"],
        },
      },
      columns: [
        [
          csjs["type-order"],
          csjs["type-pay"],
          csjs["type-cancel"],
          csjs["type-voucher"],
          csjs["type-etc"],
        ],
      ],
      defaultIndex: [0],
      show: false,
    };
  },
  methods: {
    onConfirm({ value, indexs }) {
      this.userInfo.type = value;
      this.$set(this.defaultIndex, 0, indexs);
      this.show = false;
    },

    handleSubmit() {
      this.$refs.uForm
        .validate()
        .then(() => {
          uni.request({
            url: this.$apiHost + `/front/cs`,
            method: "POST",
            header: {
              Authorization: "Bearer " + uni.getStorageSync("token"),
            },
            data: {
              use_yn: "y",
              status: "ready",
              type: this.userInfo.type,
              phone: this.userInfo.phone,
              content: this.userInfo.notes,
            },
            success: (res) => {
              if (res.data.status === "success") {
                this.userInfo = {
                  type: csjs["type-order"],
                  phone: "",
                  notes: "",
                };
                uni.navigateTo({
                  url: `/pages/initiateConsultationTwo/index?id=${res.data.data.id}`,
                });
              }
            },
          });
        })
        .catch((errors) => {});
    },
  },

  onReady() {
    //如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
    this.$refs.uForm.setRules(this.rules);
  },
};
</script>

<style lang="scss" scoped>
.text {
  padding: 32rpx;
  font-size: 32rpx;
  font-weight: 400;
  color: #333333;
}

.form {
  padding: 32rpx;
  .title {
    margin: 10rpx 0;
    font-size: 32rpx;
    font-weight: 400;
    color: #333333;
  }
}
</style>
