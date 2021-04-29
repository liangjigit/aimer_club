<template>
	<view>
		<uni-indexed-list :options="list" :show-select="true" @click="bindClick">
			<template v-slot:currentCity>
				<view class="flex padding-tb-lg padding-left">
					<text class="current-city">{{currentCity}}</text>
					<text class="change-text">切换城市</text>
					<text class="cuIcon-right"></text>
				</view>
			</template>
		</uni-indexed-list>
	</view>
</template>

<script>
	import {mapState,mapActions,mapGetters,mapMutations} from 'vuex'
	import uniIndexedList from '@/pages/components/list-city/list.vue'
	export default {
		components: {
			uniIndexedList
		},
		data() {
			return {
				cityList: [],// 门店城市列表
				isLoading:false
			}
		},
		created(){
			this.getData()
		},
		computed:{
			...mapState('shoppingGuide',['currentCity']),
		},
		onLoad(options) {
		},
		methods: {
			...mapActions('shoppingGuide',['getStoresCity','searchStoresByCity']),
			async getData(){
				this.isLoading = true
				let response = await this.getStoresCity({})
				if(response.code == 200){
					this.cityList = [...response.data]
				}
				this.isLoading = false
			},
			async bindClick(options) {
				this.GETCURRENTCITY({currentCity:options.item.name})
				await this.searchStoresByCity({name:options.item.name})
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	.current-city{
		font-size:28px;
		font-weight:400;
	}
	.change-text{
		color: #999999;
		font-size:26upx;
	}
	.cuIcon-right{
		color: #999999;
	}
</style>