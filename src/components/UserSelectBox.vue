<template>
  <div class="input-group mb-3">
    <label class="form-label">{{ label }}</label>
    <select class="form-select" v-model="selectValue" @change="$emit('selectFromChild', $event)" required>
      <option disabled value="" selected>선택</option>
      <option v-for="(option, i) in selectOptionLists" :key="i" :value="option.value">
        {{ option.key }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    selectValue: Number,
  },
  data() {
    return {
      selectOptionLists: [
        { key: '없음', value: 0 },
        { key: '있음', value: 1 },
        { key: '확인필요', value: 2 },
      ],
    };
  },
  methods: {},
};
</script>

<style scoped>
.input-group {
  flex-wrap: nowrap;
  margin: 0 auto;
  flex: 0 0 auto;
  width: 100%;
}
.form-select {
  display: flex;
  flex: 0 0 auto;
  width: 60%;
  font-size: 0.9rem;
  padding-top: 8px;
  border-top-left-radius: 5px !important;
  border-bottom-left-radius: 5px !important;
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
  .form-select {
    display: flex;
    flex: 0 0 auto;
    width: 100%;
    font-size: 0.9rem;
    border-top-left-radius: 5px !important;
    border-bottom-left-radius: 5px !important;
    align-items: center;
    justify-content: center;
  }
}
</style>
