<template>
  <Datepicker v-model="paramDate" format="yyyy. MM. dd" locale="ko" autoApply :enableTimePicker="false" v-if="!monthPicker"> </Datepicker>
  <Datepicker v-model="date" format="yyyy. MM" locale="ko" autoApply :enableTimePicker="false" monthPicker v-if="monthPicker"> </Datepicker>
  <input type="hidden" :name="inputName" :value="changeEvent" />
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import { ref, computed } from 'vue';
import { isNotEmpty } from '/@service/util';

//monthPicker
export default {
  components: {
    Datepicker,
  },
  props: {
    inputName: String,
    paramDate: Object,
    format: String,
    monthPicker: Boolean,
  },
  setup(props) {
    const month = props.paramDate != null ? props.paramDate.getMonth() : null;
    const year = props.paramDate != null ? props.paramDate.getFullYear() : null;

    const date = ref({
      month: month,
      year: year,
    });

    const changeEvent = computed(() => {
      if (props.monthPicker) {
        if (!isNotEmpty(date.value)) return '';
        return date.value.year.zf(4) + (date.value.month + 1).zf(2);
      } else {
        if (!isNotEmpty(props.paramDate)) return '';
        return isNotEmpty(props.format) ? props.paramDate.format(props.format) : props.paramDate.format('yyyyMMdd');
      }
    });

    return { changeEvent, date };
  },
};
</script>
<style>
.dp__input {
  font-size: 0.875rem !important;
}
/* // @import 'vue3-date-time-picker/src/Vue3DatePicker/style/main.scss';
// $dp__font_size: 0.875rem !default;
// */
</style>
