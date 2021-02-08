<template>
<div class="padding-lr" style="width: 750upx;">
	 <div class="ql-container ql-snow">
		 <div class="ql-editor">
			 <jyf-parser :html="content" ref="article" @parse="parse" @ready="ready" @linkpress="linkpress"></jyf-parser>
		</div>
	 </div>
 </div>
</template>

<script>
import jyfParser from "@/components/jyf-parser/jyf-parser"
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import {navigatorToPage} from '@/common/index.js'
export default {
	components:{
		jyfParser
	},
	props: {
		content: String
	},
	methods:{
		parse(){
			uni.showLoading({
				title:"加载中"
			})
		},
		ready(){
			uni.hideLoading()
			this.$emit('ready')
		},
		linkpress(e){
			if(e.href){
				e.ignore()
				navigatorToPage(e.href,2)
			}
		}
	}
};
</script>

<style scoped>
	.ql-container.ql-snow{
		border-width:0;
		height: auto;
		min-height: auto;
	}
	.ql-editor{
		padding: 0;
	}
</style>
