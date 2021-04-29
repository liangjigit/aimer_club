<template>
	<view>
		<view class="wrapper" v-show="isShow&&pupop" @touchmove.stop.prevent="moveHandle">
			<view class="bg-mask flex align-center justify-center">
				<view class="card flex flex-direction align-center">
					<!-- popup数据存在image -->
					<button v-if="pupop.image&&!isDefault" @click="getSelfInfo" class="btn">
						<image :src="pupop.image" mode="aspectFill"></image>
					</button>
					<view class="bg-white flex flex-direction align-center" v-else>
						<view class="title-img">
							<image src="/static/index/login.png" mode="aspectFill"></image>
						</view>
						<text class="title">{{defaultTitle}}</text>
						<text class="money">
							<!-- <text class="num">120</text>
						<text class="unit">元</text> -->
						</text>
						<text class="tip">{{defaultDesc}}</text>
						<button @click="getSelfInfo" class="cu-btn line-red text-red">登录</button>
					</view>
					<view @click="hide" class="cancel-btn" v-if="showHide">
						<image src="/static/close-icon.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
		</view>
		<view v-if="showTopLogin" class="top-login">
			<view class="avatar-top">
				<image src="/static/index/sign_2.png" mode="widthFix" style="width: 80rpx;"></image>
				<image src="/static/index/sign_1.png" mode="widthFix" class="sign1"></image>
			</view>
			<view class="login-text">
				<image src="/static/index/sign_3.png" mode="widthFix" style="width: 312rpx;"></image>
			</view>
			<view class="login-sign" @click="getSelfInfo">
				<image src="/static/index/sign_4.png" mode="widthFix" style="width: 160rpx;"></image>
				<image src="/static/index/sign_5.png" mode="widthFix" class="sign5"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions,
		mapMutations,
		mapGetters
	} from 'vuex'
	import {
		navigatorToPage
	} from '@/common/index.js'
	import {
		doPupopClickStatistics
	} from '@/common/statistics.js'
	export default {
		props: {
			isDefault: Boolean,
			defaultTitle: {
				type: String,
				default: "请先登录"
			},
			defaultDesc: {
				type: String,
				default: "以便我们为您提供更好的服务"
			}
		},
		data() {
			return {
				showHide: true,
				showTopLogin: false
			}
		},
		computed: {
			...mapState('login', ['userInfo', 'isShowLogin', 'pupop', 'redirectUrl']),
			...mapGetters('login', ['isLogin']),
			isShow() {
				//isLogin记录当前登录状态
				if (this.isLogin) {
					this.checkJoinState()
					if (!this.pupop) {
						this.getLoginPopup({})
					}
				}
				//isLogin为false且isShowLogin为true 当前用户未登录且显示登录弹窗 
				return !this.isLogin && this.isShowLogin
			}
		},
		methods: {
			...mapActions('login', ['onGetUserInfo', 'getLoginPopup']),
			...mapMutations('login', ['GETLOGINPOPUP', 'GETREDIRECTURL']),
			//查看是否登录
			async checkLogin(fromWhere) {
				//isLogin为true代表已成功调用wx/login接口登录
				if (!this.isLogin) {
					//获取popup数组 /content/miniapp/home/popup 且popup获取到了值
					await this.getLoginPopup({})
					if (uni.getStorageSync('saveUserProfile')) {
						//如果存在用户数据就不显示弹窗了
						this.login()
					} else {
						//参数为tabBar不需要弹窗
						if (fromWhere == 'tabBar') {
							this.showTopLogin = true
						} else {
							//如果未显示弹窗
							if (!this.isShowLogin) {
								if (fromWhere == 'FL') this.showHide = false
								//显示弹窗
								this.GETLOGINPOPUP()
								uni.hideLoading()
							}
						}
					}
					return false
				} else {
					this.checkJoinState()
				}
				return true
			},
			//当前是登录状态，看是否注册club,getPhone为true则未注册
			checkJoinState() {
				const token = uni.getStorageSync('token');
				const getPhone = uni.getStorageSync('getPhone');
				//未注册
				if (token && getPhone) {
					if (uni.getStorageSync('invitePhone')) {
						//被邀请进入的新会员
						this.$emit('getNewPrize')
					} else {
						uni.redirectTo({
							url: '/pages/join/index'
						})
					}
				}
			},
			//获取个人资料
			getSelfInfo() {
				const _this = this
				wx.getUserProfile({
					desc: '用于登录当前小程序', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (infoRes) => {
						let {
							userInfo
						} = infoRes;
						//微信登录
						uni.setStorageSync('saveUserProfile', userInfo)
						//微信登录
						_this.login()
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			//未登陆时登录
			login() {
				const {
					id
				} = this.pupop
				if (id) {
					doPupopClickStatistics({
						id
					}) // 数据统计
				}
				//通过onGetUserInfo方法，获取到getPhone，如果getPhone为true，则跳转注册页面
				this.onGetUserInfo().then((response) => {
					if (response.code == 200) {
						//关闭弹窗
						this.showPopup = false
						this.showTopLogin = false
						// 判断需要重定向的页面是否是当前页
						if (this.redirectUrl) {
							const pages = getCurrentPages();
							const page = pages[pages.length - 1];
							let {
								url,
								type
							} = this.redirectUrl
							const isCurrentPage = url.includes(page.route)
							if (!isCurrentPage) {
								navigatorToPage(url, type, null, null, true)
							}
						} else if (id) {
							const {
								linkType,
								linkUrl,
								miniappId,
								displayPage
							} = this.pupop
							navigatorToPage(linkUrl, linkType, miniappId, displayPage)
						}
						//获取getPhone 为false则代表已经注册过
						const getPhone = uni.getStorageSync('getPhone');
						if (!getPhone) {
							//重定向路径为空
							this.GETREDIRECTURL({
								redirectUrl: null
							})
							uni.showToast({
								title: "欢迎回来！",
								icon: "none"
							})
							//好友分裂活动的判断
							if (uni.getStorageSync('fromService') || uni.getStorageSync('inviteStatus') !== '') {
								console.log('我进入了裂变活动登录的判断')
								//被邀请进入的老会员
								this.$emit('reGetInfo')
							}
						}
					}
				}).catch((error) => {
					this.showPopup = true
					let {
						errMsg
					} = error;
					console.error(errMsg)
				})
			},
			//关闭登录框
			hide() {
				this.GETLOGINPOPUP()
			},
			//移动屏幕
			moveHandle() {},
		}
	}
</script>

<style lang="scss" scoped>
	.top-login {
		position: fixed;
		z-index: 999;
		top: 0;
		width: 100%;
		height: 100rpx;
		background-color: rgba(255, 255, 255, 1);
		display: flex;
		box-shadow: 0 0 3rpx #bfbfbf;

		.avatar-top {
			position: relative;
			left: 40rpx;
			top: 10rpx;
			width: 80rpx;
			height: 80rpx;

			.sign1 {
				width: 39rpx;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
		}

		.login-text {
			width: 312rpx;
			height: 29rpx;
			position: relative;
			top: 35rpx;
			left: 100rpx;
		}

		.login-sign {
			position: absolute;
			right: 40rpx;
			top: 25rpx;
			width: 160rpx;
			height: 50rpx;

			.sign5 {
				width: 124rpx;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}

	.wrapper {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		z-index: 2;

		.bg-mask {
			width: 100%;
			height: 100%;
			background-color: transparent;
		}
	}

	.card {
		z-index: 3;
		width: 512upx;
		height: 592upx;
		position: relative;
		margin-top: -120rpx;

		.bg-white {
			width: 100%;
			height: 100%;
			border-radius: 5px;
		}

		.btn {
			width: 100%;
			height: 100%;
			padding: 0;
			background-color: transparent;
			overflow: hidden;

			&::after {
				border-width: 0;
			}

			image {
				width: 100%;
				height: 100%;
			}
		}

		.cancel-btn {
			position: absolute;
			left: 50%;
			margin-left: -33upx;
			bottom: -90upx;
			font-size: 70upx;
			width: 66upx;
			height: 66upx;

			image {
				width: 100%;
				height: 100%;
			}

		}

		.title {
			font-size: 30upx;
			font-weight: 600;
			color: #111111;
			margin-bottom: 49upx;
		}

		.money {
			margin-bottom: 40upx;

			.num {
				font-size: 66upx;
				font-weight: 600;
				color: #EC2C5A;
				margin-right: 22upx;
			}

			.unit {
				font-size: 36upx;
				font-weight: 400;
				color: #111111;
			}
		}

		.tip {
			margin-bottom: 100upx;
			line-height: 1;
		}

		.cu-btn {
			width: 302upx;
			height: 80upx;
			box-shadow: 0upx 0upx 15upx 0upx rgba(187, 0, 52, 0.17);
			font-weight: 500;
			font-size: 30rpx;

			&::after {
				border: 3px solid rgba(236, 44, 90, 1);
				border-radius: 10px;
			}
		}

		.title-img {
			width: 100%;
			height: 76upx;
			margin-bottom: 100upx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
