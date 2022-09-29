<template>
  <select class="form-select" :name="name" :disabled="disabled" :value="modelValue" @input="updateValue" v-if="modelValue != null">
    <option v-for="(o, index) in options" :key="index" :value="o.value">{{ o.label }}</option>
  </select>
  <select class="form-select" :name="name" :disabled="disabled" v-else>
    <option v-for="(o, index) in options" :key="index" :value="o.value">{{ o.label }}</option>
  </select>
</template>

<script>
export default {
  props: {
    modelValue: null,
    name: String,
    options: Array,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup() {},
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', event.target.value);
    },
  },
  mounted() {},
};
</script>
