<template>
	<view class="flex flex-direction justify-center align-center" :style="{'margin-top': top}">
		<image :style="{height: imageHeight}" src="/static/empty.png" mode="aspectFit"></image>
		<view class="text-black text-sm margin-top-sm">
			{{noContent}}
		</view>
		<view class="margin-top-sm" @click="goPage" v-if="linkText">
			<text class="text-red text-df margin-right-xs">{{linkText}}</text>
			<text class="cuIcon-roundright text-red text-df"></text>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			noContent:String,
			linkText:String,
			imageHeight:{
				type:String,
				default:"150px"
			},
			top:{
				type:String,
				default:"150px"
			}
		},
		methods:{
			goPage(){
				this.$emit('click')
			}
		}
	}
</script>

<style>
</style>
