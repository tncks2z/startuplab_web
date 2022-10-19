<template>
  <div>
    <Modal :user_name="modalUserName" :user_id="modalUserId" :user_email="modalUserEmail" :user_type="modalUserType" :user_status="modalUserStatus" />
    <div class="container">
      <div class="name">
        <h4 class="underline">인턴 관리</h4>
      </div>
      <div class="flex">
        <div class="flex-area">
          <button class="btn btn-secondary" @click="movePage">인턴 추가</button>
        </div>
        <div class="search-area flex-area">
          <select class="form-select" v-model="selectedOption" ref="searchSelect">
            <option option disabled value="" selected>선택</option>
            <option value="user_name">이름</option>
            <option value="assignment_id">과제</option>
          </select>
          <input type="text" class="form-control" placeholder="검색어를 입력하세요" :value="keyword" @input="changeKeyword" @keypress.enter="searchData" ref="searchInput" />
          <button class="btn" type="submit" @click="searchData">검색</button>
        </div>
      </div>
      <div class="show-nothing"  v-if="searchedNoneUser">해당 회원을 찾을 수 없습니다.</div>
      <div class="maintable table-responsive" v-if="users.length && !searchedNoneUser">
        <table class="table" id="intern-list">
          <thead class="table head">
            <tr>
              <th>No.</th>
              <th scope="col">이름</th>
              <th scope="col">아이디(이메일)</th>
              <th scope="col">전화번호</th>
              <th scope="col">과제</th>
              <th scope="col" class="manage">관리</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <user-list-row v-for="(user, i) in users" :key="i" :index="i" :user="user" :assignment_name="assignment_name" @openModal="openModal($event)" :user_id="user.user_id"></user-list-row>   
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import UserListRow from '/@components/UserListRow.vue';
import Modal from '/@components/Modal.vue';
import { msgbox } from '../service/common';

export default {
  data() {
    return {
      selectedOption: '',
      keyword: '',
      assignment_index: [],
      assignment_name: ['광진구', '순천', '광주', '문정원'],
      users: [],
      usersFilter: [],
      modalUser: {},
      modalUserName: '',
      modalUserId: 0,
      modalUserEmail: '',
      modalUserType: 0,
      modalUserStatus: 0,
      searchedNoneUser: false,
    };
  },
  created() {
    axios
      .post('http://49.50.164.147:8090/web/assignment/user/list/', {
        assignment_id: 0,
      })
      .then(({ data }) => {
        this.users = data.data.user;
      });
  },
  methods: {
    getUserData() {
      axios
        .post('http://49.50.164.147:8090/web/assignment/user/list/', {
          assignment_id: 0,
        })
        .then(({ data }) => {
          this.users = data.data.user;
        });
    },
    movePage() {
      this.$router.push('/admin/user/register').catch(() => {});
    },
    changeKeyword(w) {
      this.keyword = w.target.value;
    },
    searchData() {
      if (this.selectedOption === 'user_name' && this.keyword !== '') {
        this.users = this.users.filter((data) => data.user_name.includes(this.keyword));
        if (this.users.length === 0) {
          this.searchedNoneUser = true;
        }
        this.selectedOption = '';
        this.keyword = '';
      } else if (this.selectedOption === 'assignment_id' && this.keyword !== '') {
        this.usersFilter = [];
        for (let i = 0; i < this.assignment_name.length; i++) {
          if (this.assignment_name[i].includes(this.keyword)) {
            this.assignment_index = i + 1;
            const arr = this.users.filter((data) => data.assignment_id === this.assignment_index);
            this.usersFilter = this.usersFilter.concat(arr);
          }
        }
        this.users = this.usersFilter;
         if (this.users.length === 0) {
          this.searchedNoneUser = true;
        }
        this.selectedOption = '';
        this.keyword = '';
      } else if (this.selectedOption != '' && this.keyword == '') { 
        msgbox("검색할 키워드를 입력해주세요.")
        this.$refs.searchInput.focus();
      } else if (this.selectedOption =='' && this.keyword != '') { 
        msgbox("검색할 칼럼을 선택해주세요.")
        this.$refs.searchSelect.focus();
      } else {
        this.searchedNoneUser = false;
        this.getUserData();
      }
    },
    openModal(id) {
      this.modalUser = this.users.filter((data) => data.user_id === id);
      this.modalUserName = this.modalUser[0].user_name;
      this.modalUserId = this.modalUser[0].user_id;
      this.modalUserEmail = this.modalUser[0].user_email;
      this.modalUserType = this.modalUser[0].user_type;
      this.modalUserStatus = this.modalUser[0].user_status;
    },
  },

  components: { UserListRow, Modal },
};
</script>

<style scoped>
.container {
  margin-top: 20px;
}

.name {
  text-align: center;
  margin-top: 40px;
}
h4 {
  margin: 30px;
}
.table {
  text-align: center;
}

.table-body {
  vertical-align: middle;
}

.flex-area .btn-secondary {
  font-size: 0.8rem;
  border: none;
  background-color: #e17b46 !important;
}

.flex-area .btn-secondary:hover {
  background-color: #dc6425 !important;
}

.pull-right,
.btn-modal {
  margin-right: 10px;
}
.items {
  display: block;
  font-size: 0;
  margin: 0 -5px;
  margin-top: 50px;
  text-align: right;
}

.form-select {
  display: inline-block;
  width: 10%;
}
.form-control {
  display: inline-block;
  width: 30%;
}

input[type='”text”']:disabled {
  background-color: #fff;
  color: black;
}
option:disabled {
  color: black;
}
.main {
  white-space: nowrap;
}
</style>
