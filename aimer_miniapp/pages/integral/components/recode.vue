<template>
	<view class="list flex flex-direction align-center padding-lr" v-show="isShow">
		<view class="item flex justify-between align-center" v-for="(item,index) in list" :key="index">
			<view class="flex flex-direction">
				<text class="title">{{item.source}}</text>
				<text class="date">{{item.integralDate}}</text>
			</view>
			<text class="count">+{{item.integral}}</text>
		</view>
		<empty-page v-if="isEmpty" :noContent="'您还没有积分流水哦'"></empty-page>
		<load-more :isLoad="isLoading" :isShow="!isEmpty"></load-more>
	</view>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	import emptyPage from '@/pages/components/empty/empty.vue'
	import loadMore from '@/pages/components/footer/loadMore.vue'
	export default{
		components:{
			emptyPage,
			loadMore
		},
		props:{
			isShow:Boolean,
			isLoading:Boolean
		},
		computed:{
			...mapState('integral',['list']),
			isEmpty(){
				return this.list.length == 0
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list{
		width:100%;
		// height:206upx;
		background:rgba(249,249,249,1);
		padding: 36upx 0;
		.item{
			width:690upx;
			height:134upx;
			background:rgba(254,255,254,1);
			margin-bottom: 30upx;
			padding: 30upx 24upx;
			&:last-child{
				margin-bottom: 0upx;
			}
			.title{
				font-size:26upx;
				font-weight:500;
				color: #333333;
				margin-bottom: 20upx;
			}
			.date{
				font-size:22upx;
				font-weight:500;
				color: #C0C0C0;
			}
			.count{
				font-size:36upx;
				font-family:PingFang SC;
				font-weight:500;
				color: #111111;
			}
			
		}
	}
</style>
