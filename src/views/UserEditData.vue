<template>
  <div class="container">
    <div>
      <h3>{{ projectName }}</h3>
    </div>
    <form class="needs-validation" @submit.prevent="submitForm($event)" novalidate>
      <div v-for="(column, i) in columnList.data" :key="i">
        <UserInput :label="column.meta_name" :inputValue="(inputValueList[column.meta_name] = inputValueList[column.meta_name])" @inputFromChild="inputValueList[column.meta_name] = $event.target.value" v-if="column.meta_type === '1'" />
        <UserSelectBox
          :label="column.meta_name"
          :selectValue="(inputValueList[column.meta_name] = inputValueList[column.meta_name])"
          @selectFromChild="inputValueList[column.meta_name] = Number($event.target.value)"
          v-else-if="column.meta_type === '2'"
        />
        <UserNote :label="column.meta_name" :note="(inputValueList[column.meta_name] = inputValueList[column.meta_name])" @inputFromChild="inputValueList[column.meta_name] = $event.target.value" v-else-if="column.meta_type === '5'" />
        <!-- <UserRadioBox
					:label="column.meta_name"
					:radioValue="(inputValueList[column.meta_name] = inputValueList[column.meta_name])"
					@radioFromChild="inputValueList[column.meta_name] = Number($event.target.value)"
					v-else-if="column.meta_type === '4'" /> -->
      </div>
      <UserRadioBox :radioValue="(data_status = data_status)" @radioFromChild="changeStatusValue($event)" />
      <button type="submit" class="btn btn-secondary">저장</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import UserInput from '/@components/UserInput.vue';
import Address from '/@components/Address.vue';
import UserSelectBox from '/@components/UserSelectBox.vue';
import UserRadioBox from '/@components/UserRadioBox.vue';
import UserNote from '/@components/UserNote.vue';
import { getUserEditForm, getUserAddForm } from '/@service/user';
import { msgbox } from '/@service/common';

export default {
  data() {
    return {
      inputValueList: {},
      columnList: [],
      errors: {
        form: [],
        status: [],
      },
      projectName: '',
      projectCode: '',
      data_id: '',
      user_id: '',
      data_status: 0,
      isPassValidatoin: false,
    };
  },
  created() {
    this.user_id = this.$cookies.get('userId');

    const setAddData = new FormData();
    const setEditData = new FormData();

    this.projectCode = sessionStorage.getItem('projectCode');
    this.projectName = sessionStorage.getItem('projectName');
    this.data_id = sessionStorage.getItem('data_id');

    setAddData.set('work_id', this.projectCode);
    setEditData.set('data_id', this.data_id);

    getUserAddForm(setAddData).then((result) => {
      this.columnList = result.data;
    });

    getUserEditForm(setEditData).then((result) => {
      this.dataList = result.data;
      this.data_status = this.dataList.data.data_status;
      this.inputValueList = JSON.parse(this.dataList.data.data_json);
    });
  },
  methods: {
    changeStatusValue(e) {
      this.data_status = Number(e.target.value);
      if (this.data_status != 2 && this.data_status != 6) {
        var forms = document.querySelectorAll('.needs-validation');
        Array.prototype.slice.call(forms).forEach(function (form) {
          form.classList.remove('was-validated');
        });
      }
    },
    checkForm() {
      this.errors = {
        form: [],
        status: [],
      };
      for (var key in this.inputValueList) {
        if (this.inputValueList[key] == '' || this.inputValueList[key] == null) {
          this.inputValueList[key] = null;
          this.errors['form'].push('Error');
        }
      }
      if (this.data_status == 2) {
        this.errors['status'].push('Error');
      }
      if (this.errors['form'].length != 0 && this.data_status == 6) {
        msgbox('모든 입력창을 채워주세요');
        var forms = document.querySelectorAll('.needs-validation');
        Array.prototype.slice.call(forms).forEach(function (form) {
          form.classList.add('was-validated');
        });
      } else if (this.errors['status'].length != 0) {
        msgbox('데이터 상태에 체크를 해주세요');
        var forms = document.querySelectorAll('.needs-validation');
        Array.prototype.slice.call(forms).forEach(function (form) {
          form.classList.add('was-validated');
        });
      } else {
        this.isPassValidatoin = true;
      }
    },
    submitForm(e) {
      this.checkForm();
      if (this.isPassValidatoin) {
        var inputData = JSON.stringify(this.inputValueList);
        if (this.data_status == 4) {
          this.user_id = -1;
        }
        axios({
          method: 'post',
          url: '/web/db/edit',
          data: {
            data_id: this.data_id,
            user_id: this.user_id,
            data_json: inputData,
            data_status: this.data_status,
          },
        })
          .then((res) => {
            console.log(inputData, this.data_id, this.data_status, this.user_id);
            e.target.reset();
            this.inputValueList = {};
            var forms = document.querySelectorAll('.needs-validation');
            Array.prototype.slice.call(forms).forEach(function (form) {
              form.classList.remove('was-validated');
            });
            this.$router.go(-1);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  components: { UserInput, Address, UserSelectBox, UserRadioBox, UserNote },
};
</script>

<style scoped>
.container {
  margin-top: 20px;
}
h3 {
  margin: 50px;
  text-align: center;
}
.btn-secondary {
  display: flex;
  justify-content: center;
  margin: 30px auto;
  font-size: 0.9rem;
  border: none;
  width: 15%;
  background-color: #e17b46;
}
.btn-secondary:hover {
  background-color: #c15a33;
}
@media (max-width: 768px) {
  h3 {
    margin: 50px;
    text-align: center;
  }
  .btn {
    display: flex;
    justify-content: center;
    margin: 30px auto;
    font-size: 0.9rem;
    border: none;
    width: 20%;
    background-color: #e17b46;
  }
  .btn-secondary:hover {
    background-color: #c15a33;
  }
}
</style>
