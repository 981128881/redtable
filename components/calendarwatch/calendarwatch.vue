<template>
  <!-- <view class="page"> -->
  <view class="card">
    <view class="head">
      <u-icon name="arrow-left" @click="click_date_month('prev')"></u-icon>
      <view class="title">{{ nowYear + "年" + nowMonth + "月" }}</view>
      <u-icon name="arrow-right" @click="click_date_month('next')"></u-icon>
      <!-- <u-button v-show="select_list.length" @tap="cancel_select" class="cancel-btn" size="mini" type="primary">取消选择</u-button> -->
    </view>
    <view class="date_week">
      <view class="week_td" v-for="(item, index) in week" :key="index">{{
        item
      }}</view>
    </view>
    <swiper
      :style="{ height: '480rpx' }"
      :current="current"
      circular
      @change="change_date"
    >
      <swiper-item>
        <view class="date_week">
          <view
            class="week_td"
            :class="
              select_list.includes(vo.date) && vo.type == 'month'
                ? 'select'
                : ''
            "
            @tap="select(vo, index, week_list_prev)"
            @longtap="selectMore(vo, index)"
            v-for="(vo, index) in week_list_prev"
            :key="index"
          >
            <view
              class="num"
              :class="[
                vo.today && vo.type == 'month' ? 'today' : '',
                vo.type == 'month' ? 'month' : 'disabled',
              ]"
            >
              {{ vo.day }}</view
            >
            <view v-show="vo.dot && vo.type == 'month'" class="dot"></view>
          </view>
        </view>
      </swiper-item>

      <swiper-item>
        <view class="date_week">
          <view
            class="week_td"
            :class="
              select_list.includes(vo.date) && vo.type == 'month'
                ? 'select'
                : ''
            "
            @tap="select(vo, index, week_list)"
            @longtap="selectMore(vo, index)"
            v-for="(vo, index) in week_list"
            :key="index"
          >
            <view
              class="num"
              :class="[
                vo.today && vo.type == 'month' ? 'today' : '',
                vo.type == 'month' ? 'month' : 'disabled',
              ]"
            >
              {{ vo.day }}</view
            >
            <view v-show="vo.dot && vo.type == 'month'" class="dot"></view>
          </view>
        </view>
      </swiper-item>

      <swiper-item>
        <view class="date_week">
          <view
            class="week_td"
            :class="
              select_list.includes(vo.date) && vo.type == 'month'
                ? 'select'
                : ''
            "
            @tap="select(vo, index, week_list_next)"
            @longtap="selectMore(vo, index)"
            v-for="(vo, index) in week_list_next"
            :key="index"
          >
            <view
              class="num"
              :class="[
                vo.today && vo.type == 'month' ? 'today' : '',
                vo.type == 'month' ? 'month' : 'disabled',
              ]"
            >
              {{ vo.day }}</view
            >
            <view v-show="vo.dot && vo.type == 'month'" class="dot"></view>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
  <!-- </view> -->
</template>

