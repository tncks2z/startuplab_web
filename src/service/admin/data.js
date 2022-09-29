import axios from "../axios";
import common from '/@service/common';
import { isNotEmpty } from '/@service/util';

export async function getDataInfo(param, callback) {
  try {
    const data = {
      work_id: param.get('work_id'),
      data_status: param.get('data_status')
    }
    const result = await axios.post('/web/manager/work/info', data);
    
    if(callback) callback(result.data);
    return result.data;
  } catch (err) {
    if(callback) callback(err.response);
  }
}

export async function getUserSearch(param, callback) {
	try {
		const data = {
			work_id: param.get('work_id'),
			data_status: param.get('data_status'),
			columnName: param.get('columnName'),
			keyword: param.get('keyword'),
		};
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
      user_status: param.get('user_status')
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
  try{
    console.log(param.get('user_id'));
    console.log(param.get('idsArray'));
    const data = {
      user_id: param.get('user_id'),
      idsArray: JSON.parse('['+ param.get('idsArray') +']')
    }
    console.log(data);
    const result = await axios.post('/web/work/distribution', data);
    if (callback) callback(result.data);
    return result.data;
  } catch (err) {
    throw new Error(err);
  }
}
// export const getDataInfo = (param) => {
//   let data = {
//     work_id: param.get('work_id'),
//     data_status: param.get('data_status')
//   }

//   const result = axios.post('/web/manager/work/info', data);
//   return result.data;

// }