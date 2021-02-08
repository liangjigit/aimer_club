<template>
	<view class="">
		<view class="location padding-tb-lg padding-lr flex align-center">
			<text class="city" v-show="currentCity">当前城市 {{currentCity}}</text>
			<!-- <text class="change">切换城市</text>
			<view class="change-icon">
				<image src="/static/activity/change-icon.png" mode="aspectFit"></image>
			</view> -->
		</view>
		<view class="select-box flex align-center" v-show="currentStore">
			<view class="cuIcon-locationfill" style="color:#CCCCCC"></view>
			<view class="text-cut name flex-sub" v-show="!showShops"  @click="toggleShops">
				<text class="text-cut" >{{currentStore}}</text>
			</view>
			<view class="text-cut name flex-sub" v-show="showShops">
				<input type="text" v-model="searchShopName"  placeholder="输入关键词搜索" :disabled="!showShops" placeholder-class="nameInput" confirm-type="search" :confirm-hold="true" @input="searchStoresByName" @confirm="searchStoresByName"/>
			</view>
			<view class="switchBtn flex align-center justify-center"  @click="toggleShops">
				<view class="cuIcon-right upper" :class="{upper:showShops,down:!showShops}" ></view>
			</view>
		</view>
		<scroll-view v-show="showShops" @scrolltolower="getMoreShops" refresher-enabled="true" :refresher-triggered="triggered"
		             :refresher-threshold="50" refresher-background="white" @refresherpulling="onPulling"
		             @refresherrefresh="onRefresh" @refresherrestore="onRestore" @refresherabort="onAbort"
		 class="select-list flex flex-direction align-center" scroll-y="true" scroll-with-animation="true" :style="'height:'+selectShopHeight+'px'">
			<view class="item padding-tb flex justify-between align-center" v-for="(item,index) in shopList" :key="index" @click="selectShop(item.store_name,item.store_code)">
				<view class="shop">{{item.store_name}}</view>
				<view class="cuIcon-check text-red text-lg check-icon"></view>
			</view>
			<view class="bg-white padding-tb" style="margin-top: -30upx; margin-bottom: -30upx;">
				<empty-page v-if="isEmpty" :noContent="isLoading?'':'无搜索结果'" :imageHeight="'0px'" :top="'30px'"></empty-page>
				<load-more :isLoad="isLoading" :isShow="!isEmpty"></load-more>
			</view>
		</scroll-view>
		<view class="line" v-if="departUserList.length>0"></view>
		<view class="guide">
			<view class="item flex justify-between align-center checked" v-for="(item,index) in departUserList"  :key="index" @click="goDetail(item.userId)">
				<view class="avatar">
					<image :src="item.thumbAvatar" mode="aspectFill"></image>
				</view>
				<view class="info flex-sub">
					<view class="name">
						{{item.name}}
					</view>
					<view class="area">
						{{district}} | {{item.position}}
					</view>
				</view>
				<view class="cuIcon-right text-lg" style="color: #999999;"></view>
			</view>
			<empty-page v-if="departUserList.length==0" :noContent="isLoading?'':'还没有导购哦'" :imageHeight="'0px'" :top="'50px'"></empty-page>
		</view>
	</view>
</template>

