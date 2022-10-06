<template>
  <div class="container">
    <!-- 업무선택, 목록선택 셀렉트박스 -->
    <select v-model="selectedProjectCode" class="form-select select-project" id="selectProject" @change="showProject($event)">
      <option value="null" selected disabled>업무 선택</option>
      <option :key="i" :value="project.work_id" v-for="(project, i) in projectList">
        {{ project.work_name }}
      </option>
    </select>
    <select v-model="selectedTaskCode" class="form-select select-project" id="selectTask" @change="showTask($event)">
      <option value="null" selected disabled>목록 선택</option>
      <option :key="i" :value="task.tkcode" v-for="(task, i) in taskList">
        {{ task.tkname }}
      </option>
    </select>

    <!-- 데이터 추가버튼 -->
    <button class="btn btn-secondary btn-add-data" type="button" v-show="selectedProjectCode != null" @click="goAddForm">데이터 추가</button>

    <!-- 제목 -->
    <div v-if="selectedProjectCode && selectedTaskCode">
      <h3>{{ pjName }} {{ tkName }} 목록</h3>
    </div>

    <!-- 검색영역 -->
    <div class="flex">
      <div class="flex-area"></div>
      <div class="search-area flex-area" v-if="selectedProjectCode && selectedTaskCode">
        <select v-model="selectedSearchOption" class="form-select" ref="searchSelect">
          <option value="" selected>선택</option>
          <option :value="searchOption" v-for="(searchOption, i) in searchOptionList" :key="i">
            {{ searchOption }}
          </option>
        </select>
        <input type="text" class="form-control" ref="searchInput" :value="searchedData" @input="changeKeyword" @keypress.enter="searchTable" placeholder="검색어를 입력하세요" />
        <button type="button" class="btn" @click="searchTable">검색</button>
      </div>
    </div>

    <!-- 테이블 -->
    <div class="none-data" v-if="searchedNone">해당 검색어를 찾을 수 없습니다.</div>
    <div class="table-responsive" v-if="selectedProjectCode && selectedTaskCode && searchedNone === false">
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th scope="col">데이터 상태</th>
            <th scope="col">최종수정날짜</th>
            <th scope="col" v-for="(dataKey, i) in dataListKey" :key="i">
              {{ dataKey }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, i) in dataListValue" :key="i">
            <td scope="row">
              <router-link :to="`/user/edit/${dataList.data[i].data_id}`">
                <button class="btn btn-secondary" type="button" id="buttonInput" @click="pushDataId(dataList.data[i].data_id)">수정</button>
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
      <!-- <vue-awesome-paginate
				:total-items="defineTotalItems"
				:items-per-page="itemsPerPage"
				:max-pages-shown="MaxPagesShown"
				:current-page="currentPage"
				:on-click="onClickHandler"
				:show-breakpoint-buttons="false" /> -->
    </div>
  </div>
</template>

<script>
import { msgbox } from '../service/common';
import { getUserSearch, getUserWorkData, getUserWorkId } from '/@service/user';

export default {
  created() {
    this.assignment_id = this.$cookies.get('assignmentId');
    this.user_id = this.$cookies.get('userId');

    const setData = new FormData();
    setData.set('assignment_id', this.assignment_id);

    getUserWorkId(setData).then((result) => {
      this.projectList = result.data.data;
    });
  },

  mounted() {
    this.pjName = sessionStorage.getItem('projectName');
    this.tkName = sessionStorage.getItem('taskName');
    this.selectedProjectCode = sessionStorage.getItem('projectCode');
    this.selectedTaskCode = sessionStorage.getItem('taskCode');

    this.showTable();
  },

  data() {
    return {
      //⬇️ paginate 변수
      selectPage: 1,
      itemsPerPage: 5, //한 페이지 당 출력해야하는 행의 갯수
      MaxPagesShown: 5, // 페이지 숫자 버튼 값 기본값 5개
      currentPage: 1, //  현재 활성 페이지 기본값 1

      //⬇️ user 데이터
      assignment_id: '',
      user_id: '',

      //⬇️ 업무관련 데이터
      pjName: '',
      tkName: '',
      selectedTaskCode: '',
      selectedProjectCode: '',
      searchedNone: false,
      dataList: [],
      dataListKey: [],
      dataListValue: [],
      searchedData: '',
      selectedSearchOption: '',
      searchOptionList: [],
      taskList: [
        { tkname: '할일', tkcode: 2 },
        { tkname: '실측', tkcode: 4 },
        { tkname: '임시저장', tkcode: 3 },
        { tkname: '완료', tkcode: 6 },
      ],
      projectList: [],
      tableTaskList: ['삭제', '할당전', '할일', '임시저장', '실측', '조사불가', '완료'],
    };
  },

  methods: {
    showProject(e) {
      this.pjName = e.target.options[e.target.options.selectedIndex].text;
      sessionStorage.setItem('projectName', this.pjName);
      sessionStorage.setItem('projectCode', this.selectedProjectCode);
      this.showTable();
    },
    showTask(e) {
      this.tkName = e.target.options[e.target.options.selectedIndex].text;
      sessionStorage.setItem('taskName', this.tkName);
      sessionStorage.setItem('taskCode', this.selectedTaskCode);
      this.showTable();
    },
    showTable() {
      if (this.pjName != '' && this.tkName != '') {
        const setData = new FormData();

        setData.set('work_id', this.selectedProjectCode);
        setData.set('data_status', this.selectedTaskCode);
        setData.set('user_id', this.user_id);

        getUserWorkData(setData).then((result) => {
          this.dataList = result.data;
          if (this.dataList != null) {
            this.dataListValue = [];
            for (let i = 0; i < this.dataList.data.length; i++) {
              const arr = JSON.parse(this.dataList.data[i].data_json);
              this.dataListKey = Object.keys(arr);
              this.searchOptionList = this.dataListKey;
              this.dataListValue.push(arr);
            }
          }
        });
      }
    },
    goAddForm() {
      this.$router.push('/user/add').catch(() => {});
    },
    pushDataId(id) {
      sessionStorage.setItem('data_id', id);
    },
    changeKeyword(w) {
      this.searchedData = w.target.value;
    },
    resetSearchOption() {
      this.selectedSearchOption = '';
    },
    searchTable() {
      if (this.selectedSearchOption != '' && this.searchedData != '') {
        const setSearch = new FormData();

        setSearch.set('work_id', this.selectedProjectCode);
        setSearch.set('data_status', this.selectedTaskCode);
        setSearch.set('columnName', this.selectedSearchOption);
        setSearch.set('keyword', this.searchedData);

        getUserSearch(setSearch).then((result) => {
          this.dataList = result.data;

          for (let i = 0; i < this.dataList.data.length; i++) {
            const arr = JSON.parse(this.dataList.data[i].data_json);
            this.dataListKey = Object.keys(arr);
            this.searchOptionList = this.dataListKey;
          }
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
    },
  },
};
</script>

<style scoped>
h3 {
  text-align: center;
  margin: 30px;
}
.container {
  margin-top: 20px;
  padding: 0;
}
.btn-add-data {
  float: right;
  font-size: 0.8rem;
  border: none;
  background-color: #e17b46;
}
.btn-add-data:hover {
  background-color: #c15a33;
}
.none-data {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  margin-top: 15rem;
}
</style>
