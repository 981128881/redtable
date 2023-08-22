<template>
	<view class="content">
		<view class="account">
			<image src="/static/profile.png"></image>
			<view class="username">
				<p>wechat_mini</p>
				<span>wechat_mini@test.com</span>
			</view>
			<u-button :customStyle="editStyle" @click="toEdit">Edit</u-button>
		</view>
		<u-line></u-line>
		<view class="line">
			<image src="/static/point.png"></image>
			<p>RT点</p>
			<view class="point-btn">
				<u-button :customStyle="pointStyle">使用记录</u-button>
				<u-button :customStyle="pointStyle">优惠券</u-button>
			</view>
			<span>123</span>
		</view>
		<u-line></u-line>
		<!-- <view class="line">
			<image src="/static/lang.png"></image>
			<p>语言</p>
		</view> -->
		<u-line></u-line>
		<view class="line">
			<image src="/static/shopping.png"></image>
			<p>购物车</p>
		</view>
		<u-line></u-line>
		<view class="line">
			<image src="/static/consult.png"></image>
			<p>1:1咨询</p>
		</view>
		<u-line></u-line>
		<view class="line">
			<image src="/static/faq.png"></image>
			<p>FAQ</p>
		</view>
		<u-line></u-line>
		<view class="line">
			<image src="/static/use.png"></image>
			<p>使用条款</p>
		</view>
		<u-line></u-line>
		<view class="line">
			<image src="/static/information.png"></image>
			<p>个人信息保护政策</p>
		</view>
		<u-line></u-line>
		<view class="line">
			<image src="/static/refund.png"></image>
			<p>退款政策</p>
		</view>
		<u-line></u-line>
		<view class="line">
			<image src="/static/order.png"></image>
			<p>订购及使用方法</p>
		</view>
		<u-line></u-line>
		<view class="line">
			<u-button :customStyle="logoutStyle" @click="logOut">登出</u-button>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				editStyle: {
					width: '200rpx',
					height: '76rpx',
					marginRight: 0,
					background: '#F3F3F3',
					borderRRadius: '4rpx',
					border: '2rpx solid #E8E8E8',
					fontSize: '28rpx',
					fontWeight: '400',
					color: '#333333',
				},
				pointStyle: {
					marginRight: '16rpx',
					padding: '10rpx 18rpx',
					width: '152rpx',
					height: '52rpx',
					background: '#F3F3F3',
					borderRadius: '0rpx',
					border: '2rpx solid #E8E8E8',
					fontSize: '24rpx',
					fontWeight: '400',
					color: '#333333',
				},
				logoutStyle: {
					marginBottom: '32rpx',
					width: '686rpx',
					height: '96rpx',
					background: '#FF4A52',
					borderRadius: '6rpx',
					fontSize: '28rpx',
					fontWeight: 'bold',
					color: '#ffffff',
				},
			}
		},
		onLoad() {},
		methods: {
			toEdit() {
				uni.navigateTo({
					url: '/pages/account/edit'
				})
			},
			logOut() {
				uni.setStorageSync('token', null)
			},
		}
	}
</script>

<style lang="scss">
	.account {
		display: flex;
		margin: 28rpx 32rpx;
	}

	.account image {
		width: 72rpx;
		height: 72rpx;
		margin-right: 16rpx;
	}

	.username p {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}

	.username span {
		font-size: 28rpx;
		font-weight: 400;
		color: #888888;
	}

	.line {
		display: flex;
		margin: 32rpx 32rpx 32rpx 44rpx;
	}

	.line image {
		width: 48rpx;
		height: 48rpx;
		// margin-right: 16rpx;
	}

	.line p {
		margin: 4rpx 16rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #333333;
	}

	.line span {
		margin-left: auto;
		font-size: 32rpx;
		font-weight: bold;
		color: #FF4A52;
	}

	.point-btn {
		display: flex;
	}
</style>