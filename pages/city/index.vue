<template>
	<view>
		<view style="margin: 32rpx;">
			<!-- 搜索栏 购物车 -->
			<u-row justify="space-between" gutter="10">
				<u-col span="11">
					<u-search placeholder="" v-model="keyword" shape="square" :clearabled="true" height="80"
						searchIconColor="#000000" searchIconSize="32rpx" :showAction="false">
					</u-search>
				</u-col>
				<u-col span="1" align="center">
					<view>
						<u-icon name="shopping-cart" color="#000000" size="40rpx" bold></u-icon>
					</view>
				</u-col>
			</u-row>
			<!-- 标签栏 -->
			<view class="tabs-list">
				<u-tabs :list="city" lineColor="#FF4A52" @click="checkedCity()"></u-tabs>
			</view>
		</view>

		<view style="display: flex;">
			<!-- 左侧菜单 纵向滚动 -->
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in district" :key="index" class="u-tab-item"
					:class="[current==index ? 'u-tab-item-active' : '']" :data-current="index"
					@tap.stop="swichMenu(item,index)">
					<text class="u-line-1">{{item.name}}</text>
				</view>
			</scroll-view>
			<block v-for="(item,index) in district" :key="index">
				<scroll-view scroll-y class="right-box" v-if="current==index">
					<view class="page-view">
						<view class="class-item">
							<view class="item-container">
								<view class="thumb-box" v-for="(type, i) in item.foods" :key="i">
									<image class="item-menu-image" :src="type.imgUrl" @click="toSpecial(type)"></image>
									<span>{{type.name}}</span>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>

		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				city: [],
				district: [],
				category: [],
				cityId: 0,
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			// 获取列表数据
			getList() {
				uni.request({
					url: this.$apiHost + '/common/select-city',
					method: 'get',
					data: {
						s_lang: 'zh-Hans',
					},
					success: res => {
						const city = res.data.data
						let newCity = []
						for (let item in city) {
							newCity.push({
								id: city[item].id,
								name: city[item].translate_name2,
								district: city[item].commercial_areas,
							})
						}
						this.city = newCity
						this.checkedCity(this.city[0])
					}
				})
			},
			// 选择市
			checkedCity(item) {
				this.district = []
				let newDistrict = []
				item.district.map((row, i) => {
					newDistrict.push({
						id: row.id,
						name: row.translate_commercial_area_name,
					})
				})
				// 根据选择市获取其下所有区
				this.district = newDistrict
				// 选中的市
				this.cityId = item.id
				// 选择市的默认区
				this.current = 0
				this.checkedDistrict(this.district[0], 0)
			},
			// 点击左边的栏目切换
			async swichMenu(item, index) {
				if (index == this.current) return;
				this.current = index;
				// 如果为0，意味着尚未初始化
				// if (this.menuHeight == 0 || this.menuItemHeight == 0) {
				// 	await this.getElRect('menu-scroll-view', 'menuHeight');
				// 	await this.getElRect('u-tab-item', 'menuItemHeight');
				// }
				// 将菜单item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
				this.checkedDistrict(item, index)
			},
			// 选择区
			checkedDistrict(item, index) {
				this.category = []
				uni.request({
					url: this.$apiHost + '/front/must-eat/main',
					method: 'get',
					data: {
						s_commercial_area_id: item.id,
						s_channel: 'redtable',
						limit: 10,
						s_lang: 'zh-Hans',
						// s_must_eat_id: '',
					},
					success: res => {
						let newCategory = []
						res.data.must_eats.map((row, i) => {
							// 选中区下的所有品类
							newCategory.push({
								key: row.id,
								imgUrl: this.$imageHost + row.must_eat_file_path,
								name: row.translate_must_eat_name,
								link: '/pages/special/index?s_commercial_area_id=' + item.id +
									'&s_must_eat_id=' + row.id
							})
						})
						this.$set(this.district[index], 'foods', newCategory)
					}
				})
			},
			toSpecial(item) {
				uni.navigateTo({
					url: item.link
				})
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({
						size: true
					}, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			}

		}
	}
</script>

<style lang="scss">
	.tabs-list {
		margin-top: 16rpx;
		margin-left: -32rpx;
		width: 754rpx;
		height: 100rpx;
		background: #F8F8F8;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		opacity: 1;
		border: 2rpx solid #E8E8E8;
	}

	.u-tabs__wrapper__nav__line {
		width: 44rpx !important;
		height: 8rpx !important;
	}

	.u-tab-view {
		width: 200rpx;
		height: 100%;
		margin-top: -32rpx;
	}

	.u-tab-item {
		width: 200rpx;
		height: 96rpx;
		background: #F1F1F1;
		border-radius: 0rpx 0rpx 0rpx 0rpx;
		opacity: 1;
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		text-align: center;
		line-height: 100rpx;
	}

	.u-tab-item-active {
		// position: relative;
		font-size: 28rpx;
		font-weight: bold;
		color: #FF4A52;
		background: #FFFFFF;
	}

	// 选中条
	// .u-tab-item-active::before {
	// 	content: "";
	// 	position: absolute;
	// 	border-left: 4px solid;
	// 	height: 32rpx;
	// 	left: 0;
	// 	top: 39rpx;
	// }

	.right-box {
		margin-top: -32rpx;
	}

	.page-view {
		padding-left: 20rpx;
	}

	.class-item {
		margin-bottom: 30rpx;
	}

	.item-container {
		display: flex;
		flex-wrap: wrap;
	}

	.thumb-box {
		width: 49%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 20rpx;
		position: relative;
	}

	.thumb-box span {
		position: absolute;
		top: 16rpx;
		left: 36rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #FFFFFF;
	}

	.item-menu-image {
		width: 228rpx;
		height: 252rpx;
		background: #FFFFFF;
		border-radius: 8rpx;
	}
</style>
