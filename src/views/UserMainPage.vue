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
    <data-table
      ref="dataTable"
      :dataNone="this.dataNone"
      :searchedNone="this.searchedNone"
      :user_id="this.user_id"
      :assignment_id="this.assignment_id"
      :selectedTaskCode="this.selectedTaskCode"
      :selectedProjectCode="this.selectedProjectCode"
      :pjName="this.pjName"
      :tkName="this.tkName"
      :searchedData="this.searchedData"
      :selectedSearchOption="this.selectedSearchOption"
      @changeData="changeData"
      @setSearchOptions="setSearchOptions"
      @changeSearchData="changeSearchData"
    />
  </div>
</template>

<script>
import { msgbox } from '/@service/common';
import { getUserWorkId } from '/@service/user';
import DataTable from '/@components/DataTable.vue';

export default {
  created() {
    this.assignment_id = this.$cookies.get('assignmentId');
    this.user_id = this.$cookies.get('userId');
    this.pjName = sessionStorage.getItem('projectName');
    this.tkName = sessionStorage.getItem('taskName');
    this.selectedProjectCode = sessionStorage.getItem('projectCode');
    this.selectedTaskCode = sessionStorage.getItem('taskCode');
    sessionStorage.removeItem('isAddPage');
    sessionStorage.removeItem('data_id');
  },
  mounted() {
    const setData = new FormData();
    setData.set('assignment_id', this.assignment_id);
    getUserWorkId(setData).then((result) => {
      this.projectList = result.data.data;
      this.showTable();
    });
  },
  data() {
    return {
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
      searchedData: '',
      selectedSearchOption: '',
      searchOptionList: {},
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
      if (this.pjName !== null && this.tkName !== null) {
        this.$refs.dataTable.getTableData();
      }
    },
    changeData(Boolean) {
      this.dataNone = Boolean;
    },
    setSearchOptions(Object) {
      this.searchOptionList = Object;
    },
    changeSearchData(Boolean) {
      this.searchedNone = Boolean;
    },
    goAddForm() {
      this.$router.push('/user/add').catch(() => {});
      sessionStorage.setItem('isAddPage', true);
    },
    changeKeyword(w) {
      this.searchedData = w.target.value;
    },
    resetSearchOption() {
      this.selectedSearchOption = '';
      this.searchedData = '';
    },
    searchTable() {
      if (this.selectedSearchOption !== '' && this.searchedData !== '') {
        this.$refs.dataTable.getSearchTable();
      } else if (this.selectedSearchOption === '' && this.searchedData !== '') {
        msgbox('검색할 칼럼을 선택해주세요.');
        this.$refs.searchSelect.focus();
      } else if (this.selectedSearchOption !== '' && this.searchedData === '') {
        msgbox('검색할 키워드를 입력해주세요.');
        this.$refs.searchInput.focus();
      } else {
        this.searchedNone = false;
        this.resetSearchOption();
        this.$refs.dataTable.getTableData();
      }
    },
  },
  components: { DataTable },
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
</style>
