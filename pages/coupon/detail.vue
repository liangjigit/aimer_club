<template>
	<view class="" v-if="detail">
		<view class="padding flex flex-direction align-center">
			<view class="level">
				{{userInfo.level}} {{userInfo.memberNo}}
			</view>
			<view class="title" style="width:510upx;" v-if="cardType == 'MJ'">
				¥ {{detail.faceAmount}}【{{detail.couponName}}（{{detail.subheading}}）】
			</view>
			<view class="discount" v-if="cardType == 'MJ'">
				<text class="unit">¥</text>
				<text class="num">{{detail.faceAmount}}</text>
			</view>
			<view class="title" style="width:510upx;" v-if="cardType == 'ZK'">
				{{detail.discount}} 折【{{detail.couponName}}（{{detail.subheading}}）】
			</view>
			<view class="discount" v-if="cardType == 'ZK'">
				<text class="num">{{detail.discount}}</text>
				<text class="unit">折</text>
			</view>
			<view class="pwd">
				密令：{{detail.couponId}}
			</view>
			<view class="barCode margin-top-lg">
				<image :src="detail.barcode" mode="aspectFit"></image>
			</view>
			<view class="date">
				有效期 {{detail.startDate}} —— {{detail.endDate}}
			</view>
		</view>

		<view class="line"></view>
		<view class="explain-box flex flex-direction">
			<text class="margin-bottom-sm">使用说明</text>
			<!-- <text>1、购买正价商品满20元可使用，可与其他活动同享（不与其他优惠券同享，不与优享卡活动同享），会员非原价积分</text>
			<text>2、每笔订单只限使用一张优惠券，此券不兑现，不找零</text>
			<text>3、优惠券有效期自领取之日起10天内有效</text>
			<text>4、适用品牌：爱慕、爱慕运动、爱慕先生、爱慕儿童、足哇、宝迪威德、IMI</text>
			<text>5、全国线下实体门店及爱慕官方商城能用</text>
			<text>6、最终解释权归爱慕所有</text> -->
			<template v-if="detail.instructions == ''">
				<text>【优惠券使用说明加载失败，请联系客服解决】</text>
			</template>
			<template v-else>
				<div v-html="detail.instructions" class="desc"></div>
			</template>
		</view>
		<view class="nav">
			<text>线上使用优惠券，请转至</text>
			<text class="link" @click="goShop">官方商城</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	export default {
		computed: {
			...mapState('login', ['userInfo'])
		},
		data() {
			return {
				detail: null,
				cardType: ''
			}
		},
		onLoad(options) {
			let {
				couponId
			} = options
			this.getDetail(couponId)
		},
		methods: {
			...mapActions('accoutBenefit', ['getCouponDetail']),
			async getDetail(couponId) {
				let response = await this.getCouponDetail({
					couponId
				})
				if (response.code == 200) {
					this.detail = response.data
					this.cardType = this.detail.couponId.substr(0, 2)
					console.log(this.detail)
					console.log(this.cardType)
				}
			},
			goShop() {
				uni.navigateToMiniProgram({
					appId: 'wx203ab2d5cb638d1d',
					path: '/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.desc {
		line-height: 36rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #999999;
		margin-bottom: 15rpx;
	}

	.date {
		font-size: 24upx;
		font-weight: 400;
		color: #999999;
		margin-top: 41upx;
		line-height: 1;
	}

	.barCode {
		width: 529upx;
		height: 250upx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.pwd {
		font-size: 30upx;
		font-weight: 400;
		color: #333333;
		margin-top: 70upx;
		text-align: center;
		line-height: 1;
	}

	.discount {
		margin-top: 50upx;
		text-align: center;

		.unit {
			font-size: 30upx;
			font-weight: 400;
			color: #2C3850;
			line-height: 1;
		}

		.num {
			font-size: 88upx;
			font-weight: 400;
			color: #EC2C5A;
			line-height: 1;
		}
	}

	.title {
		font-size: 34upx;
		font-weight: 500;
		color: #333333;
		line-height: 40upx;
		margin-top: 74upx;
	}

	.level {
		font-size: 24upx;
		font-weight: 400;
		color: #999999;
	}

	.line {
		width: 100%;
		height: 20upx;
		background: rgba(249, 249, 249, 1);
	}

	.explain-box {
		padding: 50upx 44upx;

		text {
			line-height: 36upx;
			font-size: 24upx;
			font-weight: 400;
			color: #999999;
			margin-bottom: 15upx;
		}
	}

	.nav {
		color: #333333;
		font-size: 24upx;
		font-weight: 400;
		text-align: center;
		padding-bottom: 85upx;

		.link {
			color: #EC2C5A;
		}
	}
</style>
