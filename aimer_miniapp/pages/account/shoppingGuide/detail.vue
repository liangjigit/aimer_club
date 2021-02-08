<template>
	<view  v-if="detail">
		<view class=" flex flex-direction align-center justify-center padding-top-lg">
			<!-- <view class="member-card" @click="previewImage">
				<view class="picture">
					<view class="image">
						<image src="/static/poster.jpg" mode="aspectFill"></image>
					</view>
					<view class="name flex flex-direction">
						<text style="padding-bottom: 14upx;">{{detail.name}}</text>
						<text>南京雨花区-{{detail.position}}</text>
					</view>
				</view>
				<view class="qrcode-box flex justify-end">
					<view class="qrcode self-center">
						<image :src="detail.qrCode" mode="aspectFit" :show-menu-by-longpress="true"></image>
					</view>
				</view>
			</view> -->
			<view>
				<canvas @longtap="savePhoto(posterImg)" class="canvas" :style="{width:cardWidth +'rpx',height: cardHeight + 'rpx'}" canvas-id="guideQYCard" id="guideQYCard" @error="canvasError"></canvas>
			</view>
			<view class="tip text-center margin-top-lg" v-if="isShow">
				长按保存右侧二维码，添加我的企业微信
			</view>
		</view>
	</view>
	<view v-else-if="noGuideText">
		<empty-page :noContent="noGuideText" imageHeight="0px"></empty-page>
	</view>
</template>

