import axios from '/@service/axios';

function serialize(rawData) {
  let rtnData = {};
  for (let [key, value] of rawData) {
    let sel = document.querySelectorAll('[name=' + key + ']');
    // Array Values
    if (sel.length > 1) {
      if (rtnData[key] === undefined) {
        rtnData[key] = [];
      }
      rtnData[key].push(value);
    } else {
      rtnData[key] = value;
    }
  }
  return rtnData;
}

export async function createChatRoom(params, cb) {
  try {
    const res = await axios.post('/chat/create', params);
    if (cb != undefined) {
      cb(res.data);
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function checkMessage(params, cb) {
  try {
    const res = await axios.post('/chat/check', params);
    if (cb != undefined) {
      cb(res.data);
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function sendMessage(params, cb) {
  try {
    const res = await axios.post('/chat/send', params);
    if (cb != undefined) {
      cb(res.data);
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function readMessage(params, cb) {
  try {
    const res = await axios.post('/chat/read', params);
    if (cb != undefined) {
      cb(res.data);
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function getChatList(user_id, cb) {
  try {
    const params = {
      user_id: user_id,
    };
    const res = await axios.post('/chat/list', params);
    if (cb != undefined) {
      cb(res.data);
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
