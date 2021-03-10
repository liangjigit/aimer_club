<template>
	<view id="invite">
		<image class="background" src="/static/activity/back.png" mode="scaleToFill"></image>
		<header>
			<view class="rule">
				<view class="cu-capsule round">
					<view class="cu-tag bg-blue" @click="getRole">活动规则 <text class="lg text-gray cuIcon-right"></text>
					</view>
				</view>
			</view>
		</header>
		<main>
			<view>
				<button class="cu-btn round bg-white" role="button" aria-disabled="false"
					open-type="share">邀请好友</button>
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
				<count-down :startTimes="startTime" :endTimes="endTime" v-if="endTime != 0"></count-down>
			</view>
		</footer>
		<!-- 新人注册成功页
		<view class="background-img">
			<view class="background-award">
				<view class="background-text">
					<view class="top-text">注册成功</view>
					<view class="bottom-text">点击我的卡券查看优惠</view>
				</view>
				<image src="/static/index/newJoin.png" mode="widthFix" style="height: 100%;"></image>
				<ul>
					<li v-for="item in 3">
						<image src="/static/index/backAward.png" mode="heightFix" style="height: 140rpx;"></image>
						<view class="award-left">
							50积分
						</view>
						<view class="award-right">
							<view class="award-right-top">爱慕优惠券</view>
							<view class="award-right-bottom">
								有效期：2021年2月23日至3月8日
							</view>
						</view>
					</li>
				</ul>
			</view>
		</view> -->
		<!-- 老人邀请成功页
		<view class="background-img">
			<view class="background-award">
				<view class="background-text" style="height: 50%;">
					<view class="top-text" style="color:#f0375f ;font-size: 40rpx;">您已注册过AIMER CLUB</view>
					<view class="bottom-text" style="color: #000000;text-align: center;font-weight: 600;">您可以发起新的[邀请好友]活动获得奖励，邀请越多奖励越多哦！</view>
				</view>
				<image src="/static/index/oldJoin.png" mode="widthFix" style="height: 100%;"></image>
				<view class="old-footer-button">
					<button class="cu-btn round bg-white" role="button" aria-disabled="false"
						style="padding: 0 50rpx;background-color: #ffc1c9;color: #f0375f;">逛逛CLUB</button>
					<button class="cu-btn round bg-white" role="button" aria-disabled="false"
						style="background-color: #ffffff;color: #f0375f;">立即邀请好友</button>
				</view>
			</view>
		</view> -->
		<!-- 新人未注册前的奖励
		<view class="background-img">
			<view class="background-award">
				<image src="/static/index/newback.png" mode="widthFix" style="height: 100%;"></image>
				<image src="/static/index/newborder.png" mode="widthFix" style="width: 70%;position: absolute;top: 10%;left: 50%;transform: translate(-50%);"></image>
				<image src="/static/index/newtext.png" mode="widthFix" style="width: 50%;position: absolute;top: 25%;left: 50%;transform: translate(-50%);"></image>
				<view class="old-footer-button" style="justify-content: center;">
					<button class="cu-btn round bg-white" role="button" aria-disabled="false"
						style="background-color: #ffffff;color: #f0375f;padding: 0 60rpx;">立即领取</button>
				</view>
			</view>
		</view> -->
		<!-- 邀新奖励
		<view class="background-img">
			<view class="background-award">
				<view class="background-text">
					<view class="top-text">恭喜您获得邀新奖励</view>
				</view>
				<image src="/static/index/redback.png" mode="widthFix" style="height: 100%;"></image>
				<ul style="height: 55%;">
					<li>
						<image src="/static/index/backAward.png" mode="heightFix" style="height: 140rpx;"></image>
						<view class="award-left">
							50积分
						</view>
						<view class="award-right">
							<view class="award-right-top">爱慕优惠券</view>
							<view class="award-right-bottom">
								有效期：2021年2月23日至3月8日
							</view>
						</view>
					</li>
				</ul>
			</view>
		</view> -->
	</view>
</template>

<script>
	import getReward from '../components/get-reward/GetReward.vue'
	import countDown from '../components/get-reward/CountDown.vue'
	import {mapActions} from 'vuex'
	export default {
		name: 'invite',
		components: {
			getReward,
			countDown
		},
		data() {
			return {
				indexData:{},
				endTime:0,
				startTime:0,
			}
		},
		created() {
			//获取页面数据
			this.getIndexData()
		},
		methods: {
			...mapActions('invite',['getActiveIndex','getActiveAward','getOldInvite','getNewInvite','sendMiniMessage']),
			/**
			 * 获取页面数据
			 */
			async getIndexData(){
				const res = await this.getActiveIndex()
				if(res.code == 200){
					this.indexData = res.data
					this.endTime = res.data.userBindConfigDO.endTime
					this.startTime = res.data.userBindConfigDO.startTime
					console.log(res.data)
				}
			},
			/**
			 * 获取活动规则
			 */
			getRole() {
				console.log(1111111111)
			},
		},
		onLoad() {
			const _this = this
			uni.getSetting({
				success: async function(t) {
					console.log(t)
					if (t.authSetting["scope.userInfo"]) {
						// await _this.onGetUserInfo()
						//已登录
					}
				}
			})
		},
		onShareAppMessage(res) {
			return {
				title: '好友裂变活动',
				imageUrl: '../../static/account/location.png',
				path: `/pages/index/index?activeId=fission&invitePhone=15011019986`
			}
		},
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
			// border: 1px solid black;
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
				// border: 1px solid black;
				border-radius: 30rpx;
				background: #ffffff;
			}
		}

		.background-img {
			position: fixed;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, .7);
			z-index: 99;

			.background-award {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				z-index: 100;
				width: 70%;
				height: fit-content;

				.background-text {
					position: absolute;
					top: 35rpx;
					width: 100%;
					height: 12%;
					z-index: 100;
					color: #ffffff;
					font-weight: bold;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: center;

					.top-text {
						font-size: 35rpx;
					}
				}

				ul {
					position: absolute;
					bottom: 20rpx;
					width: 100%;
					height: 60%;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: center;

					li {
						width: fit-content;
						height: fit-content;
						position: relative;

						.award-left {
							width: 32%;
							height: 100%;
							// background: rgba(0,0,0,.6);
							position: absolute;
							top: 0;
							left: 0;
							display: flex;
							justify-content: center;
							align-items: center;
						}

						.award-right {
							width: 62%;
							height: 100%;
							// background: rgba(0,0,0,.6);
							position: absolute;
							top: 0;
							right: 0;

							.award-right-top {
								width: 100%;
								height: 60%;
								// background: rgba(0,0,0,.6);
								color: #F52F48;
								font-size: 33rpx;
								font-weight: bolder;
								display: flex;
								align-items: center;
							}

							.award-right-bottom {
								width: 100%;
								height: 40%;
								// background: green;
								font-size: 19rpx;
								display: flex;
								align-items: center;
								color: #707070;
							}
						}
					}
				}

				.old-footer-button {
					position: absolute;
					bottom: 0;
					height: 120rpx;
					width: 100%;
					padding-left: 20rpx;
					padding-right: 20rpx;
					// background: rgba(0,0,0,.7);
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
			}
		}
	}
</style>
