/**
 * @description PaTableUseItemType 类型导入
 */
import { PaTableUseItemType } from "../types";
/**
 * @description 判断是否为选择类型
 * @param row 行数据
 * @param display 是否显示
 * @returns 是否为选择类型
 */
export function isSelectType(row: any, display: any) {
  const arr = [
    "tag",
    "select",
    "multiple-select",
    "switch",
    "checkbox",
    "radio",
    "cascader",
    "cascader-check",
    "multiple-cascader-check",
    "multiple-cascader"
  ];
  const type = row.filterType || row.cellConfig?.type;
  const _display = row.cellConfig?.display || display || !!row.filterType;
  let isTrue = arr.indexOf(type) > -1 && _display == true;
  if (type == "tag") isTrue = true;
  return isTrue;
}
/**
 * @description 判断是否为时间类型
 * @param row 行数据
 * @param display 是否显示
 * @returns 是否为时间类型
 */
export function isTimeType(row: any, display: any) {
  const arr = [
    "time",
    "date-picker-group",
    "date-picker",
    "date-time-picker-group",
    "date-time-picker",
    "month-picker-group",
    "month-picker",
    "time-picker-group",
    "time-picker",
    "year-picker-group",
    "year-picker"
  ];
  const type = row.filterType || row.cellConfig?.type;
  const _display = row.cellConfig?.display || display || !!row.filterType;
  const isTrue = arr.indexOf(type) > -1 && _display == true;
  return isTrue;
}
/**
 * @description 判断是否为数字类型
 * @param row 行数据
 * @param display 是否显示
 * @returns 是否为数字类型
 */
export function isNumberType(row: any, display: any) {
  const arr = ["number"];
  const type = row.filterType || row.cellConfig?.type;
  const _display = row.cellConfig?.display || display || !!row.filterType;
  const isTrue = arr.indexOf(type) > -1 && _display == true;
  return isTrue;
}
/**
 * @description 判断是否为文本类型
 * @param row 行数据
 * @param display 是否显示
 * @returns 是否为文本类型
 */
export function isTextType(row: any, display: any) {
  const arr = ["input", "textarea"];
  const type = row.filterType || row.cellConfig?.type;
  const _display = row.cellConfig?.display || display || !!row.filterType;
  const isTrue = arr.indexOf(type) > -1 && _display == true;
  return isTrue;
}
/**
 * @description 判断是否为输入类型
 * @param row 行数据
 * @param display 是否显示
 * @returns 是否为输入类型
 */
export function isInputType(row: any, display: any) {
  const arr = ["input"];
  const type = row.filterType || row.cellConfig?.type;
  const _display = row.cellConfig?.display || display;
  const isTrue = arr.indexOf(type) > -1 && _display == true;
  return isTrue;
}
/**
 * @description 判断是否使用单元格配置
 * @param row 行数据
 * @returns 是否使用单元格配置
 */
export function isUseCellConfig(row: any) {
  const isTrue = isTextType(row, true);
  return isTrue;
}
/**
 * @description 判断是否为索引列
 * @param item 表格列配置
 * @returns 是否为索引列
 */
export function isRowIndex(item: PaTableUseItemType) {
  return item.type == "index" || item.type == "selection" || item.type == "radio";
}
