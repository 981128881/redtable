<template>
  <view>
    <view style="margin: 32rpx">
      <!-- 搜索栏 购物车 -->
      <u-row justify="space-between" gutter="10">
        <u-col span="11">
          <u-search
            placeholder="请输入关键词"
            shape="square"
            :clearabled="true"
            height="80"
            searchIconColor="#000000"
            searchIconSize="32rpx"
            :showAction="false"
            @search="search()"
          >
          </u-search>
        </u-col>
        <u-col span="1" align="center">
          <view @click="toLink('/pages/shoppingCart/index')">
            <u-icon
              name="shopping-cart"
              color="#000000"
              size="40rpx"
              bold
            ></u-icon>
          </view>
        </u-col>
      </u-row>
      <!-- 标签栏 -->
      <view class="tabs-list">
        <u-tabs
          :list="city"
          :current="tabVal"
          lineColor="#FF4A52"
          @click="checkedCity()"
        ></u-tabs>
      </view>
    </view>

    <view style="display: flex">
      <!-- 左侧菜单 纵向滚动 -->
      <scroll-view
        scroll-y
        scroll-with-animation
        class="u-tab-view menu-scroll-view"
        :scroll-top="scrollTop"
      >
        <view
          v-for="(item, index) in district"
          :key="index"
          class="u-tab-item"
          :class="[current == index ? 'u-tab-item-active' : '']"
          :data-current="index"
          @tap.stop="swichMenu(item, index)"
        >
          <text class="u-line-1">{{ item.name }}</text>
        </view>
      </scroll-view>
      <block v-for="(item, index) in district" :key="index">
        <scroll-view scroll-y class="right-box" v-if="current == index">
          <view class="page-view">
            <view class="class-item">
              <view class="item-container">
                <view
                  class="thumb-box"
                  v-for="(type, i) in item.foods"
                  :key="i"
                >
                  <image
                    class="item-menu-image"
                    :src="type.imgUrl"
                    @click="toSpecial(type)"
                    mode="aspectFill"
                  ></image>
                  <view class="name">{{ type.name }}</view>
                  <view class="count"
                    >{{ type.count | unitConverter }} 个店铺</view
                  >
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </block>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      option: {},
      // cid: 0,
      tabVal: 0,
      city: [],
      district: [],
      category: [],
      cityId: 0,
      scrollTop: 0, //tab标题的滚动条位置
      current: 0, // 预设当前项的值
      menuHeight: 0, // 左边菜单的高度
      menuItemHeight: 0, // 左边菜单item的高度
    };
  },
  created() {
    console.log("created");
  },
  onLoad(option) {
    console.log("onLoad");
    this.option = option;
    // uni.$on('city', function(res) {
    // 		console.log("uni.$on",res.cid)
    // 		this.cid = res.cid
    // 	}
    // )
    this.getList();
  },
  onUnload() {
    console.log("onUnload");
  },
  mounted() {
    console.log("mounted");
  },
  methods: {
    // 获取列表数据
    getList() {
      uni.request({
        url: this.$apiHost + "/common/select-city",
        method: "get",
        data: {
          s_lang: "zh-Hans",
        },
        success: (res) => {
          const city = res.data.data;
          let newCity = [];
          for (let item in city) {
            newCity.push({
              id: city[item].id,
              name: city[item].translate_name2,
              district: city[item].commercial_areas,
            });
          }
          this.city = newCity;

          let cityIndex = 0;
          // 首页点进来的
          if (this.option.cid) {
            cityIndex = this.city.findIndex((i) => i.id == this.option.cid);
            this.tabVal = cityIndex;
          }
          this.checkedCity(this.city[cityIndex]);
        },
      });
    },
    // 选择市
    checkedCity(item) {
      this.district = [];
      let newDistrict = [];
      item.district.map((row, i) => {
        newDistrict.push({
          id: row.id,
          name: row.translate_commercial_area_name,
        });
      });
      // 根据选择市获取其下所有区
      this.district = newDistrict;
      // 选中的市
      // this.cityId = item.id
      // 选择市的默认区
      this.current = 0;
      this.checkedDistrict(this.district[0], 0);
    },
    // 点击左边的栏目切换
    async swichMenu(item, index) {
      if (index == this.current) return;
      this.current = index;
      // 如果为0，意味着尚未初始化
      // if (this.menuHeight == 0 || this.menuItemHeight == 0) {
      // 	await this.getElRect('menu-scroll-view', 'menuHeight');
      // 	await this.getElRect('u-tab-item', 'menuItemHeight');
      // }
      // 将菜单item垂直居中
      this.scrollTop =
        index * this.menuItemHeight +
        this.menuItemHeight / 2 -
        this.menuHeight / 2;
      this.checkedDistrict(item, index);
    },
    // 选择区
    checkedDistrict(item, index) {
      this.category = [];
      uni.request({
        url: this.$apiHost + "/front/must-eat/main",
        method: "get",
        data: {
          s_commercial_area_id: item.id,
          s_channel: "redtable",
          limit: 10,
          s_lang: "zh-Hans",
          // s_must_eat_id: '',
        },
        success: (res) => {
          let newCategory = [];
          res.data.must_eats.map((row, i) => {
            // 选中区下的所有品类
            newCategory.push({
              key: row.id,
              imgUrl: this.$imageHost + row.must_eat_file_path,
              name: row.translate_must_eat_name,
              count: row.must_eat_count,
              link:
                "/pages/special/index?s_commercial_area_id=" +
                item.id +
                "&s_must_eat_id=" +
                row.id,
            });
          });
          this.$set(this.district[index], "foods", newCategory);
        },
      });
    },
    toSpecial(item) {
      uni.navigateTo({
        url: item.link,
      });
    },
    // 获取一个目标元素的高度
    getElRect(elClass, dataVal) {
      new Promise((resolve, reject) => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select("." + elClass)
          .fields(
            {
              size: true,
            },
            (res) => {
              // 如果节点尚未生成，res值为null，循环调用执行
              if (!res) {
                setTimeout(() => {
                  this.getElRect(elClass);
                }, 10);
                return;
              }
              this[dataVal] = res.height;
            }
          )
          .exec();
      });
    },
    search(value) {
      uni.navigateTo({
        url: "/pages/search/index?keyword=" + value,
      });
    },
    toLink(url) {
      uni.navigateTo({ url });
    },
  },
};
</script>

