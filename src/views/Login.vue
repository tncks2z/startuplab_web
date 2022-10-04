<template>
	<div class="container">
		<div class="login-wrap">
			<div class="logo-wrap">
				<img src="/public/image/logo.png" alt="로고" width="150" />
			</div>
			<!-- {{$route.path}} -->
			<form @submit.prevent="checkData" ref="checkForm">
				<div class="mb-3">
					<input type="email" class="form-control" placeholder="아이디" v-model="oauth.username" />
				</div>
				<div class="mb-3">
					<input
						type="password"
						class="form-control"
						placeholder="비밀번호"
						v-model="oauth.password" />
				</div>
				<div class="mb-3">
					<button type="submit" class="btn" @click="login" @keyup.enter="login">로그인</button>
				</div>
				<div class="mb-3 form-check">
					<input type="checkbox" class="form-check-input" v-model="idCheck" />
					<label class="form-check-label" for="idCheck">아이디 저장</label>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
import { computed, ref } from 'vue';
import { oauthLogin, getLoginInfo, deleteStorage } from '/@service/login';
import { isNotEmpty, jsonFromFormData } from '/@service/util';
import { useStore } from 'vuex';
import { getUser } from '/@service/api';

export default {
	data() {
		return {
			src: '',
			oauth: {
				username: this.$cookies.get('userName'),
				password: '',
				user_type: '',
				result: '',
			},
			idCheck: false,
		};
	},
	setup() {
		const store = useStore();
		const checkForm = ref(null);
		const user = computed(() => {
			return store.getters.user;
		});

		return { user };
	},
	created() {
		this.$cookies.remove('name');
		this.$cookies.remove('type');

		deleteStorage();
	},
	mounted() {
		getLoginInfo().then((result) => {
			if (!result) {
				this.oauth.username = result.data.user.user_name;
			} else {
				// console.log("정보없음");
			}
		});
	},
	methods: {
		login() {
			const oauthData = new FormData();

			if (!isNotEmpty(this.oauth.username)) {
				this.msgbox('아이디를 입력하세요.');
				return;
			} else if (!isNotEmpty(this.oauth.password)) {
				this.msgbox('비밀번호를 입력하세요');
				return;
			}
			oauthData.set('username', this.oauth.username);
			oauthData.set('password', this.oauth.password);

			oauthLogin(oauthData, (result) => {
				// console.log("result: ", result);

				this.oauth.result = result;

				if (this.idCheck) {
					this.$cookies.set('userName', this.oauth.username);
				} else {
					this.$cookies.remove('userName');
				}

				if (result.error !== 'invalid_grant') {
					getLoginInfo().then((result) => {
						const user_name = result.data.user.user_name;
						const user_type = result.data.user.user_type;
						const assignment_id = result.data.user.assignment_id;
						const uesr_id = result.data.user.user_id;

						this.$cookies.set('name', user_name);
						this.$cookies.set('type', user_type);
						this.$cookies.set('assignmentId', assignment_id);
						this.$cookies.set('userId', uesr_id);

						if (user_type == 1) {
							this.$router.push('/admin').catch(() => {});
						} else {
							this.$router.push('/user').catch(() => {});
						}
					});
				} else {
					this.msgbox('아이디 또는 비밀번호를 잘못 입력하셨습니다.');
				}
			});
		},
	},
};
</script>
<style scoped>
.login-wrap {
	box-sizing: border-box;
	width: 460px;
	margin: 0 auto;
}
.logo-wrap {
	text-align: center;
	margin-bottom: 50px;
}
.container {
	margin-top: 150px;
}
.btn {
	width: 100%;
	/* background-color: #1D86B3; */
	color: #fff !important;
	background-color: #e17b46 !important;
	border: none;
	padding: 0.5rem 0.75rem;
}
.btn:hover {
	background-color: #d3662e !important;
}
.form-control {
	width: 100%;
	float: right;
	margin-bottom: 20px;
	padding: 0.5rem 0.75rem;
}
.form-check-label {
	padding-top: 3px;
}
@media (max-width: 420px) {
	.login-wrap {
		width: 100%;
	}
}
</style>
