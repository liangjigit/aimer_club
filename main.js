import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import login from './pages/components/login/index.vue'
//把vuex定义成全局组件
Vue.config.productionTip = false
App.mpType = 'app'
 
Vue.component('login-pupop', login);

const app = new Vue({
    ...App,
	store,
	mounted() {
		// 微信小程序登录
		// this.$store.dispatch('login/onGetUserInfo',{})
	}
}).$mount('#app')
