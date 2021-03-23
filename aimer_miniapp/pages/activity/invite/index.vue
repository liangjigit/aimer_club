<template>
	<view id="invite">
		<view style="width: 100%;height: 100%;position: fixed;z-index: 1000;" v-if="showModal"
			@click="getServicePermission"></view>
		<login-pupop ref="login" @reGetInfo="inviteOld" @getNewPrize="showNewPrize = true">
		</login-pupop>
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
				<button class="cu-btn round bg-white" role="button" aria-disabled="false" open-type="share"
					@click="showModal = true">邀请好友</button>
			</view>
			<view>
				<count-down :startTimes="startTime" :endTimes="endTime" v-if="endTime != 0"></count-down>
			</view>
		</main>
		<footer>
			<view class="top">
				<view class="header">邀新奖励</view>
				<view class="title">您已邀请{{rewardObj.total == undefined ? 0 : rewardObj.total}}人，邀请好友越多，奖励越多</view>
			</view>
			<view class="footer">
				<get-reward v-if="rewardObj != null" :rewardObj="rewardObj" @getFinish="getFinish"
					@seePrize="toSeePrize">
				</get-reward>
			</view>
		</footer>
		<!-- 邀新奖励 -->
		<view class="background-img" v-if="isShowPrize" @click="isShowPrize = false">
			<view class="background-award">
				<view class="background-text" style="top: 70rpx;">
					<view class="top-text">恭喜您获得邀新奖励</view>
				</view>
				<image src="/static/index/redback.png" mode="widthFix" style="height: 100%;"></image>
				<image src="/static/index/close.png"
					style="position: absolute;right: 15rpx;top: 15rpx;height: 50rpx;width: 50rpx;"
					@click="isShowPrize = false"></image>
				<ul style="height: 55%;">
					<!-- 奖励为积分时 -->
					<li v-if="getPrizeInfo.rewardType == 2">
						<image src="/static/index/jf_back.png" mode="heightFix" style="height: 140rpx;"></image>
						<view class="award-left">
							<text
								style="font-size: 45rpx;font-weight: bolder;color: #ffffff;">{{getPrizeInfo.integral}}</text>
							<view class="left-style">
								<text>积</text><text>分</text>
							</view>
						</view>
						<view class="award-right">
							<view class="award-right-top">{{getPrizeInfo.integral}}积分</view>
							<view class="award-right-bottom">
								有效期：2021年2月23日至3月8日
							</view>
						</view>
					</li>
					<!-- 奖励为优惠券的时候 -->
					<li v-if="getPrizeInfo.rewardType == 1">
						<image src="/static/index/backAward.png" mode="heightFix" style="height: 140rpx;"></image>
						<view class="award-left">
							<text
								style="font-size: 30rpx;font-weight: bolder;color: #F52F48;margin-bottom: 20rpx;">￥</text>
							<text
								style="font-size: 45rpx;font-weight: bolder;color: #F52F48;">{{getPrizeInfo.couponList[0].couponAmount}}</text>
						</view>
						<view class="award-right">
							<view
								style="font-size: 30rpx;height: fit-content;width: 100%;font-weight: bolder;color: #F52F48;margin-top: 20rpx;">
								{{getPrizeInfo.couponList[0].couponName}}
							</view>
							<view style="font-size: 20rpx;height: fit-content;width: 100%;color: #F52F48;">
								{{getPrizeInfo.couponList[0].subheading}}
							</view>
							<view class="award-right-bottom">
								有效期：2021年2月23日至3月8日
							</view>
						</view>
					</li>
					<!-- 奖励为礼品卡的时候 -->
					<li v-if="getPrizeInfo.rewardType == 3">
						<image src="/static/index/backAward.png" mode="heightFix" style="height: 140rpx;"></image>
						<view class="award-left">
							<image :src="getPrizeInfo.prizeImg" mode="heightFix" style="height: 70%;"></image>
						</view>
						<view class="award-right">
							<view class="award-right-top" style="font-size: 30rpx;">
								{{getPrizeInfo.couponList[0].couponName}}
							</view>
							<view class="award-right-bottom">
								有效期：2021年2月23日至3月8日
							</view>
						</view>
					</li>
				</ul>
			</view>
		</view>
		<!-- 老人邀请成功页 -->
		<view class="background-img" v-if="showOldprize">
			<view class="background-award">
				<view class="cancel-btn">
					<image src="/static/close-icon.png" mode="aspectFit" @click="showOldprize=false">
					</image>
				</view>
				<view class="background-text" style="height: 40%;">
					<view class="top-text" style="color:#f0375f ;font-size: 40rpx;">您已注册过AIMER CLUB</view>
					<view class="bottom-text"
						style="color: #000000;text-align: center;font-weight: 600;padding-left: 25rpx;padding-right: 25rpx;">
						您可以发起新的[邀请好友]活动获得奖励，邀请越多奖励越多哦！</view>
				</view>
				<image src="/static/index/oldJoin.png" mode="widthFix" style="height: 100%;"></image>
				<view class="old-footer-button">
					<button class="cu-btn round bg-white" role="button" aria-disabled="false"
						style="padding: 0 50rpx;background-color: #ffc1c9;color: #f0375f;"
						@click="toClubIndex">逛逛CLUB</button>
					<button class="cu-btn round bg-white" role="button" aria-disabled="false"
						style="background-color: #ffffff;color: #f0375f;" open-type="share"
						@click="showOldprize=false">立即邀请好友</button>
				</view>
			</view>
		</view>
		<!-- 新人未注册前的奖励 -->
		<view class="background-img" v-if="showNewPrize">
			<view class="background-award">
				<image src="/static/index/newback.png" mode="widthFix" style="height: 100%;"></image>
				<image src="/static/index/newborder.png" mode="widthFix"
					style="width: 70%;position: absolute;top: 10%;left: 50%;transform: translate(-50%);"></image>
				<image src="/static/index/newtext.png" mode="widthFix"
					style="width: 50%;position: absolute;top: 25%;left: 50%;transform: translate(-50%);"></image>
				<view class="old-footer-button" style="justify-content: center;">
					<button class="cu-btn round bg-white" role="button" aria-disabled="false"
						style="background-color: #ffffff;color: #f0375f;padding: 0 60rpx;" @click="toJoin">立即领取</button>
				</view>
			</view>
		</view>
		<!-- 新人注册成功页 -->
		<view class="background-img" v-if="fromJoin" @click="fromJoin = false">
			<view class="background-award">
				<view class="background-text">
					<view class="top-text">注册成功</view>
					<view class="bottom-text">点击我的卡券查看优惠</view>
				</view>
				<image src="/static/index/newJoin.png" mode="widthFix" style="height: 100%;"></image>
				<ul>
					<li v-for="(item,index) in newMemberPrizeList">
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
			<view class="cancel-award">
				<image src="/static/close-icon.png" mode="aspectFit" @click="fromJoin = false"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import getReward from '../../components/get-reward/GetReward.vue'
	import countDown from '../../components/get-reward/CountDown.vue'
	import {
		mapActions,
		mapState
	} from 'vuex'
	export default {
		name: 'invite',
		components: {
			getReward,
			countDown
		},
		data() {
			return {
				indexData: {},
				endTime: 0,
				startTime: 0,
				rewardObj: null,
				//是从注册页来的新用户
				fromJoin: false,
				fromActive: false,
				showNewPrize: false,
				showOldprize: false,
				isShowPrize: false,
				getPrizeInfo: {},
				getPrizeDetail: [],
				clubIn: false,
				newMemberPrizeList: [],
				invitePhone: '',
				showModal: false,
			}
		},
		onLoad(options) {
			uni.showLoading({
				title: '加载中',
				mask: true,
			})
			const _this = this
			const {
				fission,
				clubIn,
				invitePhone
			} = options
			console.log(options)
			console.log(getApp().globalData.fromJoin)
			console.log(getApp().globalData.fromActive)
			if (invitePhone != undefined) getApp().globalData.invitePhone = invitePhone
			this.invitePhone = invitePhone
			//1.从club进入clubIn为true，否则为false
			this.clubIn = clubIn
			//2.fission存在时表示被邀请进入，区分新老会员
			if (fission) {
				this.fromActive = getApp().globalData.fromActive = true
			} else {
				this.fromActive = getApp().globalData.fromActive = false
			}
			uni.getSetting({
				withSubscriptions: true,
				success: async function(t) {
					// console.log(t)
					if (t.authSetting["scope.userInfo"]) {
						await _this.onGetUserInfo()
						await _this.getIndexData()
						// _this.getNewMemberPrize()
					} else {
						_this.$refs.login.checkLogin()
					}
				}
			})
		},
		computed: {
			...mapState('login', ['userInfo']),
		},
		methods: {
			...mapActions('invite', ['getActiveIndex', 'getOldInvite', 'getNewInvite', 'sendMiniMessage',
				'getNewMemberPrizeList'
			]),
			...mapActions('login', ['onGetUserInfo']),
			//获取页面数据
			async getIndexData() {
				const res = await this.getActiveIndex()
				if (res.code == 200) {
					console.log(res.data)
					this.indexData = res.data
					this.endTime = res.data.userBindConfigDO.endTime
					this.startTime = res.data.userBindConfigDO.startTime
					this.rewardObj = {
						reward: res.data.rewardList,
						receive: res.data.receiveList,
						total: res.data.totalCount
					}
					//从club进入且是导购
					if (this.clubIn) {
						if (this.userInfo.isGuide == 1) {
							this.bindingOld(this.userInfo)
							return false
						}
					}
					//3.如果是新会员，fromjoin为true
					if (getApp().globalData.fromJoin) {
						console.log('我是从注册页面过来的，我是新用户')
						getApp().globalData.fromJoin = false
						this.bindingNew(this.userInfo)
						return false
					}
					uni.hideLoading()
				}
			},
			//绑定老会员
			async bindingOld(userInfo) {
				const {
					phone,
					isGuide
				} = userInfo
				console.log(userInfo)
				const response = await this.getOldInvite({
					activityId: this.indexData.userBindConfigDO.id,
					invitationPhone: getApp().globalData.fromActive == true ? this.invitePhone : null,
					type: null,
					userPhone: phone
				})
				uni.hideLoading()
				console.log(response)
			},
			//绑定新会员
			async bindingNew(userInfo) {
				const {
					phone,
					isGuide
				} = userInfo
				console.log(userInfo)
				const response = await this.getNewInvite({
					activityId: this.indexData.userBindConfigDO.id,
					invitationPhone: getApp().globalData.invitePhone,
					type: null,
					userPhone: phone
				})
				console.log(response)
				this.getNewMemberPrize()
			},
			//获取新会员奖励列表
			async getNewMemberPrize() {
				const res = await this.getNewMemberPrizeList({
					activeId: this.indexData.userBindConfigDO.id
				})
				console.log(res)
				if (res.code == 200) {
					let reward = JSON.parse(res.data.reward)
					let user_rge = JSON.parse(JSON.parse(res.data.user_rge).couponList)
					this.newMemberPrizeList = [...user_rge, ...reward]
					console.log(this.newMemberPrizeList)
				}
				uni.hideLoading()
				this.fromJoin = true
			},
			//去首页
			toClubIndex() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			//去注册页
			toJoin() {
				uni.redirectTo({
					url: '/pages/join/index'
				})
			},
			//老会员被邀重新登陆进入后
			async inviteOld() {
				const res = await this.getActiveIndex()
				if (res.code == 200) {
					console.log(res.data)
					this.indexData = res.data
					this.endTime = res.data.userBindConfigDO.endTime
					this.startTime = res.data.userBindConfigDO.startTime
					this.rewardObj = {
						reward: res.data.rewardList,
						receive: res.data.receiveList,
						total: res.data.totalCount
					}
					//从club进入且是导购
					if (this.fromActive) {
						await this.bindingOld(this.userInfo)
						this.showOldprize = true
					}
				}
			},
			//获取当前领取奖品
			async getFinish(data) {
				this.getPrizeInfo = data
				this.isShowPrize = true
				const res = await this.getActiveIndex()
				if (res.code == 200) {
					console.log(res.data)
					this.indexData = res.data
					this.endTime = res.data.userBindConfigDO.endTime
					this.startTime = res.data.userBindConfigDO.startTime
					this.rewardObj = {
						reward: res.data.rewardList,
						receive: res.data.receiveList,
						total: res.data.totalCount
					}
				}
			},
			//去查看奖励
			toSeePrize() {
				uni.navigateTo({
					url: '/pages/account/benefit'
				})
			},
			//获取拉起服务通知权限
			getServicePermission() {
				const _this = this
				uni.requestSubscribeMessage({
					tmplIds: ['KarFydEdLKD4_HI0O3A7s5_WjsxmDbr7JXVe23Z2A7Y'],
					async success(res) {
						console.log(res)
						const response = await _this.sendMiniMessage({
							activityId: this.indexData.userBindConfigDO.id,
							invitationPhone: getApp().globalData.invitePhone,
							type: null,
							userPhone: null
						})
						_this.showModal = false
					},
					fail(err) {
						console.log(err)
						console.log('必须授权')
					}
				})
			},
			//获取活动规则
			getRole() {
				console.log(this.indexData.userBindConfigDO.content)
			},
		},
		onShareAppMessage(res) {
			return {
				title: this.indexData.userBindConfigDO.friendsTitle == null ? '邀请好友活动' : this.indexData.userBindConfigDO
					.friendsTitle,
				imageUrl: this.indexData.userBindConfigDO.friendsBg == null ? '../../../static/activity/invite.png' : this
					.indexData.userBindConfigDO.friendsBg,
				path: `/pages/activity/invite/index?fission=invite&invitePhone=${this.userInfo.phone}`
			}
		},
	}
</script>

<style lang="scss" scoped>
	#invite {
		.cancel-award {
			position: absolute;
			left: 50%;
			margin-left: -33upx;
			bottom: 10%;
			font-size: 70upx;
			width: 66upx;
			height: 66upx;

			image {
				width: 100%;
				height: 100%;
			}

		}

		.cancel-btn {
			position: absolute;
			top: 0rpx;
			right: 10rpx;
			font-size: 70rpx;
			width: 50rpx;
			height: 50rpx;
			z-index: 999;

			image {
				width: 100%;
				height: 100%;
			}

		}

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
					top: 60rpx;
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
					justify-content: space-evenly;
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
							justify-content: space-evenly;
							padding: 0 10rpx;
							align-items: center;

							.left-style {
								display: flex;
								flex-direction: column;
								justify-content: flex-end;
								font-size: 20rpx;
								color: #ffffff;
								font-weight: bolder;
								margin-top: 10rpx;
							}
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
								font-size: 40rpx;
								font-weight: bolder;
								display: flex;
								align-items: flex-end;
							}

							.award-right-bottom {
								width: 100%;
								height: fit-content;
								position: absolute;
								bottom: 10rpx;
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
