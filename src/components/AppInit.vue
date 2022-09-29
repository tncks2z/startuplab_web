<template>
  <div className="common-loading">
    <img src="/image/logo.png" alt="loading" />
  </div>
</template>
<script>
import { useStore } from 'vuex';
import { getUser } from '/@service/api';

export default {
  components: {},
  props: {},
  setup() {
    const store = useStore();

    const param = {};
    param.user_id = 1;
    getUser(param).then((result) => {
      setTimeout(() => {
        if (result.error.code == 0) {
          store.commit('setUser', result.data.user);
        }
        store.commit('setAppReady', true);
      }, 1000);
    });
  },
};
</script>
