<template>
	<web-view :src="url"></web-view>
</template>
<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(e) { // 传入需要跳转的链接 使用web-view标签进行跳转
			this.url = decodeURIComponent(e.url)
			console.log(this.url)
		}
	}
</script>

<style>

</style>