<template>
	<view class="content">
		<view class="table" v-for="(item, index) in list" :key="index" v-if="list.length > 0">
			<view class="item" @click="toInfo(item)">
				<view class="credits">
					<span>{{item.operate}}</span>(持有积分: {{item.hold}})
				</view>
				<view class="type">
					{{item.typeDesc}}
				</view>
				<view class="time">
					{{item.updated_at}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			// 获取列表数据
			getList() {
				uni.request({
					url: this.$apiHost + '/front/point/log',
					method: 'get',
					data: {},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync('token')
					},
					success: res => {
						let newList = []
						res.data.data && res.data.data.map((item, index) => {
							newList.push({
								...item,
								operate: item.b2b_point + item.cash_point + item.reward_point,
								hold: item.after_b2b_point + item.after_cash_point + item.after_reward_point,
								typeDesc: res.data.sys_type[item.type]['zh-Hans'],
							})
						})
						this.list = newList
					}
				})
			},
			toInfo(item) {
				uni.navigateTo({
					url: '/pages/order/info?id=' + 654321
				})
			},

		}
	}
</script>

<style lang="scss">
	.content {
		.item {
			padding: 32rpx;
			font-size: 28rpx;
			border-bottom: 2rpx solid #E8E8E8;

			.credits {
				font-weight: 400;
				color: #888888;

				span {
					margin-right: 12rpx;
					font-size: 36rpx;
					font-weight: bold;
					color: #FF4A52;
				}
			}

			.type {
				margin-top: 30rpx;
				font-weight: bold;
				color: #000000;
			}

			.time {
				margin-top: 20rpx;
				font-weight: 400;
				color: #888888;
			}
		}
	}
</style>