<template>
  <div class="topbar">
    <div class="container">
      <div class="logo">
        <router-link to="/admin" v-if="userType == 1">
          <img src="/image/logo.png">
        </router-link>
        <router-link to="/user" v-else-if="userType == 2">
          <img src="/image/logo.png">
        </router-link>
        <router-link to="/" v-else>
          <img src="/image/logo.png">
        </router-link>
      </div>
      
      <div class="inform" v-if="url != '/'">
        <router-link to="/" @click="logout">
          <span>로그아웃</span>
        </router-link>
        <div class="username">
          <span></span> <b><span class="empha">{{ loginName }}</span>님</b>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { logout, deleteStorage } from '/@service/login';

export default {
  emits: [],
  components: {},
  mounted() {
    this.url = window.location.pathname;
    this.loginName = this.$cookies.get('name');
    this.userType = this.$cookies.get('type');
  },
  data() {
    return {
      loginName: '',
      userType: '',
      url: '',
    }
  },
  methods: {
    logout() {
      this.$cookies.remove('name');
		  this.$cookies.remove('type');

		  deleteStorage();
      logout();
    }
  },
};
</script>
