<template>
	<view>
		<view class="loginBox flex align-center" v-if="!isLogin" @click="GETLOGINPOPUP">
			<image src="/static/default-avatar.png" mode="aspectFill"></image>
			<view class="text">请先登录！</view>
		</view>
		<view class="loginBox flex align-center" v-else-if="userInfo">
			<image :src="userInfo.avatarUrl||'/static/default-avatar.png'" mode="aspectFill" @click="showGuidePopup">
			</image>
			<view class="text flex-sub">Hi {{userInfo.nickName||""}}</view>
			<view class="integral flex align-center">
				<text class="num">{{userInfo.currentIntegral}}</text>
				<text class="unit">积分</text>
				<button class="cu-btn round" @click="goIntegral">
					<text class="margin-right-xs">如何赚积分</text>
					<text class="cuIcon-question"></text>
				</button>
			</view>
		</view>
		<view class="flex justify-center" v-if="banners.length>0">
			<swiper class="banner card-swiper" next-margin="100rpx" :circular="true" :interval="5000" :duration="500"
				:autoplay="true" easing-function="linear" @change="bannerSwiper">
				<swiper-item v-for="(item,index) in banners" :key="index" :class="{cur:currentBanner==index}">
					<view class="swiper-item" @click="linkToPage(item,'banner')">
						<image :src="item.image" mode="aspectFill"></image>
						<view class="title text-cut" v-show="item.titleDisplay">
							{{item.title}}
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="cu-list grid col-4 no-border" v-if="menuList.length>0">
			<view class="cu-item align-center" v-for="(item,index) in menuList" :key="index"
				@click="linkToPage(item,0)">
				<view class="icon">
					<image :src="item.image" mode="aspectFit"></image>
				</view>
				<text>{{item.menuName}}</text>
			</view>
		</view>
		<view class="image-link text-center" v-if="singleImage">
			<image :src="singleImage.image" @click="linkToPage(singleImage,2)" class="image" mode="aspectFit"></image>
		</view>
		<!-- <view style="padding-top: 28upx;padding-left: 10upx;">
		  	<title :name="'玩转积分'">
			  <template>
					<view class="action" @click="goIntegral">
						<text>更多</text>
						<text class="cuIcon-right"></text>
					</view>
			  </template>
		  	</title>
		  </view> -->
		<view class="flex justify-center" style="padding-top: 22upx;">
			<view class="bg flex flex-direction">
				<image src="/static/index/welcome.png" class="welcome" mode="aspectFit"></image>
				<view class="join-data flex flex-direction">
					<text class="num">{{trainingCount}}</text>
					<text class="text">名小伙伴已经开始训练啦！</text>
				</view>
				<view class="flex justify-center">
					<image src="/static/index/try-btn.png" class="join-btn" mode="aspectFit" @click="goTrainig"></image>
				</view>
			</view>
			<view class="right-block flex flex-direction justify-between">
				<view class="btn flex flex-direction justify-center align-center" v-for="(item,index) in windowList"
					:key="index" @click="linkToPage(item,1)">
					<image :src="item.image" class="btn-icon" mode="aspectFit"></image>
					<text>{{item.menuName}}</text>
				</view>
			</view>
		</view>
		<view id="cup-box" class="padding-left-xs" style="padding-top: 90upx;">
			<title :name="'CUP有料'"></title>
		</view>
		<view class="banner-lg margin-top-lg flex justify-center" style="padding-top: 22upx;">
			<image src="/static/index/cup-banner.png" mode="aspectFit"></image>
		</view>
		<view class="flex justify-center">
			<swiper class="tutor card-swiper" previous-margin="230rpx" next-margin="230rpx" :interval="3000"
				:duration="500" :circular="true" :autoplay="true" @change="tutorSwiper">
				<swiper-item v-for="(item,index) in experts" :key="item.id" :class="{cur:currentCur==index}">
					<view class="swiper-item">
						<image :src="item.expertPhoto" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="line"></view>
		<view class="padding-lr select-sign-title">根据标签，筛选您感兴趣的小技能</view>
		<scroll-view scroll-x="true" enable-flex="true" style="height:106upx" class="scroll-view_H">
			<button class="cu-btn round line-black margin-right-sm" :class="{current:selectedTagsId == 0}"
				@click="changeTags(0)">全部</button>
			<button class="cu-btn round line-black margin-right-sm" :class="{current:selectedTagsId == item.id}"
				@click="changeTags(item.id)" v-for="(item,index) in tags" :key="item.id">{{item.tagsName}}</button>
		</scroll-view>
		<view class="flex flex-direction align-center padding-top-xs">
			<list-item-like :list="list" :isShowNew="true" @click="goCupDetail" @doCollect="collect"></list-item-like>
		</view>
		<view class="margin-bottom-lg" v-if="isEmpty">
			<empty-page v-if="isEmpty" :image-height="'0px'" :top="'0px'" :noContent="'持续更新中，敬请期待~'"></empty-page>
		</view>
		<load-more :isLoad="isLoading" :isShow="!isEmpty"></load-more>
		<login-pupop ref="login" @phoneIsFalse="isShowMarketing=true"></login-pupop>
		<!-- 导购海报弹窗 -->
		<guide-popup ref="guidePopup"></guide-popup>
		<!-- 营销弹窗 -->
		<marketing @hideMarket="isShowMarketing=false" v-show="isShowMarketing"></marketing>
	</view>
