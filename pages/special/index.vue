<template>
	<view>
		<!-- 搜索栏 购物车 -->
		<!-- <view style="margin: 32rpx;">
			<u-row justify="space-between" gutter="10">
				<u-col span="11">
					<u-search placeholder="" v-model="keyword" shape="square" :clearabled="true" height="80"
						searchIconColor="#000000" searchIconSize="32rpx" :showAction="false">
					</u-search>
				</u-col>
				<u-col span="1" align="center">
					<view>
						<u-icon name="shopping-cart" color="#000000" size="40rpx" bold></u-icon>
					</view>
				</u-col>
			</u-row>
		</view> -->
		<u-line></u-line>
		<!-- 横向滑动 -->
		<view style="margin: 0 32rpx">
			<u-row>
				<view style="margin-top: 32rpx; width: 720rpx">
					<u-scroll-list :indicator="false" class="swipe swipe-photo">
						<view v-for="(item, index) in bannerList" :key="index" @click="toSpecial(item)">
							<view class="swpierBox">
								<view class="swpierBox-view-photo">
									<image :src="item.imgUrl" mode="aspectFill"></image>
									<view class="swpierBox-card">
										<p class="place">{{ item.name }}</p>
										<p class="amount">{{ item.count | unitConverter }}个店铺</p>
									</view>
									<view class="checked" v-if="item.id == option.s_must_eat_id">
										<u-icon name="checkmark" color="#FFFFFF" size="40rpx"></u-icon>
									</view>
								</view>
							</view>
						</view>
					</u-scroll-list>
				</view>
			</u-row>
		</view>
		<view class="option">
			<u-grid :border="true" col="4" @click="click">
				<griditem v-for="(item, index) in tabList" :key="index" :checkedStyle="item.checkedStyle"
					@click="changeLoca(item)">
					<!-- <span class="grid-text">{{item.title}}</span> -->
					{{ item.translate_name2 }}
				</griditem>
			</u-grid>
		</view>
		<h2 class="h2">共{{ total | unitConverter }}个店铺</h2>
		<h2 class="h2">人气推荐</h2>
		<view>
				<u-row v-for="(item, index) in storeList" :key="index">
					<view class="card" @click="toStore(item)">
						<image :src="item.imgUrl" mode="aspectFill"></image>
						<view class="introduction">
							<span class="area">{{ item.region }}</span>
							<h3 class="h3">{{ item.storeName }}</h3>
							<view class="star">
								<u-icon name="star-fill" color="#FF4A52" size="36rpx"></u-icon>
								<span class="score">
									{{ item.score || "0.0" }}({{ item.count | unitConverter }})
								</span>
							</view>
							<span class="food">{{ item.menu }}</span>
							<!-- <span class="food-info"></span> -->
							<h3 class="price">
								{{ item.price | unitConverter }}
								<!-- <span>KRW</span> -->
							</h3>
						</view>
						<view class="order">
							<image :src="'/static/buynow_ico.png'"></image>
						</view>
						<view class="heart" @click="collect(item, index, 'store')">
							<u-icon name="heart" color="#FFFFFF" size="40rpx"
								v-if="item.is_store_bookmarked == 0"></u-icon>
							<u-icon name="heart-fill" color="#FF4A52" size="40rpx"
								v-if="item.is_store_bookmarked == 1"></u-icon>
						</view>
					</view>
				</u-row>
		</view>
		<view v-if="allList.length > 0">
			<h2 class="h2">全部</h2>
			<view>
					<u-row v-for="(item, index) in allList" :key="index">
						<view class="card" @click="toStore(item)">
							<image :src="item.imgUrl" mode="aspectFill"></image>
							<view class="introduction">
								<span class="area">{{ item.region }}</span>
								<h3 class="h3">{{ item.storeName }}</h3>
								<view class="star">
									<u-icon name="star-fill" color="#FF4A52" size="36rpx"></u-icon>
									<span class="score">{{ item.score }} <template v-if="item.count">(</template>
										{{ item.count | unitConverter
                    }}<template v-if="item.count">)</template></span>
								</view>
								<span class="food">{{ item.menu }}</span>
								<h3 class="price">
									{{ item.price }}
								</h3>
							</view>
							<view class="order">
								<image :src="'/static/buynow_ico.png'"></image>
							</view>
							<view class="heart" @click.stop="collect(item, index, 'product')">
								<u-icon name="heart" color="#FFFFFF" size="40rpx"
									v-if="item.is_store_bookmarked == 0"></u-icon>
								<u-icon name="heart-fill" color="#FF4A52" size="40rpx"
									v-if="item.is_store_bookmarked == 1"></u-icon>
							</view>
						</view>
					</u-row>
			</view>
		</view>
	</view>
