<template>
	<view class="marketing" @touchmove.stop.prevent="moveHandle" v-if="isShowMarketing">
		<image class="image1" :src="popData.image" @click="goPath" mode="widthFix"></image>
		<view @click="hide" class="cancel-btn" :style="closeP">
			<image class="image2" src="/static/close-icon.png" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
	import {
		mapActions,
		mapState,
		mapGetters
	} from 'vuex'
	import {
		navigatorToPage
	} from '@/common/index.js'
	export default {
		name: 'marketing',
		data() {
			return {
				popData: {},
				// 是否有弹框数据
				hasMarket: false,
				closeP: ''
			}
		},
		created() {
			this.getMarketing()
		},
		methods: {
			...mapActions('index', ['getMarketingPop']),
			async getMarketing() {
				const res = await this.getMarketingPop({
					type: 0
				})
				let {
					code,
					data
				} = res
				if (code == 200) {
					this.popData = JSON.parse(data)
					// console.log('-----', this.popData)
					if (this.popData == null) {
						this.hasMarket = false
					} else {
						this.hasMarket = true
					}
					this.$emit('hasMarketResult')
				}
			},
			//点击图片跳转
			goPath() {
				const _this = this
				const {
					linkType,
					pageUrl,
					url,
					miniappUrl,
					appId
				} = this.popData
				// console.log(this.popData)
				if (linkType == 1) {
					//跳转小程序内
					navigatorToPage(pageUrl, linkType)
				} else if (linkType == 2) {
					//跳转web
					navigatorToPage(url, linkType)
				} else if (linkType == 3) {
					//跳转其他小程序
					navigatorToPage(miniappUrl, linkType, appId)
				}
			},
			//隐藏弹窗
			hide() {
				this.hasMarket = false
			},
			moveHandle() {}
		},
		computed: {
			...mapState('index', ['marketing']),
			...mapGetters('login', ['isLogin']),
			isShowMarketing() {
				return this.hasMarket && this.isLogin
			}
		},
		watch: {
			isShowMarketing: {
				handler(val) {
					if (val) {
						const {
							windowHeight: h
						} = uni.getSystemInfoSync()
						// console.log(h)
						if (h < 600) {
							this.closeP = 'height:130rpx'
						} else if (600 <= h && h < 640) {
							this.closeP = 'height:150rpx'
						} else {
							this.closeP = 'height:300rpx'
						}
					}
				},
				immediate: true,
				deep: true
			}
		}
	}
</script>

<style scoped lang="scss">
	.marketing {
		position: fixed;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .6);
		top: 0;
		left: 0;
		// opacity: .6;
		z-index: 999999;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;

		.image1 {
			width: 78.13%;
		}

		.cancel-btn {
			position: absolute;
			left: 50%;
			margin-left: -33upx;
			bottom: 50rpx;
			font-size: 70upx;
			width: 66upx;

			.image2 {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