</template>

<script>
	import listItemLike from '@/pages/components/list-item/list-item-like.vue'
	import title from '@/pages/components/title-bar/title.vue'
	import emptyPage from '@/pages/components/empty/empty.vue'
	import loadMore from '@/pages/components/footer/loadMore.vue'
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from 'vuex'
	import {
		navigatorToPage
	} from '@/common/index.js'
	import {
		doBannerStatistics,
		doNavStatistics
	} from '@/common/statistics.js'
	import {
		guidePopup
	} from '@/pages/components/popup/guide-popup.vue'
	import marketing from '@/pages/components/marketing/marketing.vue'
	const Model = 1; // cup 有料
	export default {
		components: {
			title,
			listItemLike,
			emptyPage,
			loadMore,
			guidePopup,
			marketing
		},
		data() {
			return {
				currentCur: 0,
				currentBanner: 0,
				isLoading: false,
				pageIndex: 0,
				experts: [],
				tags: [],
				selectedTagsId: 0,
				onCreated: false,
				isShowMarketing: false
			}
		},
		computed: {
			...mapState('index', ['selector', 'banners', 'singleImage', 'menuList', 'windowList', 'miniProgramShare',
				'trainingCount'
			]),
			...mapState('login', ['userInfo', 'guidecode', 'inviteUserId']),
			...mapState('cup', ['pageNum', 'pageSize', 'totalSize', 'list']),
			...mapGetters('login', ['isLogin']),
			...mapGetters('cup', ['isEmpty']),
			getCup() {
				if (this.isLogin) {
					let isRefresh = true
					this.getCupListForIndex(isRefresh)
				}
				return this.isLogin
			},
			displayCount() {
				return this.experts.length >= 3 ? 3 : this.experts.length
			}
		},
		onLoad(options) {
			// console.log(getApp().globalData.fromJoin)
			// if (getApp().globalData.level) {
			// 	uni.reLaunch({
			// 		url: '/pages/account/benefit?level=lv'
			// 	})
			// }
			// console.log(options)
			// 	guidecode: '', // 如果从小程序卡片进入（导购二维码、关注公众号）、扫门店二维码
			// 	source:'WXC实体店微信', // 来源
			// 	aimerid:'olhZPv-4Tqthr4D104cTsvlTAWyY',
			// 	erpcode:'LB01A004', // 门店编码
			// 	appid:'wx326e67c0d2fd1528',
			// 	inviteUserId:'' // 邀请链接进入 邀请人Id
			//  scene:'' //场景值
			const {
				guidecode,
				source,
				aimerid,
				erpcode,
				appid,
				inviteUserId,
				scene,
			} = options
			const userId = inviteUserId || scene
			//保存到全局vuex
			if (guidecode || source || aimerid || erpcode || appid || userId) {
				this.GETGUIDINFO({
					guidecode,
					source,
					aimerid,
					erpcode,
					appid
				})
				this.GETINVITEUSERID({
					inviteUserId: userId
				})
			}
		},
		onShow() {
			if (this.isLogin) {
				this.isShowMarketing = true
			}
			//删除裂变活动的缓存
			uni.removeStorageSync('inviteStatus')
			this.$refs.login.checkLogin('tabBar')
			if (!this.onCreated) {
				let isRefresh = true
				this.getData(isRefresh)
			} else {
				this.onCreated = false
			}
			if (this.selector) {
				this.$nextTick(() => {
					uni.pageScrollTo({
						selector: this.selector,
						duration: 500,
						complete: () => {
							this.SETSELECTOR({
								selector: null
							})
							// console.log('complete')
						}
					})
				})
			}
		},
		onShareAppMessage(res) {
			const {
				title,
				image
			} = this.miniProgramShare
			const {
				id
			} = this.userInfo || {
				id: undefined
			}
			return {
				title: title,
				imageUrl: image,
				path: '/pages/index/index?inviteUserId=' + id
			}
		},
		created() {
			this.onCreated = true
			this.getData()
			this.GETREDIRECTURL({
				redirectUrl: null
			})
		},
		async onPullDownRefresh() {
			if (this.isLoading) {
				return
			}
			let isRefresh = true
			await this.getData(isRefresh)
			uni.stopPullDownRefresh();
			uni.showToast({
				title: "已刷新",
				icon: "none"
			})
		},
		onReachBottom() {
			if (this.totalSize == this.list.length || this.isLoading) {
				return
			}
			this.isLoading = true
			this.getCupListForIndex()
		},
		methods: {
			...mapActions('login', ['bindWithGuid', 'onGetUserInfo', 'getMyInfo']),
			...mapActions('cup', ['getCupList']),
			...mapActions('index', ['getBanners', 'getNavData', 'getExperts', 'getTags', 'getShareContent',
				'getTrainingCount'
			]),
			...mapActions('accountCollect', ['doCollect']),
			...mapMutations('index', ['SETSELECTOR']),
			...mapMutations('login', ['GETLOGINPOPUP', 'GETGUIDINFO', 'GETINVITEUSERID', 'GETREDIRECTURL']),
			...mapMutations('cup', ['CHANGECOLLECT']),
			...mapActions('invite', ['getActiveIndex']),
			getData(isRefresh) {
				this.getBanners({
					pageId: 1
				}) // 1 表示首页
				this.getNavData({})
				this.getTrainingCount({})
				this.getExpertsForIndex()
				this.getTagsForIndex()
				this.getCupListForIndex(isRefresh)
				// 更新用户信息
				if (this.isLogin) {
					this.getMyInfo({})
				}
				// 小程序分享内容
				this.getShareContent({})

			},
			// 点击头像 获取导购海报
			showGuidePopup() {
				if (this.userInfo.isGuide === 1) {
					this.$refs.guidePopup.init()
				}
			},
			async getTagsForIndex() {
				let response = await this.getTags({})
				if (response.code == 200) {
					this.tags = response.data
				}
			},
			async getExpertsForIndex() {
				let response = await this.getExperts({})
				if (response.code == 200) {
					this.experts = response.data.filter(z => z.expertPhoto)
				}
			},
			async collect(options) {
				const isLogin = await this.$refs.login.checkLogin()
				if (!isLogin) {
					return
				}
				let {
					code,
					isCollect
				} = options
				let response = await this.doCollect({
					modelCode: code,
					model: Model,
					type: Number(isCollect)
				})
				if (response.code == 200) {
					this.CHANGECOLLECT({
						isCollect: !isCollect,
						code
					})
					uni.showToast({
						title: !isCollect ? '收藏成功' : '已取消',
						icon: "none"
					})
				}
			},
			changeTags(id) {
				this.isLoading = true
				this.selectedTagsId = id
				if (!this.isLogin) {
					let isRefresh = true
					this.getCupListForIndex(isRefresh)
				}
			},
			async getCupListForIndex(isRefresh) {
				let pageIndex = isRefresh ? 1 : this.pageNum + 1
				let response = await this.getCupList({
					pageNum: pageIndex,
					pageSize: this.pageSize,
					tagsId: this.selectedTagsId
				})
				this.isLoading = false
			},
			async goIntegral() {
				const isLogin = await this.$refs.login.checkLogin()
				if (!isLogin) {
					return
				}
				uni.navigateTo({
					url: '/pages/integral/index'
				})
			},
			async linkToPage(item, type) { //linkType: 跳转到 1、小程序页面 2 web地址 3 其他小程序
				const isLogin = await this.$refs.login.checkLogin()
				if (!isLogin) {
					return
				}
				if (item.menuName == "训练礼包") {
					uni.showToast({
						title: "精彩礼包正在筹备中，敬请期待~",
						icon: "none",
						duration: 3000
					})
					return
				}
				this.clicksStatistics(type, item.id)
				const {
					bannerUrl,
					linkUrl,
					linkType,
					miniappId,
					displayPage
				} = item
				// console.log(item)
				//如果是去裂变活动的需要判断
				if (bannerUrl && bannerUrl.includes('pages/activity/invite/index')) {
					const res = await this.getActiveIndex({
						isShowHide: '1'
					})
					//data为空时活动时间结束，跳回首页
					if (res.data == null) {
						uni.showToast({
							title: '当前没有活动',
							duration: 2000,
							icon: 'none'
						});
						return false
					}
				}
				navigatorToPage(bannerUrl || linkUrl, linkType, miniappId, displayPage)
			},
			clicksStatistics(type, id) {
				if (type == "banner") { // banner
					doBannerStatistics({
						id
					})
				} else {
					doNavStatistics({
						type,
						id
					})
				}
			},
			showToast(tipText) {
				uni.showToast({
					title: tipText,
					icon: 'none'
				})
			},
			bannerSwiper(e) {
				this.currentBanner = e.detail.current
			},
			tutorSwiper(e) {
				this.currentCur = e.detail.current
			},
			async goCupDetail(options) {
				const isLogin = await this.$refs.login.checkLogin()
				if (!isLogin) {
					return
				}
				let {
					code
				} = options
				uni.navigateTo({
					url: '/pages/cup/detail?code=' + code
				})
			},
			goShoppingGuide() {
				uni.navigateTo({
					url: '/pages/account/shoppingGuide/index'
				})
			},
			goCoupon() {
				uni.navigateTo({
					url: '/pages/coupon/index'
				})
			},
			goTrainig() {
				uni.switchTab({
					url: "/pages/training/index"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.select-sign-title {
		margin-top: 54upx;
		font-weight: 500;
		font-size: 28upx;
		color: #111111;
	}

	.tutor {
		height: 147upx !important;
		margin-top: 40upx;
		margin-bottom: 60upx;
		width: 690upx;

		swiper-item {
			width: 230upx !important;
			padding: 0 4upx;
			height: 100%;
			left: 0;
		}
	}

	.scroll-view_H {
		position: sticky;
		top: 0;
		z-index: 2;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		padding-left: 34upx;
		padding-right: 34upx;
		padding-top: 26upx;
		margin-bottom: 20upx;
		background-color: #FFFFFF;
		box-shadow: 0upx 0.1upx 0upx 0upx rgba(0, 0, 0, 0.02);

		.cu-btn {
			font-weight: 500;
			color: #111111;
			height: 56upx; //60upx;
			line-height: 1;
			font-size: 22upx;
			font-weight: 500;
			padding: 0 20upx;

			&.current {
				color: #FFFFFF;
				background-color: #EC2C5A;
			}

			&.current[class*="line"]::after {
				border-color: #EC2C5A;
			}
		}

		.cu-btn[class*="line"]::after {
			border: 2upx solid #CCCCCC;
		}
	}

	.banner-lg {
		image {
			width: 690upx;
			height: 294upx;
			// border-radius:10upx;
		}
	}

	.line {
		width: 100%;
		height: 20upx;
		background-color: #F9F9F9;
	}

	.right-block {
		margin-left: 30upx;

		.btn {
			width: 170upx;
			height: 164upx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0upx 15upx 60upx 0upx rgba(0, 15, 41, 0.12);
			border-radius: 20upx;

			.btn-icon {
				width: 54upx;
				height: 42upx;
				margin-bottom: 24upx;
			}

			text {
				font-size: 26upx;
				font-weight: 500;
				color: #333333;
			}
		}
	}

	.bg {
		width: 470upx;
		height: 554upx;
		background-color: rgba(255, 255, 255, 1);
		box-shadow: 0upx 15upx 60upx 0upx rgba(0, 15, 41, 0.12);
		background-image: url(../../static/index/training-bg.png);
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		border-radius: 20upx;
		padding-top: 100upx;

		.welcome {
			width: 223upx;
			height: 59upx;
			margin-bottom: 72upx;
			margin-left: 35upx;
		}

		.join-data {
			color: #45536F;
			margin-bottom: 71upx;
			padding-left: 40upx;

			.num {
				font-size: 75upx;
				font-weight: 500;
				margin-bottom: 15upx;
				font-style: italic;
				line-height: 1;
			}

			.text {
				font-size: 30upx;
				font-weight: 500;
				color: #2C3850;
				line-height: 1;
				font-style: italic;
			}
		}

		.join-btn {
			width: 272upx;
			height: 75upx;
		}
	}

	.image-link {
		margin-top: 30upx;
		margin-bottom: 30upx;
		overflow: hidden;
		width: 100%;

		image {
			width: 690upx;
			height: 206upx;
			border-radius: 20upx;
		}
	}

	.action {
		text {
			color: #111111;
			font-size: 24upx;
			font-weight: 400;
			line-height: 1;
		}
	}

	.cu-bar .action>text[class*="cuIcon-"],
	.cu-bar .action>view[class*="cuIcon-"] {
		font-size: 30upx;
		color: #999999;
	}

	.cu-list.grid.no-border>.cu-item {
		padding-top: 0;
		padding-bottom: 0;
	}

	.cu-list {
		&.grid {
			&.no-border {
				padding-top: 0;
				padding-bottom: 30upx;
				margin-top: 10upx;
			}
		}

		.cu-item {
			font-size: 26upx;
			font-weight: 400;
			color: #111111;
			padding: 0;

			.icon {
				width: 120upx;
				height: 120upx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			text {
				color: #111111;
				font-size: 26upx;
				line-height: 1;
			}
		}
	}

	.banner {
		height: 320upx !important;
		// margin-top:40upx;
		// margin-bottom: 60upx;
		width: 750upx !important;

		swiper-item {
			width: 620upx !important;
			height: 240upx !important;
			padding: 0 30upx;
			left: 0upx;
			overflow: initial;

			.swiper-item {
				height: 100%;
				transform: scale(1);
				margin-top: 30upx;
				border-radius: 20upx;
				box-shadow: 0 10upx 45upx 0 rgba(0, 15, 41, 0.12);

				.title {
					background-color: rgba(11, 10, 10, 0.5);
					padding: 16upx;
					color: #FFFFFF;
					font-weight: 500;
					font-size: 26upx;
					position: absolute;
					bottom: 0;
					width: 100%;
					will-change: transform;
				}
			}
		}
	}

	.loginBox {
		padding: 24upx 31upx;

		image {
			width: 70upx;
			height: 70upx;
			background: rgba(201, 201, 201, 1);
			border-radius: 190%;
			margin-right: 26upx;
		}

		.text {
			font-size: 26upx;
			font-weight: 500;
			color: #333333;
		}

		.integral {
			.num {
				font-size: 26upx;
				font-weight: 500;
				color: #333333;
			}

			.unit {
				font-size: 26upx;
				font-weight: 300;
				color: #333333;
				margin-left: 20upx;
			}

			.cu-btn {
				width: 204upx;
				height: 60upx;
				background: linear-gradient(-50deg, rgba(213, 27, 71, 1), rgba(244, 50, 96, 1));
				border-radius: 30upx;
				padding: 0;
				margin-left: 20upx;

				text {
					z-index: 2;
					color: #FFFFFF;
					font-size: 26upx;
					font-weight: 400;
					line-height: 1;
				}
			}
		}
	}
</style>
