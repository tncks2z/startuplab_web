<template>
  <div class="input-group mb-3">
    <label class="form-label" id="data-form-label">{{ label }}</label>
    <div class="form-checks">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" v-model="radioValue" :value="3" @change="$emit('radioFromChild', $event)" required />
        <label class="form-check-label" for="inlineRadio1">임시저장</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" v-model="radioValue" :value="4" @change="$emit('radioFromChild', $event)" :disabled="this.isAddPage == 1" required />
        <label class="form-check-label" for="inlineRadio2">실측필요</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" v-model="radioValue" :value="5" @change="$emit('radioFromChild', $event)" :disabled="this.isAddPage == 1" required />
        <label class="form-check-label" for="inlineRadio3">조사불가</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio4" v-model="radioValue" :value="6" @change="$emit('radioFromChild', $event)" required />
        <label class="form-check-label" for="inlineRadio4">완료</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.isAddPage = sessionStorage.getItem('isAddPage');
  },

  props: {
    label: String,
    radioValue: Number,
  },

  data() {
    return {
      isAddPage: 0,
    };
  },
};
</script>

<style scoped>
.input-group {
  flex-wrap: nowrap;
  margin: 0 auto;
  flex: 0 0 auto;
  width: 100%;
}
.form-label {
  display: flex;
  width: 20%;
  margin: auto 30px auto 0px;
  align-items: center;
  justify-content: right;
  word-break: keep-all;
  font-weight: 500;
}
.form-checks {
  display: flex;
  flex-direction: row;
  width: 60%;
  text-align: left;
  font-size: 0.9rem;
  align-items: center;
  justify-content: space-between;
}
.form-check-inline {
  display: flex;
  align-items: center;
  margin-right: 5px;
}
.form-check-label {
  margin: 3px 0px auto 5px;
}
@media (max-width: 768px) {
  .input-group {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    margin: 0 auto;
    flex: 0 0 auto;
    width: 100%;
  }
  .form-label {
    display: flex;
    width: 100%;
    margin: 10px auto 10px auto;
    align-items: center;
    justify-content: left;
    word-break: keep-all;
    font-weight: 500;
  }
  .form-checks {
    display: flex;
    flex-direction: row;
    width: 100%;
    text-align: left;
    font-size: 0.9rem;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
