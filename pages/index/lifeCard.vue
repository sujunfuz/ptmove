<template>
	<view class="lifeCardbg">
		<u-navbar leftIconColor='#fff' :title="$t('lifeCard.title')" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed=""  @leftClick="leftClick"></u-navbar>
		<view>{{$t('lifeCard.title')}}</view>
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
	.lifeCardbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
	}
</style>
