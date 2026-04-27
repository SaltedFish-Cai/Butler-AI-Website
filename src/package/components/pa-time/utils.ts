/**
 * **模块导入**
 * @description 导入日期处理库
 * */
import dayjs from "dayjs";

/**
 * **模块导入**
 * @description 导入日期选择器类型定义
 * */
import { MDatePickerType } from "./types";

/**
 * **判断日期格式是否合法**
 * @param `dateString` `string` 日期字符串
 * @returns `boolean` 是否合法
 * @description 判断给定的日期字符串是否符合常见的日期格式
 * */
export function isValidDate(dateString: string): boolean {
  if (!dateString || typeof dateString !== "string") {
    return false;
  }

  /**
   * **常见日期格式正则表达式列表**
   * @type `Array<RegExp>`
   * @description 支持的日期格式模式
   * */
  const datePatterns: Array<RegExp> = [
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
  const isValidFormat: boolean = datePatterns.some(pattern => pattern.test(dateString));

  if (!isValidFormat) {
    return false;
  }

  // 进一步验证日期的有效性
  try {
    const date: Date = new Date(dateString);

    // 检查是否为有效日期
    if (isNaN(date.getTime())) {
      return false;
    }

    // 检查日期组件是否合理
    const parts: Array<string> = dateString.split(/[-/\s:年月日]/);
    if (parts.length >= 3) {
      const year: number = parseInt(parts[0]);
      const month: number = parseInt(parts[1]);
      const day: number = parseInt(parts[2]);

      // 基本范围检查
      if (month < 1 || month > 12 || day < 1 || day > 31) {
        return false;
      }

      // 更精确的日期验证
      const lastDayOfMonth: number = new Date(year, month, 0).getDate();
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
 * **转换日期格式**
 * @param `type` `MDatePickerType` 日期选择器类型
 * @param `date` `dayjs.Dayjs | string` 日期值
 * @returns `string` 转换后的日期字符串
 * @description 根据日期选择器类型转换日期格式
 * */
export function convertValue(type: MDatePickerType, date: dayjs.Dayjs | string): string {
  if (type.includes("year") && (typeof date === "string" || typeof date === "number")) {
    const _data: Array<string> = date.toString().split("-");
    date = _data[0] + "-01-01";
  }
  if (type.includes("month") && (typeof date === "string" || typeof date === "number")) {
    const _data: Array<string> = date.toString().split("-");
    date = _data[0] + "-" + _data[1] + "-01";
  }
  if (
    (type == "time-picker" && (typeof date === "string" || typeof date === "number")) ||
    (type == "time-picker-group" && (typeof date === "string" || typeof date === "number"))
  ) {
    const _data: Array<string> = date.toString().split(" ");
    date = "2025-01-01 " + _data[_data.length - 1];
  }

  if (typeof date === "string" && !isValidDate(date)) {
    return "--";
  }

  date = dayjs(date);

  /**
   * **格式映射表**
   * @type `Record<MDatePickerType, string>`
   * @description 日期类型与格式字符串的映射
   * */
  const formatMap: Record<MDatePickerType, string> = {
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
