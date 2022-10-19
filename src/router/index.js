import { createRouter, createWebHistory } from 'vue-router';
import common from '/@service/common';

import NotFound from '/@views/NotFound.vue';
import Home from '/@views/Home.vue';
import Login from '/@views/Login.vue';
import UserAddData from '/@views/UserAddData.vue';
import UserEditData from '/@views/UserEditData.vue';
import AdminMain from '/@views/AdminMain.vue';
import TaskList from '/@views/TaskList.vue';
import UserMainPage from '/@views/UserMainPage.vue';
import UserList from '/@views/UserList.vue';
import UserReg from '/@views/UserReg.vue';
import UserModify from '/@views/UserModify.vue';
import AdminMainView from '/@components/AdminMainView.vue';
import AdminModifyData from '/@views/AdminModifyData.vue';
import UserWorkPage from '/@views/UserWorkPage.vue';

import { advancePositionWithMutation } from '@vue/compiler-core';

const routes = [
  // {
  //   path: '/',
  //   component: Home,
  // },
  {
    path: '/:catchAll(.*)+',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/',
    component: Login,
  },
  {
    path: '/user/add',
    component: UserAddData,
    meta: { requireAuth: true },
  },
  {
    path: '/user/edit/:data_id',
    component: UserEditData,
    meta: { requireAuth: true },
  },
  {
    path: '/admin',
    name: "AdminMain",
    component: AdminMain,
    meta: { requireAuth: true },
  },
  {
    path: '/admin/tasklist',
    name: 'TaskList',
    component: TaskList,
    meta: { requireAuth: true },
  },
  {
    path: '/user',
    component: UserMainPage,
    meta: { requireAuth: true },
  },
  {
    path: '/admin/user/list',
    name: 'UserList',
    component: UserList,
    meta: { requireAuth: true },
  },
  {
    path: '/admin/user/register',
    name: 'UserReg',
    component: UserReg,
    meta: { requireAuth: true },
  },
  {
    path: '/admin/user/modify/:user_id',
    name: 'UserModify',
    component: UserModify,
    meta: { requireAuth: true },
  },
  {
    path: '/admin/view',
    name: 'AdminMainView',
    component: AdminMainView,
    meta: { requireAuth: true },
  },
  {
    path: '/admin/tasklist/modify/:data',
    name: 'AdminModifyData',
    component: AdminModifyData,
  },
  {
    path: '/admin/user/workpage/:user_id',
    name: 'UserWorkPage',
    component: UserWorkPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes,
});

// router.beforeEach((to, _from) => {
//   // console.log(to, _from);
// });

router.beforeEach((to, from, next) => {
  const loggedln = sessionStorage.getItem(common.ACCESS_TOKEN);

  if (to.matched.some((record) => record.meta.requireAuth)) {
    if (!loggedln) {
      alert('로그인이 필요합니다.');
      next('/');
      return;
    }
  } else {
    if(from.path == '/admin') {
      history.go(1);
    } else if(from.path == '/user') {
      history.go(1);
    }
  }
  next();
});

export default router;
