import { isNotEmpty, validateEmail, isCheckLength } from '/@service/util';

Date.prototype.format = function (f) {
  if (!this.valueOf()) return ' ';
  var weekName = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var d = this;

  return f.replace(/(yyyy|yy|MMM|MM|dd|E|HH|hh|mi|mm|ss|a\/p)/g, function ($1) {
    var h;
    switch ($1) {
      case 'yyyy':
        return d.getFullYear();
      case 'yy':
        return (d.getFullYear() % 1000).zf(2);
      case 'MM':
        return (d.getMonth() + 1).zf(2);
      case 'MMM':
        return monthNames[d.getMonth()];
      case 'dd':
        return d.getDate().zf(2);
      case 'E':
        return weekName[d.getDay()];
      case 'HH':
        return d.getHours().zf(2);
      case 'hh':
        return ((h = d.getHours() % 12) ? h : 12).zf(2);
      case 'mi':
      case 'mm':
        return d.getMinutes().zf(2);
      case 'ss':
        return d.getSeconds().zf(2);
      case 'a/p':
        return d.getHours() < 12 ? 'AM' : 'PM';
      default:
        return $1;
    }
  });
};

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

Date.prototype.addHours = function (hours) {
  var date = new Date(this.valueOf());
  date.setHours(date.getHours() + hours);
  return date;
};

Date.prototype.addMinutes = function (mins) {
  var date = new Date(this.valueOf());
  date.setMinutes(date.getMinutes() + mins);
  return date;
};

String.prototype.string = function (len) {
  var s = '',
    i = 0;
  while (i++ < len) {
    s += this;
  }
  return s;
};
String.prototype.zf = function (len) {
  return '0'.string(len - this.length) + this;
};
Number.prototype.zf = function (len) {
  return this.toString().zf(len);
};

String.prototype.todate = function (_f) {
  var d = this;
  var yyyy = d.substring(0, 4);
  var mm = d.substring(4, 6);
  var dd = d.substring(6, 8);
  var hh = d.substring(8, 10);
  var mi = d.substring(10, 12);
  var ss = d.substring(12, 14);
  return new Date(yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mi + ':' + ss);
};

String.prototype.dateformat = function (f) {
  var d = this;
  return d.todate().local().format(f);
};

String.prototype.addcomma = function () {
  var string = this;
  if (Number.isNaN(parseInt(string))) return string;
  return string.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

Number.prototype.addcomma = function () {
  return this.toString().addcomma();
};

String.prototype.newlinetobr = function () {
  var string = this;
  return string.replace(/(\n|\r\n)/g, '<br/>');
};

String.prototype.left = function (length) {
  if (this.length <= length) {
    return this;
  } else {
    return this.substring(0, length);
  }
};

String.prototype.right = function (length) {
  if (this.length <= length) {
    return this;
  } else {
    return this.substring(this.length - length, this.length);
  }
};

FormData.prototype.isEmpty = function (name) {
  return !isNotEmpty(this.get(name));
};

Array.prototype.last = function () {
  return this[this.length - 1];
};

Array.prototype.first = function () {
  return this[0];
};

export default () => {};
