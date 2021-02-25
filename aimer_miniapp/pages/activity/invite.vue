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
		<main>
			<view>
				<button class="cu-btn round bg-white" role="button" aria-disabled="false" @click="inviteF">邀请好友</button>
			</view>
			<view>
				<button class="cu-btn round bg-white" role="button" aria-disabled="false" @click="sendF">发朋友圈</button>
			</view>
			<view>
				<text>距离失效：20:20:20</text>
			</view>
		</main>
		<footer>
			<view class="top">
				<view class="header">邀新奖励</view>
				<view class="title">您已邀请3/0人，邀请好友越多，奖励越多</view>
			</view>
			<view class="footer">
				<get-reward></get-reward>
			</view>
		</footer>
	</view>
</template>

<script>
	import getReward from '../components/get-reward/GetReward.vue'
	export default {
		name: 'invite',
		components:{getReward},
		data() {
			return {
				isAndroid: false
			}
		},
		methods: {
			/**
			 * 获取活动规则
			 */
			getRole() {
				console.log(1111111111)
			},
			/**
			 * 邀请好友
			 */
			inviteF() {
				console.log(111111111111)
			},
			/**
			 * 发朋友圈
			 */
			sendF() {
				console.log(111111111)
			}
		},
		onLoad() {
			const _this = this
			uni.getSystemInfo({
				success(info) {
					let {
						platform
					} = info
					if (platform == 'android') _this.isAndroid = true
				}
			})
		},
		onShareAppMessage() {},
		onShareTimeline() {}
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

		main {
			position: absolute;
			top: 40%;
			// border: 1px solid black;
			width: 100%;
			height: 15%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;

			.cu-btn {
				padding: 0 50rpx;
				height: 50rpx;
				color: #EE194C;
			}
		}

		footer {
			position: fixed;
			bottom: 8%;
			width: 100%;
			height: 32%;
			border: 1px solid black;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;

			.top {
				display: flex;
				flex-direction: column;
				align-items: center;

				.header {
					font-size: 40rpx;
					color: #ffffff;
					font-weight: bolder;
				}

				.title {
					margin-top: 6rpx;
				}
			}

			.footer {
				// position: absolute;
				width: 90%;
				height: 70%;
				border: 1px solid black;
				border-radius: 30rpx;
			}
		}
	}
</style>
