<template>
	<view class="padding-left-xs margin-bottom">
		<view v-if="loaded || list.itemIndex < 15" class="uni-indexed-list__title-wrapper padding-left-xxl">
			<text v-if="list.items && list.items.length > 0" class="uni-indexed-list__title text-black">{{ list.key }}</text>
		</view>
		<view v-if="(loaded || list.itemIndex < 15) && list.items && list.items.length > 0" class="uni-indexed-list__list padding-left-xxl">
			<view v-for="(item, index) in list.items" :key="index" class="uni-indexed-list__item" hover-class="uni-indexed-list__item--hover">
				<view class="uni-indexed-list__item-container" @click="onClick(idx, index)">
					<view class="uni-indexed-list__item-border" :class="{'uni-indexed-list__item-border--last':index===list.items.length-1}">
						<text class="uni-indexed-list__item-content text-black">{{ item.name }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			loaded: {
				type: Boolean,
				default: false
			},
			idx: {
				type: Number,
				default: 0
			},
			list: {
				type: Object,
				default () {
					return {}
				}
			},
			showSelect: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			onClick(idx, index) {
				this.$emit("itemClick", {
					idx,
					index
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-indexed-list__list {
		background-color: #ffffff;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		border-top-style: solid;
		border-top-width: 2upx;
		border-top-color: #f9f9f9;
	}

	.uni-indexed-list__item {
		font-size: 32upx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-container {
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-border {
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 94upx;
		/* padding: 0 64upx 0 80upx; */
		padding-left: 0;
		border-bottom-style: solid;
		border-bottom-width: 2upx;
		border-bottom-color: #f9f9f9;
	}

	.uni-indexed-list__item-border--last {
		border-bottom-width: 0px;
	}

	.uni-indexed-list__item-content {
		flex: 1;
		font-size: 14px;
	}

	.uni-indexed-list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-indexed-list__title-wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
		background-color: #FFFFFF; 
	}

	.uni-indexed-list__title {
		padding: 3px 0upx;
		line-height: 24px;
		font-size: 15px;
		color: #333;
	}
	.padding-left-xxl{
		padding-left: 60upx;
	}
</style>