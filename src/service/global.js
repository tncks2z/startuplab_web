import { msg } from '/@service/string';
import { msgbox } from '/@service/common';

const methods = {
  console_log(str) {
    console.log(str);
  },
};

export default {
  install(Vue, _options) {
    Vue.config.globalProperties.log = methods.console_log;
    Vue.config.globalProperties.msg = msg;
    Vue.config.globalProperties.msgbox = (message, callback) => {
      msgbox(message, callback);
    };
  },
};
