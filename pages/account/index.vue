<template>
	<view class="flex align-center flex-direction padding-tb">
		<view class="state-log-out flex align-center" v-if="!isLogin" @click="GETLOGINPOPUP">
			<view class="avatar">
				<image src="/static/default-avatar.png" mode="aspectFill"></image>
			</view>
			<view class="text">
				登录/注册
			</view>
		</view>
		<view class="userinfo flex flex-direction padding" v-else-if="userInfo">
			<view class="flex justify-between" style="margin-bottom: 59upx;">
				<view class="flex align-center">
					<view class="avatar">
						<image :src="userInfo.avatarUrl" mode="aspectFill"></image>
					</view>
					<view class="flex flex-direction">
						<view class="username">{{userInfo.nickName}}</view>
						<view class="flex align-center" v-if="userInfo.level">
							<view class="vip-icon">
								<image src="/static/account/index/level-2.png" mode="aspectFit"
									v-if="userInfo.level == 'JT普卡'"></image>
								<image src="/static/account/index/level-1.png" mode="aspectFit"
									v-if="userInfo.level == 'JT银卡'"></image>
								<image src="/static/account/index/level-3.png" mode="aspectFit"
									v-if="userInfo.level == 'JT金卡'"></image>
								<image src="/static/account/index/level-4.png" mode="aspectFit"
									v-if="userInfo.level == 'JT白金卡'"></image>
								<image src="/static/account/index/level-5.png" mode="aspectFit"
									v-if="userInfo.level == 'JT至尊卡'"></image>
							</view>
							<view class="vip-name">
								{{userInfo.level}}
							</view>
						</view>
					</view>
				</view>
				<view class="tip-box flex justify-center align-center" v-show="showGiftPopup&&showActivity">
					<image src="/static/account/index/gift-box-close.png" class="close-btn" mode="aspectFit"
						@click.stop="hideGiftPopup"></image>
					<image src="/static/account/index/gift-box-icon.png" mode="aspectFit" @click.stop="goBaseInfo">
					</image>
				</view>
				<view class="addressbook" @click="goBaseInfo" v-if="showActivity">
					<!-- <image class="icon-addressbok" src="/static/account/index/addressbook-icon.png" mode="aspectFit"></image> -->
					<image class="icon-addressbok" src="/static/account/index/addressbook-reddot-icon.png"
						mode="aspectFit"></image>
				</view>
			</view>
			<view class="flex justify-between">
				<view class="card-info">
					<text class="text">卡号</text>
					<text class="num">{{userInfo.memberNo||""}}</text>
				</view>
				<view class="card-info">
					<text class="text">积分</text>
					<text class="num">{{userInfo.currentIntegral}}</text>
				</view>
			</view>

		</view>
		<!-- <button open-type="share" class="cu-btn banner-center">
			<image src="/static/account/index/invite.png" mode="aspectFill"></image>
		</button> -->
		<button class="cu-btn banner-center" @click="toClub">
			<!-- <image src="/static/account/index/invite.png" mode="aspectFill"></image> -->
			<image src="https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1620804997379.jpg" mode="aspectFill"></image>
		</button>
		<view class="menu-box flex align-center justify-center">
			<view class="grid col-3">
				<view class="item flex flex-direction align-center justify-center" @click="goBenefit">
					<view class="icon-img">
						<image src="/static/account/index/benefit-icon.png" mode="aspectFit"></image>
					</view>
					<view class="name">
						我的权益
					</view>
				</view>
				<view class="item flex flex-direction align-center justify-center" @click="goTraining">
					<view class="icon-img">
						<image src="/static/account/index/training-icon.png" mode="aspectFit"></image>
					</view>
					<view class="name">
						体态测评
					</view>
				</view>
				<view class="item flex flex-direction align-center justify-center" @click="goCollect">
					<view class="icon-img">
						<image src="/static/account/index/collect-icon.png" mode="aspectFit"></image>
					</view>
					<view class="name">
						我的收藏
					</view>
				</view>
				<view class="item flex flex-direction align-center justify-center" @click="goShop">
					<view class="icon-img">
						<image src="/static/account/index/shop-icon.png" mode="aspectFit"></image>
					</view>
					<view class="name">
						官方商城
					</view>
				</view>
				<view class="item flex flex-direction align-center justify-center" @click="goLiveRoom">
					<view class="icon-img">
						<image src="/static/account/index/live-room-icon.png" mode="aspectFit"></image>
					</view>
					<view class="name">
						直播间
					</view>
				</view>
				<view class="item flex flex-direction align-center justify-center" @click="goCarmi">
					<view class="icon-img">
						<image src="/static/account/index/carmi-icon.png" mode="aspectFit"></image>
					</view>
					<view class="name">
						电子券卡密
					</view>
				</view>
				<view class="item flex flex-direction align-center justify-center" @click="goStoreNav">
					<view class="icon-img">
						<image src="/static/account/index/nav-icon.png" mode="aspectFit"></image>
					</view>
					<view class="name">
						门店导航
					</view>
				</view>
				<view class="item flex flex-direction align-center justify-center" @click="showContactService">
					<view class="icon-img">
						<image src="/static/account/index/cantact-icon.png" mode="aspectFit"></image>
					</view>
					<view class="name">
						联系客服
					</view>
				</view>
				<view class="item flex flex-direction align-center justify-center" @click="goInvoice">
					<view class="icon-img">
						<image src="/static/account/index/invoice-icon.png" mode="aspectFit"></image>
					</view>
					<view class="name">
						电子发票
					</view>
				</view>
			</view>
		</view>
		<load-more :isLoad="false" :isShow="true"></load-more>
		<login-pupop ref="login"></login-pupop>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions,
		mapGetters,
		mapMutations
	} from 'vuex'
	import dialogPopup from '@/pages/components/popup/dialog-pupop.vue'
	import loadMore from '@/pages/components/footer/loadMore.vue'
	import {
		navigatorToPage
	} from '@/common/index.js'
	import login from '@/common/login.js'
	export default {
		onShow() {
			this.showGiftPopup = true
			// this.$refs.login.checkLogin('tabBar')
			if (this.isLogin) {
				this.getMyInfo({})
			}
		},
		mixins: [login],
		components: {
			dialogPopup,
			loadMore
		},
		data() {
			return {
				needWriteInformation: true, // 是否要完善个人资料
				showGiftPopup: true //显示领好礼
			}
		},
		computed: {
			...mapState('login', ['userInfo', 'showActivity']),
			...mapState('index', ['miniProgramShare']),
			...mapGetters('login', ['isLogin'])
		},
		onShareAppMessage() {
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

		methods: {
			...mapMutations('poster', ['GETSHAREINFO']),
			...mapMutations('login', ['GETLOGINPOPUP']),
			...mapActions('login', ['getMyInfo']),
			...mapActions('index', ['getLiveRoom']),
			//去裂变活动
			async toClub() {
				const isLogin = await this.$refs.login.checkLogin()
				if (!isLogin) {
					return
				}
				uni.navigateTo({
					url: '/pages/activity/invite/index?clubIn=clubIn&inviteStatus=1'
				})
			},
			// 跳转到发票
			goInvoice() {
				navigatorToPage('https://m.aimer.com.cn/#/einvoice/list', 2)
			},
			hideGiftPopup() {
				this.showGiftPopup = false //隐藏领取好礼
			},
			// 客服弹窗
			showContactService() {
				uni.showModal({
					title: "联系客服",
					content: "服务时间9:00-22:00",
					confirmText: "拨打电话",
					success(res) {
						if (res.confirm) {
							let phoneNumber = "4006505299"
							uni.makePhoneCall({
								phoneNumber
							})
						}
					}
				})
			},
			// async goInvitePoster(){
			// 	const isLogin = await this.$refs.login.checkLogin()
			// 	if(!isLogin){
			// 		return
			// 	}
			// 	uni.navigateTo({
			// 		url:"/pages/poster/index"
			// 	})
			// },
			async goCarmi() {
				const isLogin = await this.$refs.login.checkLogin()
				if (!isLogin) {
					return
				}
				uni.navigateTo({
					url: '/pages/account/carmi'
				})
			},
			goTraining() {
				uni.switchTab({
					url: '/pages/training/index'
				})
			},
			async goBaseInfo() {
				const isLogin = await this.$refs.login.checkLogin()
				if (!isLogin) {
					return
				}
				uni.navigateTo({
					url: '/pages/account/baseInfo/index'
				})
			},
			async goCollect() {
				const isLogin = await this.$refs.login.checkLogin()
				if (!isLogin) {
					return
				}
				uni.navigateTo({
					url: '/pages/account/collect'
				})
			},
			async goBenefit() {
				const isLogin = await this.$refs.login.checkLogin()
				if (!isLogin) {
					return
				}
				uni.navigateTo({
					url: '/pages/account/benefit'
				})
			},
			async goStoreNav() {
				const isLogin = await this.$refs.login.checkLogin()
				if (!isLogin) {
					return
				}
				uni.navigateTo({
					url: '/pages/account/storeNav/index'
				})
			},
			// 跳转到直播间
			async goLiveRoom() {
				// 获取直播间跳转地址
				let response = await this.getLiveRoom({})
				if (response.code == 200) {
					const {
						miniappId: appId,
						miniappUrl: path
					} = response.data
					uni.navigateToMiniProgram({
						appId,
						path
					})
				}
			},
			// 跳转到商城
			goShop() {
				uni.navigateToMiniProgram({
					appId: 'wx203ab2d5cb638d1d',
					path: '/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tip-box {
		position: absolute;
		right: 120upx;
		top: 67upx;

		.close-btn {
			width: 30upx;
			height: 30upx;
			position: absolute;
			top: -15upx;
			left: -15upx;
			border-radius: 100%;
			z-index: 2;
		}

		image {
			width: 166upx;
			height: 66upx;
		}
	}

	.menu-box {
		width: 690upx;
		height: 550upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx 15upx 60upx 0upx rgba(0, 15, 41, 0.08);
		border-radius: 20upx;

		.icon-img {
			width: 54upx;
			height: 54upx;
			margin-bottom: 26upx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.name {
			font-size: 26upx;
			font-weight: 400;
			color: #111111;
		}

		.grid {
			width: 100%;

			.item {
				padding: 30upx 0;
				position: relative;

				&::after {
					content: "";
					position: absolute;
					right: 0;
					top: 62upx;
					width: 2upx;
					height: 62upx;
					background-color: #DDDDDD;
				}

				&:last-child,
				&:nth-child(3n+0) {
					&::after {
						width: 0;
					}
				}
			}
		}

	}

	.banner-center {
		width: 690upx;
		height: 150upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx 15upx 60upx 0upx rgba(0, 15, 41, 0.12);
		border-radius: 20upx;
		margin-bottom: 54upx;
		overflow: hidden;
		padding: 0;

		image {
			width: 100%;
			height: 100%;
		}

		&::after {
			content: "";
			border: 0px;
		}
	}

	.userinfo {
		width: 690upx;
		height: 278upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx 15upx 60upx 0upx rgba(0, 15, 41, 0.08);
		border-radius: 20upx;
		margin-bottom: 54upx;

		.avatar {
			width: 118upx;
			height: 118upx;
			border-radius: 100%;
			margin-right: 31upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.username {
			font-size: 34upx;
			font-weight: 500;
			color: #111111;
			padding-top: 23upx;
			padding-bottom: 34upx;
			line-height: 1;
		}

		.card-info {
			.text {
				font-size: 26upx;
				font-weight: 400;
				color: #111111;
				margin-right: 18upx;
			}

			.num {
				font-size: 26upx;
				font-weight: 400;
				color: #999999;
			}
		}

		.vip-icon {
			width: 32upx;
			height: 32upx;
			margin-right: 11upx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.vip-name {
			font-size: 30upx;
			font-weight: 400;
			color: #999999;
			line-height: 1;
		}

		.addressbook {
			width: 45upx;
			height: 45upx;
			margin-top: 15upx;

			.icon-addressbok {
				width: 100%;
				height: 100%;
			}
		}
	}

	.state-log-out {
		width: 690upx;
		height: 200upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx 15upx 60upx 0upx rgba(0, 15, 41, 0.08);
		border-radius: 20upx;
		padding: 40upx 30upx;
		margin-bottom: 54upx;

		.avatar {
			width: 120upx;
			height: 120upx;
			background: rgba(201, 201, 201, 1);
			border-radius: 100%;
			overflow: hidden;
			margin-right: 45upx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.text {
			font-size: 34upx;
			font-weight: 500;
			color: #111111;
		}
	}
</style>
