import axios from '/@service/axios';

export async function reloadPage() {
  window.location.reload();
}
export const jsonFromFormData = (formData) => {
  const keys = formData.keys();
  let key = keys.next();
  const data = {};

  while (!key.done) {
    const k = key.value;
    const values = formData.getAll(k);

    if (values.length === 1) {
      data[k] = values[0];
    } else {
      data[k] = values;
    }

    key = keys.next();
  }

  return data;
};

export const mapToQueryString = (params) => {
  return Object.keys(params)
    .map((key) => key + '=' + params[key])
    .join('&');
};

export const isNotEmpty = (val) => {
  if (val !== null && val !== '' && typeof val !== 'undefined') {
    return true;
  }
  return false;
};

export const clone = (source) => {
  return JSON.parse(JSON.stringify(source));
};

export const removeDup = (arr) => {
  return arr.filter((o, i) => {
    const _o = JSON.stringify(o);
    return (
      i ===
      arr.findIndex((obj) => {
        return JSON.stringify(obj) === _o;
      })
    );
  });
};

export const isCheckLength = (value, size) => {
  if (!isNotEmpty(value) || value.length < size) {
    return false;
  }

  return true;
};

export const validateEmail = (value) => {
  if (!value) {
    return true; //'This field is required';
  }
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!regex.test(value)) {
    return true; //'This field must be a valid email';
  }

  return false;
};

export const isNumber = (value) => {
  return Math.sign(value) == 1 ? true : false;
};

export const fileDownload = (fileurl, filename) => {
  axios({
    method: 'GET',
    url: fileurl,
    responseType: 'blob',
    headers: {
      accept: '*/*',
    },
  }).then((res) => {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      const blob = res.data;
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      const url = window.URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
};
export const selectboxOption = (l, v) => {
  return { label: l, value: v };
};
