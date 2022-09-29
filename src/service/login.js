import axios from './axios';
import common from '/@service/common';
import { isNotEmpty } from '/@service/util';

const auth = {
  username: import.meta.env.VITE_CLIENT_ID,
  password: import.meta.env.VITE_SECRET,
};

export const getMyToken = () => {
  let token = localStorage.getItem(common.ACCESS_TOKEN);
  if (!isNotEmpty(token)) {
    token = sessionStorage.getItem(common.ACCESS_TOKEN);
  } else {
    sessionStorage.setItem(common.ACCESS_TOKEN, token);
  }
  return token;
};
export const getAccessToken = () => {
  return sessionStorage.getItem(common.ACCESS_TOKEN);
};

export const getRefreshToken = () => {
  let token = sessionStorage.getItem(common.REFRESH_TOKEN);
  if (!isNotEmpty(token)) {
    token = localStorage.getItem(common.REFRESH_TOKEN);
  }
  return token;
};

export const setOauthToken = (oauth) => {
  const access_token = oauth.access_token;
  const refresh_token = oauth.refresh_token;
  sessionStorage.setItem(common.ACCESS_TOKEN, access_token);
  sessionStorage.setItem(common.REFRESH_TOKEN, refresh_token);
  if (localStorage.getItem(common.KEEP_SIGN_IN) == 'true') localStorage.setItem(common.REFRESH_TOKEN, refresh_token);
};

export const deleteStorage = () => {
  sessionStorage.clear();
  localStorage.removeItem(common.REFRESH_TOKEN);
  localStorage.removeItem(common.KEEP_SIGN_IN);
};

export async function oauthLogin(param, callback) {
  try {
    param.set('grant_type', 'password');

    const result = await axios.post('/oauth/token', param, { auth });
    // login success
    if (result.status == 200) setOauthToken(result.data);
    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    console.log(err);

    return err;
  }
}

export async function refreshToken() {
  try {
    const refresh_token = getRefreshToken();
    let form = new FormData();
    form.append('refresh_token', refresh_token);
    form.append('grant_type', 'refresh_token');
    const result = await axios.post('/oauth/token', form, { auth });
    if (result.status == 200) setOauthToken(result.data);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function setFcmToken(param, callback) {
  try {
    param.app_type = common.APP_TYPE;
    const result = await axios.post('/common/fcm/set', param);
    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    if (callback) callback(err.response);
    // console.log(err);
    // throw new Error(err);
  }
}

export async function getLoginInfo(callback) {
  try {
    const result = await axios.post('/common/token/info');
    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    if (callback) callback(err.response);
    // console.log(err);
    throw new Error(err);
  }
}

export const logout = () => {
  deleteStorage();
};
