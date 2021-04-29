<template>
	<view class="flex flex-direction align-center">
		<!-- #ifdef MP-WEIXIN -->
		<view class="poster">
			<!-- <image :src="posterImg" mode="widthFix" :style="{width:'100%',height:screenHeight  + 'px'}" v-if="shareInfo.type == Type[0]"></image>
			<canvas class="canvas" :style="{width:screenWidth+'px',height: screenHeight + 'px'}" canvas-id="invitePoster" id="invitePoster" v-else  @error="canvasError"></canvas>
			 -->
			<canvas class="canvas" width="750" height="1334"
				:style="{width:canvasWidth+'px',height: posterImg?0:canvasHeight + 'px'}" canvas-id="invitePoster"
				id="invitePoster" @error="canvasError">
			</canvas>
			<image :src="posterImg" mode="widthFix" :style="{width:'100%',height:canvasHeight  + 'px'}"
				v-if="posterImg"></image>

		</view>
		<!-- 用户操作按钮 -->
		<view class="btns-wrapper" v-if="shareInfo.type == Type[0]">
			<button class="cu-btn lines-red lg round shadow flex align-center" open-type="share">
				<view class="icon">
					<image src="/static/share-white.png" mode="aspectFit"></image>
				</view>
				<text>直接分享</text>
			</button>
			<!-- <button class="cu-btn lines-red lg round shadow flex align-center" @click="downloadFile"> -->
			<button class="cu-btn lines-red lg round shadow flex align-center" @click="readyForSave(true)">
				<view class="icon">
					<image src="/static/poster-white-icon.png" mode="aspectFit"></image>
				</view>
				<text>海报分享</text>
			</button>
		</view>
		<view class="btns-wrapper" v-else>
			<button class="cu-btn lines-red lg round shadow flex align-center" @click="readyForSave">
				<text>保存海报</text>
			</button>
			<button class="cu-btn lines-red lg round shadow flex align-center" open-type="share">
				<text>分享给好友</text>
			</button>
		</view>
		<!-- #endif -->
		<login-pupop ref="login"></login-pupop>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	import {
		doActivityStatistics,
		doBrartsStatistics,
		doCourseStatistics,
		doCupStatistics
	} from '@/common/statistics.js'
	import {
		checkForAuthorization
	} from '@/common/index.js'
	const Type = ["share", "invitation"] // 分享海报，邀请好友
	export default {
		onShow() {
			this.$refs.login.checkLogin()
		},
		data() {
			return {
				Type,
				posterImg: '',
				canvasHeight: 0,
				canvasWidth: 0,
				clickSave: false
			}
		},
		computed: {
			...mapState('poster', ['shareInfo', 'inviteQR']),
			canSave() {
				if (this.clickSave && this.posterImg) {
					this.savePhoto()
					this.clickSave = false
				}
				return this.isSave && this.posterImg
			}
		},

		onLoad(options) {
			let {
				type,
				poster
			} = this.shareInfo
			uni.setNavigationBarTitle({
				title: type == 'invitation' ? "邀请好友" : "分享"
			})
			// this.posterImg = poster 
		},
		onReady() {
			// 绘制海报
			uni.showLoading({
				title: "加载中...",
				mask: true
			})
			let _this = this
			let info = uni.getSystemInfoSync()
			let screenHeight = info.windowHeight
			let screenWidth = info.screenWidth
			const pixelRatio = info.pixelRatio // 屏幕像素密度
			uni.getImageInfo({
				src: this.shareInfo.poster,
				success(image) {
					const canvasId = "invitePoster"
					let ctx = uni.createCanvasContext(canvasId)
					//使海报的宽度和高度适应当前屏幕
					let ratio = screenWidth / image.width
					let draw_h = image.height * ratio
					screenHeight = draw_h
					_this.canvasWidth = screenWidth
					_this.canvasHeight = draw_h
					//将海报（图片）画到画布
					ctx.drawImage(image.path, 0, 0, screenWidth, draw_h) // 海报
					if (_this.shareInfo.type == Type[1]) { //邀请好友
						//获取邀请的太阳码
						uni.getImageInfo({
							src: _this.inviteQR,
							success(res) {
								const x = (screenWidth - image.width) / 2
								const y = (draw_h - image.height) / 2
								//将小程序码（图片）画到画布
								ctx.drawImage(res.path, uni.upx2px(260), uni.upx2px(965), uni.upx2px(240),
									uni.upx2px(240))
								ctx.draw(false, () => {
									_this.canvasToTempFilePath(screenWidth, draw_h, pixelRatio,
										canvasId)
								})
							},
							fail(error) {
								console.log(error)
								uni.hideLoading()
							}
						})
					} else {
						ctx.draw(false, () => {
							_this.canvasToTempFilePath(screenWidth, draw_h, pixelRatio, canvasId)
						})
					}
				},
				fail(error) {
					console.log(error);
					uni.hideLoading()
				}
			});
		},

		onShareAppMessage(res) {
			let {
				title,
				image,
				path
			} = this.shareInfo
			this.setStatistics(2) // 统计分享数据
			return {
				title: title,
				imageUrl: image,
				path: path
			}
		},
		methods: {
			//canvas转图片
			canvasToTempFilePath(screenWidth, draw_h, pixelRatio, canvasId) {
				try {
					let _this = this
					// console.log(screenWidth * pixelRatio,draw_h *pixelRatio)
					uni.canvasToTempFilePath({
						width: screenWidth,
						height: draw_h,
						destWidth: screenWidth * pixelRatio,
						destHeight: draw_h * pixelRatio,
						canvasId: canvasId,
						fileType: 'png',
						quality: 1,
						success: function(res) {
							_this.posterImg = res.tempFilePath
							// console.log(_this.posterImg)
							uni.hideLoading()
						},
						fail: function(res) { // 部分机型会失败 create bitmap failed ，重新调用直到绘制成功
							_this.canvasToTempFilePath(screenWidth, draw_h, pixelRatio, canvasId)
							console.log(res.errMsg)
						}
					})
				} catch (e) {
					//TODO handle the exception
					console.log(e)
				}
			},
			canvasError(e) {
				console.error(e.detail.errMsg)
			},
			setStatistics(type) {
				let {
					statistics,
					code
				} = this.shareInfo
				let no = this.getDownloadPosterNo(type);
				let param = {
					modelCode: code,
					no
				}
				switch (statistics) {
					case "activity":
						doActivityStatistics(param)
						break;
					case "brarts":
						doBrartsStatistics(param)
						break;
					case "course":
						doCourseStatistics(param)
						break;
					case "cup":
						doCupStatistics(param)
						break;
					default:
						break;
				}
			},

			// 海报的NO 值 type = 1 下载 2 分享
			getDownloadPosterNo(type) {
				let {
					statistics
				} = this.shareInfo
				let no = null
				switch (statistics) {
					case "activity":
						no = type == 1 ? 5 : 2
						break;
					case "brarts":
						no = type == 1 ? 7 : 2
						break;
					case "course":
						no = type == 1 ? 4 : 2
						break;
					case "cup":
						no = type == 1 ? 1 : 3
						break;
					default:
						break;
				}
				return no
			},
			// downloadFile(){
			// 	uni.showLoading({
			// 		title:"正在保存...",
			// 		mask:true
			// 	})
			// 	 let _this = this
			// 	 this.setStatistics(1) // 统计下载海报
			// 	 uni.downloadFile({
			// 	      url: this.posterImg, 
			// 	      success: function (res) {
			// 	        if (res.statusCode === 200) {
			// 				_this.posterImg = res.tempFilePath
			// 				_this.savePhoto()
			// 			}
			// 		},
			// 		fail: function(){
			// 			uni.hideLoading()
			// 			uni.showToast({
			// 				title:"下载海报失败",
			// 				icon:"none"
			// 			})
			// 		}
			// 	})
			// },
			readyForSave(setStatistics) {
				uni.showLoading({
					title: "正在保存...",
					mask: true
				})
				this.clickSave = true
				if (setStatistics) {
					this.setStatistics(1) // 统计下载海报
				}
			},
			savePhoto() {
				let _this = this
				if (this.posterImg) {
					checkForAuthorization('scope.writePhotosAlbum').then(() => {
						uni.saveImageToPhotosAlbum({
							filePath: this.posterImg,
							success: function() {
								uni.hideLoading()
								_this.clickSave = false
								uni.showToast({
									title: "已保存至相册",
									icon: "none"
								})
							},
							fail: function(err) {
								uni.hideLoading()
								console.log(err)
								if (err.errMsg == "saveImageToPhotosAlbum:fail cancel") {
									uni.showToast({
										title: "已取消",
										icon: "none"
									})
								} else {
									uni.showToast({
										title: "保存失败",
										icon: "none"
									})
								}
							}
						})
					}).catch((err) => {
						console.log(err)
						uni.showToast({
							title: "保存失败",
							icon: "none"
						})
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.canvas {}

	.poster {
		width: 100%;
		height: 100%;
		overflow-x: hidden;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.btns-wrapper {
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-self: center;
		width: 690upx;
		margin-bottom: 61upx;

		.cu-btn {
			width: 300upx;
			font-weight: 500;
			height: 88upx;

			&[class*="lines-red"]::after {
				background: linear-gradient(-50deg, rgba(213, 27, 71, 1), rgba(244, 50, 96, 1));
				;
				border-radius: 44px;
				box-shadow: 0rpx 40rpx 55rpx 0rpx rgba(213, 27, 71, 0.5);
			}

			text {
				color: #FFFFFF;
				z-index: 2;
			}

			.icon {
				width: 34upx;
				height: 34upx;
				z-index: 2;
				margin-right: 16upx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
