<template>
  <vue-tel-input name="sssss" v-model="data" :dropdownOptions="dropdownOptions" :inputOptions="inputOptions" :preferredCountries="['kr', 'cn', 'us', 'gb']" :styleClasses="styleClasses" @on-input="onInput" :defaultCountry="dataObject.code">
  </vue-tel-input>
</template>

<script>
import { ref } from 'vue';
export default {
  props: {
    dataObject: {},
    styleClasses: String,
  },
  setup() {
    const data = ref(null);
    const dropdownOptions = {
      showDialCodeInList: false,
      showDialCodeInSelection: false,
      showFlags: true,
      showSearchBox: true,
    };
    const inputOptions = {
      showDialCode: false,
      readonly: true,
    };
    return { data, dropdownOptions, inputOptions };
  },
  methods: {
    onInput(_number, phoneObject) {
      this.data = phoneObject.country.name.countryfix();
      if (this.dataObject) {
        this.dataObject.code = phoneObject.country.iso2;
        this.dataObject.name = this.data;
      }
    },
  },
};
</script>
<style>
.vue-tel-input {
  padding: 2px;
  border: 1px solid #dde6e9 !important;
}
</style>
