/**
 * @description 导入类型定义
 * */
import { MOptionsType } from "../types";

/**
 * @description 是/否选项
 * @type `Array<object>`
 * */
export const yesNoOptions = [
  { label: { "zh-CN": "是", "en-US": "Yes" }, value: 1 },
  { label: { "zh-CN": "否", "en-US": "No" }, value: 0 }
];

/**
 * @description 筛选类型选项
 * @type `Array<object>`
 * */
export const filterTypeOptions = [
  { label: { "zh-CN": "文本类型", "en-US": "Text Type" }, value: "input" },
  { label: { "zh-CN": "数字类型", "en-US": "Number Type" }, value: "number" },
  { label: { "zh-CN": "选择类型", "en-US": "Select Type" }, value: "select" },
  { label: { "zh-CN": "标签类型", "en-US": "Tag Type" }, value: "tag" },
  { label: { "zh-CN": "时间选择类型", "en-US": "Time Select Type" }, value: "time" }
];

/**
 * @description 固定选项
 * @type `Array<object>`
 * */
export const fixedOptions = [
  { label: { "en-US": "No Fixed", "zh-CN": "无固定" }, value: "default" },
  { label: { "en-US": "Left Fixed", "zh-CN": "左固定" }, value: "left" },
  { label: { "en-US": "Right Fixed", "zh-CN": "右固定" }, value: "right" }
];

/**
 * @description 内边距选项
 * @type `Array<object>`
 * */
export const paddingOptions = [
  { label: { "zh-CN": "上", "en-US": "Top" }, value: "top" },
  { label: { "zh-CN": "下", "en-US": "Bottom" }, value: "bottom" },
  { label: { "zh-CN": "左", "en-US": "Left" }, value: "left" },
  { label: { "zh-CN": "右", "en-US": "Right" }, value: "right" },
  { label: { "zh-CN": "全部", "en-US": "All" }, value: "all" }
];

/**
 * @description 表格使用选项
 * @type `Array<MOptionsType>`
 * */
export const TableUseOptions: Array<MOptionsType> = [
  { id: "use-yes-no", description: "是否选项", OptionsType: "select", config: yesNoOptions },
  { id: "use-padding", description: "选项", OptionsType: "select", config: paddingOptions },
  { id: "use-filter-type", description: "表格筛选类型", OptionsType: "select", config: filterTypeOptions },
  { id: "use-fixed", description: "固定选项", OptionsType: "select", config: fixedOptions }
];
