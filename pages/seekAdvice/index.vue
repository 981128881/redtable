<template>
  <div>
    <div class="text">
      {{ csjs.guide }}
    </div>
    <ul class="subsection">
      <li v-for="item in list" :key="item" class="active">{{ item }}</li>
    </ul>
    <ul
      class="subsection-list"
      v-for="item in seekList"
      :key="item.id"
      @click="handleInfo(item.id)"
    >
      <li>{{ item.type }}</li>
      <li>{{ item.created_at_utc.slice(0, 10) }}</li>
      <li>{{ item.status }}</li>
    </ul>

    <u-button
      @click="handleInitiate"
      color="#FF4A52"
      custom-style="width: 690rpx; margin: 30rpx auto;"
      >{{ csjs.inquire }}</u-button
    >
  </div>
</template>

<script>
import { cs as csjs } from "../../zh-Hans/cs";
export default {
  data() {
    return {
      csjs,
      list: [csjs.type, csjs.date, csjs.status],
      current: "分类",
      seekList: [],
    };
  },
  onShow() {
    this.getSeekList();
  },
  methods: {
    getSeekList() {
      uni.request({
        url: this.$apiHost + `/front/cs`,
        method: "GET",
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        success: (res) => {
          this.seekList = res.data.data;
        },
      });
    },
    handleInitiate() {
      uni.redirectTo({
        url: "/pages/initiateConsultation/index",
      });
    },
    handleInfo(id) {
      uni.navigateTo({ url: `/pages/initiateConsultationTwo/index?id=${id}` });
    },
  },
};
</script>

<style lang="less" scoped>
.text {
  padding: 32rpx;
  font-size: 32rpx;
  font-weight: 400;
  color: #333333;
}

.subsection {
  margin-top: 32rpx;
  width: 686rpx;
  height: 82rpx;
  border: 2rpx solid #e8e8e8;
  display: flex;
  box-sizing: border-box;
  margin-left: 32rpx;
  li {
    flex: 1;
    text-align: center;
    line-height: 82rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #181818;
    box-sizing: border-box;
    &.active {
      font-weight: bold;
      background-color: #f3f3f3;
    }

    &:not(:last-of-type) {
      border-right: 2rpx solid #e8e8e8;
    }
  }
}
.subsection-list {
  width: 686rpx;
  height: 82rpx;
  border-left: 2rpx solid #e8e8e8;
  border-right: 2rpx solid #e8e8e8;
  border-bottom: 2rpx solid #e8e8e8;
  display: flex;
  box-sizing: border-box;
  margin-left: 32rpx;
  li {
    flex: 1;
    text-align: center;
    line-height: 82rpx;
    font-size: 28rpx;
    color: #333;
    box-sizing: border-box;
    &:not(:last-of-type) {
      border-right: 2rpx solid #e8e8e8;
    }
  }
}
</style>
