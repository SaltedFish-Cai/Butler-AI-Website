// #Function 时间转换方法
const format = (time: string, fmt = "yyyy-MM-dd HH:mm:ss") => {
  if (!time) {
    return "";
  }
  const _date = new Date(time);
  const o: any = {
    "M+": _date.getMonth() + 1, //月份
    "d+": _date.getDate(), //日
    "h+": _date.getHours() % 12 == 0 ? 12 : _date.getHours() % 12, //小时
    "H+": _date.getHours(), //小时
    "m+": _date.getMinutes(), //分
    "s+": _date.getSeconds(), //秒
    "q+": Math.floor((_date.getMonth() + 3) / 3), //季度
    S: _date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (const k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return fmt;
};

export default format;
