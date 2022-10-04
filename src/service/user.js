import axios from 'axios';
import common from '/@service/common';
import { isNotEmpty } from '/@service/util';

// 유저 메인페이지 데이터 조회
export async function getUserWorkData(param, callback) {
	try {
		const data = {
			work_id: param.get('work_id'),
			data_status: param.get('data_status'),
		};
		const result = await axios.post('/web/work/info', data);

		if (callback) callback(result.data);
		return result.data;
	} catch (err) {
		if (callback) callback(err.response);
	}
}

// 검색
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

// 업무선택 셀렉트박스
export async function getUserWorkId(param, callback) {
	try {
		const data = {
			assignment_id: param.get('assignment_id'),
		};
		const result = await axios.post('/web/all/works', data);
		if (callback) callback(result.data);
		return result.data;
	} catch (err) {
		if (callback) callback(err.response);
	}
}

// "데이터추가" 폼
export async function getUserAddForm(param, callback) {
	try {
		const data = {
			work_id: param.get('work_id'),
		};

		const result = await axios.post('/web/metadata', data);
		if (callback) callback(result.data);
		return result.data;
	} catch (err) {
		if (callback) callback(err.response);
	}
}

// "데이터수정" 데이터 불러오기
export async function getUserEditForm(param, callback) {
	try {
		const data = {
			data_id: param.get('data_id'),
		};

		const result = await axios.post('/web/db/edit', data);
		if (callback) callback(result.data);
		return result.data;
	} catch (err) {
		if (callback) callback(err.response);
	}
}
