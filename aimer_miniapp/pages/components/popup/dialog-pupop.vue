<template>
<view class="cu-modal" :class="{show:modalName=='dialogModal'}">
  <view class="cu-dialog bg-white">
    <view class="padding-rl-sm title" :style="{'padding-bottom': subTitle.length>0?'20px':'45px'}">
      {{title}}
    </view>
	<view class="sub-title" v-show="subTitle.length>0">
		{{subTitle}}
	</view>
    <view class="cu-bar bg-white">
      <view class="action margin-0 flex-sub cancel" @click="hideModal">{{cancelText}}</view>
      <view class="action margin-0 flex-sub solid-left confirm" @click="confirm">{{confrimText}}</view>
    </view>
  </view>
</view>
</template>
<script>
	export default{
		props:{
			modalName:String,
			title:String,
			subTitle:String,
			cancelText:{
				type:String,
				default:"取消"
			},
			confrimText:{
				type:String,
				default:"确定"
			},
			
		},
		methods:{
			hideModal(){
				this.$emit('cancel')
			},
			confirm(){
				this.$emit('confirm')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cu-dialog{
		padding-top: 96upx;
	}
	.title{
		font-size:34upx;
		font-weight:500;
		color: #111111;
		line-height: 1;
	}
	.sub-title{
		font-size:30upx;
		font-weight:400;
		color: #666666;
		padding-bottom: 65upx;
	}
	.confirm,
	.cancel{
		font-size:30upx;
		font-weight:500;
		color: #111111;
	}
	.confirm{
		color: #EC2C5A;
	}
</style>
