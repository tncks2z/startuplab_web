<template>
<div class="col_1">
  <div class="card">
    <div class="card-body">
      <div class="card-box">
        <p class="card-text"><span class="card-title">
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
          </span><span class="title">진행률</span>{{asd(data_status1, totals)}} {{ asds }}%</p>
        <div class="box">
            <p class="card-text1"><span class="text">분배 전</span><span class="count_1">{{ data_status1 }} <span class="text-count">건</span></span></p>
            <hr class="hr-dashed"> 
            <p class="card-text2"><span class="text">임시저장</span> <span class="count_2" style="margin-left: 187px;">{{ data_status3 }} <span class="text-count">건</span></span></p>
            <hr class="hr-dashed">
            <p class="card-text3"><span class="text">실측/조사불가</span> <span class="count_3" style="margin-left: 155px;">{{ data_status4 }} / {{ data_status5 }}</span> <span class="text-count">건</span></p>
            <hr class="hr-dashed">
            <p class="card-text4"><span class="text">완료</span><span class="count_4" style="margin-left: 216px;" >{{ data_status6 }} <span class="text-count">건</span></span></p>
            <hr class="hr-dashed">
        </div>
        <p class="total">{{ total(data_status6, data_status5, data_status4 ,data_status3 ,data_status1) }}(총 {{ totals }} 건) </p>
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
        data_status6: Number,
        data_status3: Number,
        data_status4: Number,
        data_status5: Number,
    },
    data() {
      return {
        totals: 0,
        asds: 0,
      }
    },
    methods: {
      total(data_status5, data_status4 , data_status3 , data_status6 , data_status1) {
        this.totals = data_status5 + data_status4 + data_status3 + data_status6 + data_status1
        // console.log(this.totals);
      }, 
      asd(data_status5, totals) {
        this.asds = Math.round(data_status5/totals)
        // console.log(this.asds);
      },
      route() {
        sessionStorage.setItem('assignment_id', this.assignment_id);
        this.$router.push('/admin/tasklist').catch(() => {});
        // this.$router.replace('/admin/tasklist');
      }
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
.count_1, .count_2, .count_3, .count_4 {
    font-size: 0.8rem;
    margin-left: 200px;
    font-weight: 500;
}
.count_1 {
  color: #494949;
}
.count_2, .count_3{
  color: #D64C57;
}
.count_4 {
  color: #3E8CDB;
}
.text-count {
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
    margin-left: 224px;
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