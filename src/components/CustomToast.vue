<template>
  <div class="toast_text">
    <p>{{ toast_message }}</p>
  </div>
</template>
<script>
export default {
  components: {},
  props: { toast_message: String },
};
</script>
<style scoped>
.toast_text {
  display: flex;
  height: 100%;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
}
.toast_text p {
  font-family: 'Noto Sans', sans-serif;
  font-size: 1em;
  line-height: 1em;
  color: #303030;
  font-weight: 700;
}
</style>
