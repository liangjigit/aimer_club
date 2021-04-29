<template>
	<view class="title-bar flex align-center">
		<view class="title-icon">
			<image :src="icon" mode="aspectFit"></image>
		</view>
		<view class="name flex-sub">
			{{title}}
		</view>
		<slot name="btns"></slot>
	</view>
</template>

<script>
	export default{
		props:{
			title:String,
			icon:String
		}
	}
</script>

<style lang="scss" scoped>
	.title-bar{
		padding: 30upx 28upx;
		.title-icon{
			width: 40upx;
			height: 40upx;
			margin-right: 24upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.name{
			font-size:30upx;
			font-weight:400;
			color: #2C3850;
		}
	}
</style>
