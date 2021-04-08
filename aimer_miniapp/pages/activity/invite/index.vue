<template>
	<view id="invite">
		<view style="width: 100%;height: 100%;position: fixed;z-index: 1000;" v-if="showModal"
			@click="getServicePermission"></view>
		<login-pupop ref="login" @reGetInfo="inviteOld" @getNewPrize="showNewPrize = true">
		</login-pupop>
		<image class="background"
			:src="indexData.userBindConfigDO.themeBg ? indexData.userBindConfigDO.themeBg : 'https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1614670402293.jpg'"
			mode="scaleToFill"></image>
		<header v-if="isShowInvite">
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
			</view>
			<view v-else>
				<text style="color: #ffffff;font-weight: bolder;">当前没有活动正在进行中</text>
			</view>
			<view>
				<count-down ref="countDown" :startTimes="startTime" :endTimes="endTime" v-if="endTime != 0">
				</count-down>
			</view>
		</main>
		<footer>
			<view class="top">
				<view class="header">邀新奖励</view>
				<view class="title">您已邀请<text
						style="color: #ffffff;">{{rewardObj.total == undefined ? 0 : rewardObj.total}}</text>人，邀请好友越多，奖励越多
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
				<image src="/static/index/newJoin.png" mode="widthFix" style="height: 100%;"></image>
				<ul>
					<!-- DJQ:满减券 LPQ:礼品券 -->
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
						<template v-else-if="item.type == 'LPQ' || item.rewardType == 3">
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
						</template>
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
				isShowInvite: false
			}
		},
		onHide() {
			uni.hideLoading()
			uni.removeStorageSync('clubIn')
			console.log('我走了onHide')
		},
		onUnload() {
			uni.removeStorageSync('inviteStatus')
			console.log('我走了onUnload')
		},
		onLoad(options) {
			let {
				//奖励标识 目前FL固定
				inviteType,
				//活动的状态 0隐藏 1显示
				inviteStatus,
				//邀请人id
				inviteUserId,
				//邀请人手机号
				invitePhone,
				//从服务通知进入
				fromService,
				//是否从club进入
				clubIn
			} = options
			//是否从club进入
			if (clubIn) uni.setStorageSync('clubIn', true)
			//保存活动的状态
			if (inviteStatus != undefined) {
				uni.setStorageSync('inviteStatus', inviteStatus)
			} else {
				if (!uni.getStorageSync('inviteStatus')) uni.setStorageSync('inviteStatus', 1)
			}
			//保存邀请人的id
			if (inviteUserId) {
				this.GETINVITEUSERID({
					inviteUserId
				})
			}
			//保存邀请人的加密手机号
			if (invitePhone != undefined) {
				invitePhone = decodeURIComponent(invitePhone)
				uni.setStorageSync('invitePhone', invitePhone)
			}
			//从服务通知进入场景
			if (fromService) uni.setStorageSync('fromService', true)
		},
		onShow() {
			const _this = this
			_this.getNowAndTwoYear()
			uni.showLoading({
				title: '加载中',
				mask: true,
			})
			//判断是否登陆
			if (_this.isLogin) {
				console.log(222, '我有个人资料缓存')
				_this.isShowInvite = true
				_this.getIndexData()
			} else {
				console.log(333, '我没有个人资料缓存')
				_this.isShowInvite = false
				_this.getNewMemberPrize('INIT')
				_this.$refs.login.checkLogin('fromFL')
			}
		},
		methods: {
			...mapActions('invite', ['getActiveIndex', 'getOldInvite', 'getNewInvite', 'sendMiniMessage',
				'getNewMemberPrizeList'
			]),
			...mapActions('login', ['onGetUserInfo']),
			...mapMutations('login', ['GETINVITEUSERID']),
			//获取页面数据
			async getIndexData() {
				//如果不是导购且进入的是隐藏活动则跳回首页
				if (this.userInfo.isGuide != 1 && uni.getStorageSync('inviteStatus') == 0 && !uni.getStorageSync(
						'invitePhone')) {
					uni.switchTab({
						url: '/pages/index/index'
					})
					return false
				}
				const res = await this.getActiveIndex({
					isShowHide: uni.getStorageSync('inviteStatus')
				})
				if (res.code == 200) {
					console.log('我是奖品的数据',res.data)
					this.indexData = res.data
					this.endTime = res.data.userBindConfigDO.endTime
					this.startTime = res.data.userBindConfigDO.startTime
					this.rewardObj = {
						reward: res.data.rewardList,
						receive: res.data.receiveList,
						total: res.data.totalCount,
						limit:res.data.userBindConfigDO.timeLimit
					}
					//从club进入且是导购 或者通过太阳码进入只存在inviteStatus
					if (uni.getStorageSync('clubIn') || (uni.getStorageSync('inviteStatus') == 0 && !uni
							.getStorageSync('invitePhone'))) {
						if (this.userInfo.isGuide == 1) {
							this.bindingOld(this.userInfo)
						}
						uni.removeStorageSync('clubIn')
						uni.hideLoading()
						return false
					}
					//邀请老会员进入
					if (!uni.getStorageSync('fromJoin') && uni.getStorageSync('invitePhone')) {
						await this.bindingOld(this.userInfo)
						return false
					}
					//如果是新会员，fromjoin为true
					if (uni.getStorageSync('fromJoin') && uni.getStorageSync('invitePhone')) {
						uni.removeStorageSync('fromJoin')
						console.log('我是新会员')
						this.getNewMemberPrize('GET')
						this.bindingNew(this.userInfo)
						return false
					}
					uni.hideLoading()
				} else if (res.code == 500) {
					this.noActivity = true
				} else if (res.code == 2009) {
					uni.redirectTo({
						url: '/pages/join/index'
					})
				}
			},
			//绑定老会员
			async bindingOld(userInfo) {
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
					this.showOldprize = false
					setTimeout(async function() {
						// console.log('我是id',uni.getStorageSync('indexDataId'))
						await _this.getOldInvite({
							activityId: uni.getStorageSync('indexDataId'),
							invitationPhone: null,
							type: null,
							userPhone: phone
						})
						uni.removeStorageSync('indexDataId')
					}, 5000)
				}
				uni.hideLoading()
				console.log('我是老会员绑定之后', response)
			},
			//老会员被邀重新登陆进入后
			async inviteOld() {
				//如果不是导购且进入的是隐藏活动则跳回首页
				if (this.userInfo.isGuide != 1 && uni.getStorageSync('inviteStatus') == 0 && !uni.getStorageSync(
						'invitePhone')) {
					uni.switchTab({
						url: '/pages/index/index'
					})
					return false
				}
				const res = await this.getActiveIndex({
					isShowHide: uni.getStorageSync('inviteStatus')
				})
				if (res.code == 200) {
					console.log(res.data)
					this.indexData = res.data
					this.endTime = res.data.userBindConfigDO.endTime
					this.startTime = res.data.userBindConfigDO.startTime
					this.rewardObj = {
						reward: res.data.rewardList,
						receive: res.data.receiveList,
						total: res.data.totalCount,
						limit:res.data.userBindConfigDO.timeLimit
					}
					//从服务通知进来的不需要再进行老会员绑定了
					if (uni.getStorageSync('fromService')) {
						uni.removeStorageSync('fromService')
						return false
					}
					this.showOldprize = true
					this.isShowInvite = true
					await this.bindingOld(this.userInfo)
				}
			},
			//绑定新会员
			async bindingNew(userInfo) {
				const {
					phone
				} = userInfo
				// console.log(userInfo)
				const response = await this.getNewInvite({
					activityId: this.indexData.userBindConfigDO.id,
					invitationPhone: uni.getStorageSync('invitePhone') ? uni.getStorageSync('invitePhone') :
						null,
					type: null,
					userPhone: phone
				})
				console.log('绑定新会员成功', response)
				if (response.code == 200) this.sendNewMemberMessage()
			},
			//新会员绑定后发送消息
			async sendNewMemberMessage() {
				const response = await this.sendMiniMessage({
					activityId: this.indexData.userBindConfigDO.id,
					//邀请人的手机
					invitationPhone: uni.getStorageSync('invitePhone') ? uni.getStorageSync('invitePhone') :
						null,
					// invitationPhone: 'bEGA5WKzyjPg0D0QbiTkqw==',
					type: 'pages/activity/invite/index?fromService=fromService',
					userPhone: null
				})
				console.log(response)
			},
			//获取新会员奖励列表
			async getNewMemberPrize(type) {
				const res = await this.getNewMemberPrizeList({
					// activeId: this.indexData.userBindConfigDO.id
					activeType: 'FL',
					isShow: uni.getStorageSync('inviteStatus')
				})
				if (res.code == 200) {
					let reward = JSON.parse(res.data.reward)
					let user_rge = JSON.parse(JSON.parse(res.data.user_rge).couponList)
					this.newMemberPrizeList = [...user_rge, ...reward]
					this.newMemberPrizeList.forEach(item => {
						if (item.couponList) item.couponList = JSON.parse(item.couponList)
					})
					if (type == 'GET') {
						// this.newMemberPrizeList = [this.newMemberPrizeList[0],this.newMemberPrizeList[1]]
						this.newMemberPrizeList = this.newMemberPrizeList.splice(0, 3)
						uni.hideLoading()
						this.fromJoin = true
					} else if (type == 'INIT') {
						this.rewardObj = {
							reward: JSON.parse(res.data.rewardShow),
							receive: [],
							total: 0,
							limit:1
						}
						uni.hideLoading()
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
				const res = await this.getActiveIndex({
					isShowHide: uni.getStorageSync('inviteStatus')
				})
				if (res.code == 200) {
					console.log(res.data)
					this.indexData = res.data
					this.endTime = res.data.userBindConfigDO.endTime
					this.startTime = res.data.userBindConfigDO.startTime
					this.rewardObj = {
						reward: res.data.rewardList,
						receive: res.data.receiveList,
						total: res.data.totalCount,
						limit:res.data.userBindConfigDO.timeLimit
					}
				}
			},
			//去查看奖励
			toSeePrize() {
				uni.navigateTo({
					url: '/pages/account/benefit'
				})
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
				uni.setStorageSync('content', this.indexData.userBindConfigDO.content)
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
				const TMPLID = 'KarFydEdLKD4_HI0O3A7s5_WjsxmDbr7JXVe23Z2A7Y'
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
						console.log(err + 'requestSubscribeMessage失败')
					}
				})
			}
		},
		computed: {
			...mapState('login', ['userInfo', 'loginState']),
			...mapGetters('login', ['isLogin']),
			// countDownChange(){
			// 	return this.$refs.countDown.surplus
			// }
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
			const status = uni.getStorageSync('inviteStatus')
			return {
				title: this.indexData.userBindConfigDO.friendsTitle == null ? '好友分裂活动' : this.indexData.userBindConfigDO
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
	#invite {
		.cancel-award {
			position: absolute;
			left: 50%;
			margin-left: -33upx;
			bottom: 15%;
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
			top: 0;
			right: 23rpx;
			font-size: 70rpx;
			width: 40rpx;
			height: 40rpx;
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
			position: fixed;
			-webkit-transform: translateZ(0);
			overflow: hidden;
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
			height: 35%;
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
					font-weight: Regular;
					// width: 155px;
					// height: 39px;
					font-family: FZLanTingHeiS-DB1-GBK;
					line-height: 95rpx;
				}

				.title {
					// margin-top: 6rpx;
					// width: 426px;
					// height: 22px;
					font-size: 22rpx;
					font-family: FZLanTingHei-R-GBK;
					font-weight: 400;
					color: #010101;
					// line-height: 95rpx;
					letter-spacing: 2rpx;
				}
			}

			.footer {
				// position: absolute;
				width: 90%;
				height: 66%;
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
				width: 550rpx;
				height: 300rpx;
				border-radius: 20rpx;
				overflow: hidden;

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
						font-size: 36rpx;
						font-family: FZLanTingHeiS-B-GB;
						font-weight: 400;
						color: #FFFFFF;
						line-height: 48rpx;
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

							.right-10 {
								font-size: 28rpx;
								height: fit-content;
								width: 280rpx;
								font-weight: 400;
								color: #F52F48;
								margin-top: 20rpx;
								text-overflow: ellipsis;
								overflow: hidden;
								white-space: nowrap;
							}

							.award-right-top {
								font-family: FZLanTingHeiS-B-GB;
								width: 100%;
								height: 60%;
								// background: rgba(0,0,0,.6);
								color: #F52F48;
								font-size: 40rpx;
								font-weight: 400;
								display: flex;
								align-items: flex-end;
								padding-left: 20rpx;
							}

							.award-right-bottom {
								font-size: 14rpx;
								font-family: FZLanTingHei-R-GBK;
								font-weight: 400;
								color: #707070;
								line-height: 48rpx;
								width: 100%;
								height: 14rpx;
								position: absolute;
								bottom: 15rpx;
								display: flex;
								justify-content: center;
								align-items: center;
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
