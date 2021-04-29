import {
	mapState,
	mapActions,
	mapMutations,
	mapGetters
} from 'vuex'
export default {
	computed: {
		...mapState('login', ['userInfo', 'inviteUserId', 'guidecode']),
		...mapGetters('login', ['isLogin']),
		getBinding() {
			if (this.isLogin && (this.inviteUserId || this.guidecode)) {
				console.log('bindWithGuid...')
				this.bindWithGuid({})
			}
			return this.isLogin
		}
	},
	onLoad(options) {
		console.log('mixin onload...common/login.js')
		let _this = this
		let {
			inviteUserId
		} = options
		if (inviteUserId) {
			console.log('inviteUserId:' + inviteUserId)
			this.GETINVITEUSERID({
				inviteUserId
			})
		}
		// this.$refs.login.checkLogin()
	},
	methods: {
		...mapMutations('login', ['GETINVITEUSERID']),
		...mapActions('login', ['bindWithGuid', 'onGetUserInfo']),
	}
}
