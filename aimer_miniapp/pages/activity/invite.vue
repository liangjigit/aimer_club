<template>
	<view id="invite">
		<image class="background" src="/static/activity/back.png" mode="scaleToFill"></image>
		<header>
			<view class="rule">
				<view class="cu-capsule round">
					<view class="cu-tag bg-blue" @click="getRole">活动规则 <text class="lg text-gray cuIcon-right"></text></view>
				</view>
			</view>
		</header>
	</view>
</template>

<script>
	export default {
		name: 'invite',
		methods: {
			/**
			 * 获取活动规则
			 */
			getRole(){
				console.log(1111111111)
			},
			test() {
				console.log(111111111111)
				uni.getProvider({
					service: 'share',
					success(a, b, c) {
						console.log(a)
						console.log(b)
						console.log(c)
					}
				})
			}
		},
		onShareAppMessage() {
			console.log(11111)
		},
		onShareTimeline() {

		}
	}
</script>

<style lang="scss" scoped>
	#invite {
		.background {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			background-size: 100% 100%;
			z-index: -1;
		}

		header {
			position: fixed;
			top: 30rpx;
			right: 0;
			.rule {
				display: flex;
				justify-content: flex-end;

				.bg-blue {
					background-color: transparent;
					border: 1px solid #FFFFFF;
					border-top-right-radius: 0;
					border-bottom-right-radius: 0;
					text-indent: 0;
				}
			}
		}
	}
</style>
