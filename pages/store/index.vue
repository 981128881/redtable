<template>
	<view>
		<image :src="info.storeImgurl" class="banner"></image>
		<view class="content">
			<p class="name">{{info.translate_name}}({{info.translate_branch_name}})</p>
			<view class="area">
				<span>{{info.area}}</span>
			</view>
			<view class="star">
				<u-icon name="star-fill" color="#FF4A52" size="36rpx"></u-icon>
				<span class="score">{{info.rti_star}}({{info.show_cnt}})</span>
			</view>
		</view>
		<view class="discount" v-for="(item, index) in info.promotions" :key="index">
			<p>{{item.translate_name}}</p>
			<span class="discount-red">打{{item.max_discount_rate*100}}%</span>
			<span class="discount-info">(最多可减{{parseInt(item.max_discount_price)}}KRW)截止{{item.date_to}}</span>
		</view>
		<view class="details">
			<p>
				<image :src="'/static/location.png'"></image>
				<span>{{info.address_road}}</span>
			</p>
			<p>
				<image :src="'/static/phone.png'"></image>
				<span>{{info.telephone}}</span>
			</p>
			<p>
				<image :src="'/static/time.png'"></image>
				<span>{{info.optime}}</span>
			</p>
			<p>
				<image :src="'/static/flag.png'"></image>
				<span>{{info.translate_description}}</span>
			</p>
		</view>
		<view class="caption">
			<p class="subtitle">招牌菜</p>
			<span class="more">更多</span>
			<u-scroll-list :indicator="false" class="swipe swipe-place">
				<view v-for="(item, index) in products" :key="index" @click="toStore(item)">
					<view class="swpierBox">
						<view class="swpierBox-view-place">
							<image :src="item.imgUrl"></image>
							<view class="card">
								<p>{{item.translate_name}}</p>
								<p>{{item.price}}<span>{{item.currency}}</span></p>
							</view>
							<view class="heart">
								<u-icon name="heart" color="#FFFFFF" size="40rpx"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</u-scroll-list>
		</view>
		<view class="other">
			<p class="subtitle" v-if="awards.length > 0">Award</p>
			<view v-for="(item, index) in awards" :key="index" v-if="awards.length > 0">
				<span class="description">
					{{item.translate_type||''}} {{item.translate_grade||''}} {{item.year||''}}
				</span>
			</view>
			<p class="subtitle" v-if="medias.length > 0">Media</p>
			<view v-for="(item, index) in medias" :key="index" v-if="medias.length > 0">
				<span class="description">
					{{item.translate_media||''}} {{item.translate_title||''}} {{item.round||''}} {{item.date||''}}
				</span>
			</view>
			<p class="subtitle" v-if="buyNow.length > 0">Buy Now</p>
			<view class="external" v-for="(item, index) in buyNow" :key="index" v-if="buyNow.length > 0">
				<view class="external-link" @click="toStore(item)">{{item.ota_name}}</view>
			</view>
			<p class="subtitle">Reviews & Images</p>
			<view class="external">
				<view class="external-link" @click="toLink('Google')">Google</view>
				<view class="external-link" @click="toLink('Naver')">Naver</view>
				<view class="external-link" @click="toLink('Tripadvisor')">Tripadvisor</view>
				<view class="external-link" @click="toLink('Ctrip')">Ctrip</view>
			</view>
		</view>
		<view class="other">
			<p class="subtitle">预定日期</p>
			<calendarwatch :dot_week_lists="dot_week_lists" :dot_remove_lists="dot_remove_lists"></calendarwatch>
			<view v-for="(item, index) in info.optime" :key="index">
				<span class="description">{{item}}</span>
			</view>
		</view>
		<view class="other">
			<p class="subtitle">设施信息</p>
			<u-checkbox-group size="32" iconSize="32" disabled>
				<u-checkbox v-for="(item, index) in facilityOptions" :key="index" :name="item.name" :label="item.name"
					:checked="item.checked" activeColor="red" size="32" labelSize="32"></u-checkbox>
			</u-checkbox-group>
		</view>
		<view class="other">
			<p class="subtitle">位置信息</p>
			<span class="description" @click="copyBtn">首尔特别市永登浦区63路50</span>
			<!-- <map style="width: 100%; height: 300px;" :latitude="latitude" :longitude="longitude" :markers="covers"></map> -->
			<!-- <view class="container">
				<web-view :src="'https://www.nyyear.com/index.html'" :fullscreen="false"></web-view>
			</view> -->
		</view>
		<view class="other">
			<p class="subtitle">History</p>
			<u-list>
				<u-list-item v-for="(item, index) in history" :key="index">
					<view class="list-item">
						<view class="user">
							<view class="user-profile">
								<image :src="item.imgUrl"></image>
							</view>
							<view class="user-info">
								<view>{{item.user_name || 'Guest'}}</view>
								<span class="description">{{item.created_at_utc}}(UTC)</span>
							</view>
						</view>
						<p>{{item.event}}</p>
					</view>
				</u-list-item>
			</u-list>
		</view>
		<view class="list-more">更多</view>
		<view class="company-info">
			<span>
				(株)REDTABLE 代表 都亥镕</br>
				营业执照编号：206-86-50534</br>
				通信销售业申报号码：2019-中区-0501</br>
				旅游事业者（一般旅游业）登录号码：第2019-000024号</br>
				首尔特别市钟路区清溪川路85首尔观光广场9楼（贯铁洞，三一大厦）</br>
			</span>
		</view>
		<view class="footer">
			<view class="footer-heart" @click.stop="collect()">
				<u-icon name="heart" color="#FFFFFF" size="40rpx" v-if="info.is_bookmarked == 0"></u-icon>
				<u-icon name="heart-fill" color="#FF4A52" size="40rpx" v-if="info.is_bookmarked == 1"></u-icon>
			</view>
			<view class="order" @click="toStoreMenu()">
				<image :src="'/static/buynow_ico.png'"></image>
				<span>在线订购</span>
			</view>
		</view>
	</view>
