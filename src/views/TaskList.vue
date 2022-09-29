<template>
  <div class="container">
    <!-- 업무선택 영역 -->
    <select class="form-select select-project" v-model="selectedWork" @change="showList($event)">
      <option value="null" selected>업무 선택</option>
      <option :key="i" :value="project.work_id" v-for="(project, i) in projectList">
        {{ project.work_name }}
      </option>
    </select>
    <!-- 분배 전, 실측, 조사불가, 완료 선택 영역 -->
    <select class="form-select select-project" v-model="selectedTask" @change="showTask($event)">
      <option value="null" selected>목록선택</option>
      <option :key="i" :value="list.value" v-for="(list, i) in lists">
        {{ list.text }}
      </option>
    </select>
    <!-- 목록명 영역(제목) -->
    <div class="subject" v-if="selectedTask">
      <h4>{{ workName }} {{ selectedTaskName }} 목록</h4>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="taskDivision" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body">
            <div class="center">업무를 분배받을 인턴을 선택해주세요.</div>
            <div class="form-group">
              <div class="form-check" :key="i" v-for="(name, i) in user.name">
                <input class="form-check-input float-none" type="radio" name="userName" :id="i" v-model="selectedUser" :value="name" @change="checkRadio" />
                <label class="form-check-label" :for="i">
                  {{ name }}
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancel">취소</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="divideTask()" :disabled="divideBtn">분배</button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex">
      <!-- 업무분배 버튼 영역 -->
      <div class="divide-area flex-area" v-if="selectedTask && selectedTask !== '조사불가' && selectedWork">
        <button class="btn btn-secondary" type="button" v-if="selectList.length !== 0" data-bs-toggle="modal" data-bs-target="#taskDivision">업무 분배</button>
        <button class="btn btn-secondary" type="button" v-else @click="this.msgbox('분배할 데이터를 선택해주세요.')">업무 분배</button>
      </div>

      <!-- 검색영역 -->
      <div class="search-area flex-area" v-if="selectedWork && selectedTask">
        <select class="form-select" v-model="selectedSearchOption" ref="searchSelect">
          <option value="">선택</option>
          <option :value="searchOption" v-for="(searchOption, i) in searchOptionList" :key="i">
            {{ searchOption }}
          </option>
        </select>
        <input type="text" class="form-control" ref="searchInput" :value="searchedData" @input="changeKeyword" @keypress.enter="searchTable" placeholder="검색어를 입력하세요" />
        <button class="btn" type="button" @click="searchTable">검색</button>
      </div>
    </div>

    <div class="show-nothing" v-if="searchedNone">해당 검색어를 찾을 수 없습니다.</div>
    <div ref="table" class="table-responsive" v-if="selectedWork && selectedTask && !searchedNone">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">
              <input type="checkbox" :value="allSelected" v-model="allSelected" />
            </th>
            <th></th>
            <th :key="i" v-for="(datakey, i) in dataListKey">
              {{ datakey }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr :key="i" v-for="(data, i) in dataListValue">
            <td scope="row">
              <input type="checkbox" :value="i" v-model="selectList" />
            </td>
            <td>
              <router-link :to="`/admin/tasklist/modify/${dataList.data[i].data_id}`">
                <button type="button" class="btn btn-secondary" @click="pushDataId(dataList.data[i].data_id)">수정</button>
              </router-link>
            </td>
            <td :key="j" v-for="(datakey, j) in dataListKey">
              {{ data[datakey] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { getDataInfo, getUserSearch, getUserList, getWorksInfo, setWorkDistribute } from '/@service/admin/data';

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

      this.getDividenUser();
      this.showAll();

      console.log(this.user);
    });
  },
  data() {
    return {
      selectedTask: '',
      lists: [
        { text: '분배 전', value: '1' },
        { text: '실측필요', value: '4' },
        { text: '조사불가', value: '5' },
        { text: '완료', value: '6' },
      ],
      workName: '',
      selectedWork: '',
      projectList: [],
      workListValue: [],
      workListKey: [],
      dataList: [],
      dataListKey: [],
      dataListValue: [],
      selectedTaskList: [],
      allChecked: false,
      selectedTaskName: '',
      selectList: [],
      modalShow: false,
      divideBtn: true,
      searchedNone: false,
      searchedData: '',
      selectedSearchOption: '',
      searchOptionList: [],
      assignment_id: '',
      idsArray: [],
      selectedUser: '',
      selectedUserId: '',
      data_id: '',
      names: [],
      user: {
        id: [],
        name: [],
      },
      dataId: [],
    };
  },
  methods: {
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
      if (this.selectedTaskName !== '') {
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

        setData.set('work_id', work_id);
        setData.set('data_status', this.selectedTask);

        getDataInfo(setData).then((result) => {
          this.dataList = result.data;

          for (let i = 0; i < this.dataList.data.length; i++) {
            this.dataId[i] = this.dataList.data[i].data_id;
          }

          for (let i = 0; i < this.dataList.data.length; i++) {
            const arr = JSON.parse(this.dataList.data[i].data_json);
            this.dataListKey = Object.keys(arr);
            this.searchOptionList = this.dataListKey;
          }
          this.dataListValue = [];
          for (let i = 0; i < this.dataList.data.length; i++) {
            this.dataListValue.push(JSON.parse(this.dataList.data[i].data_json));
          }

          for (let i = 0; i < this.dataListValue.length; i++) {
            this.selectedTaskList[i] = this.dataListValue[i];
          }
        });
      }
      this.selectList = [];
    },
    checkRadio() {
      this.divideBtn = false;
    },
    divideTask() {
      for (let i = 0; i < this.user.id.length; i++) {
        if (this.user.name[i] === this.selectedUser) {
          this.selectedUserId = this.user.id[i];
        }
      }
      this.tasks = this.selectList;

      let ids = '';
      for (let i = 0; i < this.tasks.length; i++) {
        this.idsArray[i] = this.dataId[this.tasks[i]];
      }

      this.cancel();
      this.$router.go();
      this.selectList = [];
    },
    cancel() {
      this.selectedUser = '';
      this.selectList = [];
      this.divideBtn = true;
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
};
</script>
<style scoped>
.container {
  margin-top: 20px;
  padding: 0;
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
.modal-content {
  width: 80%;
  margin: 0 auto;
}
.modal-body {
  padding-top: 20px;
}
.center {
  text-align: center;
}
.modal-footer {
  justify-content: center;
  border: none;
}
.form-group {
  margin: 0 auto;
  width: 60%;
  padding-top: 20px;
}
.form-check {
  display: inline-block;
  width: 50%;
}
.form-check-label {
  width: 80%;
  text-align: left;
  padding-top: 3px;
  margin-left: 10px;
}
.show-nothing {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  margin-top: 15rem;
}

@media (max-width: 420px) {
  .divide-area {
    display: none;
  }
}
</style>
