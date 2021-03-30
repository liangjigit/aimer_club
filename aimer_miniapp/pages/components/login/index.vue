<template>
	<view class="wrapper" v-show="isShow&&pupop" @touchmove.stop.prevent="moveHandle">
		<view class="bg-mask flex align-center justify-center">
			<view class="card flex flex-direction align-center">
				<button open-type="getUserInfo" v-if="pupop.image&&!isDefault" @getuserinfo="login"
					withCredentials="false" class="btn">
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
					<button open-type="getUserInfo" @getuserinfo="login" withCredentials="false"
						class="cu-btn line-red text-red">登录</button>
				</view>
				<view @click="hide" class="cancel-btn" v-if="showHide">
					<image src="/static/close-icon.png" mode="aspectFit"></image>
				</view>
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
				showHide:false
			}
		},
		created() {
			if (uni.getStorageSync('invitePhone') || uni.getStorageSync('fromService')) {
				//被邀请进入的老会员
				this.showHide = false
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
				return !this.isLogin && this.isShowLogin
			}
		},
		methods: {
			...mapActions('login', ['onGetUserInfo', 'getLoginPopup']),
			...mapMutations('login', ['GETLOGINPOPUP', 'GETREDIRECTURL']),
			async checkLogin() {
				if (!this.isLogin) {
					//获取popup数组
					await this.getLoginPopup({})
					let _this = this
					uni.getSetting({
						success: function(t) {
							if (!t.authSetting["scope.userInfo"]) {
								if (!_this.isShowLogin) {
									//将isShowLogin更改为true，显示login弹框
									_this.GETLOGINPOPUP()
									uni.hideLoading()
								}
							}
						}
					})
					return false
				} else {
					this.checkJoinState()
				}
				return true
			},
			checkJoinState() {
				const token = uni.getStorageSync('token');
				const getPhone = uni.getStorageSync('getPhone');
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
			login(e) {
				const {
					id
				} = this.pupop
				if (id) {
					doPupopClickStatistics({
						id
					}) // 数据统计
				}
				let {
					errMsg
				} = e.detail
				//获个人信息，用户给了权限 通过open-type=getUserInfo
				if (errMsg == "getUserInfo:ok") {
					let that = this;
					this.onGetUserInfo().then((response) => {
						if (response.code == 200) {
							this.showPopup = false
							if (this.redirectUrl) { // 判断需要重定向的页面是否是当前页
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
							const getPhone = uni.getStorageSync('getPhone');
							if (!getPhone) {
								this.GETREDIRECTURL({
									redirectUrl: null
								})
								uni.showToast({
									title: "欢迎回来！",
									icon: "none"
								})
								if (uni.getStorageSync('invitePhone') || uni.getStorageSync('fromService')) {
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
						// console.error(errMsg)
					})
				} else {
					this.showPopup = true
				}
			},
			hide() {
				this.GETLOGINPOPUP()
			},
			moveHandle() {},
		}
	}
</script>

<style lang="scss" scoped>
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
