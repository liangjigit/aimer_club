<template>
	<view id="rule">
		<image class="background" src="https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1618392284802.png"
			mode="scaleToFill"></image>
		<view class="text">
			<text>活动规则</text>
		</view>
		<view class="content">
			<!-- <view v-html="content"></view> -->
			<text :user-select="userSele">{{content}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'rule',
		onLoad() {
			const content = uni.getStorageSync('content')
			// console.log(content)
			this.content = content
			uni.removeStorageSync('content')
		},
		data() {
			return {
				content: '',
				userSele: true
			}
		}
	}
</script>

<style lang="scss" scoped>
	#rule {
		.background {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			background-size: 100% 100%;
			z-index: -1;
		}

		.text {
			position: fixed;
			top: 3%;
			width: 100%;
			display: flex;
			justify-content: center;
			font-size: 40rpx;
			font-weight: bolder;
			color: #ffffff;
		}

		.content {
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 90%;
			height: 80%;
			background: #FFFFFF;
			border-radius: 30rpx;
			padding: 50rpx;
			overflow: scroll;
		}
	}
</style>
