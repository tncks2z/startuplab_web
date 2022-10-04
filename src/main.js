import { createApp } from 'vue';
import VueGtag from 'vue-gtag';

import App from './App.vue';
import router from './router';
import store from './store';
import global from '/@service/global.js';
import VueCookies from 'vue-cookies';
import VueAwesomePaginate from 'vue-awesome-paginate';

import 'mosha-vue-toastify/dist/style.css';
import '/@assets/css/common.css';
import 'vue-awesome-paginate/dist/style.css';
const gtagConfig = { id: 'G-C6EL8W0BRK' };

const app = createApp(App);
app.use(VueCookies);
app.use(router);
app.use(store);
app.use(global);
app.use(VueAwesomePaginate);
app.use(VueGtag, { config: gtagConfig }, app.router);
app.mount('#app');