<script>
	import {mapState,mapActions,mapGetters,mapMutations} from 'vuex'
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
				district:"",// 店铺所在区
				//搜索店铺结果
				shopList:[],
				pageNum: 0,
				pageSize: 20,
				totalSize: 0,
				isLoading:true,//加载中
				searchShopName:"",//搜索的店铺名称
				lat:null,
				lng:null,
				currentStore:null, // 最近的一个门店名称
				departUserList:[], // 最近的门店导购
				showShops:false, // 是否显示店铺搜索框
				selectShopHeight:0, //搜索框高度
				// 自定义下拉刷新
				triggered: false,//下拉刷新是否被触发
				_freshing: false // 是否正在刷新
			}
		},
		computed:{
			...mapState('shoppingGuide',['currentCity','nearStore']),
			...mapState('login',['userInfo']),
			isEmpty(){
				return this.shopList.length ===0
			}
		},
		async created() {
			if(this.userInfo.guideId){
				uni.redirectTo({
					url:'/pages/account/shoppingGuide/detail?userId='+this.userInfo.guideId
				})
			}else{
				this.getData()
				const res = uni.getSystemInfoSync();
				this.selectShopHeight =  res.windowHeight - 110;
			}
		},
		methods:{
			...mapActions('shoppingGuide',['getNearStores','searchStores','getDepartUserList']),
			...mapMutations('shoppingGuide',['GETCURRENTCITY']),
			// 根据用户定位获取店铺、导购等信息
			getData(){
				uni.showLoading({
					title:"加载中...",
					icon:"none"
				})
				let _this = this
				checkForAuthorization('scope.userLocation').then(()=>{
					uni.getLocation({
						success: async function (res) {
							_this.isLoading = true
							const {longitude,latitude} = res
							_this.lat = latitude
							_this.lng = longitude
							let response = await _this.getNearStores({lat:latitude,lng:longitude})
							if(response.code == 200){
								const {city,departUserList,department,county,pageNum, pageSize, totalSize} = response.data
								_this.GETCURRENTCITY({currentCity:city})
								_this.currentStore = department // 最近的门店名称
								_this.departUserList = departUserList
								_this.district = county
							}
							_this.isLoading = false
							uni.hideLoading()
						},
						fail(error) {
							console.log(error)
							uni.hideLoading()
						}
					});
				}).catch((err)=>{
					uni.hideLoading()
					uni.navigateBack()
				})
			},
			// 搜索门店
			searchStoresByName(event){
				this.searchShopName = event.detail.value
				const isRefresh = true
				this.searchStoreRequest(isRefresh)
			},
			// 发送搜索店铺请求
			async searchStoreRequest(isRefresh){
				const {searchShopName:name,lat,lng,pageSize,pageNum,totalSize} = this
				this.isLoading = true
				let pageIndex = isRefresh? 1 : pageNum + 1 
				console.log({name,lat,lng,pageNo:pageIndex,pageSize})
				let response = await this.searchStores({name,lat,lng,pageNo:pageIndex,pageSize})
				if(response.code == 200){
					console.log(response.data)
					const {list,pageNum,pageSize,totalSize} = response.data
					if(pageNum == 1){
						this.shopList = []
					}
					this.shopList = [...this.shopList, ...list]
					this.pageSize = pageSize
					this.pageNum = pageNum
					this.totalSize = totalSize
					
				}
				this.isLoading = false
			},
			//搜索店铺
			async selectShop(storeName,storeCode){
				this.showShops = false
				let response = await this.getDepartUserList({departmentId:storeCode,departmentName:storeName})
				if(response.code == 200){
					const {departUserList,departmentName} = response.data
					this.departUserList = departUserList
					this.currentStore = departmentName
				}
			},
			// 跳转导购详情
			goDetail(userId){
				uni.navigateTo({
					url:'/pages/account/shoppingGuide/detail?userId='+userId
				})
			},
			// 选择城市
			// goCity(){
			// 	uni.navigateTo({
			// 		url:'/pages/account/shoppingGuide/city'
			// 	})
			// },
			// 自定义下拉刷新控件被下拉
			async onPulling(e) {
				this.triggered = true; // 需要重置
				this.pageNum == 0
			},
			// 自定义下拉刷新被触发
			async onRefresh() {
				if (this._freshing) return;
				this._freshing = true;
				if (!this.triggered) this.triggered = true; //界面下拉触发，triggered可能不是true，要设为true  
				const isRefresh = true
				await this.searchStoreRequest(isRefresh)
				this.triggered = false;
				this._freshing = false;
			},
			// 自定义下拉刷新被复位
			onRestore() {
				this.triggered = false; // 需要重置
			},
			// 自定义下拉刷新被中止
			onAbort() {
				this.triggered = false;
			},
			// 切换店铺搜索
			toggleShops(){
				this.showShops = !this.showShops
				if(this.pageNum == 0){
					this._freshing = false;
					setTimeout(() => {
						this.triggered = true;
					}, 200)	
				}
			},
			// 滚动到底部 加载更多
			async getMoreShops(){
				if(this.totalSize == this.shopList.length || this.isLoading){
					return
				}
				await this.searchStoreRequest()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.switchBtn{
		width: 50rpx;
		height: 50rpx;
	}
	.guide{
		.item{
			padding: 47upx 28upx;
			.avatar{
				width:98upx;
				height:98upx;
				border-radius:100%;
				overflow: hidden;
				margin-right: 37upx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.info{
				.name{
					font-size:32upx;
					font-weight:500;
					color: #111111;
					margin-bottom: 13upx;
					line-height: 1;
				}
				.area{
					font-size:28upx;
					color:#333333;
					font-weight:400;
					line-height: 1;
				}
			}
		}
	}
	.upper{
		transform: rotate(90deg);
	}
	.down{
		transform: rotate(-90deg);
	}
	.select-list{
		position: absolute;
		background-color: rgba(0,0,0,0.5);
		top: 110px;
		left: 0;
		width: 100%;
		height: 100%;
		bottom: 0;
		z-index: 2;
		.content{
			padding-left: 76upx;
			padding-right: 45upx;
			width: 100%;
		}
		.item{
			position: relative;
			background-color: #FFFFFF;
			padding-left: 75upx;
			padding-right: 45upx;
			&::before{
				content: "";
				position: absolute;
				top: 0;
				left: 72upx;
				right: 72upx;
				width: 606upx;
				height: 1upx;
				background-color: #F9F9F9;
			}
			&::after{
				content: "";
				position: absolute;
				bottom: 0;
				left: 72upx;
				right: 72upx;
				width: 606upx;
				height: 1upx;
				background-color: #F9F9F9;
			}
			&:first-child{
				&::before{
					top: 0;
				}
			}
			&:last-child{
				&::after{
					height: 0;
				}
			}
			.shop{
				font-size:32upx;
				font-weight:400;
				color: #111111;
			}
			.check-icon{
				display: none;
				width: 32upx;
				height: 32upx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			&.checked{
				.shop{
					font-size:34upx;
					font-weight:500;
				}
				.check-icon{
					display: block;
				}
			}
		}
	}
	.select-box{
		padding: 15upx 47upx 50upx 34upx;
		.name{
			font-size:34upx;
			font-weight:500;
			color: #111111;
			margin-left: 18upx;
			input{
				font-weight:400;
			}
		}
	}
	.location{
		.city{
			font-size:28upx;
			font-weight:400;
			color: #333333;
			margin-right: 18upx;
		}
		.change{
			font-size:26upx;
			font-weight:400;
			color: #999999;
			margin-right: 16upx;
		}
		.change-icon{
			width:29upx;
			height:29upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	.line{
		width: 100%;
		height:20upx;
		background:rgba(249,249,249,1);
	}
	.guide{
		background-color: #FFFFFF;
		.avatar{
			width:98upx;
			height:98upx;
			border-radius:50%;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.name{
			margin-bottom: 13upx;
			text{
				font-size:34upx;
				font-weight:500;
				color: #111111;
			}
		}
		.nameInput{
			font-size:32upx;
			font-weight:500;
			color: #111111;
		}
		.area{
			font-size:28px;
			font-weight:400;
			color: #333333;
		}
	}
</style>
