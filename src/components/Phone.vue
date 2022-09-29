<template>
  <vue-tel-input
    v-model="dataObject.phone"
    :dropdownOptions="dropdownOptions"
    :inputOptions="inputOptions"
    :preferredCountries="['kr', 'cn', 'us', 'gb']"
    :styleClasses="styleClasses"
    @on-input="onInput"
    :defaultCountry="dataObject.code"
    :validCharactersOnly="true"
  ></vue-tel-input>
</template>

<script>
export default {
  props: {
    dataObject: {},
    styleClasses: String,
  },
  setup() {
    const dropdownOptions = {
      showDialCodeInList: true,
      showDialCodeInSelection: true,
      showFlags: true,
      showSearchBox: true,
    };
    const inputOptions = {
      showDialCode: false,
      readonly: false,
    };
    return { dropdownOptions, inputOptions };
  },
  methods: {
    onInput(_number, phoneObject) {
      if (this.dataObject && phoneObject.country) {
        this.dataObject.code = phoneObject.country.iso2;
        this.dataObject.dialCode = phoneObject.country.dialCode;
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
