<template>
	<view>
		<view class="background-image">
			<!-- <image src="/static/training/evaluation/bg.png" mode="aspectFill"></image> -->
			<image src="https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1596806328856" mode="aspectFill"></image>
		</view>
		<view class="background-transparent text-white padding-left-lg" style="padding-top: 362upx;">
			<view class="margin-bottom" style="font-size: 50upx;">了解自己</view>
			<view style="margin-bottom: 45upx;font-size: 50upx;">才能更自信</view>
			<view class="margin-bottom-sm text-sm">一分钟了解你的胸型&尺码</view>
			<view class="margin-bottom-lg text-sm">开启个性化健康胸部管理</view>
			<view class="evaluate">
				<button class="cu-btn lines-red lg round flex align-center text-white" @click="goRecord">
					<text class="margin-right-xs">查看历史测评记录</text>
					<text class="cuIcon-right"></text>
				</button>
			</view>
			<view class="evaluate-btn flex flex-direction justify-end" @click="goEvaluate" :style="{'padding-bottom':bottom+'rpx'}">
				<text class="margin-bottom-sm" style="font-size: 40upx;">开始测量</text>
				<text style="opacity: 0.4;font-size: 22upx;">本测量根据【爱慕人体工学研究院】多年成果得出</text>
			</view>
		</view>
		<login-pupop ref="login"></login-pupop>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				bottom:9
			}
		},
		onShow(){
			this.$refs.login.checkLogin()
		},
		onLoad() {
			let info = uni.getSystemInfoSync()
			console.log(info)
			this.bottom = Math.abs(info.safeAreaInsets.bottom/2)
		},
		methods:{
			async goEvaluate(){
				const isLogin = await this.$refs.login.checkLogin()
				if(!isLogin){
					return
				}
				uni.navigateTo({
					url:'/pages/training/evaluation/edit'
				})
			},
			async goRecord(){
				const isLogin = await this.$refs.login.checkLogin()
				if(!isLogin){
					return
				}
				uni.navigateTo({
					url:'/pages/training/evaluation/record'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.background-image{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		image{
			width: 100%;
			height: 100%;
		}
		overflow: hidden;
	}
	.background-transparent{
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.1);
		z-index: 2;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		overflow: hidden;
	}
	.evaluate .cu-btn{
		margin-top: 60upx;
		width:287upx;
		font-weight:400;
		height: 88upx;
		padding: 0;
		&[class*="lines-red"]::after {
			background-color: #FFFFFF;
			border-radius:44px;
			border-width:0upx;
		}
		text{
			color: #2C3850;
			z-index: 2;
			line-height: 1;
			font-size:24upx;
		}
	}
	.evaluate-btn{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		// height: 124upx;
		padding-top: 32rpx;
		text-align: center;
		padding-bottom: 9upx;
		box-shadow:0upx 15upx 40upx 0upx rgba(98,0,23,0.16);
		background:linear-gradient(-50deg,rgba(213,27,71,1),rgba(244,50,96,1));
		border:1upx solid rgba(200,15,60,1);
		text{
			color: #FFFFFF;
			line-height: 1;
		}
		
	}
</style>
