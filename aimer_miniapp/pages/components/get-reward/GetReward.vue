<template>
	<view class="get_reward">
		<ul>
			<li>
				<view class="reward">
					<view class="image">
					<image src="../../../static/activity/jiang1.png" mode="widthFix"></image>
					</view>
					<text>邀请1人</text>
				</view>
				<view class="button_see">查看奖励</view>
			</li>
			<li>
				<view class="reward">
					<view class="image">
					<image src="../../../static/activity/jiang2.png" mode="widthFix"></image>
					</view>
					<text>邀请3人</text>
				</view>
				<view class="button_see">可领取</view>
			</li>
			<li>
				<view class="reward">
					<view class="image">
					<image src="../../../static/activity/jiang1.png" mode="widthFix"></image>
					</view>
					<text>邀请5人</text>
				</view>
				<view class="button_see">待领取</view>
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
					background: green;
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
				.button_see{
					transform: translateY(-50%);
					width: 150rpx;
					height: 50rpx;
					border:2px solid red;
					border-radius: 25rpx;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
	}
</style>
