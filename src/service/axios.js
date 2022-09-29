import axios from 'axios';
import * as common from '/@service/common';
import * as login from '/@service/login';
import * as util from '/@service/util';
import store from '/@store/index';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const hidingSpinnerUrl = [];
// hidingSpinnerUrl.push('/common/fcm/set');
// Add a request interceptor
axios.interceptors.request.use(
  async function (config) {
    // Do something before request is sent
    const url = config.url;
    if (!hidingSpinnerUrl.includes(url)) store.commit('setSpiner', true);

    const access_token = login.getAccessToken();
    if (util.isNotEmpty(access_token)) config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  },
  function (error) {
    store.commit('setSpiner', false);
    console.log('axios request error ', error);
    // Do something with request error
    return Promise.reject(error);
  },
);

// // Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    store.commit('setSpiner', false);
    return response;
  },
  async function (error) {
    store.commit('setSpiner', false);
    if (error.response) {
      // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
      // console.log(error.response);
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
    } else if (error.request) {
      // 요청이 이루어 졌으나 응답을 받지 못했습니다.
      // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
      // Node.js의 http.ClientRequest 인스턴스입니다.
      // console.log(error.request);
    } else {
      // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
      // console.log('unknown Error', error.message);
    }
    // console.log(error.config);

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.error('api call error', error.response);
    // console.log('api call error', error.response);

    if (error.response) {
      if (error.response.status === 400 && error.response.config.url === '/oauth/token') {
        console.error('login fail');
        return Promise.resolve(error.response);
      }
      const errorAPI = error.config;
      // // console.log('errorAPI', errorAPI);

      if (error.response.status === 401 && errorAPI.retry === undefined) {
        errorAPI.retry = true;
        console.error('401:', error.response.status, error.response.data);
        const result = await login.refreshToken();
        if (result) {
          return await axios(errorAPI);
        }
      }
      if (error.response.status === 401 && errorAPI.retry === true) {
        login.logout();
      }
    } else {
      alert('Failed to connect to server.');
    }

    return Promise.reject(error);
  },
);

export default axios;
