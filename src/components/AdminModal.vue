<template>
  <div class="modal fade" id="taskDivision" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <div class="center">업무를 분배받을 인턴을 선택해주세요.</div>
          <div class="form-group">
            <div class="form-check" :key="i" v-for="(name, i) in user_name">
              <input class="form-check-input float-none" type="radio" :id="i" v-model="selectedUser" :value="name" @change="$emit('checkRadio', $event)" />
              <label class="form-check-label" :for="i">
                {{ name }}
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="$emit('cancel')">취소</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" value="todo" @click="$emit('divideTask', $event)" :disabled="divideBtn">할일 분배</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" value="location" @click="$emit('divideTask', $event)" :disabled="divideBtn">실측 분배</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  name: 'AdminModal',
  props: {
    user_name: Array,
    user_id: Array,
    selectedUser: String,
    divideBtn: Boolean,
  },
}
</script>

<style scoped>
  .modal-content {
    width: 80%;
    margin: 0 auto;
    font-size: 0.8rem;
  }
  .modal-body {
    padding-top: 20px;
  }
  .modal-footer .btn-primary {
    background-color: #e17b46;
    border: 1px solid #e17b46;
    font-size: 0.8rem;
  }
  .modal-footer .btn-secondary {
    border: 1px solid #b9b9b9;
    color: #828282;
    background-color: #fff;
    font-size: 0.8rem;
  }
  .modal-body .center {
    font-weight: 700;
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
</style>