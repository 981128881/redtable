<template>
	<view class="content">
		<view class="first">
			<view class="btns">
				<view class="btn-red">等待支付</view>
				<view class="btn-default">卖场信息</view>
				<view class="btn-red">预定已取消</view>
			</view>
			<view class="order-name">测试商店预定</view>
		</view>
		<view class="info">
			<u-row>
				<u-col span="4">
					<view class="label">订单号码</view>
				</u-col>
				<u-col span="8">
					<view class="text">202232435425435</view>
				</u-col>
			</u-row>
		</view>
		<view class="info">
			<u-row>
				<u-col span="4">
					<view class="label">访问预定日期</view>
				</u-col>
				<u-col span="8">
					<view class="text">2022-09-30 12:43:18</view>
				</u-col>
			</u-row>
		</view>
		<view class="info">
			<u-row>
				<u-col span="4">
					<view class="label">订购日期</view>
				</u-col>
				<u-col span="8">
					<view class="text">2022-09-30 12:43:18</view>
				</u-col>
			</u-row>
		</view>
		<view class="qr-box">
			<canvas canvas-id="qrcode" v-show="qrShow" style="width: 300rpx;margin: 0 auto;" />
		</view>
		<view class="title">
			客户信息
		</view>
		<view class="info">
			<u-row>
				<u-col span="4">
					<view class="label">订购人</view>
				</u-col>
				<u-col span="8">
					<view class="text">xxx</view>
				</u-col>
			</u-row>
		</view>
		<view class="info">
			<u-row>
				<u-col span="4">
					<view class="label">联系电话</view>
				</u-col>
				<u-col span="8">
					<view class="text">01024444322</view>
				</u-col>
			</u-row>
		</view>
		<view class="info">
			<u-row>
				<u-col span="4">
					<view class="label">访问预定人数</view>
				</u-col>
				<u-col span="8">
					<view class="text">2</view>
				</u-col>
			</u-row>
		</view>
		<view class="info">
			<u-row>
				<u-col span="4">
					<view class="label">其他要求事项</view>
				</u-col>
				<u-col span="8">
					<view class="text">fffffffffffff</view>
				</u-col>
			</u-row>
		</view>
	</view>
</template>

<script>
	import uQRCode from '../../common/js/uqrcode.js'
	export default {
		data() {
			return {
				option: {},
				qrShow: false,
			}
		},
		onLoad(option) {
			this.option = option
			console.log('option', option);
			this.getInfo()
			this.qrFun('123456')
		},
		methods: {
			// 获取数据
			getInfo() {
				uni.request({
					url: this.$apiHost + '/',
					method: 'get',
					data: {
						lang: 'zh-Hans',
					},
					success: res => {
						console.log("success", res.data);
					}
				})
			},
			//**生成二维码**//
			qrFun: function(text) {
				this.qrShow = true
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: text,
					size: 150,
					margin: 0,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					errorCorrectLevel: uQRCode.errorCorrectLevel.H,
					success: res => {}
				})
			}
		}
	}
</script>

<style lang="scss">
	.first {
		background: #F8F8F8;
		padding: 20rpx 32rpx;
		border: 2rpx solid #E8E8E8;
		font-size: 24rpx;
		font-weight: 400;

		.order-name {
			margin-top: 20rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
		}

		.btns {
			display: flex;

			.btn-red {
				padding: 10rpx 18rpx;
				background: #FE4A52;
				border: 2rpx solid #E8E8E8;
				border-radius: 6rpx;
				color: #FFFFFF;
			}

			.btn-default {
				padding: 10rpx 18rpx;
				background: #FFFFFF;
				border: 2rpx solid #E8E8E8;
				border-radius: 6rpx;
				color: #333333;
			}

			:nth-child(n+2) {
				margin-left: 16rpx;
			}
		}
	}

	.title {
		padding-left: 32rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: #F8F8F8;
		border: 2rpx solid #E8E8E8;
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}

	.info {
		padding: 40rpx 32rpx;
		border-bottom: 2rpx solid #E8E8E8;
		font-size: 28rpx;

		.label {
			font-weight: 400;
			color: #999999;
		}

		.text {
			font-weight: bold;
			color: #333333;
		}
	}
	.qr-box {
		margin: 20rpx auto;
	}
</style>