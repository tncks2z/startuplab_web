import { createStore } from 'vuex';

const store = createStore({
  state: {
    app_ready: false,
    spiner: false,
    code_list: [],
    user: {},
  },
  getters: {
    app_ready(state) {
      return state.app_ready;
    },
    code_list(state) {
      return state.code_list;
    },
    user(state) {
      return state.user;
    },
    spiner(state) {
      return state.spiner;
    },
  },
  mutations: {
    setAppReady(state, value) {
      state.app_ready = value;
    },
    setCodeList(state, value) {
      state.code_list = value;
    },
    setUser(state, value) {
      state.user = value;
    },
    setSpiner(state, value) {
      state.spiner = value;
    },
  },
});

export default store;
