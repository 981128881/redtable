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
          <div class="title">{{ csjs.date }}</div>
          <u--input
            v-model="userInfo.date"
            disabled
            customStyle="padding: 8rpx; background: #F8F8F8; border: 2rpx solid #E8E8E8;"
            suffixIcon="arrow-down"
          >
          </u--input>
        </u-form-item>
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
      >删除</u-button
    >
    <u-picker
      :show="show"
      :columns="columns"
      itemHeight="100"
      @confirm="onConfirm"
      @cancel="onClose"
      :defaultIndex="defaultIndex"
    ></u-picker>

    <u-modal
      :show="showDel"
      showCancelButton
      title="提示"
      content="确认要删除吗？"
      @confirm="handleConfirm"
      @cancel="showDel = false"
    ></u-modal>
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
      params: {},
      showDel: false,
    };
  },
  onLoad(params) {
    this.params.id = params.id;
    this.getInfo();
  },
  methods: {
    getInfo() {
      uni.request({
        url: this.$apiHost + `/front/cs/${this.params.id}`,
        method: "GET",
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        success: (res) => {
          const data = res.data.data;
          this.userInfo = {
            date: data.created_at_utc.slice(0, 10),
            type: data.type,
            phone: data.phone,
            notes: data.content,
          };
        },
      });
    },

    onConfirm({ value, indexs }) {
      this.userInfo.type = value;
      this.$set(this.defaultIndex, 0, indexs);
      this.show = false;
    },

    handleSubmit() {
      this.showDel = true;
    },

    handleConfirm() {
      uni.request({
        url: this.$apiHost + `/front/cs/${this.params.id}`,
        method: "DELETE",
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        success: (res) => {
          if (res.data.status == "success") {
            uni.redirectTo({
              url: "/pages/seekAdvice/index",
            });
          }
        },
      });
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
