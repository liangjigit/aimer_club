<template>
	<view class="cu-modal" :class="{ show: modalName=='share'}">
	  <view class="cu-dialog bg-white padding-bottom-lg">
		<view class="cu-bar justify-end">
		  <view class="action" @click="hideModal">
			<text class="cuIcon-close text-gray"></text>
		  </view>
		</view>
		<view class="padding-0 padding-bottom-sm padding-lr-lg text-xl text-red" style="margin-top: -37upx;font-weight: 500;">
		  {{title}}
		</view>
		<view class="padding-0 padding-bottom padding-lr-lg text-df text-black">
		  {{subTitle}}
		</view>
		<view class="line-gray margin-bottom"></view>
		<view class="padding-0 padding-bottom padding-lr-lg text-xl text-red">
		  邀请朋友一起加入
		</view> 
		<view class="padding-xl bg-white">
			<button class="cu-btn lines-red  lg shadow" style="width:302upx;font-weight:500;" open-type="share">分享</button>
		</view> 
	  </view>
	</view> 
</template>

<script>
	export default{
		props:{
			modalName:String,
			title:String,
			subTitle:String
		},
		methods:{
			hideModal(){
				this.$emit('hideModal')
			}
		}
	}
</script>
<style lang="scss" scoped>
	.cu-btn[class*="lines"]::after {
		border: 6upx solid $aimer-color;
		box-shadow: $aimer-shadow;
		border-radius: 20upx;
	}
	.cu-bar .action>text[class*="cuIcon-"]{
		font-size: 56upx;
	}
	.text-red{
		color: $aimer-color;
	}
	.text-xl{
		font-size: 34upx;
	}
	.text-df{
		font-size: 26upx;
	}
	.cu-btn.lg{
		font-size: 30upx;
	}
	.line-gray{
		height: 2upx;
		width: 100%;
		background-color: #F9F9F9;
	}
</style>