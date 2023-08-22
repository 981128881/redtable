import App from './App'
import request from './common/js/request.js'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$apiHost="https://apiv1-dev.redtable.global" 
Vue.prototype.$imageHost="https://ukcooyocdlvo8099722.cdn.ntruss.com"
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