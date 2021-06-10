<template>
	<view class="margin-tb flex justify-center"v-show="isShow">
		<view class="cu-load loading" v-show="isLoad"></view>
		<view class="aimer-footer align-center" v-show="!isLoad">
			<image class="image1" src="/static/footer-aimer.png" mode="aspectFit"></image>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			isLoad:Boolean,
			isShow:Boolean
		}
	}
</script>

<style lang="scss" scoped>
	.aimer-footer{
		width: 500upx;
		height: 30upx;
		.image1{
			width: 100%;
			height: 100%;
		}
	}
	.cu-load.loading{
		color: #666;
	}
	.cu-load.loading::before {
		content: "\e67a";
		animation: cuIcon-spin 1s infinite linear;
		color: #999;
	}
</style>
