<template>
	<view class="flex align-center justify-center margin-bottom" @click="select(true)">
		<view class="check-btn">
			<image src="/static/training/evaluation/step4/check-btn.png" mode="aspectFit" v-show="checked"></image>
		</view>
		<button class="cu-btn lg round" :class="{checked:checked}">{{buttonName}}</button>
	</view>
</template>

<script>
	export default{
		props:{
			buttonName:String,
			checked:Boolean
		},
		methods:{
			select(){
				this.$emit('select')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.check-btn{
		width:53upx;
		height:76upx;
		padding-top: 12upx;
		margin-right: 8upx;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.cu-btn{
		width:540upx;
		height:76upx;
		background:rgba(251,241,241,1);
		border:2upx solid rgba(243,215,215,1);
		font-size:28upx;
		font-weight: 400;
		color: #111111;
		&.checked{
			background:rgba(255,255,255,1);
			box-shadow:0upx 12upx 0upx 0upx rgba(226,215,212,1);
			font-weight: 500;
			color: #EC2C5A;
		}
	}
</style>
