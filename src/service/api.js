import axios from '/@service/axios';
import store from '/@store/index.js';

export async function getCodeList(param, callback) {
  try {
    const result = await axios.post('/common/code/list', param);
    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    console.log('api error', err);
    throw new Error(err);
  }
}

export async function getUser(param, callback) {
  try {
    const result = await axios.post('/common/user/info', param);

    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function editUser(param, callback) {
  try {
    const result = await axios.post('/common/user/edit', param);
    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function joinUser(param, callback) {
  try {
    const result = await axios.post('/common/user/join', param);
    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function uploadFile(param, callback) {
  try {
    const result = await axios.post('/common/file/upload', param);
    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
