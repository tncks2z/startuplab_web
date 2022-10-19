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
          <option value="" selected disabled>선택</option>
          <option :value="searchOption" v-for="(searchOption, i) in searchOptionList.english" :key="i">
            {{ searchOptionList.korean[i] }}
          </option>
        </select>
        <input type="text" class="form-control" ref="searchInput" :value="searchedData" @input="changeKeyword" @keypress.enter="searchTable" placeholder="검색어를 입력하세요" />
        <button type="button" class="btn" @click="searchTable">검색</button>
      </div>
    </div>

    <!-- 테이블 -->
    <div class="show-nothing" v-if="dataNone">해당 데이터가 없습니다.</div>
    <div class="show-nothing" v-if="searchedNone">해당 검색어를 찾을 수 없습니다.</div>
    <div class="table-responsive" v-if="selectedProjectCode && selectedTaskCode && !searchedNone && !dataNone">
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
    </div>
    <div class="pagination-center" v-if="selectedProjectCode && selectedTaskCode && !searchedNone && !dataNone">
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
</template>

<script>
import { msgbox } from '../service/common';
import { getUserSearch, getUserWorkData, getUserWorkId, getUserAddForm } from '/@service/user';

export default {
  created() {
    this.assignment_id = this.$cookies.get('assignmentId');
    this.user_id = this.$cookies.get('userId');
    sessionStorage.removeItem('isAddPage');
    sessionStorage.removeItem('data_id');

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
      totalItems: 0,
      itemsPerPage: 100,
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
      dataNone: false,
      searchedNone: false,
      dataList: [],
      dataListKey: [],
      dataListValue: [],
      searchedData: '',
      selectedSearchOption: '',
      searchOptionList: {
        korean: [],
        english: [],
      },
      taskList: [
        { tkname: '할일', tkcode: 2 },
        { tkname: '실측', tkcode: 4 },
        { tkname: '임시저장', tkcode: 3 },
        { tkname: '완료', tkcode: 6 },
      ],
      projectList: [],
      tableTaskList: ['삭제', '할당전', '할일', '임시저장', '실측', '조사불가', '완료'],
      columnList: [],
      tableHeaderList: [],
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
      if (this.pjName !== null && this.tkName !== null) {
        const setData = new FormData();
        this.projectCode = sessionStorage.getItem('projectCode');
        this.projectName = sessionStorage.getItem('projectName');

        setData.set('work_id', this.projectCode);
        getUserAddForm(setData).then((result) => {
          this.columnList = result.data;
          this.getData();
        });
      }
    },
    getData() {
      const setData2 = new FormData();

      setData2.set('work_id', this.selectedProjectCode);
      setData2.set('data_status', this.selectedTaskCode);
      setData2.set('user_id', this.user_id);
      setData2.set('row_count', this.itemsPerPage);
      setData2.set('page_no', this.currentPage);

      getUserWorkData(setData2).then((result) => {
        this.dataList = result.data;
        this.totalItems = this.dataList.total_count;
        this.tableHeaderList = [];

        if (this.dataList.data.length !== 0) {
          this.dataNone = false;
          this.dataListKey = [];
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
        } else {
          this.dataNone = true;
        }
      });
    },
    onClickHandler(page) {
      this.currentPage = page;
      this.getData();
    },
    goAddForm() {
      this.$router.push('/user/add').catch(() => {});
      sessionStorage.setItem('isAddPage', true);
    },
    pushDataId(id) {
      sessionStorage.setItem('data_id', id);
    },
    changeKeyword(w) {
      this.searchedData = w.target.value;
    },
    resetSearchOption() {
      this.selectedSearchOption = '';
      this.searchedData = '';
    },
    searchTable() {
      if (this.selectedSearchOption != '' && this.searchedData != '') {
        const setSearch = new FormData();

        setSearch.set('work_id', this.selectedProjectCode);
        setSearch.set('data_status', this.selectedTaskCode);
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
      } else if (this.selectedSearchOption == '' && this.searchedData != '') {
        msgbox('검색할 칼럼을 선택해주세요.');
        this.$refs.searchSelect.focus();
      } else if (this.selectedSearchOption != '' && this.searchedData == '') {
        msgbox('검색할 키워드를 입력해주세요.');
        this.$refs.searchInput.focus();
      } else {
        this.searchedNone = false;
        this.resetSearchOption();
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
.pagination-center {
  display: flex;
  width: 100%;
}
.table-responsive tr th:first-child,
.table-responsive tr td:first-child {
  position: sticky;
  left: 0;
  z-index: 99;
  min-width: 37.31px;
}
.table-responsive tr td:nth-child(-n + 2) {
  background: #fff;
}
.table-responsive tr th:nth-child(2),
.table-responsive tr td:nth-child(2) {
  position: sticky;
  left: 37.31px;
  z-index: 99;
}
</style>
