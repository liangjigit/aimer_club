<template>
	<view>
		<uni-indexed-list :options="activityCities" :show-select="true" @click="selectCity">
			<template v-slot:currentCity>
				<view class="padding-left-xs padding-top-sm">
					<view class="padding-sm flex align-center" style="border-bottom: 1rpx solid #ededed;">
						<text style="font-size: 26upx; color: #999999;">当前：</text>
						<text class="text-black text-sm" @click="goBack">{{currentCity||'所有城市'}}</text>
					</view>
					<!-- <view v-show="currentCity" class="padding-tb text-black text-lg" style="padding-left: 62upx;">
						{{currentCity}}
					</view> -->
					<!-- <view v-show="!currentCity" @click="goSetting" class="padding-tb text-black text-lg" style="padding-left: 62upx;">
						点击获取当前定位
					</view> -->
					<!-- <view v-show="!currentCity" class="padding-tb text-black text-lg" style="padding-left: 62upx;">
						所有城市
					</view> -->
					<view class="padding-sm flex align-center">
						<text class="cuIcon-locationfill margin-right-xs" style="color: #CCCCCC;font-size: 30upx;"></text>
						<text style="font-size: 26upx; color: #999999;">最近访问</text>
					</view>
					<view class="padding-tb text-black text-sm" style="padding-left: 62upx;">
						<text class="margin-right" @click="selectCurrentCity('')">所有城市</text>
						<text class="margin-right" v-for="(item,index) in currentCities" :key="index" @click="selectCurrentCity(item)" >{{item}}</text>
					</view>
					<view class="padding-sm flex align-center">
						<image src="/static/activity/change-icon.png" class="margin-right-xs" mode="aspectFit" style="width: 29upx;height: 29upx;"></image>
						<text style="font-size: 26upx;color: #999999;line-height: 1;">切换其他城市</text>
					</view>
				</view>
			</template>
			<template v-slot:footer>
				<view>
					<empty-page v-if="isEmpty" v-show="isEmpty" :noContent="'还没有活动城市'"></empty-page>
					<load-more :isLoad="isLoading" :isShow="!isEmpty"></load-more>
				</view>
			</template>
		</uni-indexed-list>
		<login-pupop ref="login"></login-pupop>
	</view>
</template>

<script>
	import {mapState,mapActions,mapMutations} from 'vuex'
	import uniIndexedList from '@/pages/components/list-city/list.vue'
	import emptyPage from '@/pages/components/empty/empty.vue'
	import loadMore from '@/pages/components/footer/loadMore.vue'
	import {checkForAuthorization} from '@/common/index.js'
	export default {
		onShow(){
			this.$refs.login.checkLogin()
		},
		components: {
			uniIndexedList,
			emptyPage,
			loadMore
		},
		data() {
			return {
				isLoading:false,
				currentCities:[]//
			}
		},
		created() {
			this.getData()
			let currentCities = uni.getStorageSync('currentCities')
			if(currentCities){
				this.currentCities = JSON.parse(currentCities)
			}
		},
		computed:{
			...mapState('activity',['currentCity','activityCities','list','pageNum','pageSize','totalSize','currentCity']),
			isEmpty(){
				return this.activityCities.length ==0
			}
		},
		methods: {
			...mapActions('activity',['getActivityCities','getActivityList','getCurrentCity']),
			...mapMutations('activity',['GETCURRENTCITY']),
			goSetting(){
				let _this = this
				checkForAuthorization('scope.userLocation').then(()=>{
					_this.getLocation()
				})
			},
			getLocation(){
				let _this = this
				uni.getLocation({
				    success: async function (res) {
						const {longitude,latitude} = res
						let response = await _this.getCurrentCity({longitude,latitude})
						if(response.code == 200){
							_this.GETCURRENTCITY({currentCity:response.data})
						}
				    },
					fail(res) {
						uni.showToast({
							title:"获取定位失败"
						})
					}
				});
			},
			async getData(){
				this.isLoading = true
				await this.getActivityCities({})
				this.isLoading = false
			},
			selectCurrentCity(name){
				console.log(name)
				this.selectCity({item:{name:name}})
			},
			goBack(){
				uni.navigateBack()
			},
			async selectCity(options) {
				console.log(options)
				this.GETCURRENTCITY({currentCity:options.item.name})
				await this.getActivityList({
					pageNum: 1,
					pageSize: this.pageSize,
					city: this.currentCity
				})
				uni.navigateBack()
				if(options.item.name){
					this.currentCities.unshift(this.currentCity)
					this.currentCities = [...new Set(this.currentCities)].slice(0,3)
					console.log(this.currentCities)
					uni.setStorageSync('currentCities',JSON.stringify(this.currentCities))
				}
				// console.log('点击item，返回数据' + JSON.stringify(options))
			}
			
		}
	}
</script>

<style></style>