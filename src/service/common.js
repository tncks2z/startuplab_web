import { createToast, withProps } from 'mosha-vue-toastify';
import CustomToast from '/@components/CustomToast.vue';

export const selectboxOption = (l, v) => {
  return { label: l, value: v };
};
export const codeToSelectboxOption = (code) => {
  return selectboxOption(code['code_name'], code['code_id']);
};

const common = {
  APP_TYPE: 1, // web
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  USER_ID: 'USER_ID',
  KEEP_SIGN_IN: 'KEEP_SIGN_IN',
  EXPIRED_TOKEN_ALERT: 'EXPIRED_TOKEN_ALERT',
  PAGE_ROW_COUNT: 20,
  DATETIME_FORMAT: 'yyyy. MM. dd. HH:mi',
  DATE_FORMAT: 'yyyy. MM. dd.',
};

export default common;

// mosha-vue-toastify options => https://www.npmjs.com/package/mosha-vue-toastify
// type: 'default', 'info', 'danger', 'warning', 'success'
// transition: 'bounce', 'zoom', 'slide'
export const msgbox = (message, callback) => {
  const toastOption = { timeout: 3000, hideProgressBar: true, showCloseButton: true, showIcon: true, position: 'bottom-center', transition: 'slide', onClose: callback };
  createToast(withProps(CustomToast, { toast_message: message }), toastOption);
};
