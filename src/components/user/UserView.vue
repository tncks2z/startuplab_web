<template>
  <div class="internview">
    <h1> Intern 정보 </h1>
    <div class="">
        <label for="name">이름</label>
        <div class="view">{{users.user_name}}</div>
        <label for="userid">아이디</label>
        <div class="view">{{users.user_email}}</div>
        <label for="password">비밀번호</label>
        <div class="view">{{users.user_password}}</div>
        <label for="phonenum">전화번호</label>
        <div class="view">{{users.user_phone}}</div>
        <label for="task">과제</label>
        <div class="view">{{users.assignment_id}}</div>
        <div>
          <router-link :to="{name: 'UserModify'}">수정</router-link>
          <router-link :to="{name: 'UserList'}">목록</router-link>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    data: function(){
        return{
            users:{},
        };
    },
    created(){
      axios.get(`http://52.22.216.42:8090/common/user/info/${this.$route.params.user_id}`).then(({ data }) => {
      this.users = data.data.user;
      console.log(this.users);
    });
    }
}
</script>

<style>

</style>