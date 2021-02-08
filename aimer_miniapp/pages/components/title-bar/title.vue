<template>
	<view class="cu-bar bg-white margin-bottom padding-left" style="min-height: auto;width:" v-if="isShow">
	    <view class="action sub-title">
	      <text class="course-bar text-black">{{name}}</text>
	      <text class="bg-red"></text>
	    </view>
		<slot></slot>
	</view>
</template>

<script>
	export default{
		props:{
			name: String,
			isShow:{
				type:Boolean,
				default:true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.course-bar{
		font-size:38upx;
		font-weight:600;
		color: #333333;
	}
	.cu-bar .action:first-child{
		margin-left:0;
	}
	.cu-bar .action.sub-title text[class*="bg-"]:last-child{
		left:0;
		height:26upx;
		background:#FF6A8D;
		bottom: -6upx;
		opacity: 1;
		border-radius: 0;
	}
</style>
