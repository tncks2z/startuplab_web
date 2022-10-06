<template>
<!-- <div class="modal-background" v-if="isAct"> -->
  <div class="modal-content" v-if="isAct">
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
    <div class="modal-body">
      <h4 style="margin-top: 5px; margin-bottom: 8px; font-size: 1.15rem; font-weight: 400;">{{ user_name }}님의 계정을 정지하시겠습니까?</h4>
      <span style="font-size: 0.8rem;">(한 번 정지한 계정은 다시 활성화시킬 수 없습니다.)</span>
    </div>
    <div class="modal--box">
      <button type="button" class="modal-clo" data-bs-dismiss="modal" @click="closeModal">취소</button>
      <button type="button" class="modal-del" @click="[dataDelete(), disableUser()]">정지</button>
    </div>
  </div>
<!-- </div> -->
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
    };
  },
    name: 'Modal',
    props: {
      isAct: Boolean,
      user_name: String,
      user_type: Number,
      user_id: Number,
      user_email: String,
      user_status: Number,
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    dataDelete() {
      axios.put('http://52.22.216.42:8090/common/user/edit/', {
        user_id: this.user_id,
        user_email: this.user_email,
        user_type: this.user_type,
        user_status: 0
    })
      .then(({ data }) => {
        this.users = data.user;
        console.log(data);
          //  this.$router.push("/admin/user/list").catch(() => {});
          this.$router.go({name: 'UserList'});
          this.closeModal();
        })
    },
    disableUser() {
      this.$emit("disableUser");
    },
  },
}; 
</script>

<style scoped>
.modal-background {
  display: flex;
  position: fixed;
  flex-direction: column;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
  margin: 0;
}
.modal-content {
  position: fixed;
  background-color: white;
  border-radius: 5px;
  width: 355px;
  height: 237px;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
}

.modal-body {
  margin-top: 40px;
  max-width: 450px;
  user-select: none;
  color: #828282;
}

.modal--box {
  margin-bottom: 30px;
}

.modal-del {
  position: absolute;
  width: 63px;
  height: 28px;
  left: calc(50% - 62px/2 + 126.5px);
  bottom: 21px;
  background: #D64C57;
  border-radius: 10px;
  border: 1px solid #D64C57;
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
  left: calc(50% - 62px/2 + 52.5px);
  bottom: 21px;
  background: #FFFFFF;
  border: 1px solid #B9B9B9;
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