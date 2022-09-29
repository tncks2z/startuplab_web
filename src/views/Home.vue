<template>
  <div class="content">
    <div>
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">가입</button>
          <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">조회/변경</button>
          <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">파일업로드</button>
          <button class="nav-link" id="nav-oauth-tab" data-bs-toggle="tab" data-bs-target="#nav-oauth" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Oauth2</button>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
          <form @submit.prevent="addData" ref="joinForm">
            <div class="input-group mb-3 mt-5">
              <span class="input-group-text mylabel">이메일 *</span>
              <input type="text" class="form-control" name="user_email" />
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text mylabel">비밀번호 *</span>
              <input type="text" class="form-control" name="user_password" />
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text mylabel">이름</span>
              <input type="text" class="form-control" name="user_name" />
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text mylabel">전화번호</span>
              <input type="text" class="form-control" name="user_phone" />
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text mylabel">유형 *</span>
              <Select :options="user_types" name="user_type"></Select>
            </div>
            <div class="d-grid gap-1">
              <button type="submit" class="btn btn-primary">가입</button>
            </div>
          </form>
        </div>
        <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
          <div class="input-group mb-3 mt-5">
            <select class="form-select input-group-text" v-model="searchParam.search_type">
              <option value="user_id">user_id</option>
              <option value="user_email">email</option>
            </select>
            <input type="text" class="form-control" placeholder="검색어를 입력하세요." v-model="searchParam.search_word" @keydown.enter.prevent="search" />
            <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="search">검색</button>
          </div>

          <form @submit.prevent="editData" ref="editForm">
            <div v-show="searchVo && searchVo.user_id > 0">
              <div class="input-group mb-3 mt-3">
                <span class="input-group-text mylabel">User Id</span>
                <input type="text" class="form-control" name="user_id" :value="searchVo.user_id" readonly />
              </div>
              <div class="input-group mb-3 mt-3">
                <span class="input-group-text mylabel">이메일</span>
                <input type="text" class="form-control" name="user_email" v-model="searchVo.user_email" />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text mylabel">이름</span>
                <input type="text" class="form-control" name="user_name" v-model="searchVo.user_name" />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text mylabel">전화번호</span>
                <input type="text" class="form-control" name="user_phone" v-model="searchVo.user_phone" />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text mylabel">유형</span>
                <Select :options="user_types" name="user_type" v-model="searchVo.user_type"></Select>
              </div>
              <div class="d-grid gap-1">
                <button type="submit" class="btn btn-primary">정보변경</button>
              </div>
            </div>
          </form>
        </div>
        <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
          <!-- 파일업로드 -->
          <div class="mt-5">
            <label for="formFile" class="form-label">Upload file example</label>
            <input class="form-control" type="file" id="formFile" @change="fileUpload" accept="image/*" />
          </div>
          <div v-if="src != null && src.length > 0" class="mt-3"><img style="width: 100%" :src="src" /></div>
        </div>
        <div class="tab-pane fade show" id="nav-oauth" role="tabpanel" aria-labelledby="nav-oauth">
          <div class="input-group mb-3 mt-3">
            <span class="input-group-text mylabel">이메일</span>
            <input type="text" class="form-control" v-model="oauth.username" />
          </div>
          <div class="input-group mb-3 mt-3">
            <span class="input-group-text mylabel">패스워드</span>
            <input type="password" class="form-control" v-model="oauth.password" />
          </div>

          <div class="d-grid gap-1">
            <button type="button" class="btn btn-primary" @click="login">로그인</button>
          </div>
          <div class="mt-5">{{ oauth.result }}</div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import { computed, ref, nextTick } from 'vue';
import { useStore } from 'vuex';
import { getUser, joinUser, editUser, uploadFile } from '/@service/api';
import { oauthLogin, getLoginInfo } from '/@service/login';
import { selectboxOption, jsonFromFormData, isNotEmpty } from '/@service/util';
import Select from '/@components/Select.vue';

export default {
  components: { Select },
  unmounted() {},
  mounted() {},
  data() {
    return {
      src: '',
      searchVo: {},
      searchParam: { search_type: 'user_id', search_word: '' },
      oauth: {
        username: '',
        password: '',
        result: '',
      },
    };
  },
  setup() {
    const store = useStore();
    const joinForm = ref(null);
    const editForm = ref(null);
    const user = computed(() => {
      return store.getters.user;
    });

    const user_types = [selectboxOption('관리자', 1), selectboxOption('유저', 2)];
    return { user, user_types, joinForm, editForm };
  },
  methods: {
    search() {
      const param = this.searchParam;
      param.search_word = param.search_word.trim();
      if (!isNotEmpty(param.search_word)) {
        this.msgbox('검색어를 입력하세요.');
        return;
      }

      console.log('param:', param);
      getUser(param).then((result) => {
        console.log('result:', result);
        if (result.error.code != 0) {
          this.msgbox(result.error.msg);
          return;
        }
        if (result.data.user == null) {
          this.msgbox('겁색된 내용이 없습니다.');
          return;
        }
        this.searchVo = result.data.user;
      });
      console.log('aaa');
    },
    addData() {
      const form = this.joinForm;
      const data = jsonFromFormData(new FormData(form));
      joinUser(data).then((result) => {
        console.log('result:', result);
        if (result.error.code != 0) {
          this.msgbox(result.error.msg);
          return;
        }
        this.msgbox(this.msg.SUCCESS);
      });
    },
    editData() {
      const form = this.editForm;
      const data = jsonFromFormData(new FormData(form));
      console.log(data);
      editUser(data).then((result) => {
        console.log('result:', result);
        if (result.error.code != 0) {
          this.msgbox(result.error.msg);
          return;
        }
        this.msgbox(this.msg.SUCCESS);
      });
    },
    fileUpload(e) {
      console.log(e.target.files[0]);
      const file = e.target.files[0];
      const form = new FormData();
      form.set('file', file, file.name);
      uploadFile(form).then((result) => {
        console.log('result:', result);
        if (result.error.code != 0) {
          this.msgbox(result.error.msg);
          return;
        }
        this.src = result.data.upload_file.fileUrl;
      });
    },
    login() {
      const oauthData = new FormData();
      oauthData.set('username', this.oauth.username);
      oauthData.set('password', this.oauth.password);
      oauthLogin(oauthData, (result) => {
        console.log(result);
        this.oauth.result = result;
        geLoginInfo().then((r) => {
          console.log(r);
        });
      });
    },
  },
};
</script>
<style scoped>
.mylabel {
  width: 100px;
}
</style>
