export default {
	getToken() {
		const apiHost = "https://apiv1-dev.redtable.global"
		const token = uni.getStorageSync('token');
		// if (token) {
		// 	return
		// }
		uni.login({
			"provider": "weixin",
			"onlyAuthorize": true, // 微信登录仅请求授权认证
			success: function (event) {
				const {
					code
				} = event
				console.log('code', code)
				//客户端成功获取授权临时票据（code）,向业务服务器发起登录请求。
				uni.request({
					url: apiHost + '/wechat/login', //https://redtable.global/wechat/login
					data: {
						code: event.code
					},
					success: (res) => {
						console.log('res', res)
						// 保存token
						uni.setStorageSync('token', res.data.rt_api_key)
					}
				});
			},
			fail: function (err) {
				console.log('err', err)
				// 登录授权失败  
				// err.code是错误码
			}
		})
	},
}