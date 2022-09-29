<template>
  <AppInit v-if="!app_ready" />
  <Base v-else>
    <router-view />
  </Base>
</template>

<script>
import AppInit from '/@components/AppInit.vue';
import Base from '/@components/Base.vue';

import { useStore } from 'vuex';
import { computed } from 'vue';

import extension from '/@service/extension'; /* Don't Delete */
export default {
  components: { AppInit, Base },
  setup() {
    const store = useStore();
    const app_ready = computed(() => store.getters['app_ready']);
    return { app_ready };
  },
};
</script>
