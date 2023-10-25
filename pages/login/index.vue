<template>
	<view>
		<view>
			<view class="header">
				<image src="/static/logo.png"></image>
			</view>
			<view class="content">
				<!-- <view>申请获取以下权限</view>
				<text>获得你的公开信息(昵称，头像等)</text> -->
			</view>
			<button class="bottom" type="primary" withCredentials="true" @tap="login">一键登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		onLoad() {},
		methods: {
			login() {
				var url = this.$apiHost + '/wechat/login'
				uni.login({
					"provider": "weixin",
					"onlyAuthorize": true, // 微信登录仅请求授权认证
					success: function(event) {
						const {
							code
						} = event
						//客户端成功获取授权临时票据（code）,向业务服务器发起登录请求。
						uni.request({
							url: url, //https://redtable.global/wechat/login
							data: {
								code: event.code
							},
							success: (res) => {
								console.log('res', res)
								// 保存token
								uni.setStorageSync('token',res.data.rt_api_key)
								uni.navigateBack()
							}
						});
					},
					fail: function(err) {
						console.log('err', err)
						// 登录授权失败  
						// err.code是错误码
					}
				})
			}
		},
	};
</script>

<style>
	.header {
		margin: 90rpx 0 90rpx 50rpx;
		border-bottom: 1px solid #ccc;
		text-align: center;
		width: 650rpx;
		height: 300rpx;
		line-height: 450rpx;
	}

	.header image {
		width: 362rpx;
		height: 64rpx;
	}

	.content {
		margin-left: 50rpx;
		margin-bottom: 90rpx;
	}

	.content text {
		display: block;
		color: #9d9d9d;
		margin-top: 40rpx;
	}

	.bottom {
		border-radius: 80rpx;
		margin: 70rpx 50rpx;
		font-size: 35rpx;
	}
</style>