<script>
export default {
  props: {
    select_lists: {
      type: Array,
      // default:()=>['2023-06-06', '2023-06-07', '2023-06-08', '2023-06-09', '2023-06-10', '2023-06-11']
    },
    // dot_lists: {
    // 	type: Array,
    // 	default:()=>['2023-06-03', '2023-06-04', '2023-06-05']
    // },
    dot_week_lists: {
      type: Array,
      // default:()=>['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    dot_remove_lists: {
      type: Array,
      // default:()=>['2023-06-03', '2023-06-04', '2023-06-05']
    },
  },
  data() {
    return {
      week: ["日", "一", "二", "三", "四", "五", "六"],
      week_list: [],
      week_list_prev: [],
      week_list_next: [],
      start_date: "", // 当月的第一天
      end_date: "", // 当月的最后一天
      prev_date: "",
      next_date: "",
      nowYear: "2023",
      nowMonth: "06",
      nowDay: "02",
      nowTime: 0,
      current: 1,
      primary_current: 1,
      dot_list: [], // 打点的数组
      select_list: [],
      isMore: false,
      startMore: "",
    };
  },
  watch: {
    // dot_lists: {
    // 	immediate: true,
    // 	handler(value) {
    // 		this.dot_list = value;
    // 		this.set_doc_lists_update()
    // 	}
    // },
    select_lists: {
      immediate: true,
      handler(value) {
        this.select_list = value;
      },
    },
    dot_week_lists: {
      immediate: true,
      handler(value) {
        this.dot_week_lists = value;
        this.set_doc_lists_update();
      },
    },
    dot_remove_lists: {
      immediate: true,
      handler(value) {
        this.dot_remove_lists = value;
        this.set_doc_lists_update();
      },
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.get_date();
      this.doc_list_update();
      this.update_month();
    },
    // 将YYYY-MM-DD变成时间戳
    date_parse(str) {
      return Date.parse(str.replace(/-(\d)(?!\d)/g, "-0$1"));
    },
    select(item, index, list) {
      if (new Date(item.date).getTime() > new Date().getTime()) {
        if (item.type == "month") {
          if (this.isMore) {
            var start = Math.min(index, this.startMore);
            var end = Math.max(index, this.startMore);
            for (var i = start + 1; i <= end; i++) {
              this.select_list.push(list[i].date);
            }
            this.select_list = [...new Set(this.select_list)];
            this.isMore = false;
            return;
          }
          var index = this.select_list.findIndex((i) => i == item.date);
          if (index > -1) {
            this.select_list.splice(index, 1);
            return;
          }
          this.select_list.push(item.date);
        } else {
          uni.showToast({
            title: "只能操作本月日期~",
            duration: 3000,
            icon: "none",
          });
        }
        return;
      }
      uni.showToast({
        title: "只能操作今日之后的日期~",
        duration: 3000,
        icon: "none",
      });
    },
    selectMore(item, index) {
      if (new Date(item.date).getTime() > new Date().getTime()) {
        if (item.type == "month") {
          this.isMore = true;
          this.startMore = index;
          this.select_list.push(item.date);
        } else {
          uni.showToast({
            title: "只能在本月选择日期~",
            duration: 3000,
            icon: "none",
          });
        }
        return;
      }
      uni.showToast({
        title: "只能为今日之后的日期添加计划~",
        duration: 3000,
        icon: "none",
      });
    },
    cancel_select() {
      this.select_list = [];
      this.isMore = false;
      this.startMore = "";
    },
    // 获得三个月的周列表
    get_date(value = "", type = "same") {
      let date = new Date();
      if (value) {
        date = new Date(value);
      }
      let nowMonth = date.getMonth() + 1,
        nowYear = date.getFullYear(),
        nowDay = date.getDate(),
        nowTime = date.getTime(),
        nowWeek = date.getDay();

      // 当前月有多少天
      let days = this.get_month_days(nowMonth, nowYear);
      let start_date = new Date(nowYear, nowMonth - 1, 1); // 当月的第一天
      let end_date = new Date(nowYear, nowMonth - 1, days); // 当月的最后一天
      let prev_date = new Date(start_date.getTime() - 1); // 要显示的上月的最后一天
      let prev_date_days = prev_date.getDate(); // 要显示的上月的最后一天的日
      let next_date = new Date(end_date.getTime() + 86401 * 1000); // 要显示的下月的第一天
      let next_date_days = next_date.getDate(); // 要显示的下月的第一天的日
      let start_week = start_date.getDay(); // 当月的第一天是星期几
      let date_arrs = [];

      let week_list = []; // 星期数组，一个月共显示5周
      let count_days = 42; // 一页显示的天数

      const toWeek = {
        0: "Sun",
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat",
      };

      // 将要显示的上个月的日期纳入日期数组
      for (let i = prev_date_days - start_week + 1; i <= prev_date_days; i++) {
        let currtDate = `${prev_date.getFullYear()}-${
          prev_date.getMonth() + 1 > 9
            ? prev_date.getMonth() + 1
            : "0" + (prev_date.getMonth() + 1)
        }-${i > 9 ? i : "0" + i}`;
        date_arrs.push({
          day: i,
          type: "prev",
          today: i == new Date().getDate() ? true : false,
          date: currtDate,
          dayWeek: toWeek[new Date(currtDate).getDay()],
        });
      }
      // 将要显示的当月日期添加到日期数组
      for (let i = 1; i <= days; i++) {
        let currtDate = `${nowYear}-${
          nowMonth > 9 ? nowMonth : "0" + nowMonth
        }-${i > 9 ? i : "0" + i}`;
        date_arrs.push({
          day: i,
          type: "month",
          today: i == new Date().getDate() ? true : false,
          date: currtDate,
          dayWeek: toWeek[new Date(currtDate).getDay()],
        });
      }
      let date_arrs_length = date_arrs.length;
      // 将要显示的下个月的日期添加到日期数组中
      for (let i = 1; i <= count_days - date_arrs_length; i++) {
        let currtDate = `${next_date.getFullYear()}-${
          next_date.getMonth() + 1 > 9
            ? next_date.getMonth() + 1
            : "0" + (next_date.getMonth() + 1)
        }-${i > 9 ? i : "0" + i}`;
        date_arrs.push({
          day: i,
          type: "next",
          today: i == new Date().getDate() ? true : false,
          date: currtDate,
          dayWeek: toWeek[new Date(currtDate).getDay()],
        });
      }
      // console.log("date_arrs", date_arrs);
      // 将当月显示的42天划分为6周的周数组
      // for(let i = 0; i < date_arrs.length / 7; i++){
      // 	let arr = [];
      // 	for(let j = 0; j < 7; j++){
      // 		arr.push(date_arrs[i * 7 + j]);
      // 	}
      // 	week_list.push(arr);
      // }
      if (type == "same") {
        this.week_list = date_arrs;
        this.nowYear = nowYear;
        this.nowMonth = nowMonth;
        this.nowDay = nowDay;
        this.nowTime = nowTime;
        this.start_date = start_date;
        this.end_date = end_date;
        this.prev_date = prev_date;
        this.next_date = next_date;
      } else if (type == "prev") {
        this.week_list_prev = date_arrs;
      } else if (type == "next") {
        this.week_list_next = date_arrs;
      }
    },
    // 获得当月的天数
    get_month_days(nowMonth, nowYear) {
      let month_arr = [1, 3, 5, 7, 8, 10, 12];
      let days = 0;
      if (nowMonth == 2) {
        if (nowYear % 4 == 0) {
          days = 29;
        } else {
          days = 28;
        }
      } else if (month_arr.indexOf(nowMonth) >= 0) {
        days = 31;
      } else {
        days = 30;
      }
      return days;
    },
    // 获得前一个月和后一个月要显示的日期
    update_month() {
      this.get_date(this.get_month("prev"), "prev");
      this.get_date(this.get_month("next"), "next");
    },
    get_month(type) {
      let nowMonth = this.nowMonth;
      let nowYear = this.nowYear;
      let nowDay = new Date().getDate();

      if (type == "prev") {
        if (nowMonth == 1) {
          nowMonth = 12;
          nowYear = Number(nowYear) - 1;
        } else {
          nowMonth--;
        }
      } else if (type == "next") {
        if (nowMonth == 12) {
          nowMonth = 1;
          nowYear = Number(nowYear) + 1;
        } else {
          nowMonth++;
        }
      }
      return this.date_parse(`${nowYear}-${nowMonth}-${nowDay}`);
    },
    // 滑动切换获得天数
    change_date_month(type) {
      let week_list = this.week_list;
      if (type == "prev") {
        this.week_list = this.week_list_prev;
        this.week_list_prev = this.week_list_next;
        this.week_list_next = week_list;
      } else if (type == "next") {
        this.week_list = this.week_list_next;
        this.week_list_next = this.week_list_prev;
        this.week_list_prev = week_list;
      }
    },
    // 点击切换
    click_date_month(type) {
      if (type === "prev") {
        if (this.current === 0) {
          this.current = 2;
        } else {
          this.current--;
        }
      }
      if (type === "next") {
        if (this.current === 2) {
          this.current = 0;
        } else {
          this.current++;
        }
      }
    },
    // 滑动切换
    change_date(e) {
      let primary_current = this.primary_current; // 之前显示的swiper-item
      let current = e.detail.current; // 切换后的swiper-item
      this.current = current; // 更新swiper-item的显示
      this.primary_current = current;

      if (primary_current - current == -1 || primary_current - current == 2) {
        this.get_date(this.get_month("next"));
        this.update_month();
        if (primary_current - current == -1 && current != 1) {
          this.change_date_month("prev");
        } else if (primary_current - current == 2) {
          this.change_date_month("next");
        }
      } else {
        this.get_date(this.get_month("prev"));
        this.update_month();
        if (primary_current - current == 1 && current != 1) {
          this.change_date_month("next");
        } else if (primary_current - current == -2) {
          this.change_date_month("prev");
        }
      }
      this.set_doc_lists_update();
    },
    // 设置打点
    set_doc_lists_update() {
      this.doc_list_update("week_list");
      this.doc_list_update("week_list_prev");
      this.doc_list_update("week_list_next");
    },
    // 为当前月设置打点
    doc_list_update(week_list = "week_list") {
      let list = [];
      // item为一周的数组
      this[week_list].forEach((vo, key) => {
        // vo为一天的对象
        // if (this.dot_list.indexOf(vo.date) > -1 || this.dot_list.indexOf(vo.date.replace(/-(\d)(?!\d)/g, '-0$1')) > -1) {
        // 按星期的范围除去特定日期标记
        if (
          this.dot_week_lists.indexOf(vo.dayWeek) > -1 &&
          this.dot_remove_lists.indexOf(vo.date) == -1
        ) {
          vo.dot = true;
        } else {
          vo.dot = false;
        }
        list.push(vo);
      });
      this[week_list] = list;
    },
  },
};
</script>

