<template>
	<view class="richTextbg">
		<u-navbar leftIconColor='#fff' :title="title" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="rich pad20">
			<rich-text :nodes="content"> </rich-text>
		</view>
	</view>
</template>

<script>
	import loginApi from '@/api/login.js'
	export default {
		data() {
			return {
				title: this.$t('login.tips2'),
				content: '',
				protocolType: '', //类型
			}
		},
		onLoad(e) {
			if (e.protocolType) {
				this.protocolType = e.protocolType;
			}
			this.title = this.protocolType == 'PROTOCOL_TYPE_ENUM_USER_AGREEMENT' ? this.$t('login.tips2') : this.$t(
				'login.tips3')
			this.getProtocol()
		},
		methods: {
			//获取隐私政策和服务条款
			getProtocol() {
				loginApi.getProtocol({
					protocolType:this.protocolType
				}).then(res => {
					if (res.code = 200) {
						this.content=res.data[0].content
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.richTextbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.rich {
			/deep/.richTextImg {
				max-width: 100%;
			}
		}
	}
</style>
