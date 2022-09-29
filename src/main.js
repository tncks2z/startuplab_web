import { createApp } from 'vue';
import VueGtag from 'vue-gtag';

import App from './App.vue';
import router from './router';
import store from './store';
import global from '/@service/global.js';
import VueCookies from 'vue-cookies';

import 'mosha-vue-toastify/dist/style.css';
import '/@assets/css/common.css';
const gtagConfig = { id: 'G-C6EL8W0BRK' };

const app = createApp(App);
app.use(VueCookies);
app.use(router);
app.use(store);
app.use(global);
app.use(VueGtag, { config: gtagConfig }, app.router);
app.mount('#app');
