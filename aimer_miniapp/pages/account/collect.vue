<template>
	<view class="flex flex-direction align-center padding-top">
		<view v-if="!isEmpty">
			<list-item-like :list="list" :model="Model" @click="goDetail" @doCollect="collect()"></list-item-like>
		</view> 
		<empty-page v-if="isEmpty" :noContent="'您还没有收藏内容'" :linkText="'先去逛逛吧'" @click="goHome"></empty-page>
		<load-more :isLoad="isLoading" :isShow="!isEmpty"></load-more>
	</view>
</template>

<script>
	import {mapState,mapActions,mapMutations,mapGetters} from 'vuex'
	import listItemLike from '@/pages/components/list-item/list-item-like.vue'
	import emptyPage from '@/pages/components/empty/empty.vue'
	import loadMore from '@/pages/components/footer/loadMore.vue'
	const Model = 1; // cup 有料
	export default {
		components:{
			listItemLike,
			emptyPage,
			loadMore
		},
		computed:{
			...mapState('accountCollect',['list','pageNum','pageSize','totalSize']),
			...mapState('index',['selector']),
			...mapGetters('accountCollect',['isEmpty'])
		},
		created() {
			this.getCollectList({
				 pageNum: 1,
				 pageSize: this.pageSize,
				 model: Model,
			})
		},
		data(){
			return{
				isLoading:false
			}
		},
		onPullDownRefresh() {
			if(this.isLoading){
				return
			}
			let isRefresh = true
			this.getData(isRefresh)
		},
		onReachBottom() {
			if(this.totalSize == this.list.length || this.isLoading){
				return
			}
			this.getData()
		},
		methods:{
			 ...mapActions('accountCollect',['getCollectList','doCollect']),
			 ...mapMutations('accountCollect',['GETCOLLECTLIST','CHANGECOLLECTSTATE']),
			 ...mapMutations('index',['SETSELECTOR']),
			 ...mapMutations('cup', ['CHANGECOLLECT']),
			 async getData(isRefresh){
			 	this.isLoading = true
			 	let pageIndex = isRefresh? 1 : this.pageNum + 1
			 	let response = await this.getCollectList({
			 		 pageNum: pageIndex,
			 		 pageSize: this.pageSize,
					 model: Model,
			 	})
				if(isRefresh) uni.stopPullDownRefresh();
				if(response.code == 200){
					if(isRefresh){
						uni.showToast({
							title:"已刷新",
							icon: "none"
						})
					}
				}
				this.isLoading = false
			 },
			 async collect(options){
				 let {code,isCollect} = options
				 let response = await this.doCollect({
				 	 modelCode: code,
				 	 model: Model,
					 type: Number(isCollect)
				 })
				 if(response.code == 200){
					 this.CHANGECOLLECTSTATE({  // 收藏列表收藏状态
						 code,
						 isCollect:!isCollect
					 })
					 this.CHANGECOLLECT({ // cup 有料列表收藏状态
						 code,
						 isCollect:!isCollect
					 })
					 uni.showToast({
					 	title:!isCollect?'收藏成功':'已取消',
						icon:"none"
					 })
				 }
			 },
			 goDetail(options){
				let {code} = options
				uni.navigateTo({
					url:'/pages/cup/detail?code='+code
				})
			 },
			 goHome(){
				 this.SETSELECTOR({selector:'#cup-box'})
				 uni.switchTab({
				 	url:'/pages/index/index'
				 })
				 
			 }
		}
		
	}
</script>

<style lang="scss" scoped>
	
</style>
