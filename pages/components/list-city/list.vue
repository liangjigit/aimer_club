<template>
	<view class="uni-indexed-list" ref="list" id="list">
		
		<!-- #ifdef APP-NVUE -->
		<list class="uni-indexed-list__scroll" scrollable="true" show-scrollbar="false">
			<slot name="currentCity"></slot>
			<cell v-for="(list, idx) in lists" :key="idx" :ref="'uni-indexed-list-' + idx">
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<view class="uni-indexed-list__scroll">
				<!-- <scroll-view :scroll-into-view="scrollViewId" class="uni-indexed-list__scroll" scroll-y> -->
					<slot name="currentCity"></slot>
					<view v-for="(list, idx) in lists" :key="idx" :id="'uni-indexed-list-' + idx">
						<!-- #endif -->
						<uni-indexed-list-item :list="list" :loaded="loaded" :idx="idx" :showSelect="showSelect" @itemClick="onClick"></uni-indexed-list-item>
						<!-- #ifndef APP-NVUE -->
					</view>
					<slot name="footer"></slot>
				<!-- </scroll-view> -->
				</view>
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
			</cell>
		</list>
		<!-- #endif -->
		<view :class="touchmove ? 'uni-indexed-list__menu--active' : ''" @touchstart="touchStart" @touchmove.stop.prevent="touchMove" @touchend="touchEnd" class="uni-indexed-list__menu">
			<view v-for="(list, key) in lists" :key="key" class="uni-indexed-list__menu-item">
				<text class="uni-indexed-list__menu-text" :class="touchmoveIndex == key ? 'uni-indexed-list__menu-text--active' : ''">{{ list.key }}</text>
			</view>
		</view>
		<view v-if="touchmove&&lists[touchmoveIndex].key" class="uni-indexed-list__alert-wrapper">
			<text class="uni-indexed-list__alert">{{ lists[touchmoveIndex].key }}</text>
		</view>
	</view>