<style lang="scss">
@import "../../node_modules/uview-ui/index.scss";

.page {
  width: 100vw;
  height: 100vh;
  background: #f1f1f1;
  box-sizing: border-box;
  padding-top: 10rpx;
}

.card {
  // width: 720rpx;
  margin: 10rpx auto;
  padding: 10rpx;
  box-sizing: border-box;
  background: #fff;
  border-radius: 10rpx;
  box-shadow: 0 0 10rpx #c0c0c0;

  .head {
    position: relative;
    height: 80rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36rpx;
    color: #333;
    padding: 15rpx 0;

    .title {
      margin: 0 15rpx;
    }

    .cancel-btn {
      position: absolute;
      right: 20rpx;
    }
  }

  .date_week {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;

    .week_td {
      width: 95rpx;
      height: 70rpx;
      font-size: 30rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &.select {
        // background: #007aff;

        .num {
          background: #ff4a52 !important;
          color: #fff !important;
        }
      }

      .num {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        line-height: 60rpx;
        text-align: center;

        &.disabled {
          color: #ccc;
        }

        &.month {
          color: #333;
        }

        &.today {
          background: #fff0f5;
          // color:#fff;
        }
      }

      .dot {
        margin-top: 5rpx;
        width: 8rpx;
        height: 8rpx;
        border-radius: 50%;
        background: #ff4a52;
      }
    }
  }
}
</style>
