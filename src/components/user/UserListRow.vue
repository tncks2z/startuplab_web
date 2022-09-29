<template>
    <tr class="tr" :class="{ 'tr-disabled' : user.user_status === 0 }" >
        <td>{{user.user_name}}</td>
        <td>{{user.user_email}}</td>
        <td>{{user.user_password}}</td>
        <td>{{user.user_phone}}</td>
        <td>
            {{assignment_name[user.assignment_id -1]}}
        </td>
        <td>   
            <button type="button" class="btn btn-primary btn-modal" @click="movePage" :disabled="user.user_status === 0" >수정</button>
            <button type="button" class="btn btn-primary btn-modal btn-stop" @click="openModal(user.user_id)"  :disabled="user.user_status === 0"  >활성화</button> 
            <button class="btn btn-primary btn-modal btn-stop"  :disabled="user.user_status === 0" >작업 내역</button>
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
    },
    data() {
    return {
      message: '',
      isDisalbed: true
    }
  }, 
  methods: {
    openModal(id) {
        this.$emit("openModal", id);
    },
    movePage() {
      this.$router.push(`/admin/user/modify/${this.user_id}`)
    },
    isChangeColor() {

    },
    }
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