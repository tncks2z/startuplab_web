<template>
  <div class="input-group mb-3">
    <label class="form-label">{{ label }}</label>
    <textarea type="text" placeholder="특이사항을 남겨주세요" rows="3" class="form-control" id="exampleFormControlInput1" :value="note" @input="$emit('inputFromChild', $event)" />
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    note: String,
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
.form-select,
.form-control {
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
  .form-select,
  .form-control {
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
