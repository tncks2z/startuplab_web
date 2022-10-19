<template>
  <div class="container">
    <div>
      <h4>인턴 추가</h4>
    </div>
    <form class="needs-validation" @submit.prevent="registUser()" novalidate>
      <div class="input-group mb-3">
        <label class="form-label" for="user_name">이름</label>
        <input type="text" class="form-control" id="user_name" name="user_name" v-model="user_name" ref="user_name" required />
      </div>
      <div class="input-group mb-3">
        <label class="form-label" for="user_email">아이디(이메일)</label>
        <input type="text" class="form-control" id="user_email" name="user_email" v-model="user_email" ref="user_email"  placeholder="예) startup@startuplab.team" required />
      </div>
      <div class="input-group mb-3">
        <label class="form-label" for="user_password">비밀번호</label>
        <input type="text" class="form-control" id="user_password" name="user_password" v-model="user_password" ref="user_password" required />
      </div>
      <div class="input-group mb-3">
        <label class="form-label" for="user_phone">전화번호</label>
        <input type="text" class="form-control" id="user_phone" name="user_phone" v-model="user_phone" ref="user_phone" placeholder="예) 010-0000-0000" required />
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
      <div style="text-align: center; margin-top: 60px">
        <button class="btn move" type="button" @click="moveAdminMain">취소</button>
        <button class="btn check" type="submit">저장</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { isNotEmpty } from '/@service/util';
import { msgbox } from '/@service/common';

export default {
  data() {
    return {
      user_name: '',
      user_email: '',
      user_password: '',
      user_phone: '',
      assignment_id: '',
      isPassValidation: false,
      isNamePassValidation: false,
      isEmailPassValidation: false,
      isPWPassValidation: false,
      isPhonePassValidation: false,
      isTaskPassValidation: false,
      msg: '',
      errors:[],
      users: [],
      userNameList: [],
      userEmailList: [], 
      userPhoneList: [],
    };
  },
  mounted() {
    this.userNameList = [];
    this.userEmailList = [];
    this.userPhoneList = [];
    axios
      .post('http://49.50.164.147:8090/web/assignment/user/list/', {
        assignment_id: 0,
        user_status: 1
      })
      .then(({ data }) => {
        this.users = data.data.user;
      });
  },
  methods: {
    checkForm() {
      this.errors = [];
      this.checkTask();
      this.checkPhone();
      this.checkPassWord();
      this.checkEmail();
      this.checkName();
      if (this.errors.length != 0) {
      msgbox(this.msg)
      } else {
        this.isPassValidation = true;
      }
      },
      

    addUserInfo() {
      for (let i = 0; i < this.users.length; i++) {
        this.userNameList.push(this.users[i].user_name);
        this.userEmailList.push(this.users[i].user_email);
        this.userPhoneList.push(this.users[i].user_phone);
      }
    },

    checkEmail() {
      this.addUserInfo();
      const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (regex.test(this.user_email)){
        this.isEmailPassValidation = true;
      } else if (!isNotEmpty(this.user_email)) {
        this.msg = '이메일을 입력해주세요';
        this.errors.push("error");
        this.$refs.user_email.focus();
      } else {
        this.msg = '이메일 형식에 맞게 입력해주세요';
        this.errors.push("error");
        this.$refs.user_email.focus();
      }
      if (this.userEmailList.includes(this.user_email)) {
        this.msg = '중복된 이메일입니다.';
        this.errors.push("error");
        this.$refs.user_email.focus();
      } else {
          this.isEmailPassValidation = true;
      }
    },

    checkPhone() {
      this.addUserInfo();
      const regex = /^\d{3}-\d{4}-\d{4}$/;
      if (regex.test(this.user_phone)){
        this.isPhonePassValidation = true;
      } else if (!isNotEmpty(this.user_phone)) {
        this.msg = '전화번호를 입력해주세요.';
        this.errors.push("error");
        this.$refs.user_phone.focus();
      } else {
        this.msg = '전화번호 형식에 맞게 입력해주세요'
        this.errors.push("error")
        this.$refs.user_phone.focus();
      }
      if (this.userPhoneList.includes(this.user_phone)) {
        this.msg = '중복된 번호입니다.';
        this.errors.push("error");
        this.$refs.user_phone.focus();
      } else {
        this.isPhonePassValidation = true;
      }
    },

    checkName() {
      this.addUserInfo();
       if (isNotEmpty(this.user_name)){
        this.isNamePassValidation = true;
      } else {
       this.msg = '이름을 입력해주세요'
       this.errors.push("error")
       this.$refs.user_name.focus();
      }
      if (this.userNameList.includes(this.user_name)) {
        this.msg = '중복된 이름입니다.';
        this.errors.push("error");
        this.$refs.user_name.focus();
      } else {
        this.isEmailPassValidation = true;
      }
    },

    checkPassWord() {
       if (isNotEmpty(this.user_password)){
        this.isPWPassValidation = true;
      } else {
        this.msg = '비밀번호를 입력해주세요'
        this.errors.push("error")
        this.$refs.user_password.focus();
      }
    },

    checkTask() {
       if (isNotEmpty(this.assignment_id)){
        this.isTaskPassValidation = true;
      } else {
      this.msg = '과제를 선택해주세요'
      this.errors.push("error")
      this.$refs.assignment_id.focus();
      }
    },

    registUser() {
      this.checkForm();
      if(this.isPassValidation){
        axios
          .post('http://49.50.164.147:8090/common/user/join', {
            user_name: this.user_name,
            user_email: this.user_email,
            user_password: this.user_password,
            user_phone: this.user_phone,
            assignment_id: this.assignment_id,
          })
          .then(({ data }) => {
            let msg = '등록을 완료했습니다.';
            if(data === 'sucess') {
            }
          msgbox(msg);
          this.moveAdminMain();
          });}
    },

    moveAdminMain() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
select:invalid {
  color: #b9b9b9;
}
select option {
  color: black;
}
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
  margin-bottom: 40px !important;
}
.check {
  background-color: #e17b46;
  border-color: #e17b46;
  color: white;
  width: 90px;
  margin-left: 25px;
}
.check:hover {
  background-color: #c15a33;
  border-color: #c15a33;
  color: white;
}
.move {
  background-color: white;
  border-color: #e17b46;
  color: #e17b46;
  width: 90px;
  margin-right: 25px;
}
.move:hover {
  background-color: #fbebe3;
  border-color: #e17b46;
  color: #e17b46;
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
