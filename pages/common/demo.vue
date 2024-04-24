<template>
	<view class="followStorebg">
		<u-navbar leftIconColor='#fff' :title="$t('followStore.title')" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed=""  @leftClick="leftClick"></u-navbar>
		<view>demo</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		onLoad() {

		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.followStorebg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
	}
</style>
