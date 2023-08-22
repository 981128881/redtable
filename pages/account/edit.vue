<template>
	<view class="content">
		<u--form labelPosition="left" :model="form" :rules="rules" ref="uForm">
			<p>姓名</p>
			<u--input placeholder="wechat_mini" border="surround" v-model="form.name"
				:customStyle="inputStyle"></u--input>
			<p>邮箱</p>
			<u--input placeholder="wechat_mini@test.com" border="surround" v-model="form.email"
				:customStyle="inputStyle">
			</u--input>
			<p>手机号</p>
			<u-form-item prop="phone" borderBottom ref="phone">
				<u--input placeholder="13333333333" border="surround" v-model="form.phone"
					:customStyle="inputStyle"></u--input>
			</u-form-item>
			<p>时区</p>
			<view class="timezone" @click="timezoneShow = true">
				<u--input v-model="timezoneText" :customStyle="inputStyle"></u--input>
				<u-picker :show="timezoneShow" :columns="timezone" keyName="label" itemHeight="100" @confirm="confirm"
					@change="change" @close="cancel" @cancel="cancel">
				</u-picker>
			</view>
			<!-- <p>密码</p>
		<u--input border="surround" v-model="pwd" :customStyle="inputStyle"></u--input> -->
			<u-button :customStyle="btnStyle" @click="save()">保存</u-button>
			<!-- <p class="to" @click="toRetpwd">重置密码</p> -->
		</u--form>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: '',//'wechat_mini',
					// email: 'wechat_mini@test.com',
					phone: '',
					timezone: {},
					// pwd: '',
				},
				timezoneShow: false,
				timezone: [],
				timezoneData: [],
				timezoneText: '',
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
				rules: {
					'phone': {
						type: 'number',
						required: true,
						len: 11,
						message: '请填写手机号',
						trigger: ['blur', 'change']
					},
				},
			}
		},
		onLoad() {
			// this.show()
			this.getInfo()
			this.getTimezone()
		},
		methods: {
			getInfo() {
				const token = uni.getStorageSync('token')
				uni.request({
					url: this.$apiHost + '/front/user/profile',
					method: 'GET',
					data: {},
					header: {
						'Authorization': 'Bearer ' + token
					},
					success: res => {
						console.log("getInfo res", res)
					}
				})
			},
			getTimezone() {
				uni.request({
					url: this.$apiHost + '/common/timezone',
					method: 'GET',
					data: {},
					success: res => {
						let timezone = []
						res.data.data.map((item, index) => {
							timezone.push({
								label: item.timezone + item.gmt_offset,
								id: index,
							})
						})
						this.timezone = [timezone]
						this.timezoneData = res.data.data
					}
				})
			},
			// show() {
			// 	uni.showTabBar();
			// },
			confirm(e) {
				this.timezoneShow = false
				this.timezoneText = e.value[0].label
				this.form.timezone = this.timezoneData[e.value[0].id]
			},
			change(e) {
				// console.log('change', e)
			},
			cancel(e) {
				this.timezoneShow = false
			},
			toRetpwd() {
				uni.navigateTo({
					url: '/pages/account/reset'
				})
			},
			save() {
				this.$refs.uForm.validate().then(res => {
					console.log("this.form",this.form)
					const token = uni.getStorageSync('token')
					uni.request({
						url: this.$apiHost + '/front/user/profile',
						method: 'POST',
						data: this.form,
						header: {
							'Authorization': 'Bearer ' + token
						},
						success: res => {
							console.log("getInfo res", res)
						}
					})
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			}
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

	.to {
		margin-top: 32rpx;
		font-size: 32rpx;
		font-weight: 400;
		color: #333333;
		text-decoration: underline;
		text-underline-offset: 2rpx;
	}

	.timezone {
		width: 678rpx;
		height: 80rpx;
		background: #F1F1F1;
		border-radius: 8rpx;
		border: 1rpx solid #dadbde;
	}
</style>