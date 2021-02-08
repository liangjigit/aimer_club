<template>
	<view class="padding-left-xs padding-top-sm">
		<view class="padding-sm">
			<text class="cuIcon-locationfill margin-right-xs" style="color: #CCCCCC;font-size: 30upx;"></text>
			<text style="font-size: 26upx; color: #999999;">当前定位城市</text>
		</view>
		<view class="padding-left padding-tb padding-left-xxl text-black text-lg">
			{{city}}
		</view>
		<view class="padding-sm">
			<text class="cuIcon-locationfill margin-right-xs" style="color: #CCCCCC;font-size: 30upx;"></text>
			<text style="font-size: 26upx;color: #999999;">切换其他城市</text>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			city:String
		}
	}
</script>

<style lang="scss" scoped>
	.padding-left-xxl{
		padding-left: 60upx;
	}
</style>
