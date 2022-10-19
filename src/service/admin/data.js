import axios from '/@service/axios';
import common from '/@service/common';
import { isNotEmpty } from '/@service/util';

export async function getDataInfo(param, callback) {
  try {
    let data = {};
    if (param.get('user_id')) {
      data = {
        work_id: param.get('work_id'),
        data_status: param.get('data_status'),
        user_id: param.get('user_id'),
        row_count: param.get('row_count'),
        page_no: param.get('page_no'),
      };
    } else {
      data = {
        work_id: param.get('work_id'),
        data_status: param.get('data_status'),
        row_count: param.get('row_count'),
        page_no: param.get('page_no'),
      };
    }
    const result = await axios.post('/web/manager/work/info', data);

    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    if (callback) callback(err.response);
  }
}

export async function getUserSearch(param, callback) {
  try {
    let data = {};
    if(param.get('user_id')) {
      data = {
        work_id: param.get('work_id'),
        data_status: param.get('data_status'),
        columnName: param.get('columnName'),
        keyword: param.get('keyword'),
        user_id: param.get('user_id'),
      };
    } else {
      data = {
        work_id: param.get('work_id'),
        data_status: param.get('data_status'),
        columnName: param.get('columnName'),
        keyword: param.get('keyword'),
      }
    }


    const result = await axios.post('/web/search', data);
    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    if (callback) callback(err.response);
  }
}

export async function getUserList(param, callback) {
  try {
    const data = {
      assignment_id: param.get('assignment_id'),
      user_status: param.get('user_status'),
    };
    const result = await axios.post('/web/assignment/user/list', data);
    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    if (callback) callback(err.response);
  }
}

export async function getWorksInfo(param, callback) {
  try {
    const data = {
      assignment_id: param.get('assignment_id'),
    };

    const result = await axios.post('/web/all/works', data);
    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    if (callback) callback(err.response);

    throw new Error(err);
  }
}

export async function setWorkDistribute(param, callback) {
  try {
    const data = {
      user_id: param.get('user_id'),
      idsArray: JSON.parse('[' + param.get('idsArray') + ']'),
      data_status: param.get('data_status'),
    };

    const result = await axios.post('/web/work/distribution', data);
    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function getUserDataNum(param, callback) {
  try {
    const data = {
      work_id : param.get('work_id'),
      assignment_id : param.get('assignment_id'),
      user_id : param.get('user_id'),
    };

    const result = await axios.post('/web/work/nums', data);
    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    throw new Error(err);
  }
}

// 관리자 유저 데이터 조회
export async function getUserWorkData2(param, callback) {
  try {
    const data = {
      work_id: param.get('work_id'),
      user_id: param.get('user_id'),
      row_count: param.get('row_count'),
      page_no: param.get('page_no'),
    };
    const result = await axios.post('/web/manager/work/info', data);

    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    if (callback) callback(err.response);
  }
}