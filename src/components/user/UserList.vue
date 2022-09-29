<template>
<Modal
:isAct="isModalAct"
@closeModal="closeModal"
:user_name="modalUserName"  
:user_id="modalUserId" 
:user_email="modalUserEmail"  
:user_type="modalUserType"  
:user_status="modalUserStatus"/>
<div class="container">
  <div class="name">
    <h4 class="underline">인턴 관리</h4>
  </div>
  <div class="flex">
    <div class="flex-area">
      <button class="btn btn-secondary" @click="movePage">인턴 추가</button>
    </div>
    <div class="search-area flex-area" >
      <select class="form-select" v-model="selectedOption" >
        <option option disabled value="" selected>선택</option>
        <option value="user_name">이름</option>
        <option value="assignment_id">과제</option>
      </select>
      <input type="text" class="form-control" placeholder="검색어를 입력하세요" :value="keyword" @input="changeKeyword" @keypress.enter="searchData" />
      <button class="btn" type="submit" @click="searchData">검색</button>
    </div>
  </div>
  <div class="maintable table-responsive">
    <div v-if="users.length">
      <table class="table" id="intern-list">
        <thead class="table head">
          <tr>
              <th scope="col">이름</th>
              <th scope="col">아이디</th>
              <th scope="col">비밀번호</th>
              <th scope="col">전화번호</th>
              <th scope="col">과제</th>
              <th scope="col" class="manage">관리</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <user-list-row v-for="(user, i) in users" :key="i" :user="user" :assignment_name = assignment_name @openModal="openModal($event)" :user_id = user.user_id ></user-list-row>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center">회원이 없습니다.</div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import UserListRow from '/@components/user/UserListRow.vue';
import Modal from '/@components/Modal.vue';

export default {

  data() {
    return {
      selectedOption: '',
      keyword: '',
      assignment_index: [],
      assignment_name: [
        '광진구','순천','광주','문정원'
      ],
      users: [],
      usersFilter: [],
      isModalAct: false,
      modalUser: {},
      modalUserName: '',
      modalUserId: 0,
      modalUserEmail: '',
      modalUserType: 0,
      modalUserStatus: 0,
    };
  },
  created() {
    axios.post('http://52.22.216.42:8090/web/assignment/user/list/',
    {
      assignment_id: 0
  })
    .then(({ data }) => {
      this.users = data.data.user;
      // console.log(this.users);
    });
  },
  methods: {
    
    getUserData() {
      axios.post('http://52.22.216.42:8090/web/assignment/user/list/',
      {
        assignment_id: 0,
      })
      .then(({ data }) => {
      this.users = data.data.user;
      });
    },
    movePage() {
      this.$router.push({ name: 'UserReg' });
    },
    changeKeyword(w) {
      this.keyword = w.target.value;
    },
    searchData() {
      if ((this.selectedOption === 'user_name') && (this.keyword !== '')) {
        this.users = this.users.filter((data) => data.user_name.includes(this.keyword))
        this.selectedOption=''
        this.keyword=''
      }
      else if ((this.selectedOption === 'assignment_id') && (this.keyword !== '')) {
      this.usersFilter = []
      for (let i=0; i < this.assignment_name.length; i++) {
        if(this.assignment_name[i].includes(this.keyword)) {
          this.assignment_index = i+1
          const arr = this.users.filter((data) => data.assignment_id === this.assignment_index)
          this.usersFilter = this.usersFilter.concat(arr)
        }
      }
      this.users = this.usersFilter
      this.selectedOption=''
      this.keyword=''
      }
      else {
        this.getUserData();
      }

    },
    openModal(id) {
      this.isModalAct = true;
      this.modalUser = this.users.filter((data)=>data.user_id === id)
      this.modalUserName = this.modalUser[0].user_name
      this.modalUserId = this.modalUser[0].user_id
      this.modalUserEmail = this.modalUser[0].user_email
      this.modalUserType = this.modalUser[0].user_type
      this.modalUserStatus = this.modalUser[0].user_status
    },
    closeModal() {
      this.isModalAct = false;
    },
  },
  
  components: { UserListRow, Modal},
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

.table-body{
    vertical-align: middle;
}
.manage {
    width: 15%;
}

.flex-area .btn-secondary {
  font-size: .8rem;
  border: none;
  background-color: #e17b46 !important;
}

.flex-area .btn-secondary:hover {
  background-color: #dc6425 !important;
}

.pull-right, .btn-modal {
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

input[type=”text”]:disabled {
  background-color: #FFF;
  color: black;
}
option:disabled {
  color: black;
}
.main { white-space: nowrap; }
</style>