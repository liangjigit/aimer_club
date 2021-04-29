<template>
	<view class="cu-modal":class="{ show: modalName=='signUp' }">
	  <view class="cu-dialog bg-white padding-bottom-lg">
		<view class="cu-bar justify-end">
		  <view class="content"></view>
		  <view class="action" @click="hideModal">
			<text class="cuIcon-close text-gray"></text>
		  </view>
		</view>
		<view class="padding-0 padding-bottom-sm padding-lr-lg text-xl text-title">
		  {{title}}
		</view> 
		<view class="padding-xl">
			<button class="cu-btn lines-red lg shadow" style="width:302upx;font-weight:500;"  @click="confirm">确定</button>
		</view> 
	  </view>
	</view> 
</template>

<script>
	export default{
		props:{
			modalName:String,
			title:String
		},
		methods:{
			hideModal(){
				console.log(1)
				this.$emit('hideModal')
			},
			confirm(){
				this.$emit('confirm')
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
	.text-title{
		color: $aimer-text-black;
		font-weight:500;
	}
	.text-xl{
		font-size: 34upx;
	}
	.cu-btn.lg{
		font-size: 30upx;
	}
</style>