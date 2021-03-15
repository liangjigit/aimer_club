<template>
	<view class="get_reward">
		<ul>
			<li v-for="(item,index) in reward" :key="item.id">
				<view class="reward" :class="totalInvite < item.inviteCount ? 'wait-bg' : 'see-get-bg'">
					<view class="image" v-if="reward[index].couponList.length > 2">
						<image src="../../../static/activity/jiang1.png" mode="widthFix"></image>
					</view>
					<view class="image" style="display: flex;justify-content: center;align-items: center;" v-else>
						<image src="../../../static/index/jf.png" mode="widthFix" style="width: 90rpx;"></image>
						<view style="position: absolute ;display:flex;flex-direction: column;justify-content: center;align-items: center;color: #ffffff;">
							<text style="font-size: 30rpx;">{{reward[index].integral}}</text>
							<text style="font-size: 20rpx;">积分</text></view>
					</view>
					<text>邀请{{item.inviteCount}}人</text>
				</view>
				<view class="button_wait" v-if="totalInvite < item.inviteCount">待领取</view>
				<view class="button_get"
					v-else-if="(totalInvite >= item.inviteCount) && (conpareCount[index].a > conpareCount[index].b)"
					@click="getPrize(index,item.id,item.activeId)">
					可领取</view>
				<view class="button_see" v-else @click="$emit('seePrize')">查看奖励</view>
			</li>
		</ul>
	</view>
</template>

<script>
	import {
		mapActions
	} from 'vuex'
	export default {
		name: 'GetReward',
		props: {
			rewardObj: {
				type: Object,
				default () {
					return {}
				}
			},
		},
		data() {
			return {
				reward: [],
				initCount: {},
				getCount: {},
				lastGetCount: [],
			}
		},
		created() {
			this.reward = this.rewardObj.reward.sort((a, b) => {
				return a.inviteCount - b.inviteCount
			})
			this.initGetPrizeCount()
			this.disposeGet()
			console.log(this.reward[1].couponList.length)
			// console.log(this.receiveList)
			// console.log(this.conpareCount)
		},
		methods: {
			...mapActions('invite', ['getActiveAward', 'getOldInvite', 'getNewInvite', 'sendMiniMessage']),
			//获取奖励
			async getPrize(index, rewardId, activeId) {
				// console.log(id,activeId)
				const res = await this.getActiveAward({
					rewardId,
					activeId
				})
				// console.log(res)
				if (res.code == 200) {
					this.conpareCount[index].b++
					// console.log(this.conpareCount)
					this.$emit('getFinish', this.reward[index])
				}
			},
			//默认需要领取奖品的次数
			initGetPrizeCount() {
				let floor = Math.floor(this.totalInvite / this.reward[this.reward.length - 1].inviteCount)
				let remainder = this.totalInvite % this.reward[this.reward.length - 1].inviteCount
				const initCount = {
					fi: floor + (remainder >= this.reward[0].inviteCount ? 1 : 0),
					si: floor + (remainder >= this.reward[1].inviteCount ? 1 : 0),
					ti: floor,
				}
				// console.log(initCount)
				this.initCount = initCount
			},
			//已经领取的数组处理
			disposeGet() {
				const rewardId = {
					fId: this.reward[0].id,
					sId: this.reward[1].id,
					tId: this.reward[2].id,
				}
				const getCount = {
					fg: 0,
					sg: 0,
					tg: 0,
				}
				let {
					receive
				} = this.rewardObj
				if (receive == null) receive = []
				receive.forEach(item => {
					switch (item.rewardId) {
						case rewardId.fId:
							getCount.fg++
							break;
						case rewardId.sId:
							getCount.sg++
							break;
						case rewardId.tId:
							getCount.tg++
							break;
					}
				})
				// console.log(getCount)
				this.getCount = getCount
			},
		},
		computed: {
			totalInvite() {
				return this.rewardObj.total == null ? 0 : this.rewardObj.total
			},
			conpareCount() {
				let {
					fi,
					si,
					ti
				} = this.initCount
				let {
					fg,
					sg,
					tg
				} = this.getCount
				const f = {
					a: fi,
					b: fg
				}
				const s = {
					a: si,
					b: sg
				}
				const t = {
					a: ti,
					b: tg
				}
				this.lastGetCount = [f, s, t]
				return this.lastGetCount
			}
		}
	}
</script>

<style lang="scss" scoped>
	.get_reward {
		width: 100%;
		height: 100%;
		padding-top: 25rpx;

		ul {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: space-around;
			align-items: center;

			li {
				height: 100%;
				padding-top: 20rpx;
				display: flex;
				flex-direction: column;
				align-items: center;

				.reward {
					padding-top: 15rpx;
					padding-bottom: 25rpx;
					width: 90%;
					height: 70%;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: center;
					border-radius: 10rpx;

					.image {
						width: 90%;

						image {
							width: 100%;
						}
					}
				}

				.see-get-bg {
					background-color: #ffdde2;
				}

				.wait-bg {
					background-color: #e5e5e5;
				}

				.button_see {
					transform: translateY(-50%);
					width: 150rpx;
					height: 55rpx;
					border: 2px solid #ee194c;
					color: #ee194c;
					border-radius: 25rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #ffffff;
				}

				.button_get {
					transform: translateY(-50%);
					width: 150rpx;
					height: 55rpx;
					border: 2px solid #ee194c;
					color: #ffffff;
					border-radius: 25rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #ee194c;
				}

				.button_wait {
					transform: translateY(-50%);
					width: 150rpx;
					height: 55rpx;
					border: 2px solid #a0a0a0;
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