</template>

<script>
	import griditem from "../../components/griditem/griditem.vue";
	export default {
		components: {
			griditem,
		},
		props: {},
		data() {
			return {
				// keyword: '',
				option: {},
				// 滑到底部加载更多
				offset: 1,
				noData: false,
				// isAll: false,
				total: 0,
				bannerList: [],
				checkedIndex: 0,
				tabList: [],
				storeList: [],
				allList: [],
			};
		},
		onLoad(option) {
			this.option = option;
			this.getList();
		},
		onReachBottom (){			console.log("onReachBottom")			this.loadmore();		},
		methods: {
			click(index) {
				// 选中文字红色
				const newList = this.tabList;
				this.tabList.map((value, i) => {
					newList[i].checkedStyle = "#181818";
				});
				this.tabList = newList;
				this.tabList[index].checkedStyle = "#FF4A52 !important";
				this.checkedIndex = index;
			},
			scrolltolower() {
				this.loadmore();
			},
			getList() {
				uni.request({
					url: this.$apiHost + "/front/must-eat",
					method: "get",
					data: {
						s_channel: "redtable",
						s_lang: "zh-Hans",
						offset: this.offset,
						...this.option,
					},
					success: (res) => {
						this.offset++;
						if (res.data.data.length < 10) {
							this.noData = true;
						}
						let newBanner = [];
						res.data.must_eats.map((item, index) => {
							if (item.id == this.option.s_must_eat_id) {
								this.total = item.must_eat_count;
							}
							newBanner.push({
								id: item.id,
								imgUrl: this.$imageHost + item.must_eat_file_path,
								name: item.translate_must_eat_name,
								count: item.must_eat_count,
							});
						});
						this.bannerList = newBanner;
						this.tabList = res.data.locations;
						this.storeListPush(res.data.data);
					},
				});
			},
			loadmore() {
				if (this.noData == true) {
					return;
				}
				uni.request({
					url: this.$apiHost + "/front/must-eat",
					method: "get",
					data: {
						s_channel: "redtable",
						s_lang: "zh-Hans",
						offset: this.offset,
						...this.option,
					},
					success: (res) => {
						this.offset++;
						if (res.data.data.length < 10) {
							this.noData = true;
						}
						this.storeListPush(res.data.data);
					},
				});
			},
			storeListPush(datas) {
				datas.map((data, i) => {
					let img = data.product_image ?? data.store_image;
					let currentData = {
						...data,
						imgUrl: this.$imageHost + img,
						region: data.translate_store_location_name2 +
							"/" +
							data.translate_store_location_name3,
						storeName: data.translate_branch_name ?
							data.translate_store_name + "(" + data.translate_branch_name + ")" :
							data.translate_store_name,
						score: data.rti_star,
						count: data.show_cnt,
						menu: data.translate_product_name,
					};
					if (data.product_sale_status == "sale") {
						this.storeList.push(currentData);
					} else {
						this.allList.push(currentData);
					}
				});
			},
			toSpecial(item) {
				uni.redirectTo({
					url: "/pages/special/index?s_commercial_area_id=" +
						this.option.s_commercial_area_id +
						"&s_must_eat_id=" +
						item["id"],
				});
			},
			toStore(item) {
				uni.navigateTo({
					url: "/pages/store/index?id=" + item.store_id,
				});
			},
			changeLoca(item) {
				uni.redirectTo({
					url: "/pages/special/index?s_commercial_area_id=" +
						this.option.s_commercial_area_id +
						"&s_must_eat_id=" +
						this.option.s_must_eat_id +
						"&s_loc1=" +
						item.cat1 +
						"&s_loc2=" +
						item.cat2,
				});
			},
			// 收藏
			collect(item, index, type) {
				const token = uni.getStorageSync("token");
				uni.request({
					url: this.$apiHost + "/front/user/bookmark",
					method: "POST",
					data: {
						product_id: item.product_id,
						store_id: item.store_id,
					},
					header: {
						Authorization: "Bearer " + token,
					},
					success: (res) => {
						if (res.data.status !== "success") return;
						if (res.data.data === null) {
							console.log("取消");
							if (type === "store") this.storeList[index].is_store_bookmarked = 0;
							if (type === "product") this.allList[index].is_store_bookmarked = 0;
							return;
						}
						console.log("收藏");
						if (type === "store") this.storeList[index].is_store_bookmarked = 1;
						if (type === "product") this.allList[index].is_store_bookmarked = 1;
					},
				});
			},
		},
	};
