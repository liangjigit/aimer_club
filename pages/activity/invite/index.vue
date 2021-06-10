<template>
	<view id="invite">
		<view style="width: 100%;height: 100%;position: fixed;z-index: 1000;" v-if="showModal"
			@click="getServicePermission"></view>
		<login-pupop ref="login" @reGetInfo="getIndexData('oldFromLogin')" @getNewPrize="getNewPrize">
		</login-pupop>
		<!-- <image class="background"
			:src="backgroundMr ? backgroundMr : 'https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1618392284802.png'"
			mode="scaleToFill"></image> -->
		<image class="background"
			:src="backgroundMr ? backgroundMr : 'https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1619748011251.jpg'"
			mode="widthFix" style="width: 100%;"></image>
		<image class="small-background"
			src="https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1618392341758.png" mode="heightFix"
			:style="{'top':topHeight,'height':smallHeight}"></image>
		<header v-if="isShowInvite || !noActivity">
			<view class="rule">
				<view class="cu-capsule round">
					<view class="cu-tag bg-blue" @click="getRule">
						<!-- 活动规则 <text class="lg text-gray cuIcon-right"></text> -->
						<image src="/static/activity/rules.png" mode="heightFix" style="width: 109rpx;height: 21rpx;">
						</image>
					</view>
				</view>
			</view>
		</header>
		<main>
			<view v-if="!noActivity">
				<button class="cu-btn round bg-white" role="button" style="width: 240rpx;height: 60rpx;"
					aria-disabled="false" open-type="share" @click="showModalYn" v-if="isShowInvite">邀请好友</button>
				<button class="cu-btn round bg-white" role="button"
					style="width: 240rpx;height: 60rpx;background-color: #c1c1c1;color: #666666;" aria-disabled="false"
					@click="showModalNp" v-else>邀请好友</button>
			</view>
			<view v-else>
				<text style="color: #ffffff;font-weight: bolder;">当前没有活动</text>
			</view>
			<view>
				<count-down @activityIsOver="isShowInvite = false" :startTimes="startTime" :endTimes="endTime"
					v-if="endTime != 0">
				</count-down>
			</view>
		</main>
		<footer>
			<view class="top">
				<view class="header">邀新奖励</view>
				<view class="title">您已邀请
					<view style="width: 10rpx;"></view>
					<text style="color: #ffffff;font-size: 25rpx;">
						{{rewardObj.total == undefined ? 0 : rewardObj.total}}
					</text>
					<view style="width: 10rpx;"></view>人，邀请好友越多，奖励越多
				</view>
			</view>
			<view class="footer">
				<get-reward v-if="rewardObj != null" :rewardStr="JSON.stringify(rewardObj)" @getFinish="getFinish"
					@seePrize="toSeePrize">
				</get-reward>
			</view>
		</footer>
		<!-- 邀新奖励 -->
		<view class="background-img" v-if="isShowPrize" @click="isShowPrize = false">
			<view class="background-award">
				<view class="background-text" style="top: 54rpx;">
					<view class="top-text">恭喜您获得邀新奖励</view>
				</view>
				<image src="/static/index/redback.png" mode="center" style="height: 300rpx;"></image>
				<image src="/static/index/close.png"
					style="position: absolute;right: 23rpx;top: 23rpx;height: 40rpx;width: 40rpx;"
					@click="isShowPrize = false"></image>
				<ul style="height: fit-content;margin-top: 32rpx;">
					<!-- 奖励为积分时 -->
					<li v-if="getPrizeInfo.rewardType == 2">
						<image src="/static/index/jf_back.png" mode="heightFix" style="height: 148rpx;"></image>
						<view class="award-left">
							<text
								style="font-size: 90rpx;font-family: DINCond-Black;font-weight: 400;color: #FFFFFF;line-height: 122rpx;">{{getPrizeInfo.integral}}</text>
							<image src="/static/activity/jifen.png" mode="widthFix"
								style="width: 25rpx;height: 46rpx;margin-top: 20rpx;"></image>
						</view>
						<view class="award-right">
							<view class="award-right-top">{{getPrizeInfo.integral}}积分</view>
							<view class="award-right-bottom">
								有效期:{{nowTime}}至{{twoYearLater}}
							</view>
						</view>
					</li>
					<!-- 奖励为优惠券的时候 -->
					<li v-if="getPrizeInfo.rewardType == 1">
						<image src="/static/index/backAward.png" mode="heightFix" style="height: 148rpx;"></image>
						<view class="award-left">
							<text
								style="font-size: 34rpx;font-family: DINCond-Black;font-weight: 400;color: #F52F48;line-height: 122rpx;margin-bottom: 14rpx;">￥</text>
							<text
								style="font-size: 60rpx;font-family: DINCond-Black;font-weight: 400;color: #F52F48;line-height: 122rpx;margin-left: -10rpx;">
								{{getPrizeInfo.couponList[0].couponAmount}}</text>
						</view>
						<view class="award-right">
							<view class="right-10">
								<text>{{getPrizeInfo.couponList[0].couponName}}
								</text>
							</view>
							<view class="right-10" style="font-size: 22rpx;margin-top: 10rpx;">
								<text>{{getPrizeInfo.couponList[0].subheading}}</text>
							</view>
							<view class="award-right-bottom">
								有效期:{{getPrizeInfo.couponList[0].startDate | transformDate}}至{{getPrizeInfo.couponList[0].endDate | transformDate}}
							</view>
						</view>
					</li>
					<!-- 奖励为礼品卡的时候 -->
					<li v-if="getPrizeInfo.rewardType == 3">
						<image src="/static/index/backAward.png" mode="heightFix" style="height: 148rpx;"></image>
						<view class="award-left">
							<image :src="getPrizeInfo.prizeImg" mode="heightFix" style="height: 100rpx;"></image>
						</view>
						<view class="award-right">
							<view class="award-right-top"
								style="height: fit-content;width: 280rpx;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin-top: 45rpx;">
								<text
									style="width: 100%;text-overflow: ellipsis;overflow: hidden;">{{getPrizeInfo.couponList[0].couponName}}</text>
							</view>
							<view class="award-right-bottom">
								有效期:{{getPrizeInfo.couponList[0].startDate | transformDate}}至{{getPrizeInfo.couponList[0].endDate | transformDate}}
							</view>
						</view>
					</li>
				</ul>
			</view>
		</view>
		<!-- 老人邀请成功页 -->
		<view class="background-img" v-if="showOldprize">
			<view class="background-award" style="height: 400rpx;">
				<view class="cancel-btn">
					<image src="/static/close-icon.png" mode="aspectFit" @click="showOldprize=false">
					</image>
				</view>
				<view class="background-text" style="height: 40%;">
					<image src="/static/activity/already-join.png" mode="aspectFit"
						style="width: 403rpx;height: 35rpx;margin-top: 32rpx;"></image>
					<image src="/static/activity/already-sub.png" mode="aspectFit"
						style="width: 435rpx;height: 58rpx;margin-top: 53rpx;"></image>
				</view>
				<image src="/static/index/oldJoin.png" mode="widthFix" style="height: 100%;"></image>
				<view class="old-footer-button">
					<button class="cu-btn round bg-white" role="button" aria-disabled="false"
						style="width: 220rpx;height: 60rpx;background-color: #ffc1c9;color: #f0375f;"
						@click="toClubIndex">
						<image src="/static/activity/to-club.png" mode="widthFix" style="width: 130rpx;height: 24rpx;">
						</image>
					</button>
					<button class="cu-btn round bg-white" role="button" aria-disabled="false"
						style="width: 220rpx;height: 60rpx;background-color: #ffffff;color: #f0375f;" open-type="share"
						@click="showOldprize=false">
						<image src="/static/activity/invute-f.png" mode="widthFix" style="width: 159rpx;height: 25rpx;">
						</image>
					</button>
				</view>
			</view>
		</view>
		<!-- 新人未注册前的奖励 -->
		<view class="background-img" v-if="showNewPrize">
			<view class="background-award" style="height: 400rpx;">
				<image src="/static/index/newback.png" mode="widthFix" style="width: 100%;"></image>
				<image src="/static/index/newborder.png" mode="widthFix"
					style="width: 343rpx;height:199rpx; position: absolute;top: 48rpx;left: 104rpx;"></image>
				<image src="/static/index/newtext.png" mode="widthFix"
					style="width: 221rpx;height: 81rpx;position: absolute;top: 109rpx;left: 50%;transform: translate(-50%);">
				</image>
				<view class="old-footer-button" style="justify-content: center;">
					<button class="cu-btn round bg-white" role="button" aria-disabled="false" @click="toJoin"
						style="background-color: #ffffff;color: #f0375f;width: 240rpx;height: 60rpx;">
						<image src="/static/activity/like-get.png" mode="widthFix" style="width: 106rpx;height: 25rpx;">
						</image>
					</button>
				</view>
			</view>
		</view>
		<!-- 新人注册成功页 -->
		<view class="background-img" v-if="fromJoin" @click="fromJoin = false">
			<view class="background-award" style="height: fit-content;">
				<view class="background-text">
					<image src="/static/activity/join-success.png" mode="widthFix" style="height: 81rpx;width: 239rpx;">
					</image>
				</view>
				<image
					:src="newMemberPrizeList.length == 3 ? 'https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1618392421168.png':'https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1618392452987.png'"
					mode="widthFix" style="height: 100%;" @load="fromJoinUl = true"></image>
				<ul v-if="fromJoinUl">
					<!-- DJQ:满减券 -->
					<li v-for="(item,index) in newMemberPrizeList">
						<template v-if="item.type == 'DJQ' || item.rewardType == 1">
							<image src="/static/index/backAward.png" mode="heightFix" style="height: 148rpx;"></image>
							<view class="award-left">
								<text
									style="font-size: 34rpx;font-family: DINCond-Black;font-weight: 400;color: #F52F48;line-height: 122rpx;margin-bottom: 14rpx;">￥</text>
								<text
									style="font-size: 60rpx;font-family: DINCond-Black;font-weight: 400;color: #F52F48;line-height: 122rpx;margin-left: -10rpx;">
									{{item.couponAmount ? item.couponAmount : item.couponList[0].couponAmount}}</text>
							</view>
							<view class="award-right">
								<view class="right-10">
									<text>{{item.couponName ? item.couponName : item.couponList[0].couponName}}
									</text>
								</view>
								<view class="right-10" style="font-size: 22rpx;margin-top: 10rpx;">
									<text>{{item.subheading ? item.subheading : item.couponList[0].subheading}}</text>
								</view>
								<view class="award-right-bottom">
									有效期:{{(item.startDate ? item.startDate : item.couponList[0].startDate) | transformDate}}至{{(item.endDate ? item.endDate : item.couponList[0].endDate) | transformDate}}
								</view>
							</view>
						</template>
						<!-- 积分 -->
						<template v-else>
							<image src="/static/index/jf_back.png" mode="heightFix" style="height: 148rpx;"></image>
							<view class="award-left">
								<text
									style="font-size: 90rpx;font-family: DINCond-Black;font-weight: 400;color: #FFFFFF;line-height: 122rpx;">{{item.integral}}</text>
								<image src="/static/activity/jifen.png" mode="widthFix"
									style="width: 25rpx;height: 46rpx;margin-top: 20rpx;"></image>
							</view>
							<view class="award-right">
								<view class="award-right-top">{{item.integral}}积分</view>
								<view class="award-right-bottom">
									有效期:{{nowTime}}至{{twoYearLater}}
								</view>
							</view>
						</template>
						<!-- <template v-else-if="item.type == 'LPQ'">
							<image src="/static/index/backAward.png" mode="heightFix" style="height: 148rpx;"></image>
							<view class="award-left">
								<image :src="item.prizeImg ? item.prizeImg : ''" mode="heightFix"
									style="height: 100rpx;"></image>
							</view>
							<view class="award-right">
								<view class="award-right-top"
									style="height: fit-content;width: 280rpx;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin-top: 45rpx;">
									<text
										style="width: 100%;text-overflow: ellipsis;overflow: hidden;">{{item.couponName ? item.couponName : item.couponList[0].couponName}}</text>
								</view>
								<view class="award-right-bottom">
									有效期:{{(item.startDate ? item.startDate : item.couponList[0].startDate) | transformDate}}至{{(item.endDate ? item.endDate : item.couponList[0].endDate) | transformDate}}
								</view>
							</view>
						</template> -->
					</li>
				</ul>
			</view>
			<view class="cancel-award">
				<image src="/static/close-icon.png" mode="aspectFit" style="height: 40rpx;height: 40rpx;"
					@click="fromJoin = false"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import getReward from './get-reward/GetReward.vue'
	import countDown from './get-reward/CountDown.vue'
	import {
		mapActions,
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'
	import {
		debounce
	} from '@/common/index.js'
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
				fromJoinUl: false,
				showNewPrize: false,
				showOldprize: false,
				isShowPrize: false,
				getPrizeInfo: {},
				getPrizeDetail: [],
				newMemberPrizeList: [],
				showModal: false,
				nowTime: '',
				twoYearLater: '',
				noActivity: false,
				isShowInvite: false,
				backgroundMr: '',
				topHeight: '',
				smallHeight: '',
				receiveListSave: []
			}
		},
		watch: {
			fromJoin: {
				handler(val) {
					if (val) {
						let prevpage = getCurrentPages()[getCurrentPages().length - 2];
						// console.log(prevpage)
						if (prevpage != undefined) prevpage = prevpage.route
						const page = ['pages/activity/invite/index', undefined]
						// console.log('上个页面路径', prevpage)
						let prevpagetype
						switch (prevpage) {
							case page[0]:
								prevpagetype = '活动页'
								break;
							case page[1]:
								prevpagetype = '注册页'
								break;
							default:
								prevpagetype = '其他'
						}
						// console.log(prevpagetype)
						const params = {
							activeId: this.buriedData.activeId,
							invitePhone: this.buriedData.invitePhone,
							pageUrl: prevpagetype,
							type: 'THREE',
							userPhone: this.buriedData.userPhone,
							userWx: this.buriedData.userWx
						}
						// console.log(params)
						this.getBuriedPoint(params)
					}
				},
				deep: true,
				immediate: true
			}
		},
		onHide() {
			console.log('------onHide------')
		},
		onUnload() {
			console.log('------onUnload------')
			uni.removeStorageSync('inviteStatus')
			this.GETINVITEUSERID({
				inviteUserId: null
			})
			uni.removeStorageSync('invitePhone')
			uni.removeStorageSync('fromService')
			uni.removeStorageSync('clubIn')
		},
		onLoad(options) {
			console.log('------onLoad------')
			//适配屏幕
			this.getPhoneScreenHeight()
			let {
				//1、活动的状态 0隐藏 1显示 fx通过分享或者服务通知进来
				inviteStatus,
				//2、邀请人id
				inviteUserId,
				//3、邀请人手机号
				invitePhone,
				//4、从服务通知进入
				fromService,
				//5、是否从club进入
				clubIn
			} = options
			//保存活动的状态
			uni.setStorageSync('inviteStatus', inviteStatus)
			//从club首页进入 要清除其他所有状态
			if (clubIn === 'clubIn') {
				uni.setStorageSync('clubIn', true)
				this.GETINVITEUSERID({
					inviteUserId: null
				})
				uni.removeStorageSync('invitePhone')
				uni.removeStorageSync('fromService')
			} else {
				uni.removeStorageSync('clubIn')
			}
			//保存邀请人的id
			if (inviteUserId) {
				this.GETINVITEUSERID({
					inviteUserId
				})
			} else {
				this.GETINVITEUSERID({
					inviteUserId: null
				})
			}
			//保存邀请人的加密手机号
			if (invitePhone) {
				invitePhone = decodeURIComponent(invitePhone)
				uni.setStorageSync('invitePhone', invitePhone)
			} else {
				uni.removeStorageSync('invitePhone')
			}
			//从服务通知进入场景
			if (fromService) {
				uni.setStorageSync('fromService', true)
			} else {
				uni.removeStorageSync('fromService')
			}
		},
		onShow() {
			console.log('------onShow------')
			// uni.hideLoading()
			// uni.showLoading({
			// 	title: '加载中',
			// 	mask: true,
			// })
			//获取两年后积分时间
			this.getNowAndTwoYear()
			// //通过小程序码进入 1047 1048 1049 隐藏活动
			// let scene = uni.getStorageSync('globalScene')
			// if (scene == 1047 || scene == 1048 || scene == 1049) {
			// 	//奖励标识 目前FL固定
			// 	// const inviteType = 'FL'
			// 	uni.setStorageSync('inviteStatus', 0)
			// 	this.GETINVITEUSERID({
			// 		inviteUserId: null
			// 	})
			// 	uni.removeStorageSync('invitePhone')
			// 	uni.removeStorageSync('fromService')
			// 	uni.removeStorageSync('clubIn')
			// }
			//判断是否登陆
			if (this.isLogin) {
				this.isShowInvite = true
				this.getIndexData()
			} else {
				this.isShowInvite = false
				this.getNewMemberPrize('INIT')
				this.$refs.login.checkLogin('FL')
			}
		},
		methods: {
			...mapActions('invite', ['getActiveIndex', 'getOldInvite', 'getNewInvite', 'sendMiniMessage',
				'getNewMemberPrizeList', 'getBuriedPoint'
			]),
			...mapActions('login', ['onGetUserInfo']),
			...mapMutations('login', ['GETINVITEUSERID']),
			...mapMutations('invite', ['GETBURIEDPOINT']),
			//获取页面数据
			async getIndexData(oldFromLogin = undefined) {
				// //如果不是导购且进入的是隐藏活动则跳回首页
				// if (this.userInfo.isGuide != 1 && uni.getStorageSync('inviteStatus') == '0' && !uni.getStorageSync(
				// 		'invitePhone')) {
				// 	uni.switchTab({
				// 		url: '/pages/index/index'
				// 	})
				// 	return false
				// }
				const res = await this.getActiveIndex({
					isShowHide: uni.getStorageSync('inviteStatus')
				})
				// console.log(res)
				//data为空时活动时间结束，跳回首页
				if (res.data == null) {
					uni.showToast({
						title: '当前时间段没有活动~',
						duration: 2000,
						icon: 'none'
					});
					setTimeout(function() {
						uni.switchTab({
							url: '/pages/index/index'
						})
					}, 2000)
					return false
				}
				//成功返回数据 code==200
				if (res.code == 200) {
					this.indexData = res.data
					this.backgroundMr = res.data.userBindConfigDO.themeBg
					this.endTime = res.data.userBindConfigDO.endTime
					this.startTime = res.data.userBindConfigDO.startTime
					this.rewardObj = {
						reward: res.data.rewardList,
						receive: res.data.receiveList,
						total: res.data.totalCount,
						limit: res.data.userBindConfigDO.timeLimit
					}
					this.receiveListSave = res.data.receiveList
					//activeStatus == 2 表示管理员手动关闭活动或者奖励领取完毕
					if (res.data.userBindConfigDO.activeStatus == 2) {
						// uni.hideLoading()
						this.isShowInvite = false
						return false
					}
					//从club首页进
					if (uni.getStorageSync('clubIn')) {
						uni.removeStorageSync('clubIn')
						if (this.userInfo.isGuide == 1) {
							console.log('------我是导购------')
							this.bindingOld(this.userInfo)
						}
						// uni.hideLoading()
						return false
					}
					// // 从club进入且是导购 或者通过太阳码进入只存在inviteStatus
					// if (uni.getStorageSync('clubIn') === 'clubIn' || (uni.getStorageSync('inviteStatus') == 0 && !uni
					// 		.getStorageSync('invitePhone'))) {
					// 	uni.removeStorageSync('clubIn')
					// 	if (this.userInfo.isGuide == 1) {
					// 		console.log('我是导购，进入isGuide == 1')
					// 		this.bindingOld(this.userInfo)
					// 	}
					// 	uni.hideLoading()
					// 	return false
					// }
					//邀请老会员进入(登陆中)(此时被邀请有可能是导购)
					if (!uni.getStorageSync('fromJoin') && uni.getStorageSync('invitePhone') && oldFromLogin ==
						undefined) {
						this.bindingOld(this.userInfo)
						return false
					}
					//oldFromLogin存在代表老会员重新登陆进入当前页
					if (oldFromLogin === 'oldFromLogin') {
						this.isShowInvite = true
						if (uni.getStorageSync('fromService')) {
							uni.removeStorageSync('fromService')
						} else {
							this.bindingOld(this.userInfo, 'oldFromLogin')
						}
						return false
					}
					//这是新会员注册完成后从注册页面过来，fromjoin为true
					if (uni.getStorageSync('fromJoin') && uni.getStorageSync('invitePhone') && oldFromLogin ==
						undefined) {
						uni.removeStorageSync('fromJoin')
						this.getNewMemberPrize('GET')
						this.bindingNew(this.userInfo)
						return false
					}
					//从服务通知进来的不需要再进行老会员绑定了
					if (uni.getStorageSync('fromService')) {
						this.isShowInvite = true
						uni.removeStorageSync('fromService')
						return false
					}
					console.log('------直接获取数据，未走任何判断------')
					// uni.hideLoading()
				} else if (res.code == 500 || res.code == 2100) {
					this.noActivity = true
				} else if (res.code == 2009) {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			},
			//绑定老会员
			async bindingOld(userInfo, isReGet) {
				const {
					phone
				} = userInfo
				const response = await this.getOldInvite({
					activityId: this.indexData.userBindConfigDO.id,
					invitationPhone: uni.getStorageSync('invitePhone') ? uni.getStorageSync('invitePhone') :
						null,
					type: null,
					userPhone: phone
				})
				//如果被邀请人是导购
				if (response.code == 2016) {
					const _this = this
					uni.setStorageSync('indexDataId', this.indexData.userBindConfigDO.id)
					setTimeout(async function() {
						await _this.getOldInvite({
							activityId: uni.getStorageSync('indexDataId'),
							invitationPhone: null,
							type: null,
							userPhone: phone
						})
						uni.removeStorageSync('indexDataId')
					}, 5000)
				}
				//非导购且重新载入时才显示
				if (this.userInfo.isGuide != 1 && isReGet == 'oldFromLogin' && response.code != 2012 && response
					.code == 200) {
					this.showOldprize = true
				}
				uni.removeStorageSync('invitePhone')
				// uni.hideLoading()
				// console.log('我是老会员绑定之后', response)
			},
			//绑定新会员
			async bindingNew(userInfo) {
				const {
					phone
				} = userInfo
				const response = await this.getNewInvite({
					activityId: this.indexData.userBindConfigDO.id,
					invitationPhone: uni.getStorageSync('invitePhone') ? uni.getStorageSync('invitePhone') :
						null,
					type: null,
					userPhone: phone
				})
				// uni.hideLoading()
				// console.log('绑定新会员成功', response)
				if (response.code == 200) this.sendNewMemberMessage()
			},
			//新会员绑定后发送消息
			async sendNewMemberMessage() {
				let status = 'fx' + this.indexData.userBindConfigDO.id
				const response = await this.sendMiniMessage({
					activityId: this.indexData.userBindConfigDO.id,
					//邀请人的手机
					invitationPhone: uni.getStorageSync('invitePhone') ? uni.getStorageSync('invitePhone') :
						null,
					// invitationPhone: 'bEGA5WKzyjPg0D0QbiTkqw==',
					type: `pages/activity/invite/index?fromService=fromService&inviteStatus=${status}`,
					userPhone: null
				})
				uni.removeStorageSync('invitePhone')
				// console.log(response)
			},
			//获取新会员奖励列表
			async getNewMemberPrize(type) {
				const res = await this.getNewMemberPrizeList({
					isShowHide: uni.getStorageSync('inviteStatus')
				})
				if (res.code == 200) {
					//reward rewardShow rewardImage user_rge
					this.backgroundMr = res.data.rewardImage
					let user_rge = []
					let user_jf = [{
						integral: 0
					}]
					let reward = []
					if (res.data.user_rge != null) {
						//新人礼满减券
						user_rge = JSON.parse(JSON.parse(res.data.user_rge).couponList)
						//新人礼积分
						user_jf = [{
							integral: JSON.parse(res.data.user_rge).integral
						}]
					}
					if (res.data.reward != null) {
						//邀新礼
						reward = JSON.parse(res.data.reward)
					}
					//保存新人礼的数组
					let saveNewArr = []
					if (user_rge.length == 0) {
						//没有优惠券
						if (user_jf[0].integral !== 0) {
							saveNewArr = [...user_jf]
						}
					} else if (user_rge.length == 1) {
						if (user_rge[0].couponNum == 1) {
							saveNewArr = [...user_rge]
							if (user_jf[0].integral !== 0) {
								saveNewArr = [...saveNewArr, ...user_jf]
							}
						} else {
							saveNewArr = [...user_rge, ...user_rge]
						}
					} else {
						saveNewArr = [...user_rge].splice(0, 2)
					}
					//要渲染的数据
					this.newMemberPrizeList = [...saveNewArr, ...reward]
					this.newMemberPrizeList.forEach(item => {
						if (item.couponList) item.couponList = JSON.parse(item.couponList)
					})
					if (type == 'GET') {
						// console.log('我是新会员奖励展示', this.newMemberPrizeList)
						// uni.hideLoading()
						this.fromJoin = true
					} else if (type == 'INIT') {
						this.rewardObj = {
							reward: res.data.rewardShow == null ? [] : JSON.parse(res.data.rewardShow),
							receive: [],
							total: 0,
							limit: 1
						}
						// uni.hideLoading()
					}
				}
			},
			//去首页
			toClubIndex() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			//去登录
			toJoin() {
				uni.navigateTo({
					url: '/pages/join/index'
				})
			},

			//获取当前领取奖品
			async getFinish(data) {
				this.getPrizeInfo = data
				// console.log(data)
				this.isShowPrize = true
				this.getIndexData('finishGetPrize')
			},
			//去查看奖励
			toSeePrize(prizeInfo) {
				const {
					rewardType,
					id
				} = prizeInfo
				let couponId = undefined
				// console.log(prizeInfo)
				couponId = this.receiveListSave.find(function(item) {
					return item.rewardId == id
				}).memberNo
				//rewardType == 2时为积分
				if (rewardType == 2) {
					uni.navigateTo({
						url: '/pages/account/modules/benefit'
					})
				} else {
					uni.navigateTo({
						url: '/pages/coupon/detail?couponId=' + couponId
					})
				}
			},
			//获取当前以及两年后时间
			getNowAndTwoYear() {
				const time = new Date()
				const year = time.getFullYear()
				const yearTwo = parseInt(year) + 2
				const month = time.getMonth() + 1
				const date = time.getDate()
				this.nowTime = `${year}年${month}月${date}日`
				this.twoYearLater = `${yearTwo}年${month}月${date}日`
				// console.log(this.nowTime,this.twoYearLater)
			},
			//获取活动规则
			getRule() {
				// console.log(this.indexData.userBindConfigDO.content)
				const rule =
					`1、分享方式：在此活动页面点击【邀请好友】分享给准备邀请的好友，好友成功注册后即完成爱慕会员邀请活动。
				2、分享者发起分享活动，在活动有效期内邀请好友注册，完成分享活动并达到邀请好友注册数量，即可领取邀请好友专属优惠券或实物兑换券（具体奖励以活动设置为准）。
				3、被分享者通过邀请链接注册成为爱慕会员，即可获得专属导购服务及新人专属好礼。
				4、分享活动进行中，如分享者邀请人数已达上限，则不再获得邀请人奖励，仍可邀请好友参与活动。
				5、可在活动页“查看奖励”或在“我的账户-我的优惠券”中查看获得的邀请奖励。实物兑换券需使用其下单成功才会发货。
				6、同一设备id、用户id只能绑定一张券，同一IP同一收货地址同一收货人视为恶意刷单行为有权取消资格。
				7、针对不正当手段（如作弊、扰乱系统、实施网络攻击等）参与活动的用户，爱慕有权禁止其参与活动并取消获奖资格（如已发放，有权追回）。
				8、最终解释权归爱慕股份有限公司所有`
				// uni.setStorageSync('content', )
				let content = this.indexData.userBindConfigDO.content || rule
				uni.setStorageSync('content', content)
				uni.navigateTo({
					url: `/pages/activity/invite/rule`
				})
			},
			//服务通知权限弹框
			showModalYn() {
				if (uni.getStorageSync('alreadySubscribeMessage')) return false
				this.showModal = true
				// const _this = this
				// const TMPLID = 'KarFydEdLKD4_HI0O3A7s5_WjsxmDbr7JXVe23Z2A7Y'
				// uni.getSetting({
				// 	withSubscriptions: true, //  这里设置为true,下面才会返回mainSwitch
				// 	success: function(res) {
				// 		// console.log(res)
				// 		// 调起授权界面弹窗
				// 		if (res.subscriptionsSetting.mainSwitch) { // 用户打开了订阅消息总开关
				// 			if (res.subscriptionsSetting.itemSettings !=
				// 				null) { // 用户同意总是保持是否推送消息的选择, 这里表示以后不会再拉起推送消息的授权
				// 				let moIdState = res.subscriptionsSetting.itemSettings[TMPLID]; // 用户同意的消息模板id
				// 				// if (moIdState === 'accept') {
				// 				// 	console.log('接受了消息推送');
				// 				// } else if (moIdState === 'reject') {
				// 				// 	console.log("拒绝消息推送");
				// 				// } else if (moIdState === 'ban') {
				// 				// 	console.log("已被后台封禁");
				// 				// }
				// 				if (moIdState) _this.showModal = false
				// 			}
				// 		} else {
				// 			console.log('订阅消息未开启 withSubscriptions: true')
				// 		}
				// 	},
				// 	fail: function(error) {
				// 		console.log(error);
				// 	}
				// })
			},
			//获取拉起服务通知权限
			getServicePermission() {
				const _this = this
				const TMPLID = process.env.NODE_ENV === 'development' ? 'KarFydEdLKD4_HI0O3A7s5_WjsxmDbr7JXVe23Z2A7Y' :
					'5V-jOqqs_9WPyhkdusoGekHUBg5rr5KYFF19ExBDDh4'
				// console.log(TMPLID)
				uni.requestSubscribeMessage({
					tmplIds: [TMPLID],
					success(res) {
						// console.log(res)
						// if (res.errMsg == 'requestSubscribeMessage:ok' && res[
						// 		TMPLID] == 'accept') {
						// 	_this.showModal = false
						// }
						uni.setStorageSync('alreadySubscribeMessage', true)
						_this.showModal = false
					},
					fail(err) {
						console.log(err)
						uni.showToast({
							title: 'requestSubscribeMessage失败',
							duration: 2000,
							icon: 'none'
						})
						_this.showModal = false
					}
				})
			},
			//获取屏幕高度
			getPhoneScreenHeight() {
				const _this = this
				uni.getSystemInfo({
					success: function(res) {
						const {
							windowHeight
						} = res
						// console.log(res)
						if (800 < windowHeight) {
							_this.topHeight = '280rpx'
							_this.smallHeight = '550rpx'
						} else if (700 < windowHeight && windowHeight <= 800) {
							_this.topHeight = '290rpx'
							_this.smallHeight = '530rpx'
						} else if (650 < windowHeight && windowHeight <= 700) {
							_this.topHeight = '250rpx'
						} else if (600 < windowHeight && windowHeight <= 650) {
							_this.topHeight = '250rpx'
							_this.smallHeight = '450rpx'
						} else {
							_this.topHeight = '250rpx'
							_this.smallHeight = '420rpx'
						}
					}
				});
			},
			//摁扭置灰奖品领完了
			showModalNp() {
				uni.showToast({
					title: '活动已结束',
					duration: 2000,
					icon: 'none'
				})
			},
			//设置裂变活动埋点
			getNewPrize: debounce(function() {
				const params = {
					activeId: uni.getStorageSync('inviteStatus').substr(2),
					invitePhone: uni.getStorageSync('invitePhone'),
					type: "ONE",
					userWx: this.userInfo.id
				}
				this.GETBURIEDPOINT(params)
				this.getBuriedPoint(params)
				this.showNewPrize = true
				// console.log('邀请人手机', uni.getStorageSync('invitePhone'))
				// console.log('被邀请人wx', this.userInfo.id)
				// console.log('活动id', uni.getStorageSync('inviteStatus').substr(2))
			}, 300)
		},
		computed: {
			...mapState('login', ['userInfo', 'loginState']),
			...mapGetters('login', ['isLogin']),
			...mapState('invite', ['buriedData']),
		},
		filters: {
			transformDate(time) {
				// console.log(time)
				const year = time.substr(0, 4) + '年'
				const month = time.substr(5, 2) + '月'
				const day = time.substr(8, 2) + '日'
				return (year + month + day)
			}
		},
		onShareAppMessage(res) {
			let {
				id,
				phone
			} = this.userInfo || {
				id: undefined,
				phone: undefined
			}
			phone = encodeURIComponent(phone)
			const status = 'fx' + this.indexData.userBindConfigDO.id
			console.log(phone, id, status)
			return {
				title: this.indexData.userBindConfigDO.friendsTitle == null ? 'club裂变活动' : this.indexData.userBindConfigDO
					.friendsTitle,
				imageUrl: this.indexData.userBindConfigDO.friendsBg == null ?
					'https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1616037395714.png' : this
					.indexData.userBindConfigDO.friendsBg,
				path: `/pages/activity/invite/index?invitePhone=${phone}&inviteUserId=${id}&inviteStatus=${status}`
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import '@/styles/activity/invite/index.scss'
</style>