<style lang="scss">
.tabs-list {
  margin-top: 16rpx;
  margin-left: -32rpx;
  width: 754rpx;
  height: 100rpx;
  background: #f8f8f8;
  border-radius: 0rpx 0rpx 0rpx 0rpx;
  opacity: 1;
  border: 2rpx solid #e8e8e8;
}

.u-tabs__wrapper__nav__line {
  width: 44rpx !important;
  height: 8rpx !important;
}

.u-tab-view {
  width: 200rpx;
  // height: 100%;
  margin-top: -32rpx;
  background: #f1f1f1;
}

.u-tab-item {
  width: 200rpx;
  height: 96rpx;
  background: #f1f1f1;
  border-radius: 0rpx 0rpx 0rpx 0rpx;
  opacity: 1;
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  text-align: center;
  line-height: 100rpx;
}

.u-tab-item-active {
  // position: relative;
  font-size: 28rpx;
  font-weight: bold;
  color: #ff4a52;
  background: #ffffff;
}

// 选中条
// .u-tab-item-active::before {
// 	content: "";
// 	position: absolute;
// 	border-left: 4px solid;
// 	height: 32rpx;
// 	left: 0;
// 	top: 39rpx;
// }

.right-box {
  margin-top: -32rpx;
  height: calc(100vh - 230rpx);
}

.page-view {
  padding-left: 20rpx;
}

.class-item {
  margin-bottom: 30rpx;
}

.item-container {
  display: flex;
  flex-wrap: wrap;
}

.thumb-box {
  width: 49%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 20rpx;
  position: relative;
}

.thumb-box .name {
  position: absolute;
  top: 16rpx;
  left: 36rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #ffffff;
}
.thumb-box .count {
  position: absolute;
  top: 60rpx;
  left: 36rpx;
  font-size: 24rpx;
  color: #ffffff;
}

.item-menu-image {
  width: 228rpx;
  height: 252rpx;
  background: #ffffff;
  border-radius: 8rpx;
}
.menu-scroll-view {
  height: calc(100vh - 230rpx);
}
</style>
