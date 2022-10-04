<template>
	<div>
		<div class="select-project">
			<select
				v-model="selectedProjectCode"
				class="form-select"
				@change="showProject($event)">
				<option value="" selected>업무 선택</option>
				<option :value="project.pjcode" :key="i" v-for="(project, i) in projectList">
					{{ project.pjname }}
				</option>
			</select>
		</div>
		<h4 class="title">{{ user_name }}님의<br class="sp" />업무현황 페이지</h4>
		<div class="total-percent bg">
			<div class="main">
				<h5 class="theme_total">
					{{ projects[0] }} <br class="sp" /><span class="theme_name">전체</span>
				</h5>
				<p class="user_per">
					{{ progress[0] }}%<br class="sp" /><span class="avg_per"
						>(평균 {{ avg_progress[0] }}%)</span
					>
				</p>
			</div>
			<p class="temp_storage">
				・임시저장 :<br class="sp" /><span class="ts">{{ temp_storage[0] }}</span
				>개
			</p>
			<p class="actual_measurement">
				・실측 :<br class="sp" />
				<span class="am">{{ actual_measurement[0] }}</span
				>개
			</p>
			<p class="completion">
				・완료 : <br class="sp" /><span class="com">{{ completion[0] }}</span
				>개
			</p>
		</div>
		<!-- ▼ 카테고리별 개인 작업 현황 -->
		<div  v-if="selectedProjectCode">
			<div class="total-percent line">
				<div class="main">
					<h5 class="theme_total">문정원_OTT</h5>
					<p class="user_per">
						{{ progress[0] }}% <br class="sp" /><span class="avg_per"
							>(평균 {{ avg_progress[0] }}%)</span
						>
					</p>
				</div>

				<p class="temp_storage">
					・임시저장 : <br class="sp" /><span class="ts">{{ temp_storage[0] }}</span
					>개
				</p>
				<p class="actual_measurement">
					・실측 : <br class="sp" /><span class="am">{{ actual_measurement[0] }}</span
					>개
				</p>
				<p class="completion">
					・완료 : <br class="sp" /><span class="com">{{ completion[0] }}</span
					>개
				</p>
			</div>
			<!-- 검색영역 -->
			<div class="flex">
				<div class="flex-area"></div>
				<div class="search-area flex-area">
					<select class="form-select">
						<option value="">선택</option>
						<option value="시설명">시설명</option>
						<option value="주소">주소</option>
					</select>
					<input type="text" class="form-control" placeholder="검색어를 입력하세요" />
					<button class="btn" type="button">검색</button>
				</div>
			</div>

			<div class="table-responsive" v-if="selectedProjectCode" 
						:items-per-page="itemsPerPage"
						:v-model="currentPage">
				
				<table class="table">
					<thead>
						<tr>
							<th></th>
							<th scope="col" v-for="(dataKey, i) in dataListKey" :key="i">
								{{ dataKey }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(data, i) in dataListValue" :key="i">
							<td scope="row">
								<button class="btn btn-secondary" type="button" id="buttonInput">
									수정
								</button>
							</td>
							<td v-for="(datakey, j) in dataListKey" :key="j">
								{{ data[datakey] }}
							</td>
						</tr>
					</tbody>
				</table>
				<vue-awesome-paginate
						:total-items="defineTotalItems"
						:items-per-page="itemsPerPage"
						:max-pages-shown="MaxPagesShown"
						:current-page="currentPage"
						:on-click="onClickHandler"
						:show-breakpoint-buttons="false"/>
			</div>
		</div>
	</div>
</template>

<script>
import {getDataInfo} from "/@service/admin/data";

export default {
	data() {
		return {
			selectPage: 1,
			itemsPerPage:5, //한 페이지 당 출력해야하는 행의 갯수
			MaxPagesShown: 5, // 페이지 숫자 버튼 값 기본값 5개
			currentPage:1, //  현재 활성 페이지 기본값 1

			// ▼셀렉트 데이터 임시
			pjName: '',
			selectedProjectCode: '',
			projectList: [
				{ pjname: '광진구', pjcode: 1 },
				{ pjname: '순천', pjcode: 2 },
				{ pjname: '광주', pjcode: 3 },
				{ pjname: '문정원_OTT', pjcode: 4 },
				{ pjname: '문정원_펫프렌드', pjcode: 5 },
				{ pjname: '문정원_베리어프리', pjcode: 6 },
				{ pjname: '문정원_트렌드기반 문화시설', pjcode: 7 },
				{ pjname: '문정원_문화다양성', pjcode: 8 },
				{ pjname: '문정원_커뮤니티', pjcode: 9 },
				{ pjname: '문정원_액티비티', pjcode: 10 },
				{ pjname: '문정원_가족여가', pjcode: 11 },
			],
			Userdate: [{ User: '문정원_OTT', value: '문정원_OTT' }],
			User: ['사수봉', '김인턴', '최인턴'],
			projects: ['문정원', '광진구', '광주', '순천'],
			progress: ['26.3'],
			avg_progress: ['5.9'],
			temp_storage: ['26'],
			actual_measurement: ['10'],
			completion: ['55'],
			dataList: [],
			dataListKey: [],
			dataListValue: [],
		};
	},
	// created() {
	// 	axios.get(`http://52.22.216.42:8090/common/user/info/${this.$route.params.user_id}`).then(({ data }) => {
	// 		// console.log(data.data.user.user_id);
	// 		this.user_id = data.data.user.user_id;
	// 		this.user_name = data.data.user.user_name;
	// 		this.user_email = data.data.user.user_email;
	// 		this.user_phone = data.data.user.user_phone;
	// 		this.assignment_id = data.data.user.assignment_id;
	// 		this.user_type = data.data.user.user_type;
	// 	})
	// },
	methods: {
		defineTotalItems() {
			this.defineTotalItems = this.dataListValue.length
		},
		showProject(e) {
			this.pjName = e.target.options[e.target.options.selectedIndex].text;
			this.showTable();
		},
		showTable() {
			if (this.pjName !== '') {
				const setData = new FormData();

				setData.set('work_id', this.selectedProjectCode);

				getDataInfo(setData).then((result) => {
					console.log('result: ', result);
					this.dataList = result.data;

					for (let i = 0; i < this.dataList.data.length; i++) {
						const arr = JSON.parse(this.dataList.data[i].data_json);
						this.dataListKey = Object.keys(arr);
					}
					this.dataListValue = [];
					for (let i = 0; i < this.dataList.data.length; i++) {
						this.dataListValue.push(JSON.parse(this.dataList.data[i].data_json));
					}
					this.defineTotalItems();
				});
			}
		},
		goInput() {
			this.$router.replace('/');
		},
		
		onClickHandler(page) {
			console.log(page);
		},
	},
	
};

</script>

<style scoped>

/* ==================== */
.pagination-container {
    display: flex;
    column-gap: 10px;
  }
  .paginate-buttons {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    cursor: pointer;
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(217, 217, 217);
    color: black;
  }
  .paginate-buttons:hover {
    background-color: #d8d8d8;
  }
  .active-page {
    background-color: #3498db;
    border: 1px solid #3498db;
    color: white;
  }
  .active-page:hover {
    background-color: #2988c8;
  }
/* ==================== */

.select-project {
	margin-right: 0;
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
	display: inline-block;
	width: 45%;
	margin-top: 30px;
	margin-left: 15%;
	padding-bottom: 5px;
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
	width: 30%;
}
.theme_total {
	display: inline-block;
	margin-left: 20px;
	font-size: 1.3rem;
	font-weight: 800;
}
.user_per {
	display: inline-block;
	font-size: 1.25em;
	color: #e17b46;
	font-weight: 800;
	margin-left: 20px;
}
.avg_per {
	font-size: 0.8rem;
	color: black;
	font-weight: 700;
}
.temp_storage,
.actual_measurement,
.completion {
	margin-left: 5%;
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
	.title {
		width: 40%;
		margin-left: 25%;
	}

	.search-area .form-select {
		min-width: 70px;
	}
}
</style>
