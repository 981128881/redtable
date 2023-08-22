<template>
  <div>
    <ul class="subsection">
      <li
        v-for="item in list"
        :key="item.key"
        :class="{ active: item.key === current }"
        @click="handleClickActive(item.key)"
      >
        {{ item.value }}
      </li>
    </ul>
    <ul class="collapse">
      <li v-for="(item, index) in dataList" :key="item.id">
        <div class="title" @click="handleClick(index, item.show)">
          <div class="icon">Q</div>
          <div class="text">{{ item.translate_answer }}</div>
          <div class="arrow">
            <u-icon
              :name="item.show ? 'arrow-up' : 'arrow-down'"
              color="#999"
              size="34"
              bold
            ></u-icon>
          </div>
        </div>
        <div class="content" v-if="item.show">
          <div class="icon">A</div>
          <div class="text">{{ item.translate_answer }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      dataList: [],
      current: "",
    };
  },
  onLoad() {
    this.getList();
  },
  methods: {
    getList() {
      uni.request({
        url: this.$apiHost + `/front/faq`,
        method: "GET",
        header: {
          Authorization: "Bearer " + uni.getStorageSync("token"),
        },
        data: {
          s_type: this.current,
          s_status: "normal",
          s_order1: "T10.sorting",
          s_order2: true,
          limit: 100,
          s_lang: "zh-Hans",
        },
        success: (res) => {
          const data = res.data.sys_type;
          const result = Object.entries(data).map(([key, value]) => ({
            key,
            value,
          }));
          console.log(result);
          this.list = result;
          this.dataList = res.data.data.map((item) => {
            return { ...item, show: false };
          });
        },
      });
    },
    handleClick(index, show) {
      this.$set(this.dataList[index], "show", !show);
    },

    handleClickActive(item) {
      this.current = item;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.subsection {
  width: 750rpx;
  height: 82rpx;
  border: 2rpx solid #e8e8e8;
  display: flex;
  box-sizing: border-box;

  li {
    flex: 1;
    text-align: center;
    line-height: 82rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #181818;
    box-sizing: border-box;

    &.active {
      background-color: #ff4a52;
      color: #fff;
    }

    &:not(:last-of-type) {
      border-right: 2rpx solid #e8e8e8;
    }
  }
}
.collapse {
  width: 750rpx;
  height: auto;
  li {
    width: 750rpx;
    height: auto;
    .title {
      display: flex;
      padding: 32rpx;
      .icon {
        width: 80rpx;
        line-height: 48rpx;
        font-size: 18px;
        color: #ff4a52;
        font-weight: 500;
        flex-shrink: 0;
      }
      .text {
        width: 100%;
        font-size: 28rpx;
        line-height: 48rpx;
      }
      .arrow {
        padding-top: 8rpx;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        width: 80rpx;
        flex-shrink: 0;
      }
    }
    .content {
      display: flex;
      padding: 50rpx 32rpx;
      background-color: #f3f3f3;
      width: 100%;
      cursor: pointer;
      box-sizing: border-box;
      .icon {
        width: 80rpx;
        line-height: 48rpx;
        font-size: 18px;
        color: #ff4a52;
        font-weight: 500;
        flex-shrink: 0;
      }
      .text {
        width: 100%;
        font-size: 28rpx;
        line-height: 48rpx;
      }
    }
  }
}
</style>
