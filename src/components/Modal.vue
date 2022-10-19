<template>
  <div class="modal fade" id="adminModal" tabindex="-1" aria-labelledby="adminModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        <div class="modal-body">
          <h4 style="margin-top: 5px; margin-bottom: 8px; font-size: 1.15rem; font-weight: 400">{{ user_name }}님의 계정을 정지하시겠습니까?</h4>
          <span style="font-size: 0.8rem">(한 번 정지한 계정은 다시 활성화시킬 수 없습니다.)</span>
        </div>
        <div class="modal-footer">
          <button type="button" class="modal-clo" data-bs-dismiss="modal" @click="closeModal">취소</button>
          <button type="button" class="modal-del" @click="[dataDelete(), disableUser()]">정지</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {};
  },
  name: 'Modal',
  props: {
    user_name: String,
    user_type: Number,
    user_id: Number,
    user_email: String,
    user_status: Number,
  },
  methods: {
    dataDelete() {
      axios
        .put('http://49.50.164.147:8090/common/user/edit/', {
          user_id: this.user_id,
          user_email: this.user_email,
          user_type: this.user_type,
          user_status: 0,
        })
        .then(({ data }) => {
          this.users = data.user;
          console.log(data);
          this.$router.go({ name: 'UserList' });
          this.closeModal();
        });
    },
    disableUser() {
      this.$emit('disableUser');
    },
  },
};
</script>

<style scoped>
.modal.fade .modal-dialog {
  transition: none;
  transform: none;
}

.modal-content {
  position: fixed;
  background-color: white;
  border-radius: 5px;
  width: 355px;
  height: 237px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.modal-body {
  margin-top: 40px;
  max-width: 450px;
  user-select: none;
  color: #828282;
}

.modal-footer {
  margin-bottom: 30px;
  border: none;
}

.modal-del {
  position: absolute;
  width: 63px;
  height: 28px;
  left: calc(50% - 62px / 2 + 126.5px);
  bottom: 21px;
  background: #d64c57;
  border-radius: 10px;
  border: 1px solid #d64c57;
  color: white;
}
.modal-clo {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  position: absolute;
  width: 64px;
  height: 28px;
  left: calc(50% - 62px / 2 + 52.5px);
  bottom: 21px;
  background: #ffffff;
  border: 1px solid #b9b9b9;
  color: #828282;
  border-radius: 10px;
}
.btn-close {
  margin-left: 322px;
  margin-top: 15px;
  width: 0.4em;
  height: 0.4em;
  padding: 0.25em 0.25em;
}
</style>
