<template>
    <tr class="tr" :class="{ 'tr-disabled' : user.user_status === 0 }">
        <td>{{ index+1 }}</td>
        <td class="user_name" style="width: 20%;">{{user.user_name}}</td>
        <td class="user_email" style="width: 20%;">{{user.user_email}}</td>
        <td class="user_phone" style="width: 20%;">{{user.user_phone}}</td>
        <td class="assignment_name" style="width: 20%;">
            {{assignment_name[user.assignment_id -1]}}
        </td>
        <td class="status_button" style="width: 20%;">   
            <button type="button" class="btn btn-primary btn-modal" @click="moveModifyPage" :disabled="user.user_status === 0" >수정</button>
            <button type="button" class="btn btn-primary btn-modal btn-stop" data-bs-toggle="modal" data-bs-target="#adminModal" style="width: 75px; text-align: center;" @click="openModal(user.user_id)" :disabled="user.user_status === 0"  v-if="user.user_status == 1" >{{ msg }}</button> 
            <button type="button" class="btn btn-primary btn-modal btn-stop" data-bs-toggle="modal" data-bs-target="#adminModal" style="width: 75px; text-align: center;" @click="openModal(user.user_id)" :disabled="user.user_status === 0"  v-if="user.user_status == 0">{{ nextMsg }}</button> 
            <button class="btn btn-primary btn-modal btn-stop"  :disabled="user.user_status === 0" @click="moveUserWorkPage">작업 내역</button>
        </td>
    </tr>
</template>

<script>
export default {
    name: 'UserListRow',
    props: {
        user: Object,
        user_id : Number,
        assignment_name: Array,
        user_status: Number,
        index: Number
    },
    data() {
    return {
        message: '',
        isDisalbed: true,
        msg:"활성화",
        nextMsg:"계정 정지",
    }
  }, 
  methods: {
    openModal(id) {
        this.$emit("openModal", id);
    },
    moveModifyPage() {
        this.$router.push(`/admin/user/modify/${this.user_id}`).catch(() => {});
    },
     moveUserWorkPage() {
        sessionStorage.setItem('user_name', this.user.user_name)
        sessionStorage.setItem('user_id', this.user.user_id)
        sessionStorage.setItem('assignment_id', this.user.assignment_id)
        this.$router.push(`/admin/user/workpage/${this.user_id}`).catch(() => {});
    },

  },
}
</script>

<style scoped>
.btn {
    background-color:#e17b45;
    border-color: #e17b45;
    color: white;
}
.btn-primary-add {
    background-color: #e17b45;
    border-color: #e17b45;
    color: white;
}
.btn-primary-add:hover {
    background-color: #dc6425;
    border-color: #dc6425;
    color: white;
}
.btn-modal{
    font-size: .8rem;
} 
.btn-modal:hover{
    background-color: #dc6425;
} 

.flex-area .btn-secondary {
  font-size: .8rem;
  border: none;
  background-color: #e17b46 !important;
}

.flex-area .btn-secondary:hover {
  background-color: #dc6425 !important;
}

.btn-stop {
    background-color: white; 
    border-color: #e17b45;
    color: #e17b45;
}
.btn-stop:hover {
    background: #FBEBE3;
    border-color: #e17b45;
}
.pull-right, .btn-modal {
    margin-right: 5px;
}
.items {
    display: block;
    font-size: 0; 
	margin: 0 -5px;
    margin-top: 50px;
    text-align: right;
}
.btn-primary-add {
    float: left;
}
.search-area {
    margin-right: 5px;
}
.form-select {
    display: inline-block;
    width: 10%;
    margin-right: 10px;
}
.form-control {
    display: inline-block;
    width: 30%;
    margin-right: 10px;
} 

.btn-primary {
    font-size: .8rem;
}
.tr-disabled {
    background-color: #EFEFEF;
}
</style>