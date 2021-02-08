<template>
	<view class="cu-list menu self-start no-border" v-if="isShow">
		<view class="cu-item">
		  <view class="content flex flex-wrap">
			 <view class="icon">
				<image :src="icon" class="png" mode="aspectFit"></image>
			 </view>
			<view class="text-title flex-sub" v-html="title"></view>
		  </view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			icon: String,
			title: String,
			isShow: {
				type:Boolean,
				default:true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cu-list.menu>.cu-item .content {
		align-items: baseline;
	}
	.icon {
		width: 28upx;
		height: 28upx;
		overflow: hidden;
		margin-right: 25upx;
		image{
			width: 100%;
			height: 100%
		}
	}
	.text-title{
		color: #2C3850;
		font-size: 30upx;
		line-height:46upx;
		opacity:0.8;
	}
	.cu-list{
		width:100%;
	}
	.cu-list.menu>.cu-item {
		min-height: 46upx;
		margin-bottom: 42upx;
	}
	.cu-list.menu.no-border>.cu-item:after {
		width: 0;
	}
	.text-gray{
		color: #999999;
	}
</style>
