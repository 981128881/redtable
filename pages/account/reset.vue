<template>
	<view class="content">
		<p>当前密码</p>
		<u--input placeholder="请输入当前密码" border="surround" v-model="pwd" :customStyle="inputStyle"></u--input>
		<p>新密码</p>
		<u--input placeholder="请输入要更改的密码" border="surround" v-model="newPwd" :customStyle="inputStyle">
		</u--input>
		<p>再次输入新密码</p>
		<u--input placeholder="请输入要更改的密码" border="surround" v-model="password" :customStyle="inputStyle"></u--input>
		<view class="">
			<u-button :customStyle="btnStyle">保存</u-button>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				pwd: '',
				newPwd: '',
				password: '',
				inputStyle: {
					width: '646rpx',
					height: '56rpx',
					background: '#F1F1F1',
					borderRadius: '8rpx',
				},
				btnStyle: {
					marginTop: '32rpx',
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
		onLoad() {
			this.show()
		},
		methods: {
			show() {
				uni.showTabBar();
			},
		}
	}
</script>

<style lang="scss">
	.content {
		margin: 32rpx;
	}

	.content p {
		margin-top: 32rpx;
		margin-bottom: 16rpx;
		font-size: 32rpx;
		font-weight: 400;
		color: #333333;
	}
</style>
