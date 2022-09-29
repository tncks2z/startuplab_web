<template>
  <table class="table">
    <thead>
      <tr>
        <th scope="col" v-for="(th, i) in tableHeader" :key="i">{{ th }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(td, i) in tableData" :key="i">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    columns: Array,
    entries: Array,
  },
  computed: {
    tableHeader() {
      return this.columns || [];
    },
    tableData() {
      return this.entries || [];
    },
  },
};
</script>

<style></style>
