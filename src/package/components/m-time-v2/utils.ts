import dayjs from "dayjs";
import { MDatePickerType } from "./type";

/**
 * 判断是否是合法的日期格式
 * @param {string} dateString - 日期字符串
 * @returns {boolean} - 是否合法
 */
export function isValidDate(dateString: string): boolean {
  if (!dateString || typeof dateString !== "string") {
    return false;
  }

  // 常见的日期格式正则表达式
  const datePatterns = [
    // YYYY-MM-DD
    /^\d{4}-\d{2}-\d{2}$/,
    // YYYY/MM/DD
    /^\d{4}\/\d{2}\/\d{2}$/,
    // YYYY.MM.DD
    /^\d{4}\.\d{2}\.\d{2}$/,
    // YYYY年MM月DD日
    /^\d{4}年\d{1,2}月\d{1,2}日$/,
    // MM/DD/YYYY
    /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    // DD/MM/YYYY
    /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    // 时间格式 HH:mm:ss
    /^\d{2}:\d{2}:\d{2}$/,
    // 时间格式 HH:mm
    /^\d{2}:\d{2}$/,
    // 日期时间格式 YYYY-MM-DD HH:mm:ss
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    // 日期时间格式 YYYY/MM/DD HH:mm:ss
    /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/
  ];

  // 检查是否符合任一格式
  const isValidFormat = datePatterns.some(pattern => pattern.test(dateString));

  if (!isValidFormat) {
    return false;
  }

  // 进一步验证日期的有效性
  try {
    const date = new Date(dateString);

    // 检查是否为有效日期
    if (isNaN(date.getTime())) {
      return false;
    }

    // 检查日期组件是否合理
    const parts = dateString.split(/[-/\s:年月日]/);
    if (parts.length >= 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const day = parseInt(parts[2]);

      // 基本范围检查
      if (month < 1 || month > 12 || day < 1 || day > 31) {
        return false;
      }

      // 更精确的日期验证
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      if (day > lastDayOfMonth) {
        return false;
      }
    }
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 转换日期格式
 * @param date 日期
 * @returns 转换后的日期字符串
 */
export function convertValue(type: MDatePickerType, date: dayjs.Dayjs | string) {
  if (type.includes("year") && (typeof date === "string" || typeof date === "number")) {
    const _data = date.toString().split("-");
    date = _data[0] + "-01-01";
  }
  if (type.includes("month") && (typeof date === "string" || typeof date === "number")) {
    const _data = date.toString().split("-");
    date = _data[0] + "-" + _data[1] + "-01";
  }
  if (
    (type == "time-picker" && (typeof date === "string" || typeof date === "number")) ||
    (type == "time-picker-group" && (typeof date === "string" || typeof date === "number"))
  ) {
    const _data = date.toString().split(" ");
    date = "2025-01-01 " + _data[_data.length - 1];
  }

  if (typeof date === "string" && !isValidDate(date)) {
    return "--";
  }

  date = dayjs(date);

  const formatMap = {
    "time-picker": "HH:mm:ss",
    "time-picker-group": "HH:mm:ss",
    "date-time-picker": "YYYY-MM-DD HH:mm:ss",
    "date-time-picker-group": "YYYY-MM-DD HH:mm:ss",
    "date-picker": "YYYY-MM-DD",
    "date-picker-group": "YYYY-MM-DD",
    "month-picker": "YYYY-MM",
    "month-picker-group": "YYYY-MM",
    "year-picker": "YYYY",
    "year-picker-group": "YYYY"
  };

  return date?.format?.(formatMap[type || "date-picker"]) || "";
}
