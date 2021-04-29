<template>
	<view>
		<list-item-card :list="list" @click="goDetail" :btnText="'查看详情'"></list-item-card>
		<empty-page v-if="isEmpty" :noContent="'还没有BRARTS内容'"></empty-page>
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
			...mapState('brarts',['list','pageNum','pageSize','totalSize']),
			...mapGetters('brarts',['isEmpty'])
		},
		created() {
			this.onCreated = true
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
			...mapActions('brarts',['getBrartsList']),
			async getData(isRefresh){
				let pageIndex = isRefresh? 1 : this.pageNum + 1
				let response = await this.getBrartsList({
					pageNum: pageIndex,
					pageSize: this.pageSize 
				})
				this.isLoading = false
			},
			// 跳转到详情
			goDetail(options){
				uni.navigateTo({
					url:'/pages/brarts/detail?code='+ options.code
				})
			}	
		}
	}
</script>