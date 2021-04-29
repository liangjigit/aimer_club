<template>
	<view>
		<view class="background-red" v-if="punchData"></view>
		<view class="content flex flex-direction align-center justify-center" v-if="punchData">
			<view class="card padding flex flex-direction">
				<view class="flex align-center padding" style="margin-bottom: 78upx;">
					<view class="flex flex-direction flex-sub margin-right-sm" style="width: 200upx;">
						<text class="text-lg text-red margin-bottom-sm" style="font-weight: 500;">恭喜您</text>
						<text class="text-lg text-red" style="font-weight: 500;">完成训练</text>
						<text class="padding-top-lg text-sm margin-bottom-sm text-cut">{{detail.title}}</text>
						<text class="text-sm">{{punchDate}}</text>
					</view>
					<view class="image">
						<image src="/static/training/detail/win-icon.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="line"></view>
				<view class="duration flex justify-around">
					<view class="item flex flex-direction align-center justify-center">
						<view class="name margin-bottom-lg">时长</view>
						<view>
							<text class="value">{{punchData.duration||0}}</text>
							<text class="unit">分</text>
						</view>
					</view>
					<view class="item flex flex-direction align-center justify-center">
						<view class="name margin-bottom-lg">次数</view>
						<view>
							<text class="value">{{punchData.exerciseNum}}</text>
							<text class="unit">次</text>
						</view>
					</view>
					<view class="item flex flex-direction align-center justify-center">
						<view class="name margin-bottom-lg">奖励</view>
						<view>
							<text class="value">{{punchData.integral}}</text>
							<text class="unit">积分</text>
						</view>
					</view>
				</view>
			</view>
			<view class="btns-box flex flex-direction align-center">
				<button class="cu-btn round lg bg-red margin-bottom" v-if="!isPunched" @click="onPunch">打卡记录一下吧</button>
				<button class="cu-btn round lg margin-bottom" :class="{'lines-gray':!punchData.allowPunch,'lines-red':punchData.allowPunch}" v-else>
					<image class="check margin-right-sm" :style="{'filter':punchData.allowPunch?'none':'opacity(0.5)'}" src="/static/training/detail/punch.png" mode="aspectFit"></image>
					<text>{{punchData.allowPunch?'打卡成功':'已打卡'}}</text>
				</button>
				<button class="cu-btn round lg bg-red margin-bottom" @click="savePhoto" v-if="detail.previewImg">每一次坚持，都值得去炫耀一下下</button>
				<button class="cu-btn round lg bg-red margin-bottom" open-type="share" v-else>每一次坚持，都值得去炫耀一下下</button>
			</view>
		</view>
		<login-pupop ref="login"></login-pupop>
	</view>
</template>

<script>
	import {mapState,mapActions,mapMutations} from 'vuex'
	import {doCourseStatistics} from '@/common/statistics.js'
	import {abnormalprompt} from '@/common/index.js'
	const nowDate = new Date()
	const punchDate = nowDate.getFullYear() + '年'+(nowDate.getMonth()+1) +'月'+ nowDate.getDate()+'日'
	export default{
		data(){
			return{
				punchDate,
				code:"",
				isPunched:false,
				punchData:null
			}
		},
		computed:{
			...mapState('trainingDetail',['detail']),
			...mapState('poster',['shareInfo']),
			...mapState('login',['isDisabledUser']),
		},
		onShareAppMessage(res){
			// 统计分享数据
			doCourseStatistics({ 
				modelCode:this.code,
				no: 2// 分享
			})
			let {title,image,path} = this.shareInfo
			return {
				title:title,
				imageUrl:image,
				path:path
			}
		},
		async onLoad(options) {
			let {code} = options
			this.code = code
			let response = await this.getPunchData({courseCode:code})
			if(response.code == 200){
				this.punchData = {...response.data}
				this.isPunched = !this.punchData.allowPunch
			}
		},
		methods:{
			...mapActions('brarts',['doPunch']),
			...mapActions('trainingDetail',['getPunchData']),
			...mapMutations('trainingDetail',['GETCOURSEDETAIL']),
			async onPunch(){
				const isLogin = await this.$refs.login.checkLogin()
				if(!isLogin){
					return
				}
				if(this.isDisabledUser){
					abnormalprompt()
					return
				}
				uni.showLoading({
					title:"请求中...",
					mask:true
				})
				let response = await this.doPunch({
					model:2, // course
					modelCode: this.code
				})
				if(response.code == 200){
					this.isPunched = true
					// this.punchData.allowPunch = false
					this.GETCOURSEDETAIL({detail:{...this.detail,allowPunch:false}})
				}
				uni.hideLoading()
			},
			savePhoto(){
				uni.showLoading({
					title:"正在保存...",
					mask:true
				})
				 doCourseStatistics({modelCode:this.code,no:4})// 下载海报数据统计
				 uni.downloadFile({
				      url: this.detail.previewImg, 
				      success: function (res) {
				        if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath:res.tempFilePath,
								success: function () {
									uni.hideLoading()
								},
								fail: function(e){
									console.log(e)
									uni.hideLoading()
									uni.showToast({
										title:"保存失败",
										icon:"none"
									})
								}
							})
						}
					},
					fail: function(e){
						console.log(e)
						uni.hideLoading()
						uni.showToast({
							title:"下载海报失败",
							icon:"none"
						})
					}
				})
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		background-color: transparent;
		z-index: 2;
	}
	.card{
		width:598upx;
		height:628upx;
		background:rgba(255,255,255,1);
		box-shadow:0upx 10upx 20upx 0upx rgba(50,0,2,0.1);
		border-radius:10upx;
		
		.image{
			width: 106upx;
			height: 106upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.line{
			width:100%;
			height:3upx;
			background-color:#CCCCCC;
		}
		.duration{
			height: 269upx;
			padding-top: 60upx;
			.item{
				font-weight:500;
				.name{
					font-size:24upx;
					color:#999999;
				}
				.value{
					color: #EC2C5A;
					font-size:32upx;
				}
				.unit{
					font-size:24upx;
					color: #333333;
					margin-left: 14upx;
				}
			}
		}
		text{
			line-height: 1;
		}
	}
	.background-red{
		background-color: #BB3F59;
		background-image: url(../../../static/training/detail/bg.png);
		background-repeat: no-repeat; 
		background-size: cover;
		width:100%;
		height:538upx;
		position: absolute;
		top: 0;
		left: 0;
		background-position: center;

	}
	.lines-gray{
		box-shadow:0upx 15upx 40upx 0upx rgba(229, 228, 228, 0.2) !important;
	}
	.lines-gray::after{
		border:2upx solid #aaaaaa !important;
	}
	.lines-red::after {
		border:2upx solid #BB3F59 !important;
	}
	.btns-box{
		padding-top: 107upx;
		button{
			width:590upx;
			height:88upx;
			box-shadow:0upx 15upx 40upx 0upx rgba(98,0,23,0.16);
			// &::after{
			// 	border:2upx solid #BB3F59;
			// }
			.bg-red{
				background-color:#BB3F59;
				color: #FFFFFF;
			}
			.lines-red{
				background-color: #FFFFFF;
				color: #BB3F59;
			}
			.check{
				width:37upx;
				height:31upx;
			}
		}
	}
</style>