</script>

<style lang="scss">
	.indicator {
		@include flex(row);
		justify-content: center;

		&__dot {
			height: 6px;
			width: 6px;
			border-radius: 100px;
			background-color: rgba(255, 255, 255, 0.35);
			margin: 0 5px;
			transition: background-color 0.3s;

			&--active {
				background-color: #ffffff;
			}
		}
	}

	.indicator-num {
		padding: 2px 0;
		background-color: rgba(0, 0, 0, 0.35);
		border-radius: 100px;
		width: 35px;
		@include flex;
		justify-content: center;

		&__text {
			color: #ffffff;
			font-size: 12px;
		}
	}

	.swipe {
		/deep/ .uni-swiper-dot {
			margin-right: 16rpx;
			width: 28rpx;
			height: 3px;
			border-radius: 8rpx;
		}
	}

	.swipe .swpierBox {
		height: 100%;
		display: flex;
	}

	.swipe-photo {
		height: 244rpx;
	}

	.swpierBox-view-photo {
		position: relative;
		width: 284rpx;
		height: 244rpx;
		margin-right: 10rpx;

		image {
			width: 284rpx;
			height: 244rpx;
			border-radius: 6rpx;
		}

		.swpierBox-card {
			position: absolute;
			top: 0;
			left: 0;
			color: #ffffff;
			width: 284rpx;
			height: 244rpx;
		}

		.place {
			margin-top: 10rpx;
			margin-left: 10rpx;
			font-size: 36rpx;
			font-weight: 400;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			overflow: hidden;
			-webkit-line-clamp: 2;
			text-overflow: ellipsis;
			word-wrap: break-word;
			word-break: break-all;
		}

		.amount {
			margin-top: 20rpx;
			margin-left: 20rpx;
			font-size: 24rpx;
			font-weight: 400;
		}

		.checked {
			position: absolute;
			top: 10rpx;
			right: 10rpx;
		}
	}

	.option {
		margin-top: 40rpx;
	}

	.u-grid-item {
		border: #e8e8e8 solid 2rpx !important;
		padding: 26rpx !important;
		font-size: 28rpx !important;
		font-weight: 400 !important;
		color: #181818 !important;
	}

	// .u-grid-item--hover-class {
	// 	color: #FF4A52 !important;
	// }

	.grid-text {
		padding: 26rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #181818;
	}

	.active {
		color: red;
	}

	.h2 {
		margin: 32rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #181818;
	}

	.card {
		margin: 0 32rpx 32rpx;
		width: 686rpx;
		height: 338rpx;
		border-radius: 8rpx;
		border: 2rpx solid #e8e8e8;
		display: flex;
		position: relative;
	}

	.card image {
		width: 300rpx;
		height: 336rpx;
		border-top-left-radius: 8rpx;
		border-bottom-left-radius: 8rpx;
	}

	.introduction {
		margin: 16rpx;
		width: 378rpx;
		// height: 200rpx;
	}

	.area {
		// width: 116rpx;
		height: 26rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #333333;
		line-height: 0rpx;
	}

	.order {
		position: absolute;
		top: 16rpx;
		left: 16rpx;
	}

	.order image {
		width: 44rpx;
		height: 44rpx;
	}

	.heart {
		position: absolute;
		top: 16rpx;
		left: 220rpx;
	}

	.h3 {
		margin-top: 16rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #000000;
		line-height: 28rpx;
	}

	.star {
		margin-top: 16rpx;
		position: relative;
	}

	.score {
		position: absolute;
		top: 6rpx;
		left: 40rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #777777;
		line-height: 28rpx;
	}

	.food {
		margin-top: 20rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #000000;
		line-height: 28rpx;
		display: inline-block;
	}

	.food-info {
		font-size: 24rpx;
		font-weight: 400;
		color: #888888;
		line-height: 28rpx;
		display: inline-block;
	}

	.price {
		margin-top: 20rpx;
		font-size: 32rpx;
		font-weight: 400;
		color: #000000;
		line-height: 28rpx;
	}

	.price span {
		font-size: 24rpx;
		font-weight: 400;
		color: #777777;
		line-height: 28rpx;
	}
</style>