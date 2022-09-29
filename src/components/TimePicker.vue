<template>
  <Datepicker v-model="time" timePicker autoApply> </Datepicker>
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
    paramTime: String,
  },
  setup(props) {
    const time = ref({
      hours: null,
      minutes: null,
    });
    if (isNotEmpty(props.paramTime) && props.paramTime.length == 4) {
      time.value.hours = props.paramTime.left(2);
      time.value.minutes = props.paramTime.right(2);
    }
    const changeEvent = computed(() => {
      if (!isNotEmpty(time.value)) return '';
      if (time.value.hours == null || time.value.minutes == null) return '';
      return time.value.hours.zf(2) + time.value.minutes.zf(2);
    });

    return { time, changeEvent };
  },
};
</script>
