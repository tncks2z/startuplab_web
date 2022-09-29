<template>
  <div class="topbar">
    <div class="container">
      <div class="logo">
        <router-link to="/">
          <img src="/public/image/logo.png">
        </router-link>
      </div>
      
      <div class="inform">
        <router-link to="/login" @click="logout">
          <span>로그아웃</span>
        </router-link>
        <div class="username" v-if="loginName!==''">
          <span></span> <b><span class="empha">{{ loginName }}</span>님</b>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { nextTick, ref, computed, onMounted } from 'vue';
import { getLoginInfo, logout } from '/@service/login';
import { useStore } from 'vuex';

export default {
  emits: [],
  components: {},
  created() {
    getLoginInfo().then((result) => {
      console.log(result);
      if(result.data.user !== null){
        const user_name = result.data.user.user_name;
        console.log(user_name);
        this.loginName = user_name;
      }
    });
  },
  data() {
    return {
      loginName: '',
    }
  },
  methods: {
    logout() {
      logout();
    }
  },
};
</script>
