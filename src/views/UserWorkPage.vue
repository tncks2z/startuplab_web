<template>
	<div>
		<div>
			<select
				class="form-select select-project"
				v-model="selectedProjectCode"
				@change="showProject($event)">
				<option value="" selected disabled>업무 선택</option>
				<option :value="project.work_id" :key="i" v-for="(project, i) in projectList">
					{{ project.work_name }}
				</option>
			</select>
		</div>
		<h4 class="title">{{ user_name }}님의<br class="sp" /> 업무현황 페이지</h4>
		
		<div class="total-percent bg" >
			<div class="main">
				<h5 class="theme_total">
					{{ projects[assignment_id-1] }} <br class="sp" /><span class="theme_name">전체</span>
				</h5>
				<p class="user_per">
					{{ userAss_progress }}%<br class="sp" /><span class="avg_per"
						>(평균 {{ allUser_progress }}%)</span
					>
				</p>
			</div>
			<p class="temp_storage">
				・임시저장 : <br class="sp" /><span class="ts">{{ userAssSt.data_status3 }}</span
				>개
			</p>
			<p class="actual_measurement">
				・실측 : <br class="sp" />
				<span class="am">{{ userAssSt.data_status4 }}</span
				>개
			</p>
			<p class="completion">
				・완료 : <br class="sp" /><span class="com">{{ userAssSt.data_status6 }}</span
				>개
			</p>
		</div>
		<!-- ▼ 카테고리별 개인 작업 현황 -->
		<div  v-if="selectedProjectCode">
			<div class="total-percent line">
				<div class="main">
					<h5 class="theme_total" @change="showProject($event)">{{ pjName }}</h5>
					<p class="user_per">
						{{ userWork_progress }}% <br class="sp" /><span class="avg_per"
							>(평균 {{ totalWork_progress }}%)</span
						>
					</p>
				</div>

				<p class="temp_storage">
					・임시저장 : <br class="sp" /><span class="ts">{{ userWorkSt.data_status3 }}</span
					>개
				</p>
				<p class="actual_measurement">
					・실측 : <br class="sp" /><span class="am">{{ userWorkSt.data_status4 }}</span
					>개
				</p>
				<p class="completion">
					・완료 : <br class="sp" /><span class="com">{{ userWorkSt.data_status6 }}</span
					>개
				</p>
			</div>
			<!-- 검색영역 -->
			<div class="flex mt-30">
				<div class="flex-area"></div>
				<div class="search-area flex-area" v-if="selectedProjectCode">
					<select v-model="selectedSearchOption" class="form-select" ref="searchSelect">
					<option value="" selected disabled>선택</option>
					<option value="dataStatus">데이터 상태</option> 
					<option :value="searchOption" v-for="(searchOption, i) in searchOptionList.english" :key="i">
						{{ searchOptionList.korean[i] }}
					</option>
					</select>
					<input type="text" class="form-control" ref="searchInput" :value="searchedData" @input="changeKeyword" @keypress.enter="searchTable" placeholder="검색어를 입력하세요" />
					<button type="button" class="btn" @click="searchTable">검색</button>
				</div>
			</div>
			
			<div class="show-nothing" v-if="dataNone">해당 데이터가 없습니다.</div>
			<div class="show-nothing" v-if="searchedNone">해당 검색어를 찾을 수 없습니다.</div>
			<div class="table-responsive" v-if="selectedProjectCode && !dataNone  && !searchedNone">	
				<table class="table">
					<thead>
						<tr>
							<th>No.</th>
							<th></th>
							<th scope="col">데이터 상태</th>
							<th scope="col">최종수정날짜</th>
							<th scope="col" v-for="(th, i) in tableHeaderList" :key="i">
							{{ th }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(data, i) in dataListValue" :key="i">
							<td>{{ (currentPage - 1) * 100 + (i + 1) }}</td>
							<td scope="row">
							<router-link :to="`/admin/tasklist/modify/${dataList.data[i].data_id}`">
								<button class="btn btn-secondary" type="button" id="buttonInput" @click="pushDataId(dataList.data[i].data_id, dataList.data[i].data_status_name)">수정</button>
							</router-link>
							</td>
							<td scoped="row">
							{{ tableTaskList[dataList.data[i].data_status] }}
							</td>
							<td scoped="row">
							{{ $filters.dateFormat(dataList.data[i].update_time) }}
							</td>
							<td v-for="(datakey, j) in dataListKey" :key="j">
							{{ data[datakey] }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="pagination-center" v-if="selectedProjectCode && !dataNone  && !searchedNone">
				<vue-awesome-paginate
					:total-items="this.totalItems"
					:max-pages-shown="this.MaxPagesShown"
					:current-page="this.currentPage"
					:itemsPerPage="this.itemsPerPage"
					:on-click="onClickHandler"
					:show-breakpoint-buttons="false"
					:show-ending-buttons="true"
					firstPageContent="<<"
					lastPageContent=">>"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { msgbox } from '../service/common';
import { getUserWorkId,getUserSearch,getUserAddForm } from "/@service/user";
import {getUserDataNum,getUserWorkData2,getUsertotallangth} from "/@service/admin/data";

export default {
	data() {
		return {
			user_name: '',
			user_id: '',
			pjName: '',
			assignment_id: '',
			user_status: 1,
			work_name:'',
			selectedProjectCode: '',
			dataList: [],
			dataListKey: [],
			dataListValue: [],
			projectList: [],
			projects: ['광진구', '순천', '광주', '문정원'],
			taskList: [
				{ tkname: '할일', tkcode: 2 },
				{ tkname: '실측', tkcode: 4 },
				{ tkname: '임시저장', tkcode: 3 },
				{ tkname: '완료', tkcode: 6 },
			],
			tableTaskList: ['삭제', '할당전', '할일', '임시저장', '실측', '조사불가', '완료'],
			columnList: [],
			tableHeaderList: [],

			// 유저 작업 진행률
			userAssSt:[],
			allAss_data:[],
			allAss_dataTotal:0,
			allUser_progress:0,
			userAss_progress:0,
			assUsertotal:[],
			userWorkSt:[],
			totalWork_progress:0,
			userWork_progress:0,
			data_status1:'',
			data_status2:'',
			data_status3:'',
			data_status4:'',
			data_status5:'',
			data_status6:'',

			//검색
			searchedData: '',
			selectedSearchOption: '',
			searchOptionList: {
				korean: [],
				english: [],
			},
			searchDataIndex: '',
			searchedNone : false,
			dataNone : false,

			// pagination
			totalItems: 0,
			itemsPerPage: 100,
			MaxPagesShown: 5, // 페이지 숫자 버튼 값 기본값 5개
			currentPage: 1, //  현재 활성 페이지 기본값 1
		};
	},
	created() {
		// 이전페이지 세션스토리지에서 저장되는 값
		this.user_name = sessionStorage.getItem('user_name')
		this.user_id = sessionStorage.getItem('user_id')
		this.assignment_id = sessionStorage.getItem('assignment_id')
	},
	mounted() {
		//assignment_id로 프로젝트명 불러오기
		const setData = new FormData();
		setData.set('assignment_id', this.assignment_id);

		getUserWorkId(setData).then((result) => {
			this.projectList = result.data.data;
		});

		// 전체 작업량 확인
		const allAssData = new FormData();
		const userAssData = new FormData();
		const Usertotallangth = new FormData();

		allAssData.set('assignment_id', this.assignment_id)
		userAssData.set('assignment_id', this.assignment_id)
		userAssData.set('user_id', this.user_id)
		Usertotallangth.set('assignment_id', this.assignment_id)
		Usertotallangth.set('user_status', this.user_status)

		// 해당 프로젝트의 총 작업량
		getUserDataNum(allAssData).then((data) => {
			this.allAss_data = data.data.data;
			this.allAss_dataTotal = this.allAss_data.data_status1+this.allAss_data.data_status2+this.allAss_data.data_status3+this.allAss_data.data_status4+this.allAss_data.data_status5+this.allAss_data.data_status6;
			
			//해당 프로젝트 별 총 유저 인원수
			getUsertotallangth(Usertotallangth).then((data)=>{
				this.assUsertotal =data.data.user.length
				//프로젝트 전체 인원의 완료 비율
				this.allUser_progress = ((this.allAss_data.data_status6/(this.assUsertotal*this.allAss_dataTotal))*100).toFixed(1) ;
				if (isNaN(this.allUser_progress)== true) { 
					this.allUser_progress = 0;
				}
			})
			//유저 프로젝트 작업량
			getUserDataNum(userAssData).then((data) => {
				this.userAssSt = data.data.data;
				//유저의 작업비율
				this.userAss_progress = ((this.userAssSt.data_status6/this.allAss_dataTotal)*100).toFixed(1) ;
				if (isNaN(this.userAss_progress)== true) { 
					this.userAss_progress = 0;
				}
			})
		})
	},
	methods: {
		showProject(e) {
			this.pjName = e.target.options[e.target.options.selectedIndex].text;
			sessionStorage.setItem('workName', this.pjName)
			sessionStorage.setItem('selectedWork', this.selectedProjectCode)
			// 유저의 프로젝트 > 과제별 전체 api
			const allWorkData = new FormData();
			const userWorkData = new FormData();
			allWorkData.set('work_id', this.selectedProjectCode)
			userWorkData.set('work_id', this.selectedProjectCode)
			userWorkData.set('user_id', this.user_id)
			
			// 전체 work_id별 작업량
			getUserDataNum(allWorkData).then((data) =>{
				this.allWork_data = data.data.data;
				this.allWork_dataTotal = this.allWork_data.data_status1+this.allWork_data.data_status2+this.allWork_data.data_status3+this.allWork_data.data_status4+this.allWork_data.data_status5+this.allWork_data.data_status6;
				//work_id별 전체 인원의 완료 비율
				this.totalWork_progress = ((this.allWork_data.data_status6/(this.assUsertotal*this.allWork_dataTotal))*100).toFixed(1) ;
				if (isNaN(this.totalWork_progress)== true) { 
					this.totalWork_progress = 0;
				}
				// 유저 work_id별 작업량
				getUserDataNum(userWorkData).then((data) =>{
					this.userWorkSt = data.data.data;
					// 해당 유저의 work_id 완료 비율
					this.userWork_progress = ((this.userWorkSt.data_status6/this.allWork_dataTotal)*100).toFixed(1) ;
					if (isNaN(this.userWork_progress)== true) { 
						this.userWork_progress = 0;
					}
					this.showTable();	
				})
			})
		},
		// api데이터 테이블로 출력
		showTable() {
			if (this.pjName !== '') {
				const setData = new FormData();

				setData.set('work_id', this.selectedProjectCode);
				setData.set('user_id', this.user_id);
				
				getUserAddForm(setData).then((result) => {
					this.columnList = result.data;
					this.getData();
				});
			}
		},

		// pagination
		getData() {
			const setData2 = new FormData();

			setData2.set('work_id', this.selectedProjectCode);
			setData2.set('user_id', this.user_id);
			setData2.set('row_count', this.itemsPerPage);
			setData2.set('page_no', this.currentPage);

			getUserWorkData2(setData2).then((result) => {
				this.dataList = result.data;
				this.totalItems = result.data.total_count;
				this.tableHeaderList = [];	
				if (this.dataList.data.length !== 0) {
					this.dataNone = false;
					this.dataListValue = [];
					for (let i = 0; i < this.dataList.data.length; i++) {
						const arr = JSON.parse(this.dataList.data[i].data_json);
						this.dataListKey = Object.keys(arr);
						this.dataListValue.push(arr);
					}
					for (let i = 0; i < this.columnList.data.length; i++) {
						for (let j = 0; j < this.columnList.data.length; j++) {
							if (this.columnList.data[j].meta_key == this.dataListKey[i]) {
								this.tableHeaderList.push(this.columnList.data[j].meta_name);
							}
						}
					}
					this.searchOptionList.english = this.dataListKey;
					this.searchOptionList.korean = this.tableHeaderList;
				}
				else {
					this.dataNone = true;
				}
			});
		},

		onClickHandler(page) {
			this.currentPage = page;
			this.getData();
		},

		// 검색기능
		changeKeyword(w) {
			this.searchedData = w.target.value;
		},
		resetSearchOption() {
			this.selectedSearchOption = '';
		},
		searchTable() {
			// 데이터 상태로 검색
			if (this.selectedSearchOption == 'dataStatus' && this.searchedData != '' ) {
				for (let i = 0; i < this.tableTaskList.length; i++) {
					if (this.tableTaskList[i].includes(this.searchedData)) {
						this.searchDataIndex = i
					}
				}
				this.dataList.data = this.dataList.data.filter((data) => data.data_status == this.searchDataIndex);
				this.totalItems = this.dataList.data.length;
				this.tableHeaderList = [];	
				if (this.dataList.data.length !== 0) {
					this.searchedNone = false;
					this.dataListValue = [];
					for (let i = 0; i < this.dataList.data.length; i++) {
						const arr = JSON.parse(this.dataList.data[i].data_json);
						this.dataListKey = Object.keys(arr);
						this.dataListValue.push(arr);
					}
					for (let i = 0; i < this.columnList.data.length; i++) {
						for (let j = 0; j < this.columnList.data.length; j++) {
							if (this.columnList.data[j].meta_key == this.dataListKey[i]) {
								this.tableHeaderList.push(this.columnList.data[j].meta_name);
							}
						}
					}
					this.searchOptionList.english = this.dataListKey;
					this.searchOptionList.korean = this.tableHeaderList;

					this.resetSearchOption();
					this.searchedData = '';
				} else {
					this.searchedNone = true;
					this.resetSearchOption();
					this.searchedData = '';
				}
			} else {
				// 그 외 칼럼명으로 검색
				if (this.selectedSearchOption != '' && this.searchedData != '') {
					const setSearch = new FormData();

					setSearch.set('work_id', this.selectedProjectCode);
					setSearch.set('columnName', this.selectedSearchOption);
					setSearch.set('keyword', this.searchedData);
					setSearch.set('user_id', this.user_id);

					getUserSearch(setSearch).then((result) => {
					this.dataList = result.data;
					this.totalItems = this.dataList.data.length;

					for (let i = 0; i < this.dataList.data.length; i++) {
						const arr = JSON.parse(this.dataList.data[i].data_json);
						this.dataListKey = Object.keys(arr);
					}

					for (let i = 0; i < this.columnList.data.length; i++) {
						for (let j = 0; j < this.columnList.data.length; j++) {
						if (this.columnList.data[j].meta_key == this.dataListKey[i]) {
							this.tableHeaderList.push(this.columnList.data[j].meta_name);
						}
						}
					}
					this.searchOptionList.english = this.dataListKey;
					this.searchOptionList.korean = this.tableHeaderList;

					this.dataListValue = [];
					for (let i = 0; i < this.dataList.data.length; i++) {
						this.dataListValue.push(JSON.parse(this.dataList.data[i].data_json));
					}
					if (this.dataListValue.length === 0) {
						this.searchedNone = true;
					}
					});
					this.resetSearchOption();
					this.searchedData = '';
				} else if ((this.selectedSearchOption == '') & (this.searchedData != '')) {
					msgbox('검색할 칼럼을 선택해주세요');
					this.$refs.searchSelect.focus();
				} else if ((this.selectedSearchOption != '') & (this.searchedData == '')) {
					msgbox('검색할 키워드를 입력해주세요');
					this.$refs.searchInput.focus();
				} else {
					this.searchedNone = false;
					this.resetSearchOption();
					this.searchedData = '';
					this.showTable();
				}
			}
		},
		// 데이터 수정 버튼
		pushDataId(id, name) {
			let statusCode = ''
			statusCode = Number(this.tableTaskList.indexOf(name));
			sessionStorage.setItem('data_status', statusCode)
			  sessionStorage.setItem('data_id', id);
		},
	},
};

</script>

<style scoped>
.select-project {
	margin-right: 0;
	width: 20%;
	margin-top: 20px;
}
.selectbox .form-select {
	width: 100%;
	margin-top: 20px;
	min-width: 220px;
	font-size: 0.9rem;
}
option {
	font-size: 0.9rem;
}
.title {
	padding-bottom: 20px;
	text-align: center;
}

.name {
	text-align: center;
	margin-top: 40px;
}
.bg {
	background: #fbebe3;
}
.total-percent.line {
	border: 2px solid #e17b46;
}
.total-percent {
	width: 100%;
	padding: 17px;
	border-radius: 10px;
	margin: 10px 0;
	display: flex;
	align-items: center;
}
.main {
	width: 45%;
}
.theme_total {
	display: inline-block;
	margin-left: 15%;
	font-size: 1.5rem;
	font-weight: 800;
}
.user_per {
	display: inline-block;
	font-size: 1.5em;
	color: #e17b46;
	font-weight: 800;
	margin-left: 20px;
}
.avg_per {
	font-size: 0.8rem;
	color: black;
	font-weight: 700;
	margin-left: 5px;
}
.temp_storage,
.actual_measurement,
.completion {
	margin-left: 7%;
}
.ts {
	color: #d64c57;
	font-weight: 700;
}
.am,
.com {
	color: #3e8cdb;
}
.table-responsive {
	overflow: scroll;
	height: 100%;
	max-height: 700px;
	margin-top: 20px;
	white-space: nowrap;
	scrollbar-color: #e4e4e4;
}

.table-bordered {
	text-align: center;
	vertical-align: middle;
	font-size: 0.8rem;
}
button {
	border: none;
}
th {
	background-color: #fbebe3;
	vertical-align: middle;
	padding: 8px 10px;
}
.sp {
	display: none;
}
.mt-30{
	margin-top: 30px;
}

@media (max-width: 768px) {
	* {
		font-size: 1rem !important;
	}
	.sp {
		display: block;
	}
	.main,
	.user_per,
	.avg_per,
	.temp_storage,
	.actual_measurement,
	.completion {
		font-size: 0.8rem !important;
	}
	.search-area .form-select {
		min-width: 70px;
	}
}
</style>
