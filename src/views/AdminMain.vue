<template>
  <div style="text-align: right">
    <button type="submit" class="btn btn-secondary">
      <router-link to="/admin/user/list"><a>인턴관리</a></router-link>
    </button>
  </div>

  <!-- ▼수정부분 div 추가▼ -->
  <div class="w70">
    <div class="row row-cols-md-2 g-4">
      <admin-main-view v-for="(data, assignment_id) in datas" :key="assignment_id" v-bind="data"></admin-main-view>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AdminMainView from '/@components/AdminMainView.vue';

export default {
  data() {
    return {
      datas: [],
    };
  },
  created() {
    axios.get('http://52.22.216.42:8090/web/assignment/nums/').then(({ data }) => {
      this.datas = data.data.data;
      console.log(this.datas);

      sessionStorage.removeItem('selectedWork');
      sessionStorage.removeItem('workName');
      sessionStorage.removeItem('selectedTaskName');
      sessionStorage.removeItem('selectedTask');
    });
  },
  components: {
    AdminMainView,
  },
  methods: {
  },
};
</script>

<style scoped>
/* ▼수정부분▼ */
.container {
  margin-top: 20px;
}
.w70 {
  max-width: 700px;
  margin: auto;
  margin-top: 30px;
}
.row {
  justify-content: center;
  align-items: center;
}

.card {
  width: 340px;
  height: 272px !important;
  border: 3px solid #e17b45;
  border-radius: 20px;
  margin: 0 auto;
}

.card-title {
  margin-top: 15px;
  margin-right: 8px;
  text-align: center;
  color: black;
  text-decoration: underline;
  text-underline-position: under;
  font-size: 1.2rem;
  font-weight: 900;
}
.card-text {
  text-align: center;
  font-size: 2.5rem;
  color: #e17b45;
  font-weight: 900;
}

.card-text1,
.card-text2,
.card-text3,
.card-text4 {
  width: 100%;
  font-size: 0.9rem;
  margin-top: 15px;
}
.box {
  margin-top: 29px;
}

.title {
  font-size: 1.2rem;
  color: black;
  font-weight: 700;
  margin-right: 45px;
}
a {
  color: white;
}
.text {
  margin-left: 7px;
}
.count_1,
.count_2,
.count_3,
.count_4 {
  font-size: 0.8rem;
  margin-left: 200px;
  font-weight: 500;
}
.count_1 {
  color: #494949;
}
.count_2,
.count_3 {
  color: #d64c57;
}
.count_4 {
  color: #3e8cdb;
}
.text-count {
  color: black;
}
.hr-dashed {
  background: white;
  border-top: 3px dashed #e17b45;
  margin-top: 5px;
}
.total {
  font-size: 0.7rem;
  position: absolute;
  bottom: 18px;
  margin-left: 224px;
}

.btn {
  background-color: #e17b45;
  border-color: #e17b45;
  color: white;
  font-size: 0.8rem;
  margin-top: 25px;
}

.btn:hover {
  background-color: #dc6425;
  border-color: #dc6425;
  color: white;
}
@media (min-width: 768px) {
  .row-cols-md-2 > * {
    flex: 1 0 auto;
    width: 40% !important;
  }
}
</style>
