<template>
	<view>
		<view class="flex align-center bg-white text-black  padding" style="font-size: 26upx;">
			<text class="flex-sub" v-if="currentCity">当前城市 {{currentCity}}</text>
			<!-- <view class="flex-sub" v-else @click="goSetting"><text class="cuIcon-locationfill"></text>点击获取当前定位 </view> -->
			<view class="flex-sub" v-else><text class="cuIcon-locationfill"></text>所有城市 </view> 
			<view class="flex align-center" @click="goActivityCity">
				<text class="padding-right-sm">切换</text>
				<text class="cuIcon-right" style="color: #000000;font-size: 32upx;"></text>
			</view>
		</view>
		<list-item-card :list="list" @click="goDetail" btnText="我要报名" isApplyText="查看详情" isApplyEndText="报名已结束" :isActivity="true"></list-item-card>
		<empty-page v-if="isEmpty" :noContent="'还没有社区活动内容'"></empty-page>
		<load-more :isLoad="isLoading" :isShow="!isEmpty"></load-more>
		<login-pupop ref="login"></login-pupop>
	</view> 
</template>

<script>
	import {mapState,mapActions,mapGetters,mapMutations} from 'vuex'
	import listItemCard from '../components/list-item/list-item-card.vue'
	import emptyPage from '@/pages/components/empty/empty.vue'
	import loadMore from '@/pages/components/footer/loadMore.vue'
	import login from '@/common/login.js'
	export default{
		onShow(){
			this.$refs.login.checkLogin('tabBar')
			if(this.onCreated){
				this.onCreated = false
				return
			}
			let isRefresh = true
			this.getData(isRefresh)
		},
		mixins:[login],
		components:{
			listItemCard,
			emptyPage,
			loadMore 
		},
		data(){
			return {
				isLoading:false,
				onCreated:false
			}
		},
		computed:{
			...mapState('activity',['list','pageNum','pageSize','totalSize','currentCity']),
			...mapGetters('activity',['isEmpty']) 
		},
		created() {
			this.onCreated = true
			// this.getCityActivityData()
			this.getData()
		},
		async onPullDownRefresh() {
			if(this.isLoading){
				return
			}
			let isRefresh = true
			await this.getData(isRefresh)
			uni.stopPullDownRefresh();
			uni.showToast({
				title:"已刷新",
				icon: "none"
			})
		},
		onReachBottom() {
			if(this.totalSize == this.list.length || this.isLoading){
				return
			}
			this.isLoading = true
			this.getData()
		},
		methods:{
			...mapActions('activity',['getActivityList','getCurrentCity']),
			...mapMutations('activity',['GETCURRENTCITY']),
			// 打开定位设置
			goSetting(){
				let _this = this
				uni.openSetting({
				  success(res) {
					// console.log(res.authSetting)
					if (res.authSetting["scope.userLocation"]) {
					  _this.getCityActivityData()
					}
				  }
				})
			},
			// 获取城市活动
			getCityActivityData(){
				let _this = this
				uni.getLocation({
				    success: async function (res) {
						const {longitude,latitude} = res
						let response = await _this.getCurrentCity({longitude,latitude})
						if(response.code == 200){
							_this.GETCURRENTCITY({currentCity:response.data})
						}
						_this.getData()
				    },
					fail(res) {
						// console.log(res)
						_this.getData()
					}
				});
			},
			async getData(isRefresh){
				let pageIndex = isRefresh? 1 : this.pageNum + 1
				let response = await this.getActivityList({
					pageNum: pageIndex,
					pageSize: this.pageSize,
					city: this.currentCity
				})
				this.isLoading = false
			},
			// 跳转到详情
			goDetail(options){
				uni.navigateTo({
					url:'/pages/activity/detail?code='+ options.code
				})
			},
			// 切换城市
			goActivityCity(){
				uni.navigateTo({
					url:'/pages/activity/city'
				})
			}
		}
	}
</script>
