<template>
		<view class="content">
			<u--form labelPosition="left" :model="form" :rules="rules" ref="uForm">
				<p>请在下面输入窗口输入您持有的优惠券编号后点击注册优惠券按钮。</p>
				<u-form-item prop="serial" ref="serial">
					<u--input placeholder="请输入优惠券编号" border="surround" v-model="form.serial"
						:customStyle="inputStyle"></u--input>
				</u-form-item>
				<u-button :customStyle="btnStyle" @click="save()">注册优惠券</u-button>
			</u--form>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					serial: '',
				},
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
					'serial': {
						type: 'string',
						required: true,
						// len: 11,
						message: '请填写优惠券编号',
						trigger: ['blur', 'change']
					},
				},
			}
		},
		onLoad() {
		},
		methods: {
			save() {
				this.$refs.uForm.validate().then(res => {
					const token = uni.getStorageSync('token')
					uni.request({
						url: this.$apiHost + '/front/coupon',
						method: 'POST',
						data: this.form,
						header: {
							'Authorization': 'Bearer ' + token
						},
						success: res => {
							if (res.data.status === 'success') {
								uni.$u.toast('注册成功')
							}
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
</style>