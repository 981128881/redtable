<template>
	<view>
		<view style="margin: 32rpx;">
			<!-- 搜索栏 购物车 -->
			<u-row justify="space-between" gutter="10">
				<u-col span="11">
					<u-search placeholder="请输入关键词" shape="square" :clearabled="true" height="80"
						searchIconColor="#000000" searchIconSize="32rpx" :showAction="false" @search="search()">
					</u-search>
				</u-col>
				<u-col span="1" align="center">
					<view @click="toLink('/pages/shoppingCart/index')">
						<u-icon name="shopping-cart" color="#000000" size="40rpx" bold></u-icon>
					</view>
				</u-col>
			</u-row>
			<!-- 标签栏 -->
			<view class="tabs-list">
				<u-tabs :list="tabs" lineColor="#FF4A52" @click="changeTabs()"
					:itemStyle="{width:'25%',height:'100rpx'}">
				</u-tabs>
			</view>
		</view>
		<view class="content">
			<!-- 无数据 -->
			<view class="no-data" v-if="list.length == 0">
				<image src="/static/info.png"></image>
				<span>Nothing ordered yet.</span>
				<p class="under-line" @click="toTabBar('/pages/city/index')">所有商品</p>
			</view>
			<u-list @scrolltolower="scrolltolower" height="1200rpx" :preLoadScreen="page * 4">
				<u-list-item v-for="(item, index) in list" :key="index" v-if="list.length > 0">
					<!-- <view class="table" v-for="(item, index) in list" :key="index" v-if="list.length > 0"> -->
					<view class="item" @click="toInfo(item)">
						<image :src="item.imgUrl"></image>
						<view class="item-info">
							<h2>{{item.translate_name}}</h2>
							<p>{{item.title}}</p>
							<p>使用日期 {{item.reserved_at}}</p>
							<view class="price">
								{{item.order_price}}
								<span>{{item.currency}}</span>
							</view>
							<span class="more">
								<u-icon name="arrow-right" color="#888888" size="28rpx" bold></u-icon>
							</span>
						</view>
					</view>
					<!-- </view> -->
				</u-list-item>
			</u-list>
		</view>

	</view>

</template>

<script>
	export default {
		data() {
			return {
				// 滑到底部加载更多
				offset: 1,
				noData: false,
				tabType: 'wait',
				tabs: [{
					name: '待使用',
					type: 'wait',
				}, {
					name: '已使用',
					type: 'used',
				}, {
					name: '取消订单',
					type: 'cancel',
				}],
				list: [],
				// 待使用
				waitList: [],
				// 已使用
				usedList: [],
				// 取消
				cancelList: [],
			}
		},
		onLoad() {},
		onShow: function() {
			if (uni.getStorageSync('token')) {
				this.init();
			}else{
				uni.navigateTo({
					url: '/pages/login/index'
				})
			}
		},
		methods: {
			init() {
				this.list = []
				this.waitList = []
				this.usedList = []
				this.cancelList = []
				this.offset = 1
				this.noData = false
				this.loadmore()
			},
			scrolltolower() {
				this.loadmore()
			},
			loadmore() {
				if (this.noData == true) {
					console.log("this.noData == true")
					return
				}
				const token = uni.getStorageSync('token')
				// const token = 'xbCXQ7DwwFM0VbrR1BQQpyUIv29yqV7garpzTJJtajVV7bNeImvqnzCayNMNo3Tk'
				uni.request({
					url: this.$apiHost + '/front/order',
					method: 'GET',
					data: {
						limit: 50,
						offset: this.offset,
					},
					header: {
						'Authorization': 'Bearer ' + token
					},
					success: res => {
						this.offset++
						if (res.data.data.length < 50) {
							this.noData = true
						}
						this.orderListPush(res.data.data)
					}
				})
			},
			orderListPush(datas) {
				datas.map((data, i) => {
					let currentData = {
						...data,
						imgUrl: this.$imageHost + data.store_image,
						dateText: data.status === 'cancel' ? '取消日期' : '使用日期'
					}
					if ((data.status === 'paid' || data.status === 'particial_cancel') && data.voucher_status !==
						'used') {
						this.waitList.push(currentData)
					}
					if (data.voucher_status === 'used') {
						this.usedList.push(currentData)
					}
					if (data.status === 'cancel') {
						this.cancelList.push(currentData)
					}
				})
				console.log("this.waitList",this.waitList)
				console.log("this.usedList",this.usedList)
				console.log("this.cancelList",this.cancelList)
				this.list = this.tabType == 'wait' ? this.waitList :
					this.tabType == 'used' ? this.usedList :
					this.cancelList
			},
			changeTabs(item) {
				this.tabType = item.type
				this.init()
			},
			toTabBar(url) {
				uni.switchTab({
					url
				})
			},
			toInfo(item) {
				uni.navigateTo({
					url: '/pages/order/info?order_no=' + item.order_no
				})
			},
			search(value) {
				uni.navigateTo({
					url: '/pages/search/index?keyword=' + value
				})
			},
			toLink(url) {
				uni.navigateTo({ url })
			},
		}
	}
</script>

<style lang="scss">
	.tabs-list {
		margin-top: 16rpx;
		margin-left: -32rpx;
		width: 754rpx;
		height: 100rpx;
		background: #F8F8F8;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		opacity: 1;
		border: 2rpx solid #E8E8E8;
	}

	.u-tabs__wrapper__nav__line {
		width: 44rpx !important;
		height: 8rpx !important;

	}

	.content {}

	.no-data {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.no-data image {
		margin-top: 128rpx;
		width: 64rpx;
		height: 64rpx;
	}

	.no-data span {
		margin-top: 32rpx;
	}

	.under-line {
		margin-top: 72rpx;
		font-size: 32rpx;
		font-weight: 400;
		color: #333333;
		text-decoration: underline;
	}

	.item {
		display: flex;
		padding: 20rpx 32rpx;
		border-bottom: 2rpx solid #E8E8E8;
	}

	.item image {
		width: 240rpx;
		height: 200rpx;
	}

	.item-info {
		position: relative;
		width: 450rpx;
		padding-left: 16rpx;

		h2 {
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
		}

		p {
			margin-top: 15rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #888888;
		}
	}

	.price {
		margin-top: 26rpx;
		text-align: right;
		font-size: 32rpx;
		font-weight: 700;

		span {
			font-size: 26rpx;
			color: #aaaaaa;
			padding-left: 10rpx;
		}
	}

	.more {
		position: absolute;
		top: 0;
		right: 0;
		font-size: 28rpx;
		font-weight: 400;
		color: #777777;
	}
</style>