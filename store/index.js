import Vue from "vue";
import Vuex from "vuex";
import login from "./modules/login"; // 登录
import index from "./modules/index.js" // 首页
import accoutBaseInfo from "./modules/account/baseInfo.js" // 我的权益
import accoutBenefit from "./modules/account/benefit.js" // 我的权益
import accountCollect from "./modules/account/collect.js" // 我的收藏列表
import accountStoreNav from "./modules/account/storeNav.js" // 门店导航
import poster from "./modules/poster.js" // 分享海报、邀请海报
import brarts from "./modules/brarts.js"
import activity from "./modules/activity.js"
import training from "./modules/training/index.js"
import trainingDetail from "./modules/training/detail.js"
import trainingEvaluation from "./modules/training/evaluation.js"
import integral from "./modules/integral.js"
import cup from "./modules/cup.js"
import shoppingGuide from "./modules/account/shoppingGuide.js"
import invite from "./modules/invite.js"

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		invite,
		login,
		index,
		accoutBaseInfo,
		accoutBenefit,
		accountCollect,
		accountStoreNav,
		poster,
		brarts,
		activity,
		training,
		trainingDetail,
		trainingEvaluation,
		integral,
		cup,
		shoppingGuide
	}
});
