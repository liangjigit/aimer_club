<template>
	<view class="get_reward">
		<ul>
			<li>
				<view class="reward see-get-bg">
					<view class="image">
					<image src="../../../static/activity/jiang1.png" mode="widthFix"></image>
					</view>
					<text>邀请1人</text>
				</view>
				<view class="button_see">查看奖励</view>
			</li>
			<li>
				<view class="reward see-get-bg">
					<view class="image">
					<image src="../../../static/activity/jiang2.png" mode="widthFix"></image>
					</view>
					<text>邀请3人</text>
				</view>
				<view class="button_get">可领取</view>
			</li>
			<li>
				<view class="reward wait-bg">
					<view class="image">
					<image src="../../../static/activity/jiang1.png" mode="widthFix"></image>
					</view>
					<text>邀请5人</text>
				</view>
				<view class="button_wait">待领取</view>
			</li>
		</ul>
	</view>
</template>

<script>
	export default{
		name:'GetReward'
	}
</script>

<style lang="scss" scoped>
	.get_reward{
		width: 100%;
		height: 100%;
		padding-top: 25rpx;
		ul{
			width: 100%;
			height: 100%;
			display:flex;
			justify-content: space-around;
			align-items: center;
			li{
				height: 100%;
				padding-top: 20rpx;
				display: flex;
				flex-direction:column;
				align-items: center;
				.reward{
					padding-top: 15rpx;
					padding-bottom: 25rpx;
					width: 90%;
					height: 70%;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: center;
					border-radius: 10rpx;
					.image{
						width: 90%;
						image{
							width: 100%;
						}
					}
				}
				.see-get-bg{
					background-color: #ffdde2;
				}
				.wait-bg{
					background-color: #e5e5e5;
				}
				.button_see{
					transform: translateY(-50%);
					width: 150rpx;
					height: 55rpx;
					border:2px solid #ee194c;
					color: #ee194c;
					border-radius: 25rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #ffffff;
				}
				.button_get{
					transform: translateY(-50%);
					width: 150rpx;
					height: 55rpx;
					border:2px solid #ee194c;
					color: #ffffff;
					border-radius: 25rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #ee194c;
				}
				.button_wait{
					transform: translateY(-50%);
					width: 150rpx;
					height: 55rpx;
					border:2px solid #a0a0a0;
					color: #ffffff;
					border-radius: 25rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #a0a0a0;
				}
			}
		}
	}
</style>
