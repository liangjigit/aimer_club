<template>
	<view class="" >
		<map v-if="latitude" :longitude="longitude" :latitude="latitude" :show-location="true" style="width: 750upx;height: 308px;"></map>
		<scroll-view v-if="!isEmpty" class="bg-white" :scroll-y="true" @scrolltolower="scrolltolower"  :style="{height:height}" scroll-with-animation="true">
			<view class="flex flex-direction border-bottom padding" v-for="(item,index) in list" :key="index" @click="goDetail($event,index)">
				<view class="margin-bottom-lg flex justify-between align-center">
					<text class="name">{{item.store_name}}</text>
					<text class="distance">{{item.distance}}km</text>
				</view>
				<view class="flex justify-between">
					<text class="detail">{{item.store_address}}</text> 
					<text class="cuIcon-right"></text> 
				</view>
			</view>
			<load-more :isLoad="isLoading" :isShow="true"></load-more>
		</scroll-view>
		<empty-page v-if="isEmpty" :image-height="'85px'" :top="'100px'" :noContent="'您的附近还没有门店哦'"></empty-page>
	</view>
</template>

<script>
	import request from '@/utils/request.js'
	import {mapState,mapActions,mapMutations} from 'vuex'
	import emptyPage from '@/pages/components/empty/empty.vue' 
	import loadMore from '@/pages/components/footer/loadMore.vue'
	import {checkForAuthorization} from '@/common/index.js'
	export default{
		components:{
			emptyPage,
			loadMore
		},
		data(){
			return{
				longitude:null,
				latitude:null,
				height:'0px',
				isLoading:false,
				hasMore:true,
				pageIndex:0,
				pageSize:10
			}
		},
		computed:{
			...mapState('accountStoreNav',['list']),
			isEmpty(){
				return this.list.length == 0
			}
		},
		created() {
			let _this = this
			checkForAuthorization('scope.userLocation').then(()=>{
				uni.getLocation({
					type:"gcj02",
					success: function (res) {
						_this.longitude = res.longitude
						_this.latitude = res.latitude
						// 获取门店信息
						_this.getStoreList()
					}
				});
			}).catch((err)=>{
				uni.navigateBack()
			})
		},
		onLoad() {
			let system = uni.getSystemInfoSync()
			this.height = (system.windowHeight - 308) + "px" 
		},
		methods:{
			...mapActions('accountStoreNav',['getStores']),
			...mapMutations('accountStoreNav',['GETSTORENAVS']),
			goDetail(e,index){
				uni.navigateTo({
					url:"/pages/account/storeNav/detail?index="+index 
				})
			},
			async getStoreList(){
				this.isLoading = true
				this.pageIndex++
				let response = await this.getStores({
					distance:"60",
					lat:this.latitude.toString(),
					lng:this.longitude.toString(),
					page_no:this.pageIndex,
					page_size:this.pageSize
				})
				if(response.code == 200){
					let list = response.data
					if(list.length == 0 || list.length < this.pageSize){
						this.hasMore = false
					}else{
						this.GETSTORENAVS({list})
					}
				}
				this.isLoading = false
			},
			scrolltolower(){
				if(!this.hasMore||this.isLoading){
					return
				}
				this.getStoreList()
			}
		}
	}
</script>

<style scoped>
	.name{
		width: 510upx;
		color: #111111;
		font-size: 30upx;
		font-weight:500;
	}
	.distance{
		color: #999999;
		font-size:26upx;
		font-weight:400;
	}
	.detail{
		width: 510upx;
		white-space: normal;
		color: #999999;
		font-size:24upx;
		font-weight:400;
	}
	.cuIcon-right{
		color: #999999;
		margin-top: -26rpx;
		font-size: 38rpx;
	}
	.border-bottom{
		position: relative;
	}
	.border-bottom::after{
		content: "";
		position: absolute;
		bottom: 0;
		width: 690upx;
		height: 1upx;
		background-color: #EFEFEF;
		left: 30upx;
	}
</style>
