<template>
<div class="col_1">
  <div class="card">
    <div class="card-body">
      <div class="card-box">
        <p class="card-text">
          <span class="card-title">
            <span v-if="assignment_id === 1">
                <a @click="route()">광진구</a>
            </span>
            <span v-else-if="assignment_id === 2">
              <a @click="route()">순천</a>
            </span>
            <span v-else-if="assignment_id === 3">
              <a @click="route()">광주</a>
            </span>
            <span v-else-if="assignment_id === 4">
              <a @click="route()">문정원</a>
            </span>
          </span>
          <span class="title">진행률</span>{{avg()}} {{ avgs }}%</p>
        <div class="box">
            <p class="card-text1 fix"><span class="text">분배 전</span><span class="count_1">{{ numberWithCommas(data_status1) }} <span class="text-count">건</span></span></p>
            <hr class="hr-dashed"> 
            <p class="card-text2 fix"><span class="text">임시저장</span> <span class="count_2">{{ numberWithCommas(data_status3) }} <span class="text-count">건</span></span></p>
            <hr class="hr-dashed">
            <p class="card-text3 fix"><span class="text">실측/조사불가</span> <span class="count_3">{{ numberWithCommas(data_status4) }} / {{ numberWithCommas(data_status5) }} <span class="text-count">건</span></span></p>
            <hr class="hr-dashed">
            <p class="card-text4 fix"><span class="text">완료</span><span class="count_4">{{ numberWithCommas(data_status6) }} <span class="text-count">건</span></span></p>
            <hr class="hr-dashed">
        </div>
        <p class="total">{{ total() }}(총 {{ numberWithCommas(totals) }} 건) </p>
      </div>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'AdminMainView',
  props: {
      assignment_id: Number,
      data_status1: Number,
      data_status2: Number,
      data_status6: Number,
      data_status3: Number,
      data_status4: Number,
      data_status5: Number,
  },
  data() {
    return {
      totals: 0,
      avgs: 0,
    }
  },
  methods: {
    total() {
      this.totals = this.data_status5 + this.data_status4 + this.data_status3 + this.data_status6 + this.data_status1 + this.data_status2;
    }, 
    avg() {
      if (this.totals == 0) { 
        this.avgs = 0;
      }
      else {  
        this.avgs = ((this.data_status6/this.totals)*100).toFixed(1);
      }
    },
    numberWithCommas(x) { 
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
    },
    route() {
      sessionStorage.setItem('assignment_id', this.assignment_id);
      this.$router.push('/admin/tasklist').catch(() => {});
    }, 
  } 
}
</script>

<style scoped>
/* ▼수정부분▼ */
.container {
  margin-top: 20px;
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

.card-text1, .card-text2, .card-text3, .card-text4 {
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
    margin-right: 30px;
}
a {
  color: white;
}
a:hover {
  cursor: pointer;
}
.text {
  margin-left: 7px;
}
.fix{
  position: relative;
}
.count_1, .count_2, .count_3, .count_4 {
    position: absolute;
    right: 5px;
    font-size: 0.8rem;
    font-weight: 500;
}
.count_1 {
 
  color: #494949;
  margin-left: 170px;
}
.count_2, .count_3{
  color: #D64C57;
}
.count_4 {
  color: #3E8CDB;
}
.text-count {
  /* position: fixed; */
  color: black;
  font-size: 0.8rem;
  font-weight: 500;
}
.hr-dashed {
  background: white;
  border-top: 3px dashed #e17b45;
  margin-top: 5px;
}
.total {
    font-size: 0.7rem;
    color: #828282;
    position: absolute;
    bottom: 18px;
    right: 20px;
}

.btn {
  background-color: #e17b45;
  border-color: #e17b45;
  color: white;
  font-size: .8rem;
  margin-top: 40px;
  margin-bottom: 20px;
}


.btn:hover {
  background-color: #dc6425;
  border-color: #dc6425;
  color: white;
}
@media (min-width: 768px) {
  .row-cols-md-2>* {
    flex: 1 0 auto;
    width: 40% !important;
  }
} 
</style>