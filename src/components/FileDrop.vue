<template>
  <div style="">
    <form @submit.prevent ref="pageForm">
      <div @dragover.prevent @drop.prevent="dropFile" v-if="fileObj.file_name == null">
        <label for="selected_file">
          <div class="addbox add">Upload<em></em></div>
        </label>
        <input type="file" id="selected_file" name="selected_file" style="display: none" @change="changeInputFile" />
      </div>
      <div v-else>
        <button type="button" class="edit" @click="deleteFile">{{ fileObj.file_name }}</button>
      </div>
    </form>
  </div>
</template>
<script>
import { computed, ref } from 'vue';
import common, { getFileObject } from '/@service/common';
import { isNotEmpty, isUploadableFileExtension } from '/@service/util';

export default {
  emits: ['selectFile', 'deleteFile'],
  components: {},
  props: { fileObject: Object },
  setup(props) {
    const pageForm = ref(null);
    const fileObj = isNotEmpty(props.fileObject) ? props.fileObject : getFileObject();

    return { pageForm, fileObj };
  },
  methods: {
    async changeInputFile() {
      const form = this.$refs.pageForm;
      const file = form.selected_file.files[0];

      if (!isUploadableFileExtension(file.name)) {
        this.msgbox(this.msg.FORBIDDEN_FILE_EXTENSIONS);
        return;
      }
      form.selected_file.value = '';
      this.fileObj.file_id = 0;
      this.fileObj.file_name = file.name;
      this.fileObj.file = file;
      this.fileObj.file_type = file.type;

      let obj = getFileObject();
      obj.file_id = 0;
      obj.file_name = file.name;
      obj.file = file;
      obj.file_type = file.type;
      this.$emit('selectFile', obj);
    },
    dropFile(e) {
      const form = this.$refs.pageForm;
      form.selected_file.files = e.dataTransfer.files;
      this.changeInputFile();
    },
    deleteFile() {
      const chk = confirm('Are you sure you want to delete this file?');
      if (!chk) return;
      this.$emit('deleteFile', this.fileObj);
      this.fileObj.file_id = 0;
      this.fileObj.file_name = null;
      this.fileObj.file = null;
      this.fileObj.file_type = null;
    },
  },
};
</script>
<style scoped>
.addbox {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e4e4e4;
  border-radius: 2px;
  height: 48px;
  margin-left: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  padding: 0 6px;
  cursor: pointer;
}
</style>
