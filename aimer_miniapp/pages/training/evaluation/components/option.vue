<template>
	<view class="option flex justify-center flex-direction align-center" @click="select">
		<view class="img">
			<view class="checked">
				<image :src="'/static/training/evaluation/step3/check-on.png'" mode="aspectFit" v-show="checked"></image>
				<image :src="'/static/training/evaluation/step3/check-off.png'" mode="aspectFit" v-show="!checked"></image>
			</view>
			<image :src="img" mode="aspectFit"></image>
		</view>
		<view class="text" :class="{'text-checked':checked}" v-html="title"></view>
	</view>
</template>

<script>
	export default{
		props:{
			checked:Boolean,
			title:String,
			img:String
		},
		methods:{
			select(){
				this.$emit('select')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.option{
		.img{
			width: 182upx;
			height: 183upx;
			margin-bottom: 15upx;
			position: relative;
			image{
				width: 100%;
				height: 100%;
			}
			.checked{
				position: absolute;
				top: 0;
				right: 0;
				width: 50upx;
				height: 50upx;
				z-index: 2;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.text{
			font-size:28upx;
			&.text-checked{
				color: #EC2C5A;
				font-weight:500;
			}
		}
	}
</style>
