<template>
	<div
		class="modal-content"
		v-if="isAct">
		<button
			type="button"
			class="btn-close"
			data-bs-dismiss="modal"
			aria-label="Close"
			@click="closeModal"></button>
		<div class="modal-body">
			<h4 style="margin-top: 20px; margin-bottom: 10px">{{ user_name }}님의 계정을 정지하시겠습니까?</h4>
			<span>(한 번 정지한 계정은 다시 활성화시킬 수 없습니다.)</span>
		</div>
		<div class="modal--box">
			<button
				type="button"
				class="modal-clo"
				data-bs-dismiss="modal"
				@click="closeModal">
				취소
			</button>
			<button
				type="button"
				class="modal-del"
				@click="[dataDelete(), disableUser()]">
				정지
			</button>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
export default {
	data() {
		return {};
	},
	name: 'Modal',
	props: {
		isAct: Boolean,
		user_name: String,
		user_type: Number,
		user_id: Number,
		user_email: String,
		user_status: Number,
	},
	methods: {
		closeModal() {
			this.$emit('closeModal');
		},
		dataDelete() {
			axios
				.put('http://52.22.216.42:8090/common/user/edit/', {
					user_id: this.user_id,
					user_email: this.user_email,
					user_type: this.user_type,
					user_status: 0,
				})
				.then(({ data }) => {
					this.users = data.user;
					console.log(data);
					let msg = '계정을 정지하였습니다.';
					alert(msg);
					this.$router.go({ name: 'UserList' });
					this.closeModal();
				});
		},
		disableUser() {
			this.$emit('disableUser');
		},
	},
};
</script>

<style scoped>
.modal-dialog {
	display: flex;
	position: fixed;
	flex-direction: column;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.7);
	width: 100%;
	height: 100%;
	margin: 0;
}
.modal-content {
	position: fixed;
	background-color: white;
	border-radius: 5px;
	width: 440px;
	height: 250px;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
}

.modal-body {
	margin-top: 5px;
	max-width: 450px;
	user-select: none;
	color: #828282;
}

.modal--box {
	margin-bottom: 30px;
}

.modal-del {
	margin-left: 15px;
	background-color: #d64c57;
	border-color: #d64c57;
	color: white;
	border-radius: 10px;
	margin-top: 15px;
	padding: 6px 23px;
	font-size: 19px;
}
.modal-clo {
	margin-right: 15px;
	background-color: white;
	border-color: #b9b9b9;
	color: #828282;
	border-radius: 10px;
	margin-top: 15px;
	padding: 6px 23px;
	font-size: 19px;
}
.btn-close {
	margin-left: 390px;
	margin-top: 20px;
}
</style>
