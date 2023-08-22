<template>
	<view>
		<view style="margin: 32rpx;">
			<!-- 搜索栏 购物车 -->
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
			<!-- 标签栏 -->
			<view class="tabs-list">
				<u-tabs :list="tabs" lineColor="#FF4A52" @click="click" :itemStyle="{width:'25%',height:'100rpx'}">
				</u-tabs>
			</view>
		</view>
		<view class="content">
			<!-- 无数据 -->
			<view class="no-data" v-if="list.length == 0">
				<image src="/static/info.png"></image>
				<span>Nothing ordered yet.</span>
				<u-link href="https://uviewui.com/" text="所有商品" :under-line="true" @click="click2"></u-link>
			</view>
			<view class="table" v-for="(item, index) in list" :key="index" v-if="list.length > 0">
				<view class="item" @click="toInfo(item)">
					<image :src="item.imgUrl"></image>
					<view class="item-info">
						<h2>撒大大餐厅</h2>
						<p>测试商店预定</p>
						<p>使用日期2022-09-30 09:00</p>
						<view class="price">
							400
							<span>KRW</span>
						</view>
						<span class="more">
							<u-icon name="arrow-right" color="#888888" size="28rpx" bold></u-icon>
						</span>
					</view>
				</view>
			</view>
		</view>

	</view>

</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				tabs: [{
					name: '待使用',
					num: 0,
				}, {
					name: '已使用',
					num: 0,
				}, {
					name: '取消订单',
					num: 0,
				}],
				list: [
					{
						imgurl: 'https://uihmdccdciav16245131.cdn.ntruss.com/data/store/store/231745_AJA9KlHYQPsYiDxQaXg6L2RSwNdhB9R8.jpg?type=w&w=1024&quality=80&extopt=0',
					},
					{
						imgurl: 'https://uihmdccdciav16245131.cdn.ntruss.com/data/store/store/231745_AJA9KlHYQPsYiDxQaXg6L2RSwNdhB9R8.jpg?type=w&w=1024&quality=80&extopt=0',
					}
				],
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			// 获取列表数据
			getList() {
				// this.$api.getList(this.pageNo, this.pageSize, res => {
				// 	let data = res.data;
				// 	this.list.push(...data.list);
				// 	this.totalPage = data.total;
				// });
			},
			toInfo(item) {
				uni.navigateTo({
					url: '/pages/order/info?id=' + 654321
				})
			},
			click2() {
				console.log('click2');
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

	.u-link {
		margin-top: 72rpx !important;
		font-size: 32rpx !important;
		font-weight: 400 !important;
		color: #333333 !important;
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