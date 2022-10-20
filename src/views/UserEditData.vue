<template>
	<div class="container">
		<div>
			<h3>
				{{ projectName }}
			</h3>
			<h4>{{ taskName }} 데이터 수정</h4>
		</div>
		<form class="needs-validation" @submit.prevent="submitForm($event)" novalidate>
			<div v-for="(column, i) in columnList.data" :key="i">
				<UserInput
					:label="column.meta_name"
					:inputValue="(inputValueList[column.meta_key] = inputValueList[column.meta_key])"
					@inputFromChild="inputValueList[column.meta_key] = $event.target.value"
					v-if="column.meta_type === '1'" />
				<UserSelectBox
					:label="column.meta_name"
					:selectValue="(inputValueList[column.meta_key] = inputValueList[column.meta_key])"
					@selectFromChild="inputValueList[column.meta_key] = Number($event.target.value)"
					v-else-if="column.meta_type === '2'" />
				<UserNote
					:label="column.meta_name"
					:note="(inputValueList[column.meta_key] = inputValueList[column.meta_key])"
					@inputFromChild="inputValueList[column.meta_key] = $event.target.value"
					v-else-if="column.meta_type === '5'" />
			</div>
			<UserRadioBox
				:label="dataStatusLabel"
				:radioValue="(data_status = data_status)"
				@radioFromChild="changeStatusValue($event)" />
			<div class="buttons">
				<button type="button" class="btn btn-secondary" @click="cancel">취소</button>
				<button type="submit" class="btn btn-primary">저장</button>
			</div>
		</form>
	</div>
</template>

<script>
import axios from 'axios';
import UserInput from '/@components/UserInput.vue';
import Address from '/@components/Address.vue';
import UserSelectBox from '/@components/UserSelectBox.vue';
import UserRadioBox from '/@components/UserRadioBox.vue';
import UserNote from '/@components/UserNote.vue';
import { getUserEditForm, getUserAddForm } from '/@service/user';
import { msgbox } from '/@service/common';

export default {
	data() {
		return {
			inputValueList: {},
			columnList: [],
			errors: {
				form: [],
				status: [],
			},
			taskName: '',
			projectName: '',
			projectCode: '',
			data_id: '',
			user_id: '',
			user_name: '',
			data_status: 0,
			isPassValidatoin: false,
			dataStatusLabel: '데이터 상태',
		};
	},
	created() {
		this.taskName = sessionStorage.getItem('taskName');
		sessionStorage.setItem('isAddPage', 0);
		this.user_id = this.$cookies.get('userId');

		const setAddData = new FormData();
		const setEditData = new FormData();

		this.projectCode = sessionStorage.getItem('projectCode');
		this.projectName = sessionStorage.getItem('projectName');
		this.data_id = sessionStorage.getItem('data_id');

		setAddData.set('work_id', this.projectCode);
		getUserAddForm(setAddData).then((result) => {
			this.columnList = result.data;
		});

		setEditData.set('data_id', this.data_id);
		getUserEditForm(setEditData).then((result) => {
			this.dataList = result.data;
			this.data_status = this.dataList.data.data_status;
			this.inputValueList = JSON.parse(this.dataList.data.data_json);
		});
	},
	methods: {
		changeStatusValue(e) {
			this.data_status = Number(e.target.value);
			if (this.data_status != 2 && this.data_status != 6) {
				var forms = document.querySelectorAll('.needs-validation');
				Array.prototype.slice.call(forms).forEach(function (form) {
					form.classList.remove('was-validated');
				});
			}
		},
		checkForm() {
			this.errors = {
				form: [],
				status: [],
			};
			for (let key in this.inputValueList) {
				if (this.inputValueList[key] === '' || this.inputValueList[key] === null) {
					this.inputValueList[key] = '';
					this.errors['form'].push('Error');
				}
			}
			if (this.data_status == 2) {
				this.errors['status'].push('Error');
			}
			if (this.errors['form'].length != 0 && this.data_status == 6) {
				msgbox('모든 입력란을 채워주세요');
				var forms = document.querySelectorAll('.needs-validation');
				Array.prototype.slice.call(forms).forEach(function (form) {
					form.classList.add('was-validated');
				});
			} else if (this.errors['status'].length != 0) {
				msgbox('데이터 상태에 체크를 해주세요');
				var forms = document.querySelectorAll('.needs-validation');
				Array.prototype.slice.call(forms).forEach(function (form) {
					form.classList.add('was-validated');
				});
			} else {
				this.isPassValidatoin = true;
			}
		},
		submitForm(e) {
			this.checkForm();
			if (this.isPassValidatoin) {
				var inputData = JSON.stringify(this.inputValueList);

				axios({
					method: 'post',
					url: '/web/db/edit',
					data: {
						data_id: this.data_id,
						user_id: this.user_id,
						data_json: inputData,
						data_status: this.data_status,
					},
				})
					.then((res) => {
						var forms = document.querySelectorAll('.needs-validation');
						Array.prototype.slice.call(forms).forEach(function (form) {
							form.classList.remove('was-validated');
						});
						e.target.reset();
						this.cancel();
					})
					.catch((err) => {
						console.log(err);
					});
			}
		},
		cancel() {
			this.inputValueList = {};
			this.$router.go(-1);
		},
	},
	components: { UserInput, Address, UserSelectBox, UserRadioBox, UserNote },
};
</script>

<style scoped>
.container {
	margin-top: 20px;
}
h3 {
	margin: 50px auto 20px auto;
	text-align: center;
}
h4 {
	margin-bottom: 50px;
	text-align: center;
}
.buttons {
	display: flex;
	margin: 35px auto;
	justify-content: center;
	align-items: center;
}
.btn-primary,
.btn-secondary {
	width: 8%;
	height: 2%;
	border-radius: 10px;
	margin: 0 20px auto;
	font-size: 0.9rem;
}
.btn-primary {
	background-color: #e17b45;
	border-color: #e17b45;
	color: white;
}
.btn-primary:hover {
	background-color: #dc6425;
	border-color: #dc6425;
	color: white;
}
.btn-secondary {
	background-color: white;
	border-color: #e17b45;
	color: #e17b45;
}
.btn-secondary:hover {
	background: #fbebe3;
	border-color: #e17b45;
}
@media (max-width: 768px) {
	h3 {
		margin: 50px;
		text-align: center;
	}
	.btn {
		display: flex;
		justify-content: center;
		margin: 30px auto;
		font-size: 0.9rem;
		border: none;
		width: 20%;
		background-color: #e17b46;
	}
	.btn-secondary:hover {
		background-color: #c15a33;
	}
}
</style>
