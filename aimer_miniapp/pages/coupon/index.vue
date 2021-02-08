<template>
	<view class="flex flex-direction align-center">
		<view class="tip padding-top padding-bottom-lg" v-if="!isEmpty">点击优惠券可查看使用规则</view>
		<view class="item flex-direction flex justify-between" v-for="(item,index) in list" :key="index" @click="goDetail(item.couponId)">
			<view class="padding-lr-lg padding-top-lg padding-bottom flex align-center" v-if="cardType[index] == 'MJ'">
				<view class="discount">
					<text class="unit">¥</text>
					<text class="num">{{item.faceAmount}}</text>
				</view>
				<view class="flex flex-direction flex-sub">
					<text class="title text-cut-line2 margin-bottom">¥ {{item.faceAmount}}【{{item.couponName}}（{{item.subheading}}）】</text>
					<text class="date">有效期 {{item.startDate}} —— {{item.endDate}}</text>
				</view>
			</view>
			<view class="padding-lr-lg padding-top-lg padding-bottom flex align-center" v-if="cardType[index] == 'ZK'">
				<view class="discount">
					<text class="num">{{item.discount * 10}}</text>
					<text class="unit" style="margin-left: 5px;">折</text>
				</view>
				<view class="flex flex-direction flex-sub">
					<text class="title text-cut-line2 margin-bottom">{{item.discount * 10}}折【{{item.couponName}}（{{item.subheading}}）】</text>
					<text class="date">有效期 {{item.startDate}} —— {{item.endDate}}</text>
				</view>
			</view>
			<view class="flex footer padding-left-lg align-stretch justify-between">
				<text class="pwd">密令：{{item.couponId}}</text>
				<text class="btn">立即使用</text>
			</view>
		</view>
		<empty-page v-if="isEmpty" :imageHeight="'0px'" :noContent="'暂无可用优惠券'"></empty-page>
		<load-more :isLoad="isLoading" :isShow="!isEmpty"></load-more>
	</view>
</template>

<script>
	import loadMore from '@/pages/components/footer/loadMore.vue'
	import emptyPage from '@/pages/components/empty/empty.vue'
	import {
		mapState,
		mapActions
	} from 'vuex'
	import {
		abnormalprompt
	} from '@/common/index.js'
	export default {
		components: {
			loadMore,
			emptyPage
		},
		data() {
			return {
				list: [],
				pageNum: 0,
				pageSize: 10,
				totalSize: 0,
				isLoading: false,
				cardType:[]
			}
		},
		computed: {
			...mapState('login', ['isDisabledUser']),
			isEmpty() {
				return this.list.length == 0
			}
		},
		onShow() {
			if (this.isDisabledUser) {
				abnormalprompt()
			}
		},
		created() {
			this.getData()
		},
		onPullDownRefresh() {
			if (this.isLoading) {
				return
			}
			let isRefresh = true
			this.getData(isRefresh)
		},
		onReachBottom() {
			if (this.totalSize == this.list.length || this.isLoading) {
				return
			}
			this.getData()
		},
		methods: {
			...mapActions('accoutBenefit', ['getCoupons']),
			async getData(isRefresh) {
				this.isLoading = true
				let pageIndex = isRefresh ? 1 : this.pageNum + 1
				console.log(pageIndex, this.pageSize)
				let response = await this.getCoupons({
					pageNum: pageIndex,
					pageSize: this.pageSize
				})
				if (isRefresh) uni.stopPullDownRefresh();
				if (response.code == 200) {
					let {
						pageNum,
						pageSize,
						totalSize,
						userCouponListDTOList: list
					} = response.data
					this.totalSize = totalSize
					this.pageSize = pageSize
					this.pageNum = pageNum
					if (this.pageNum == 1) {
						this.list = []
					}
					this.list = [...this.list, ...list]
					this.cardType = this.list.map(item=>{
						return item.couponId.substr(0,2)
					})
					console.log(this.list)
					console.log(this.cardType)
					if (isRefresh) {
						uni.showToast({
							title: "已刷新",
							icon: "none"
						})
					}
				}
				this.isLoading = false
			},
			goDetail(couponId) {
				uni.navigateTo({
					url: '/pages/coupon/detail?couponId=' + couponId
				})
			}

		}
	}
</script>
<style>
	page {
		background-color: #F9F9F9;
	}
</style>
<style lang="scss" scoped>
	.tip {
		font-size: 24upx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #999999;
		text-align: center;
	}

	.item {
		width: 690upx;
		height: 308upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0upx 0upx 5upx 0upx rgba(0, 15, 41, 0.12);
		margin-bottom: 30upx;

		.date {
			font-size: 24upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #999999;
			line-height: 36upx;
		}

		.title {
			font-size: 26upx;
			font-weight: 500;
			color: #333333;
			line-height: 36upx;
		}

		.discount {
			margin-right: 63upx;

			.unit {
				font-size: 26upx;
				font-weight: 400;
				color: #2C3850;
				margin-right: 13upx;
			}

			.num {
				font-size: 44upx;
				font-weight: 400;
				color: #EC2C5A;
			}
		}

		.footer {
			height: 88upx;
			width: 100%;
			padding-right: 48upx;
			line-height: 70upx;
			border-top: 2upx solid #EFEFEF;

			.pwd {
				font-size: 24upx;
				font-weight: 400;
				color: #999999;
			}

			.btn {
				font-size: 26upx;
				font-weight: 500;
				color: #EC2C5A;
			}
		}
	}
</style>