</template>

<script>
	import calendarwatch from "../../components/calendarwatch/calendarwatch.vue"
	import {
		switchReview
	} from '../../common/js/history.js'
	import {
		getOption
	} from '../../common/js/facility.js'
	export default {
		components: {
			calendarwatch
		},
		props: {},
		data() {
			return {
				option: {},
				info: {},
				products: [],
				awards: [],
				medias: [],
				buyNow: [],
				dot_week_lists: [],
				dot_remove_lists: [],
				facilityOptions: [],
				history: [],
				// url: '/hybrid/html/map.html?',
				url: 'https://www.nyyear.com/index.html',
				// 腾讯地图
				// latitude: 37.51966415528160,
				// longitude: 126.93990933806800,
				// covers: [{
				// 	latitude: 39.909,
				// 	longitude: 116.39742,
				// 	iconPath: '../../../static/location.png'
				// }, {
				// 	latitude: 39.90,
				// 	longitude: 116.39,
				// 	iconPath: '../../../static/location.png'
				// }]
			}
		},
		onLoad(option) {
			this.option = option
			console.log('option.id', option.id);
			this.getList();
		},
		methods: {
			copyBtn(e) {
				// var that = this;
				uni.setClipboardData({
					data: 'dfsdfsdfsdfsdfsdfs',
					success: function(res) {
						uni.showToast({
							title: '复制成功',
						});
					},
					fail: function(res) {
						uni.showToast({
							title: '复制失败',
						});
					}
				});
			},
			// 获取数据
			getList() {
				uni.request({
					url: this.$apiHost + '/front/store/' + this.option.id,
					method: 'get',
					data: {
						s_lang: 'zh-Hans',
					},
					success: res => {
						console.log("success", res.data);
						const {
							data,
							promotions,
							products,
							awards,
							medias,
							ota_links,
							store_bisuness_times,
							store_holidays,
							store_holiday_temps,
							store_holiday_publics,
							options,
							live_events,
						} = res.data
						let area_type = '',
							area_city = '',
							area_district = '',
							newProducts = [],
							newOptions = [],
							newHistory = []
						area_type = data.translate_store_label_name ?? data.store_label_name
						area_city = data.location_translate_name2 ?? data.location_name2
						area_district = data.location_translate_name3 ?? data.location_name3
						area_type += ' / ' + area_city + ' ' + area_district

						// 招牌菜
						products.map((item, index) => {
							newProducts.push({
								...item,
								imgUrl: this.$imageHost + item.product_image,
								// link: '/pages/special/index?s_commercial_area_id=' + item.id +
								// 	'&s_must_eat_id=' + item.id
							})
						})
						// 预定日期: store_bisuness_times取星期几,其余3个在星期几的范围内刨除日期
						store_bisuness_times.map((item, index) => {
							this.dot_week_lists.push(item.day)
						})
						store_holidays.map((item, index) => {
							this.dot_remove_lists.push(item.date)
						})
						store_holiday_temps.map((item, index) => {
							this.dot_remove_lists.push(item.date)
						})
						store_holiday_publics.map((item, index) => {
							this.dot_remove_lists.push(item.date)
						})
						// 设施信息
						let facility = getOption(data.option)
						for (let item in options) {
							let checked = false
							if (facility.indexOf(options[item].value) > -1) {
								checked = true
							}
							newOptions.push({
								name: options[item].name['zh-Hans'],
								value: options[item].value,
								checked: checked,
							})
						}
						// history
						live_events.map((item, index) => {
							let url = item.ip2nation_code ?
								'/asset/image/flags/1x1/' + item.ip2nation_code + '.svg' :
								'/asset/image/error_img.png'
							newHistory.push({
								...item,
								imgUrl: this.$imageHost + url,
								event: switchReview(item),
							})
						})
						this.info = data
						this.info.storeImgurl = this.$imageHost + data.store_image
						this.info.area = area_type
						this.info.promotions = [promotions[0], promotions[0]]
						this.info.optime = data.translate_optime.split('｜')
						this.products = newProducts
						this.awards = awards
						this.medias = medias
						this.buyNow = ota_links
						this.facilityOptions = newOptions
						this.history = newHistory
					}
				})
			},
			toStoreMenu() {
				uni.navigateTo({
					url: '/pages/storeMenu/index?id=' + this.option.id
				})
			},
			toLink(type) {
				const {
					name
				} = this.info
				let url = ''
				switch (type) {
					case 'Google':
						url = 'https://www.google.com/search?q=' + name +
							'&sxsrf=ALiCzsbmQJ7QykDtW8md9xxoQKePYT5wCA%3A1656584302771&source=hp&ei=bni9YveTLJH3-Qa-y7ngBw&iflsig=AJiK0e8AAAAAYr2GfppF8oBM0bKP1d9l2IH0loXVhmkG&ved=0ahUKEwj3gp63-dT4AhWRe94KHb5lDnwQ4dUDCAk&uact=5&oq=%EA%B3%B0%EA%B5%AD%EC%8B%9C%EC%A7%91&gs_lcp=Cgdnd3Mtd2l6EAMyCwguEIAEEMcBEK8BMgUIABCABDIFCAAQgAQyCwguEIAEEMcBEK8BMgQIABAeMgQIABAeMgYIABAeEA8yBAgAEB4yBAgAEB4yBggAEB4QDzoECCMQJzoLCAAQgAQQsQMQgwE6BAguEAM6BAgAEAM6BQguEIAEOhEILhCABBCxAxCDARDHARCvAToICAAQgAQQsQM6CAguEIAEELEDOgsILhCABBCxAxDUAlAAWO4IYIcKaAJwAHgCgAF-iAGpCZIBBDEuMTCYAQCgAQE&sclient=gws-wiz'
						break;
					case 'Naver':
						url = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=' + name
						break;
					case 'Tripadvisor':
						url = 'https://www.tripadvisor.co.kr/Search?q=' + name
						break;
					case 'Ctrip':
						url = 'https://kr.trip.com/global-search/searchlist/search/?keyword=' + name
						break;
				}
				console.log("url", url)
				uni.reLaunch({
					url: 'www.baidu.com'
				})
			},
			checkboxChange(n) {
				console.log('change', n);
				console.log('checkboxChange this.facilityValues', this.facilityValues)
			},
			// 收藏
			collect() {
				const token = uni.getStorageSync('token')   
				uni.request({
					url: this.$apiHost + '/front/user/bookmark',
					method: 'POST',
					data: {
						store_id: this.info.id,
					},
					header: {
						'Authorization': 'Bearer ' + token
					},
					success: res => {
						if ( res.data.data !== null ) {
							console.log("收藏")
							this.info.is_bookmarked = 1
						} else {
							console.log("取消")
							this.info.is_bookmarked = 0
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.banner {
		width: 750rpx;
		height: 600rpx;
	}

	.content {
		margin: 28rpx 32rpx;
		width: 686rpx;
	}

	.name {
		font-size: 40rpx;
		font-weight: bold;
		color: #181818;
	}

	.subtitle {
		font-size: 32rpx;
		font-weight: bold;
		color: #131313;
	}

	.area {
		margin-top: 20rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #888888;
	}

	.star {
		margin-top: 20rpx;
		position: relative;
	}

	.score {
		position: absolute;
		top: 6rpx;
		left: 40rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #777777;
		line-height: 28rpx;
	}

	.discount {
		margin: 20rpx 32rpx;
		padding: 32rpx 50rpx;
		border-radius: 8rpx;
		border: 2rpx dashed #E8E8E8;
	}

	.discount-red {
		font-size: 40rpx;
		font-weight: bold;
		color: #FF4A52;
	}

	.discount-info {
		font-size: 28rpx;
		color: #888888;
	}

	.details {
		margin: 0 32rpx;
	}

	.details p {
		margin-bottom: 20rpx;
		display: flex;
	}

	.details p image {
		margin-right: 12rpx;
		width: 28rpx;
		height: 28rpx;
	}

	.details p span {
		width: 646rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #888888;
	}

	.caption {
		position: relative;
		margin: 32rpx;
	}

	.more {
		position: absolute;
		top: 0;
		right: 0;
		font-size: 28rpx;
		font-weight: 400;
		color: #777777;
	}



	.swipe {
		/deep/ .uni-swiper-dot {
			margin-right: 16rpx;
			width: 28rpx;
			height: 3px;
			border-radius: 8rpx;
		}
	}

	.swipe-place {
		height: 404rpx;
	}

	.swpierBox-view-place {
		position: relative;
		width: 284rpx;
		height: 404rpx;
		margin-right: 10rpx;
		border-radius: 8rpx;
		border: 2rpx solid #E8E8E8;

		image {
			width: 284rpx;
			height: 220rpx;
			border-radius: 8rpx;
		}

		.card {
			top: 0;
			left: 0;
			width: 284rpx;
			height: 184rpx;
		}

		.card p {
			font-size: 28rpx;
			font-weight: bold;
			color: #333333;
		}

		.heart {
			position: absolute;
			top: 12rpx;
			left: 220rpx;
		}

	}

	.other {
		margin: 0 32rpx;
	}

	.description {
		margin: 10rpx auto;
		font-size: 28rpx;
		font-weight: 400;
		color: #888888;
		display: block;
	}

	.external {
		margin-top: 10rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.external-link {
		text-align: center;
		width: 330rpx;
		height: 40px;
		line-height: 40px;
		border: 1px solid #dddddd;
		border-radius: 3px;
		margin-bottom: 5px;
	}

	/deep/ .u-checkbox-group {
		flex-wrap: wrap;
		margin-bottom: 32rpx;
	}

	/deep/ .u-checkbox {
		margin-top: 38rpx;
		width: 320rpx;
	}

	/deep/ .u-list {
		height: 100% !important;
		margin-top: 20rpx;
	}

	.list-item {
		border-bottom: 2rpx solid #E8E8E8;
	}

	.list-item p {
		margin-bottom: 32rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
	}

	.list-item p span {
		color: #FF4A52;
	}

	.user {
		display: flex;
		margin: 32rpx 0;
	}

	.user-profile {
		border-radius: 100%;
		width: 80rpx;
		height: 80rpx;
		border: 1px solid #eeeeee;
	}

	.user-profile image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 80rpx;
	}

	.user-info {
		margin-left: 16rpx;
		font-size: 32rpx;
		font-weight: 400;
		color: #333333;
	}

	.list-more {
		margin: 32rpx;
		border-radius: 6rpx;
		border: 2rpx solid #DDDDDD;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 100rpx;
		color: #666666;
		text-align: center;
	}

	.company-info {
		padding: 60rpx 32rpx 200rpx;
		background: #F3F3F3;
		line-height: 40rpx;
		font-size: 24rpx;
		font-weight: 300;
		color: #888888;
	}

	.company-info span {
		display: block;
	}

	.footer {
		padding: 30rpx 32rpx;
		width: 100%;
		height: 100rpx;
		background-color: #FFFFFF;
		display: flex;
		position: fixed;
		bottom: 0;
	}

	.footer-heart {
		width: 100rpx;
		height: 100rpx;
		background: #DDDDDD;
		border-radius: 4rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.order {
		margin-left: 20rpx;
		width: 566rpx;
		border-radius: 4rpx;
		background: #FF4A52;
		font-size: 28rpx;
		font-weight: bold;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.order image {
		width: 48rpx;
		height: 48rpx;
	}
</style>