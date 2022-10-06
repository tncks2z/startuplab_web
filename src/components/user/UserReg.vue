<template>
	<div class="container">
		<div>
			<h4>인턴 추가</h4>
		</div>
    <form class="needs-validation" @submit.prevent="registUser()" novalidate>
      <div class="input-group mb-3">
        <label class="form-label" for="user_name">이름</label>
        <input type="text" class="form-control" id="user_name" name="user_name" v-model="user_name" ref="user_name" required/>
      </div>
      <div class="input-group mb-3">
        <label class="form-label" for="user_email">아이디</label>
        <input type="text" class="form-control" id="user_email" name="user_email" v-model="user_email" ref="user_email" required/>
      </div>
      <div class="input-group mb-3">
        <label class="form-label" for="user_password">비밀번호</label>
        <input type="text" class="form-control"  id="user_password" name="user_password" v-model="user_password" ref="user_password" required/>
      </div>
      <div class="input-group mb-3">
        <label class="form-label" for="user_phone">전화번호</label>
        <input type="text" class="form-control" id="user_phone" name="user_phone" v-model="user_phone" ref="user_phone" required/>
      </div>
      <div class="input-group mb-3">
        <label class="form-label" for="assignment_id">과제</label>
          <select class="form-select" id="assignment_id" name="assignment_id" v-model.number="assignment_id" ref="assignment_id" required>
            <option disabled value="" selected>선택</option>
            <option :value="1">광진구</option>
            <option :value="2">순천</option>
            <option :value="3">광주</option>
            <option :value="4">문정원</option>
          </select>
      </div>

      <div style="text-align: center; margin-top: 60px;">
        <button class="btn move" type="button" @click="moveList">취소</button>
        <button class="btn check" type="submit">저장</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { isNotEmpty } from '/@service/util';
export default {
  data() {
    return {
      user_name: '',
      user_email: '',
      user_password: '',
      user_phone: '',
      assignment_id: '',

      isPassValidation: false,
      errors: []
    };
  },
  methods: {
    checkValue() {
      if (!isNotEmpty(this.user_name) || !isNotEmpty(this.user_email) || !isNotEmpty(this.user_password) || !isNotEmpty(this.user_phone) || !isNotEmpty(this.assignment_id)) {
        this.msgbox('입력란을 모두 채워주세요.');
        this.errors.push("error")
      }
      if (this.errors.length != 0){
        console.log(this.errors)
        var forms = document.querySelectorAll('.needs-validation');
        Array.prototype.slice.call(forms).forEach(function (form) {
          form.classList.add('was-validated');
        });
      } 
      else {
        this.isPassValidation = true
      };
    },

    registUser() {
      this.checkValue();
      if(this.isPassValidation){
        axios.post('http://52.22.216.42:8090/common/user/join', {
          user_name: this.user_name,
          user_email: this.user_email,
          user_password: this.user_password,
          user_phone: this.user_phone,
          assignment_id: this.assignment_id,
        })
        .then(({data}) => {
          let msg = '등록을 완료했습니다.';
          if(data === 'sucess') {
            msg = '등록 완료';
          }
          msgbox(msg);
          this.moveList();
        });
      }
    },
    moveList() {
      this.$router.go(-1);
    },

}
}
</script>

<style scoped>
h4 {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 100px;
}
.input-group {
	flex-wrap: nowrap;
	margin: 0 auto;
	flex: 0 0 auto;
	width: 60%;
}
.mb-3 {
    margin-bottom: 40px!important;
}
.check {
  background-color: #E17B46;
  border-color: #E17B46;
  color: white;
  width: 90px;
  margin-left: 25px;
}
.check:hover {
  background-color: #C15A33;
  border-color: #C15A33;
  color: white;

}
.move {
  background-color: white;
  border-color: #E17B46;
  color: #E17B46;
  width: 90px;
  margin-right: 25px;
}
.move:hover {
  background-color: #FBEBE3;
  border-color: #E17B46;
  color: #E17B46;
}
.form-select,
.form-control {
	display: flex;
	flex: 0 0 auto;
	width: 60%;
	font-size: 0.9rem;
	padding-top: 8px;
	border-top-left-radius: 5px !important;
	border-bottom-left-radius: 5px !important;
}
.form-label {
	display: flex;
	width: 20%;
	margin: auto 30px auto 0px;
	align-items: center;
	justify-content: right;
	word-break: keep-all;
	font-weight: 500;
}
@media (max-width: 768px) {
	.input-group {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		margin: 0 auto;
		flex: 0 0 auto;
		width: 100%;
	}
	.form-label {
		display: flex;
		width: 100%;
		margin: 10px auto 10px auto;
		align-items: center;
		justify-content: left;
		word-break: keep-all;
		font-weight: 500;
	}
	.form-select,
	.form-control {
		display: flex;
		flex: 0 0 auto;
		width: 100%;
		font-size: 0.9rem;
		border-top-left-radius: 5px !important;
		border-bottom-left-radius: 5px !important;
		align-items: center;
		justify-content: center;
	}
}
</style>