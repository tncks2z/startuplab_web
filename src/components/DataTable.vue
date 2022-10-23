<template>
  <div>
    <div class="show-nothing" v-if="dataNone">해당 데이터가 없습니다.</div>
    <div class="show-nothing" v-if="searchedNone">해당 검색어를 찾을 수 없습니다.</div>
    <div class="table-responsive" v-if="selectedProjectCode && selectedTaskCode && !dataNone && !searchedNone">
      <table class="table">
        <thead>
          <tr>
            <th>No.</th>
            <th></th>
            <th scope="col">데이터 상태</th>
            <th scope="col">최종수정날짜</th>
            <th scope="col" v-for="(th, i) in tableHeaderList" :key="i">
              {{ th.meta_name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, i) in dataList.data" :key="i">
            <td>{{ (currentPage - 1) * 100 + (i + 1) }}</td>
            <td scope="row">
              <router-link :to="`/user/edit/${data.data_id}`">
                <button class="btn btn-secondary" type="button" id="buttonInput" @click="pushDataId(data.data_id)">수정</button>
              </router-link>
            </td>
            <td scoped="row">
              {{ tableTaskList[data.data_status] }}
            </td>
            <td scoped="row">
              {{ $filters.dateFormat(data.update_time) }}
            </td>
            <td v-for="(value, j) in tableBody[i]" :key="j">
              {{ value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination-center">
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
        v-if="selectedProjectCode && selectedTaskCode && !dataNone && !searchedNone"
      />
    </div>
  </div>
</template>

<script>
import { getUserAddForm, getUserWorkData, getUserSearch } from '/@service/user';

export default {
  props: {
    dataNone: Boolean,
    searchedNone: Boolean,
    user_id: Number,
    assignment_id: Number,
    selectedProjectCode: String,
    selectedTaskCode: String,
    pjName: String,
    tkName: String,
    searchedData: String,
    selectedSearchOption: String,
  },
  data() {
    return {
      //⬇️ pagination 변수
      totalItems: 0,
      itemsPerPage: 100,
      MaxPagesShown: 5,
      currentPage: 1,

      //⬇️ table 변수
      tableHeaderList: [],
      searchOptionList: {
        english: [],
        korean: [],
      },
      tableBodyList: {
        key: [],
        value: [],
      },
      tableBody: [],
      dataList: [],
      tableTaskList: ['삭제', '할당전', '할일', '임시저장', '실측', '조사불가', '완료'],
    };
  },

  methods: {
    getTableData() {
      const setData = new FormData();
      setData.set('work_id', this.selectedProjectCode);

      getUserAddForm(setData).then((result) => {
        this.tableHeaderList = result.data.data;
        this.tableBodyList.key = [];
        for (let i = 0; i < this.tableHeaderList.length; i++) {
          this.tableBodyList.key.push(this.tableHeaderList[i].meta_key);
          this.searchOptionList.english.push(this.tableHeaderList[i].meta_key);
          this.searchOptionList.korean.push(this.tableHeaderList[i].meta_name);
        }
        this.$emit('setSearchOptions', this.searchOptionList);
        this.getTableBodyData();
      });
    },
    getTableBodyData() {
      const setData = new FormData();
      setData.set('work_id', this.selectedProjectCode);
      setData.set('data_status', this.selectedTaskCode);
      setData.set('user_id', this.user_id);
      setData.set('row_count', this.itemsPerPage);
      setData.set('page_no', this.currentPage);

      getUserWorkData(setData).then((result) => {
        this.dataList = result.data;
        this.totalItems = this.dataList.total_count;
        this.tableBody = [];
        if (this.dataList.data.length !== 0) {
          this.$emit('changeData', false);
          for (let i = 0; i < this.dataList.data.length; i++) {
            this.tableBodyList.value = [];
            let dataJson = JSON.parse(this.dataList.data[i].data_json);
            for (let j = 0; j < this.tableBodyList.key.length; j++) {
              if (dataJson[this.tableBodyList.key[j]] == '0') {
                dataJson[this.tableBodyList.key[j]] = 'X';
              } else if (dataJson[this.tableBodyList.key[j]] == '1') {
                dataJson[this.tableBodyList.key[j]] = 'O';
              } else if (dataJson[this.tableBodyList.key[j]] == '2') {
                dataJson[this.tableBodyList.key[j]] = '확인필요';
              }
              this.tableBodyList.value.push(dataJson[this.tableBodyList.key[j]]);
            }
            this.tableBody.push(this.tableBodyList.value);
          }
        } else {
          this.$emit('changeData', true);
        }
      });
    },
    getSearchTable() {
      const setSearch = new FormData();
      setSearch.set('work_id', this.selectedProjectCode);
      setSearch.set('data_status', this.selectedTaskCode);
      setSearch.set('columnName', this.selectedSearchOption);
      setSearch.set('keyword', this.searchedData);
      setSearch.set('user_id', this.user_id);

      getUserSearch(setSearch).then((result) => {
        this.dataList = result.data;
        this.totalItems = this.dataList.data.length;
        this.tableBody = [];
        if (this.dataList.data.length !== 0) {
          this.$emit('changeSearchData', false);
          for (let i = 0; i < this.dataList.data.length; i++) {
            this.tableBodyList.value = [];
            let dataJson = JSON.parse(this.dataList.data[i].data_json);
            for (let j = 0; j < this.tableBodyList.key.length; j++) {
              this.tableBodyList.value.push(dataJson[this.tableBodyList.key[j]]);
            }
            this.tableBody.push(this.tableBodyList.value);
          }
          this.$parent.resetSearchOption();
        } else {
          this.$emit('changeSearchData', true);
          this.$parent.resetSearchOption();
        }
      });
    },
    onClickHandler(page) {
      this.currentPage = page;
      this.getTableData();
    },
    pushDataId(id) {
      sessionStorage.setItem('data_id', id);
    },
  },
};
</script>

<style scoped>
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
