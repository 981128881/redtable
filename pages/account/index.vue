<template>
	<view class="content">
		<view class="account">
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
				<image class="avatar" :src="avatarUrl ? avatarUrl : '/static/profile.jpg'"></image>
			</button>
			<view class="username">
				<input type="nickname" class="weui-input" v-model="info.name" placeholder="请输入昵称" @change="saveName" />
				<span v-if="info.email">{{info.email}}</span>
			</view>
			<!-- <u-button :customStyle="editStyle" @click="toEdit">Edit</u-button> -->
		</view>
		<u-line></u-line>
		<view class="line">
			<image src="/static/point.png"></image>
			<p>RT点</p>
			<view class="point-btn">
				<view class="pointStyle" @click="toLink('/pages/credits/index')">使用记录</view>
				<view class="pointStyle" @click="toLink('/pages/credits/exchange')">优惠券</view>
			</view>
			<span>{{info.point||0}}</span>
		</view>
		<u-line></u-line>
		<!-- <view class="line">
			<image src="/static/lang.png"></image>
			<p>语言</p>
		</view>
		<u-line></u-line> -->
		<view class="line" @click="toLink('/pages/shoppingCart/index')">
			<image src="/static/shopping.png"></image>
			<p>购物车</p>
		</view>
		<u-line></u-line>
		<view class="line" @click="toLink('/pages/seekAdvice/index')">
			<image src="/static/consult.png"></image>
			<p>1:1咨询</p>
		</view>
		<u-line></u-line>
		<view class="line" @click="toLink('/pages/FAQ/index')">
			<image src="/static/faq.png"></image>
			<p>FAQ</p>
		</view>
		<u-line></u-line>
		<view class="line" @click="toLink('/pages/account/term?type=index')">
			<image src="/static/use.png"></image>
			<p>使用条款</p>
		</view>
		<u-line></u-line>
		<view class="line" @click="toLink('/pages/account/term?type=privacy')">
			<image src="/static/information.png"></image>
			<p>个人信息保护政策</p>
		</view>
		<u-line></u-line>
		<view class="line" @click="toLink('/pages/account/term?type=refund')">
			<image src="/static/refund.png"></image>
			<p>退款政策</p>
		</view>
		<u-line></u-line>
		<view class="line" @click="toLink('/pages/account/term?type=usage')">
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
				info: [],
				avatarUrl: '',
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
		onShow: function() {
			if (uni.getStorageSync('token')) {
				this.getList();
			}else{
				uni.navigateTo({
					url: '/pages/login/index'
				})
			}
		},
		methods: {
			// 获取列表数据
			getList() {
				uni.request({
					url: this.$apiHost + '/front/user/profile',
					method: 'get',
					data: {},
					header: {
						'Authorization': 'Bearer ' + uni.getStorageSync('token')
					},
					success: res => {
						this.info = res.data.data
						this.info.point = this.info.cash_point + this.info.b2b_point + this.info.reward_point
						if (this.info.profile_photo_path)
							this.avatarUrl = this.info.profile_photo_path
					}
				})
			},
			// toEdit() {
			// 	uni.navigateTo({
			// 		url: '/pages/account/edit'
			// 	})
			// },
			toLink(url) {
				uni.navigateTo({
					url
				})
			},
			logOut() {
				uni.setStorageSync('token', null)
				uni.$u.toast('登出成功')
				this.info = []
				this.avatarUrl = ''
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			saveInfo(param) {
				var url = this.$apiHost + '/wechat/login'
				uni.login({
					"provider": "weixin",
					"onlyAuthorize": true,
					success: function(event) {
						const {
							code
						} = event
						uni.request({
							url: url,
							data: {
								...param,
								code: event.code
							},
							success: (res) => {
								// 保存token
								uni.setStorageSync('token', res.data.rt_api_key)
							}
						});
					},
					fail: function(err) {
						console.log('err', err)
						// 登录授权失败  
						// err.code是错误码
					}
				})
			},
			onChooseAvatar(e) {
				// 转成base64
				this.avatarUrl = 'data:image/jpeg;base64,' + wx.getFileSystemManager().readFileSync(e.detail.avatarUrl,
					'base64')
				this.saveInfo({
					avatarUrl: e.detail.avatarUrl
				})
			},
			saveName(e) {
				this.saveInfo({
					nickname: e.detail.value
				})
			},
		}
	}
</script>

<style lang="scss">
	.account {
		display: flex;
		margin: 28rpx 32rpx;

		.avatar-wrapper {
			margin-right: 16rpx;
			padding: 0;
			width: 80rpx !important;
			height: 80rpx !important;
			border-radius: 0;
		}

		.avatar {
			display: block;
			width: 80rpx;
			height: 80rpx;
		}
	}

	.username {
		width: 600rpx;
		// overflow: hidden;
		overflow-wrap: normal;
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

	.pointStyle {
		margin-right: 16rpx;
		padding: 10rpx 18rpx;
		width: 132rpx;
		line-height: normal;
		text-align: center;
		background: #F3F3F3;
		// border-radius: 0rpx;
		border: 2rpx solid #E8E8E8;
		font-size: 24rpx;
		font-weight: 400;
		color: #333333;
	}
</style>