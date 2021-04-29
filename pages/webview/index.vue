<template>
    <view>
        <web-view :webview-styles="webviewStyles" :src="url"></web-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                webviewStyles: {
                    progress: {
                        color: '#EC2C5A'
                    }
                },
				url:''//页面url
            }
        },
		onLoad(options) {
			const {url} = options
			this.url = url
		}
    }
</script>

<style>

</style>