</template>
<script>
	import uniIndexedListItem from '@/pages/components/list-city/list-item.vue'
	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom');
	// #endif
	// #ifdef APP-PLUS
	function throttle(func, delay) {
		var prev = Date.now();
		return function() {
			var context = this;
			var args = arguments;
			var now = Date.now();
			if (now - prev >= delay) {
				func.apply(context, args);
				prev = Date.now();
			}
		}
	}

	function touchMove(e) {
		let pageY = e.touches[0].pageY
		let index = Math.floor((pageY - this.winOffsetY) / this.itemHeight)
		if (this.touchmoveIndex === index) {
			return false
		}
		let item = this.lists[index]
		if (item) {
			// #ifndef APP-NVUE
			
			this.scrollViewId = 'uni-indexed-list-' + index
			
			this.touchmoveIndex = index
			// #endif
			// #ifdef APP-NVUE
			dom.scrollToElement(this.$refs['uni-indexed-list-' + index][0], {
				animated: false
			})
			this.touchmoveIndex = index
			// #endif
		}
	}
	const throttleTouchMove = throttle(touchMove, 40)
	// #endif

	/**
	 * IndexedList 索引列表
	 * @description 用于展示索引列表
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=375
	 * @property {Boolean} showSelect = [true|false] 展示模式
	 * 	@value true 展示模式
	 * 	@value false 选择模式
	 * @property {Object} options 索引列表需要的数据对象
	 * @event {Function} click 点击列表事件 ，返回当前选择项的事件对象
	 * @example <uni-indexed-list options="" showSelect="false" @click=""></uni-indexed-list>
	 */
	export default {
		components: {
			uniIndexedListItem,
		},
		props: {
			options: Array,
			showSelect: Boolean
		},
		data() {
			return {
				lists: [],
				winHeight: 0,
				itemHeight: 0,
				winOffsetY: 0,
				touchmove: false,
				touchmoveIndex: -1,
				scrollViewId: '',
				touchmoveTimeout: '',
				loaded: false
			}
		},
		computed:{
			scrollview(){
				uni.pageScrollTo({
					selector:this.scrollViewId
				})
				return true
			}
		},
		watch: {
			options: {
				handler: function() {
					this.setList()
				},
				deep: true
			}
		},
		mounted() {
			setTimeout(() => {
				this.setList()
			}, 50)
			setTimeout(() => {
				this.loaded = true
			}, 300);
		},
		methods: {
			setList() {
				let index = 0;
				this.lists = []
				if(this.options.length==0){
					return
				}
				this.options.forEach((value, index) => {
					if (value.data.length === 0) {
						return
					}
					let indexBefore = index
					let items = value.data.map(item => {
						let obj = {}
						obj['key'] = value.letter
						obj['name'] = item
						obj['itemIndex'] = index
						index++
						obj.checked = item.checked ? item.checked : false
						return obj
					})
					this.lists.push({
						title: value.letter,
						key: value.letter,
						items: items,
						itemIndex: indexBefore
					})
				})
				// #ifndef APP-NVUE
				uni.createSelectorQuery()
					.in(this)
					.select('#list')
					.boundingClientRect()
					.exec(ret => {
						this.winOffsetY = 229.5/2;//ret[0].top
						this.itemHeight = 20;//this.winHeight / this.lists.length
						this.winHeight = this.lists.length * this.itemHeight;//ret[0].height
						// this.winHeight = 459;//ret[0].height
						// this.itemHeight = this.winHeight / this.lists.length
					})
				// #endif
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['list'], (res) => {
					this.winOffsetY = res.size.top
					this.winHeight = res.size.height
					this.itemHeight = this.winHeight / this.lists.length
				})
				// #endif
			},
			touchStart(e) {
				this.touchmove = true
				let pageY = e.touches[0].pageY
				let index = Math.floor((pageY - this.winOffsetY) / this.itemHeight)
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = 'uni-indexed-list-' + index
					this.touchmoveIndex = index
					// #ifdef APP-NVUE
					dom.scrollToElement(this.$refs['uni-indexed-list-' + index][0], {
						animated: false
					})
					// #endif
				}
			},
			touchMove(e) {
				// #ifndef APP-PLUS
				let pageY = e.touches[0].pageY
				let index = Math.floor((pageY - this.winOffsetY) / this.itemHeight)
				if (this.touchmoveIndex === index) {
					return false
				}
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = 'uni-indexed-list-' + index
					this.touchmoveIndex = index
				}
				// #endif
				// #ifdef APP-PLUS
				throttleTouchMove.call(this, e)
				// #endif
			},
			touchEnd() {
				this.touchmove = false
				this.touchmoveIndex = -1
			},
			onClick(e) {
				let {
					idx,
					index
				} = e
				let obj = {}
				for (let key in this.lists[idx].items[index]) {
					obj[key] = this.lists[idx].items[index][key]
				}
				let select = []
				if (this.showSelect) {
					this.lists[idx].items[index].checked = !this.lists[idx].items[index].checked
					this.lists.forEach((value, idx) => {
						value.items.forEach((item, index) => {
							if (item.checked) {
								let obj = {}
								for (let key in this.lists[idx].items[index]) {
									obj[key] = this.lists[idx].items[index][key]
								}
								select.push(obj)
							}
						})
					})
				}
				this.$emit('click', {
					item: obj,
					select: select
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	
	.uni-indexed-list {
		// position: absolute;
		// left: 0;
		// top: 0;
		// right: 0;
		// bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		background-color: #FFFFFF;
	}

	.uni-indexed-list__scroll {
		flex: 1;
	}

	.uni-indexed-list__menu {
		width: 24px;
		background-color: transparent;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: fixed;
		right: 0;
		top: 50%;
		margin-top: -229.5px;
		height: 459px;
	}

	.uni-indexed-list__menu-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		// flex: 1;
		// align-items: center;
		// justify-content: center;
	}

	.uni-indexed-list__menu-text {
		line-height: 20px;
		font-size: 12px;
		text-align: center;
		color: #aaa;
	}

	.uni-indexed-list__menu--active {
		background-color: transparent;
	}

	.uni-indexed-list__menu-text--active {
		color: $aimer-color;
	}

	.uni-indexed-list__alert-wrapper {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.uni-indexed-list__alert {
		width: 80px;
		height: 80px;
		border-radius: 80px;
		text-align: center;
		line-height: 80px;
		font-size: 35px;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.2);
	}
</style>