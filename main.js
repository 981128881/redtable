import App from './App'
import request from './common/js/request.js'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

// Vue.prototype.$apiHost = "https://apiv1-dev.redtable.global"
Vue.prototype.$apiHost = "https://apiv1.redtable.global"
Vue.prototype.$imageHost = "https://ukcooyocdlvo8099722.cdn.ntruss.com"
Vue.prototype.$request = request;

// 配置uviewUi
import uView from 'uview-ui'
Vue.use(uView)
uni.$u.setConfig({
	config: {
		unit: 'rpx'
	},
	props: {
		radio: {
			size: 15
		}
	}
})
uni.addInterceptor('request', {
	success(args) {
		let token = uni.getStorageSync('token')
		if (args.statusCode == 401 && token) {
			uni.showModal({
				title: "温馨提示",
				content: '登录已过期,重新登录',
				cancelText: "取消",
				confirmText: "确定",
				confirmColor: "#FF4A52",
				showCancel: false,
				success: (res) => {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/login/index'
						})
					} else if (res.cancel) { }
				}
			});
		}
	},
	fail(err) {
		console.log('失败')
	}
})
// 千分位
Vue.filter('unitConverter', (value) => {
	if (!value) return 0
	// 获取整数部分
	const intPart = Math.trunc(value)
	// 整数部分处理，增加,
	const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
	// 预定义小数部分
	let floatPart = ''
	// 将数值截取为小数部分和整数部分
	const valueArray = value.toString().split('.')
	if (valueArray.length === 2 && valueArray[1] > 0) { // 有小数部分
		floatPart = valueArray[1].toString() // 取得小数部分
		return intPartFormat + '.' + floatPart
	}
	return intPartFormat + floatPart
})

const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif