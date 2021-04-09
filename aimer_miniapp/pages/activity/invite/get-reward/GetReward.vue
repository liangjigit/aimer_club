<template>
	<view class="get_reward">
		<ul>
			<li v-for="(item,index) in reward" :key="item.id">
				<view class="reward" :class="totalInvite < item.inviteCount ? 'wait-bg' : 'see-get-bg'">
					<!-- 奖励1：积分 -->
					<view class="image" v-if="item.rewardType == 2">
						<image src="/static/index/jf.png" mode="widthFix" style="width: 70rpx;"></image>
						<view class="award-text">
							<text style="font-size: 25rpx;">{{item.integral}}</text>
							<text style="font-size: 20rpx;">积分</text>
						</view>
					</view>
					<!-- 奖励2：优惠券 -->
					<view class="image" v-if="item.rewardType == 1">
						<image src="/static/activity/award_back.png" mode="widthFix"
							style="width: 88rpx;height: 51rpx;"></image>
						<view class="award-text">
							<text class="youhuiquan">{{item.couponList[0].couponAmount}}元</text>
						</view>
					</view>
					<!-- 奖励3：礼品卡 -->
					<view class="image" v-if="item.rewardType == 3">
						<image :src="item.prizeImg" mode="heightFix" style="height: 70rpx;"></image>
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
			rewardStr: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				rewardObj: {},
				reward: [],
				initCount: {},
				getCount: {},
				lastGetCount: [],
			}
		},
		watch: {
			rewardStr: {
				handler(n) {
					this.rewardObj = JSON.parse(n)
					console.log('我是get-reward组件奖励数据', this.rewardObj)
					this.initAwardList()
					if (this.rewardObj.total == 0 || this.rewardObj.total == null) return false
					this.initGetPrizeCount()
					this.disposeGet()
				},
				immediate: true,
			}
		},
		created() {
			// this.rewardObj = JSON.parse(this.rewardStr)
			// this.initAwardList()
			// this.initGetPrizeCount()
			// this.disposeGet()
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
				if (res.code == 200) {
					this.conpareCount[index].b++
					// console.log(this.conpareCount)
					this.$emit('getFinish', this.reward[index])
				}
			},
			//初始化奖励数组
			initAwardList() {
				const reward = this.rewardObj.reward.sort((a, b) => {
					return a.inviteCount - b.inviteCount
				})
				//转换奖励数组
				reward.forEach(item => {
					item.couponList.length > 2 ? item.couponList = JSON.parse(item.couponList) : item.couponList
				})
				this.reward = reward
				// console.log(this.reward)
			},
			//默认需要领取奖品的次数
			initGetPrizeCount() {
				let floor = Math.floor(this.totalInvite / this.reward[this.reward.length - 1].inviteCount)
				let remainder = this.totalInvite % this.reward[this.reward.length - 1].inviteCount
				let prizeMember = this.reward.length.toString()
				let initCount = {}
				switch (prizeMember) {
					case '1':
						initCount = {
							fi: floor
						}
						break;
					case '2':
						initCount = {
							fi: floor + (remainder >= this.reward[0].inviteCount ? 1 : 0),
							si: floor,
						}
						break;
					case '3':
						initCount = {
							fi: floor + (remainder >= this.reward[0].inviteCount ? 1 : 0),
							si: floor + (remainder >= this.reward[1].inviteCount ? 1 : 0),
							ti: floor,
						}
						break;
				}
				console.log('我是应该领取次数', initCount)
				this.initCount = initCount
			},
			//已经领取的数组处理
			disposeGet() {
				const rewardId = {
					fId: this.reward[0].id,
					sId: this.reward[1] ? this.reward[1].id : 0,
					tId: this.reward[2] ? this.reward[2].id : 0,
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
				console.log('我是已经领取次数', getCount)
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
					a: fi || 0,
					b: fg || 0
				}
				const s = {
					a: si || 0,
					b: sg || 0
				}
				const t = {
					a: ti || 0,
					b: tg || 0
				}
				//2是不限次
				if (this.rewardObj.limit == 2) {
					this.lastGetCount = [f, s, t]
				} else {
					f.a = 1
					s.a = 1
					t.a = 1
					this.lastGetCount = [f, s, t]
				}
				console.log('最终', this.lastGetCount)
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
					padding-bottom: 40rpx;
					width: 90%;
					height: 70%;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: center;
					border-radius: 10rpx;

					.image {
						width: 140rpx;
						height: 185rpx;
						display: flex;
						justify-content: center;
						align-items: center;

						.award-text {
							position: absolute;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							font-family: FZLanTingHeiS-DB1-GBK;
							color: #FFFFFF;
							font-weight: Regular;

							.youhuiquan {
								font-size: 28rpx;
								// letter-spacing: -25rpx;
								line-height: 95rpx;
							}
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
					width: 160rpx;
					height: 50rpx;
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
					width: 160rpx;
					height: 50rpx;
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
					width: 160rpx;
					height: 50rpx;
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
