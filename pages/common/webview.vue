<template>
	<view>
		<web-view :src="urls"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				urls: ''
			}
		},
		onLoad(e) {
			this.urls = decodeURIComponent(e.url);
			console.log(e.url)
		}
	}
</script>
