import { MTableV2UseItemType } from "../type";

// #Function 是否选择类型
export function isSelectType(row, display) {
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
  const type = row.cellConfig?.type || row.filterType;
  const _display = row.cellConfig?.display || display || !!row.filterType;
  let isTrue = arr.indexOf(type) > -1 && _display == true;
  if (type == "tag") isTrue = true;
  return isTrue;
}

// #Function 是否时间类型
export function isTimeType(row, display) {
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
  const type = row.cellConfig?.type || row.filterType;
  const _display = row.cellConfig?.display || display || !!row.filterType;
  const isTrue = arr.indexOf(type) > -1 && _display == true;
  return isTrue;
}

// #Function 是否数字类型
export function isNumberType(row, display) {
  const arr = ["number"];
  const type = row.cellConfig?.type || row.filterType;
  const _display = row.cellConfig?.display || display || !!row.filterType;
  const isTrue = arr.indexOf(type) > -1 && _display == true;
  return isTrue;
}

// #Function 是否文本类型
export function isTextType(row, display) {
  const arr = ["input", "textarea"];
  const type = row.cellConfig?.type || row.filterType;
  const _display = row.cellConfig?.display || display || !!row.filterType;
  const isTrue = arr.indexOf(type) > -1 && _display == true;
  return isTrue;
}

// #Function 是否输入类型
export function isInputType(row, display) {
  const arr = ["input"];
  const type = row.filterType || row.cellConfig?.type;
  const _display = row.cellConfig?.display || display;
  const isTrue = arr.indexOf(type) > -1 && _display == true;
  return isTrue;
}

// #Function 是否文本类型(判断高级搜索)
export function isUseCellConfig(row) {
  const isTrue = isTextType(row, true);
  return isTrue;
}

// #Function 是否索引列
export function isRowIndex(item: MTableV2UseItemType) {
  return item.type == "index" || item.type == "selection" || item.type == "radio";
}