<script>
	import {mapState,mapActions,mapGetters,mapMutations} from 'vuex'
	import {checkForAuthorization} from '@/common/index.js'
	import emptyPage from '@/pages/components/empty/empty.vue'
	export default{
		data(){
			return{
				noGuideText:"",
				detail:null,
				cardWidth:598,
				cardHeight:850,
				posterImg:"",
				isShow:false
			}
		},
		components:{
			emptyPage
		},
		computed:{
			...mapState('login',['userInfo'])
		},
		async onLoad(options){
			let {userId} = options
			let response = await this.getDepartUserDetail({userId})
			if(response.code == 200){
				this.detail = response.data
				if(this.detail){
					this.drawPoster();
				}else{
					this.noGuideText = "未查询到导购信息"
				}
			}
		},
		methods:{
			...mapActions('shoppingGuide',['getDepartUserDetail']),
			canvasError(e){
				 console.error(e.detail.errMsg)
			},
			// 绘制海报
			drawPoster() {
				uni.showLoading({
					title:'加载中...',
					mask:true
				})
				let _this = this
				_this.isShow = true
				let info = uni.getSystemInfoSync()
				const pixelRatio = info.pixelRatio // 屏幕像素密度
				uni.getImageInfo({
					src: _this.detail.avatarUrl || "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1605238938861.jpg",
					success(image) {
						const canvasId = "guideQYCard"
						let  ctx = uni.createCanvasContext(canvasId,_this)
						ctx.save(); // 先保存状态 已便于画完圆再用
						ctx.beginPath(); //开始绘制
						ctx.setFillStyle('white')
						ctx.fillRect(0, 0, uni.upx2px(_this.cardWidth), uni.upx2px(_this.cardHeight))
						ctx.restore();
						let ratio = _this.cardWidth/image.width
						let draw_h = image.height*ratio
						// _this.cardHeight = draw_h
						ctx.drawImage(image.path,0,0,uni.upx2px(_this.cardWidth),uni.upx2px(draw_h)) // 海报
						// 绘制 昵称
						ctx.save(); // 先保存状态 已便于画完圆再用
						const name_size = 28
						const name_x = 24
						const name_y = 511
						ctx.setFillStyle('#FFFFFF')
						ctx.setTextBaseline('top') 
						ctx.setFontSize(uni.upx2px(name_size))
						ctx.fillText(_this.detail.name, uni.upx2px(name_x), uni.upx2px(name_y))
						const position_size = 24
						const position_x = 24
						const position_y = 554
						ctx.setFontSize(uni.upx2px(position_size))
						ctx.fillText(_this.detail.position, uni.upx2px(position_x), uni.upx2px(position_y))
						// 绘制 二维码
						uni.getImageInfo({
							src: _this.detail.qrCode,
							success(res){
								const size = 180
								const x = 40
								const y = 35
								const img_x = _this.cardWidth - size - x
								const img_y = _this.cardHeight - size - y
								const img_w = size
								const img_h = img_w
								ctx.drawImage(res.path,uni.upx2px(img_x),uni.upx2px(img_y),uni.upx2px(img_w),uni.upx2px(img_h)) // 头像
								ctx.draw(false, () => {
									uni.canvasToTempFilePath({
									  width: _this.cardWidth,
									  height: _this.cardHeight,
									  destWidth: _this.cardWidth * pixelRatio,
									  destHeight: _this.cardHeight *pixelRatio,
									  canvasId: canvasId,
									  fileType: 'png',
									  quality:1,
									  success: function(res) {
										_this.posterImg = res.tempFilePath
										_this.showCloseBtn = true
										console.log(_this.posterImg)
										uni.hideLoading()
									  },
									  fail(error) {
										console.log('4',error)
										_this.isShow = false
										uni.showLoading({
											title:'加载失败，请稍后重试',
											mask:true
										})
										uni.hideLoading()
									  }
									},_this)
								})
							},
							fail(error) {
								console.log('3',error)
								uni.showLoading({
									title:'加载失败，请稍后重试',
									mask:true
								})
								_this.isShow = false
								uni.hideLoading()
							}
						})
					 },
					 fail(error) {
					 	console.log('1',error)
						_this.isShow = false
						uni.showLoading({
							title:'加载失败，请稍后重试',
							mask:true
						})
					 	uni.hideLoading()
					 }
				});
			},
			savePhoto(filePath){
				checkForAuthorization('scope.writePhotosAlbum').then(()=>{
					uni.saveImageToPhotosAlbum({
						filePath:filePath,
						success: function () {
							uni.showToast({
								title:"已保存至相册",
								icon:"none"
							})
							uni.hideLoading()
						},
						fail: function(e){
							uni.hideLoading()
							console.log(e)
							if(e.errMsg == "saveImageToPhotosAlbum:fail cancel"){
								uni.showToast({
									title:"已取消",
									icon:"none"
								})
							}else{
								uni.showToast({
									title:"保存失败",
									icon:"none"
								})
							}
						}
					})
				}).catch((err)=>{
					console.log(err)
					uni.showToast({
						title:"保存失败",
						icon:"none"
					})
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.tip{
		font-size:26upx;
		font-weight:400;
		color: #111111;
	}
	.canvas{
		width: 598upx;
		height: 849upx;
		background-color: #ffffff;
		box-shadow: 0 3upx 7upx 0 rgba(34, 20, 24, 0.35);
	}
	.member-card{
		width:598upx;
		height:850upx;
		background:rgba(255,255,255,1);
		box-shadow:0upx 3upx 7upx 0upx rgba(35, 21, 24, 0.35);
		.picture{
			width: 100%;
			height:606upx;
			position:relative;
			.image{
				width:598upx;
				height:606upx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.name{
				padding: 30upx 24upx;
				position: absolute;
				bottom: 0;
				left: 0;
			}
			
		}
		.qrcode-box{
			padding: 40upx 39upx;
			.course{
				&::before{
					content: "";
					position: absolute;
					width: 70upx;
					height: 1upx;
					background-color: #333333;
				}
				.effect{
					color: #666666;
					font-size: 30upx;
					padding-bottom: 30upx;
					padding-top: 40upx;
				}
				.name{
					color: #333333;
					font-size: 30upx;
				}
			}
			.qrcode{
				width:180upx;
				height:180upx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
