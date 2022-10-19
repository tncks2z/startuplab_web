<template>
  <div class="container">
    <!-- 업무선택 영역 -->
    <select class="form-select select-project" v-model="selectedWork" @change="showList($event)">
      <option value="null" selected disabled>업무 선택</option>
      <option :key="i" :value="project.work_id" v-for="(project, i) in projectList">
        {{ project.work_name }}
      </option>
    </select>
    <!-- 분배 전, 실측, 조사불가, 완료 선택 영역 -->
    <select class="form-select select-project" v-model="selectedTask" @change="showTask($event)">
      <option value="null" selected disabled>목록 선택</option>
      <option :key="i" :value="list.value" v-for="(list, i) in lists">
        {{ list.text }}
      </option>
    </select>
    <!-- 목록명 영역(제목) -->
    <div class="subject" v-if="selectedTask">
      <h4>{{ workName }} {{ selectedTaskName }} 목록</h4>
    </div>

    <!-- Modal -->
    <AdminModal
      :user_name="user.name"
      :user_id="user.id"
      :selectedUser="selectedUser"
      :divideBtn="divideBtn"
      @cancel="cancelModal"
      @checkRadio="changeRadio($event)"
      @divideTask="divideTask($event)"
    />

    <div class="flex">
      <!-- 업무분배 버튼 영역 -->
      <div class="divide-area flex-area" v-if="selectedTask && selectedTaskName !== '완료' && selectedWork && !dataNone">
        <button class="btn btn-secondary" type="button" v-if="selectList.length !== 0" @click="getDividenUser()" data-bs-toggle="modal" data-bs-target="#taskDivision">업무 분배</button>
        <button class="btn btn-secondary" type="button" v-else @click="this.msgbox('분배할 데이터를 선택해주세요.')">업무 분배</button>
      </div>
      <div class="divide-area flex-area" v-else></div>

      <!-- 검색영역 -->
      <div class="search-area flex-area" v-if="selectedWork && selectedTask && !dataNone">
        <select class="form-select" v-model="selectedSearchOption" ref="searchSelect">
          <option value="">선택</option>
          <option :value="searchOption" v-for="(searchOption, i) in searchOptionList.english" :key="i">
            {{ searchOptionList.korean[i] }}
          </option>
        </select>
        <input type="text" class="form-control" ref="searchInput" :value="searchedData" @input="changeKeyword" @keypress.enter="searchTable" placeholder="검색어를 입력하세요" />
        <button class="btn" type="button" @click="searchTable">검색</button>
      </div>
    </div>

    <!-- 테이블 영역 -->
    <div class="show-nothing" v-if="dataNone">해당 데이터가 없습니다.</div>
    <div class="show-nothing" v-if="searchedNone">해당 검색어를 찾을 수 없습니다.</div>

    <div ref="table" class="table-responsive" v-if="selectedWork && selectedTask && !searchedNone && !dataNone">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">
              <input type="checkbox" :value="allSelected" v-model="allSelected" />
            </th>
            <th>No.</th>
            <th></th>
            <th scope="col">최종수정날짜</th>
            <th scope="col" v-if="selectedTask == 6">작성자</th>
            <th scope="col" v-for="(th, i) in tableHeaderList" :key="i">
              {{ th }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr :key="i" v-for="(data, i) in dataListValue">
            <td scope="row">
              <input type="checkbox" :value="i" v-model="selectList" />
            </td>
            <td>{{ (currentPage - 1) * 100 + (i + 1) }}</td>
            <td>
              <router-link :to="`/admin/tasklist/modify/${dataList.data[i].data_id}`">
                <button type="button" class="btn btn-secondary" @click="pushDataId(dataList.data[i].data_id)">수정</button>
              </router-link>
            </td>
            <td scoped="row">
              {{ $filters.dateFormat(dataList.data[i].update_time) }}
            </td>
            <td scoped="row" v-if="selectedTask == 6">
              {{ dataList.data[i].user_name }}
            </td>
            <td :key="j" v-for="(datakey, j) in dataListKey">
              {{ data[datakey] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination-center" v-if="selectedWork && selectedTask && !searchedNone && !dataNone">
      <vue-awesome-paginate
        :total-items="this.totalItems"
        :items-per-page="this.itemsPerPage"
        :max-pages-shown="this.MaxPagesShown"
        :current-page="this.currentPage"
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
import { getDataInfo, getUserSearch, getUserList, getWorksInfo, setWorkDistribute } from '/@service/admin/data';
import { getUserAddForm } from '/@service/user';
import AdminModal from '/@components/AdminModal.vue';

export default {
  created() {
    this.assignment_id = sessionStorage.getItem('assignment_id');
    const setData = new FormData();
    setData.set('assignment_id', this.assignment_id);

    getWorksInfo(setData).then((result) => {
      this.projectList = result.data.data;

      for (let i = 0; i < this.projectList.length; i++) {
        this.workListKey.push(this.projectList[i].work_id);
        this.workListValue.push(this.projectList[i].work_name);
      }
      this.selectedWork = sessionStorage.getItem('selectedWork');
      this.workName = sessionStorage.getItem('workName');
      this.selectedTaskName = sessionStorage.getItem('selectedTaskName');
      this.selectedTask = sessionStorage.getItem('selectedTask');

      this.showAll();
    });
  },
  data() {
    return {
      // paginate 변수
      totalItems: 0,
      itemsPerPage: 100, //한 페이지 당 출력해야하는 행의 갯수
      MaxPagesShown: 5, // 페이지 숫자 버튼 값 기본값 5개
      currentPage: 1, //  현재 활성 페이지 기본값 1

      lists: [
        { text: '분배 전', value: '1' },
        { text: '실측필요', value: '4' },
        { text: '조사불가', value: '5' },
        { text: '완료', value: '6' },
      ],
      // 셀렉트 선택 저장된 세션 불러오기
      workName: '',
      selectedWork: '',
      selectedTask: '',
      selectedTaskName: '',
      // 업무분배시 선택된 데이터
      selectedTaskList: [],

      projectList: [],
      workListValue: [],
      workListKey: [],
      dataList: [],
      dataListKey: [],
      dataListValue: [],
      allChecked: false,
      selectList: [],
      searchedNone: false,
      dataNone: false,
      searchedData: '',
      selectedSearchOption: '',
      searchOptionList: {
        korean: [],
        english: [],
      },
      assignment_id: '',
      selectedUser: '',
      selectedUserId: '',
      divideBtn: true,
      idsArray: [],
      data_id: '',
      names: [],
      user: {
        id: [],
        name: [],
      },
      dataId: [],
      columnList: [],
      tableHeaderList: [],
    };
  },
  methods: {
    getData() {
      const setData = new FormData();

      let work_id = '';
      for (let i = 0; i < this.workListValue.length; i++) {
        if (this.workListValue[i] === this.workName) {
          work_id = this.workListKey[i];
        }
      }

      sessionStorage.setItem('workListValue', this.workListValue);
      sessionStorage.setItem('workListKey', this.workListKey);
      sessionStorage.setItem('selectedWork', work_id);
      sessionStorage.setItem('workName', this.workName);

      // 불러올 데이터 세팅하기
      setData.set('work_id', work_id);
      setData.set('data_status', this.selectedTask);
      setData.set('row_count', this.itemsPerPage);
      setData.set('page_no', this.currentPage);
      // 실측필요의 경우 user_id가 없는 데이터만 불러옴
      if (this.selectedTask == 4) {
        setData.set('user_id', -1);
      }
      // 데이터 불러오기
      getDataInfo(setData).then((result) => {
        this.tableHeaderList = [];
        this.dataList = result.data;

        if (this.dataList.data.length !== 0) {
          this.dataNone = false;
          this.dataListKey = [];
          this.dataListValue = [];

          this.totalItems = this.dataList.total_count;
          for (let i = 0; i < this.dataList.data.length; i++) {
            this.dataId[i] = this.dataList.data[i].data_id;
          }

          this.dataListValue = [];
          for (let i = 0; i < this.dataList.data.length; i++) {
            const arr = JSON.parse(this.dataList.data[i].data_json);
            this.dataListKey = Object.keys(arr);
            this.dataListValue.push(JSON.parse(this.dataList.data[i].data_json));
          }
          for (let i = 0; i < this.dataListValue.length; i++) {
            this.selectedTaskList[i] = this.dataListValue[i];
          }
          // table header 이름으로 매칭
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
    //데이터 아이디 EditForm에 전송
    pushDataId(id) {
      sessionStorage.setItem('data_id', id);
    },
    // 업무 셀렉트 선택시
    showList(e) {
      this.workName = e.target.options[e.target.options.selectedIndex].text;
      sessionStorage.setItem('workName', this.workName);
      sessionStorage.setItem('selectedWork', this.selectedWork);

      this.showAll();
    },
    // 분배전, 실측필요, 조사불가, 완료 선택시
    showTask(e) {
      this.selectedTaskName = e.target.options[e.target.options.selectedIndex].text;
      sessionStorage.setItem('selectedTaskName', this.selectedTaskName);
      sessionStorage.setItem('selectedTask', this.selectedTask);

      this.showAll();
    },
    showAll() {
      // 셀렉트에 맞는
      if (this.selectedTaskName !== null) {
        let work_id = '';
        for (let i = 0; i < this.workListValue.length; i++) {
          if (this.workListValue[i] === this.workName) {
            work_id = this.workListKey[i];
          }
        }
        const setData2 = new FormData();
        this.projectCode = sessionStorage.getItem('projectCode');
        this.projectName = sessionStorage.getItem('projectName');
        // 테이블 헤드 메타데이터와 대조(한글명)
        setData2.set('work_id', work_id);

        getUserAddForm(setData2).then((result) => {
          this.columnList = result.data;
          this.getData();
        });
      }
      this.selectList = [];
    },
    changeKeyword(w) {
      this.searchedData = w.target.value;
    },
    resetSearchOption() {
      this.selectedSearchOption = '';
    },
    searchTable() {
      if (this.selectedSearchOption !== '' && this.searchedData !== '') {
        const setSearch = new FormData();

        setSearch.set('work_id', this.selectedWork);
        setSearch.set('data_status', this.selectedTask);
        setSearch.set('columnName', this.selectedSearchOption);
        setSearch.set('keyword', this.searchedData);

        // 실측필요의 경우 user_id가 없는 데이터만 불러옴
        if (this.selectedTask == 4) {
          setSearch.set('user_id', -1);
        }

        getUserSearch(setSearch).then((result) => {
          this.dataList = result.data;

          this.totalItems = this.dataList.data.length;

          this.dataListValue = [];
          for (let i = 0; i < this.dataList.data.length; i++) {
            const arr = JSON.parse(this.dataList.data[i].data_json);
            this.dataListKey = Object.keys(arr);
            this.dataListValue.push(JSON.parse(this.dataList.data[i].data_json));
          }
          if (this.dataListValue.length === 0) {
            this.searchedNone = true;
          }
          // table header 이름으로 매칭
          for (let i = 0; i < this.columnList.data.length; i++) {
            for (let j = 0; j < this.columnList.data.length; j++) {
              if (this.columnList.data[j].meta_key == this.dataListKey[i]) {
                this.tableHeaderList.push(this.columnList.data[j].meta_name);
              }
            }    
          }
          this.searchOptionList.english = this.dataListKey;
          this.searchOptionList.korean = this.tableHeaderList;
        });

        this.resetSearchOption();
        this.searchedData = '';
      } else if ((this.selectedSearchOption === '') & (this.searchedData !== '')) {
        alert('검색할 칼럼을 선택해주세요');
        this.$refs.searchSelect.focus();
      } else if ((this.selectedSearchOption !== '') & (this.searchedData === '')) {
        alert('검색할 키워드를 입력해주세요');
        this.$refs.searchInput.focus();
      } else {
        this.searchedNone = false;
        this.resetSearchOption();
        this.searchedData = '';
        this.showAll();
      }
    },
    onClickHandler(page) {
      this.currentPage = page;
      this.showAll();
    },
    cancelModal() {
      this.selectedUser = '';
      this.user = {
        id: [],
        name: [],
      };
      this.selectList = [];
      this.divideBtn = true;
    },
    changeRadio(e) {
      this.divideBtn = false;
      this.selectedUser = e.target.value;
    },
    // 분배 받을 유저 갖고오기
    getDividenUser() {
      const setData = new FormData();
      setData.set('assignment_id', this.assignment_id);

      getUserList(setData).then((result) => {
        this.names = result.data;

        for (let i = 0; i < this.names.user.length; i++) {
          this.user.id.push(this.names.user[i].user_id);
          this.user.name.push(this.names.user[i].user_name);
        }
      });
    },
    divideTask(e) {
      for (let i = 0; i < this.user.id.length; i++) {
        if (this.user.name[i] === this.selectedUser) {
          this.selectedUserId = this.user.id[i];
        }
      }
      this.tasks = this.selectList;

      for (let i = 0; i < this.tasks.length; i++) {
        this.idsArray[i] = this.dataId[this.tasks[i]];
      }

      const setData = new FormData();
      setData.set('user_id', this.selectedUserId);
      setData.set('idsArray', this.idsArray);
      // 할일분배, 실측분배 분기
      if(e.target.value === "todo") {
        setData.set('data_status', 2);
      } else if(e.target.value === "location") {
        setData.set('data_status', 4);
      }
      
      setWorkDistribute(setData).then((result) => {
        if (result.error.code != 0) {
          this.msgbox(result.error.msg);
          return;
        }
        this.msgbox(this.selectedUser + "님께 분배가 완료되었습니다.");

        this.cancelModal();
        this.selectList = [];
        this.getData();
      });
    },
  },
  computed: {
    allSelected: {
      get: function () {
        return this.selectedTaskList ? (this.selectList ? this.selectList.length === this.selectedTaskList.length : false) : false;
      },
      set: function (e) {
        if (e) {
          for (let i = 0; i < this.selectedTaskList.length; i++) {
            // this.selectList[i] = this.selectedTaskList[i];
            this.selectList[i] = i;
          }
        } else {
          this.selectList = [];
        }
      },
    },
  },
  components: { AdminModal },
};
</script>
<style scoped>
.container {
  margin-top: 20px;
  padding: 0;
}
.table-responsive tr td:nth-child(-n + 3) {
  background: #fff;
}
.table-responsive tr th:first-child,
.table-responsive tr td:first-child {
  position: sticky;
  left: 0;
  z-index: 99;
}
.table-responsive tr th:nth-child(2),
.table-responsive tr td:nth-child(2) {
  position: sticky;
  left: 28.99px;
  z-index: 99;
}
.table-responsive tr th:nth-child(3),
.table-responsive tr td:nth-child(3) {
  position: sticky;
  left: 66.6px;
  z-index: 99;
}
.subject {
  text-align: center;
  margin: 30px;
}
.divide-area .btn-secondary {
  font-size: 0.8rem;
  border: none;
  background-color: #e17b46 !important;
}
.divide-area .btn-secondary:hover {
  background-color: #dc6425 !important;
}

@media (max-width: 420px) {
  .divide-area {
    display: none;
  }
}
</style>
