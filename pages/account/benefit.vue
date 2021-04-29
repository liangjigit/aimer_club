<template>
	<view class="">
		<view class="tab flex padding-tb">
			<view class="flex-sub solid-right text-center" :class="{active:current==1}" @click="changeTab(1)">
				我的权益
			</view>
			<view class="flex-sub text-center" :class="{active:current==2}" @click="changeTab(2)">
				权益介绍
			</view>
		</view>
		<view v-show="current==1">
			<view class="padding-tb-lg padding-lr sub-title">
				以下是您的专属【会员权益】——
			</view>
			<view class="flex flex-direction align-center">
				<view class="content-box">
					<view class="flex align-center card-number">
						<image src="/static/account/benefit/card-icon.png" mode="aspectFit"></image>
						<text>{{userInfo.memberNo||""}}</text>
					</view>
					<view class="flex align-center card-name">
						<text>会员等级：</text>
						<text class="light">{{userInfo.level || ""}}</text>
					</view>
					<view class="cu-list menu">
						<view class="cu-item arrow" @click="goIntegral">
							<view class="content">
								<image src="/static/account/benefit/integral-icon.png" class="icon" mode="aspectFit"></image>
								<text class="text-black margin-right-lg">积分</text>
								<text class="text-grey">{{userInfo.level ? benefits.currentIntegral : ""}}</text>
							</view>
						</view>
						<view class="cu-item arrow" @click="goCoupon">
							<view class="content">
								<image src="/static/account/benefit/coupon-icon.png" class="icon" mode="aspectFit"></image>
								<text class="text-black margin-right-lg">优惠券</text>
								<text class="text-grey">{{userInfo.level ? benefits.couponNum : ""}}</text>
							</view>
						</view>
						<view class="cu-item arrow" @click="goCarmi">
							<view class="content">
								<image src="/static/account/benefit/carmi-icon.png" class="icon" mode="aspectFit"></image>
								<text class="text-black margin-right-lg">电子券卡密</text>
							</view>
						</view>
						<view class="cu-item arrow">
							<view class="content">
								<image src="/static/account/benefit/privileges-icon.png" class="icon" mode="aspectFit"></image>
								<text class="text-black margin-right-lg">特权活动</text>
							</view>
						</view>
					</view>
				</view>
				<view class="thanks">感谢您对爱慕旗下品牌的认可与信赖，并欢迎您成为AIMER CLUB大家庭的一员。我们将在这里，持续为您提供优质的服务。</view>
			</view>
		</view>
		<view class="flex justify-center flex-direction align-center padding-tb-lg" v-show="current==2">
			<view class="banner">
				<image :src="benefitIntr.image" mode="aspectFit"></image>
			</view>
			<view class="intr-list">
				<view class="intr-item flex flex-direction" v-for="(item,index) in benefitIntr.profile" @click="toggle(index+1)">
					<view class="title-bar flex align-center">
						<view class="bar"></view>
						<view class="title-text flex-sub">{{item.title}}</view>
						<view class="cuIcon-right" :class="{upper:open!=index+1,down:open==index+1}"></view>
					</view>
					<view class="detail padding" v-show="open==index+1" v-html="item.content"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	import {
		abnormalprompt
	} from '@/common/index.js'
	export default {
		data() {
			return {
				current: 1, // tab 切换
				open: 0 // 介绍
			}
		},
		computed: {
			...mapState('accoutBenefit', ['benefitIntr', 'benefits']),
			...mapState('login', ['userInfo', 'isDisabledUser'])
		},
		onLoad(options) {
			const _this = this
			const {
				level
			} = options
			if (level) {
				getApp().globalData.level = true
				//确定从卡券进入
				uni.getSetting({
					success: async function(t) {
						if (t.authSetting["scope.userInfo"]) {
							await _this.onGetUserInfo()
							const token = uni.getStorageSync('token');
							const getPhone = uni.getStorageSync('getPhone');
							if (token && getPhone) {
								uni.redirectTo({
									url: '/pages/join/index'
								})
							} else {
								await _this.getMyBenefit()
								await _this.getBenifitIntr()
								getApp().globalData.level = false
							}
						}
					}
				})
			} else {
				_this.getMyBenefit()
				_this.getBenifitIntr()
				getApp().globalData.level = false
			}
		},
		onShow() {
			if (this.isDisabledUser) {
				abnormalprompt()
			}
		},
		methods: {
			...mapActions('accoutBenefit', ['getBenifitIntr', 'getMyBenefit']),
			...mapActions('login', ['onGetUserInfo']),
			changeTab(current) {
				this.current = current
			},
			toggle(current) {
				this.open = current == this.open ? 0 : current
			},
			goIntegral() {
				uni.navigateToMiniProgram({
					appId: 'wx203ab2d5cb638d1d',
					path: '/integral_mall/index/index'
				})
			},
			goCarmi() {
				uni.navigateTo({
					url: '/pages/account/carmi'
				})
			},
			goCoupon() {
				uni.navigateTo({
					url: '/pages/coupon/index'
				})
			}
		}

	}
</script>

<style lang="scss" scoped>
	// 权益介绍
	.intr-list {
		padding: 7upx 34upx 48upx 30upx;
		width: 100%;
	}

	.detail {
		font-size: 26upx;
		font-weight: 400;
		color: #2C3850;
		line-height: 36upx;
		white-space: pre-line;
	}

	.title-bar {
		position: relative;
		height: 122upx;
		width: 100%;


		.bar {
			width: 3upx;
			height: 30upx;
			background-color: #C81338;
			border-radius: 2upx;
			margin-right: 27upx;
		}

		.title-text {
			font-size: 30upx;
			font-weight: 500;
			color: #666666;
		}

		.upper {
			transform: rotate(90deg);
		}

		.down {
			transform: rotate(-90deg);
		}

		&::after {
			content: "";
			position: absolute;
			bottom: 0;
			left: 00upx;
			right: 0upx;
			width: 690upx;
			height: 2upx;
			background-color: #F9F9F9;
		}
	}

	.banner {
		width: 690upx;
		height: 348upx;
		background: rgba(255, 255, 255, 1);

		// box-shadow:0upx 0upx 15upx 0upx rgba(0, 0, 0, 0.17);
		image {
			width: 100%;
			height: 100%;
		}
	}

	// 我的权益
	.thanks {
		width: 660upx;
		font-size: 24upx;
		font-weight: 400;
		color: #999999;
		padding-top: 40upx;
	}

	.content-box {
		width: 690upx;
		height: 548upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx 0upx 15upx 0upx rgba(0, 0, 0, 0.17);
		border-radius: 10upx;
		padding: 34upx 0upx 52upx 28upx;

		.menu {
			.cu-item {
				position: relative;
				padding: 30upx 4upx;

				.content {
					.icon {
						width: 34upx;
						height: 34upx;
						margin-right: 19upx;
					}

					text {
						font-size: 30upx;
					}
				}
			}

		}

		.card-number {
			margin-bottom: 24upx;
			color: #999999;
			font-size: 30upx;

			image {
				width: 34upx;
				height: 34upx;
				margin-right: 14upx;
			}

			text {
				line-height: 1;
			}
		}

		.card-name {
			color: #999999;
			font-size: 26upx;

			.light {
				color: #C6AB6D;
			}

		}
	}

	.sub-title {
		font-size: 30upx;
		font-weight: 500;
		color: #111111;
	}

	.tab {
		font-size: 30upx;
		color: #111111;

		.active {
			color: #EC2C5A;
			font-size: 30upx;
		}
	}
</style>
