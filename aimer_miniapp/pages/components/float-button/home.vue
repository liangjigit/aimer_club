<template>
	<view class="home-btn" @click.stop="goHome">
		<image src="/static/home-icon.png" mode="aspectFit" style=""></image>
	</view>
</template>

<script>
	export default{
		methods:{
			goHome(){
				uni.switchTab({
					url:"/pages/index/index"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.home-btn{
		position: fixed;
		right: 38upx;
		bottom: 100upx;
		width:76upx;
		height:76upx;
		overflow: hidden;
		z-index:5;
		image{
			width: 100%;
			height: 100%;
		}
	}
</style>
