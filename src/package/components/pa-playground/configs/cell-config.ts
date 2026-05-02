/**
 * @description 导入类型定义
 * */
import { PaStructureType, PaOptionType } from "M_Types";

/**
 * @description 单元格类型映射配置
 * @type `Array<PaOptionType.Select>`
 * */
export const cellMapConfig: Array<PaOptionType.Select> = [
  { label: { "en-US": "Text", "zh-CN": "文本" }, value: "text", children: [] },
  { label: { "en-US": "Input", "zh-CN": "输入框" }, value: "input", children: [] },
  { label: { "en-US": "Number", "zh-CN": "数字框" }, value: "number", children: [] },
  { label: { "en-US": "Switch", "zh-CN": "开关" }, value: "switch", children: [] },
  {
    label: { "en-US": "Select Box", "zh-CN": "选择框" },
    value: "select",
    children: [
      { label: { "en-US": "Single Select", "zh-CN": "单择框" }, value: "select" },
      { label: { "en-US": "Multiple Select", "zh-CN": "多选框" }, value: "multiple-select" }
    ]
  },
  {
    label: { "en-US": "Cascader", "zh-CN": "级联选择框" },
    value: "cascader",
    children: [
      { label: { "en-US": "Single Cascader", "zh-CN": "单级级联选择框" }, value: "cascader" },
      { label: { "en-US": "Cascader Check", "zh-CN": "多级联选择框" }, value: "cascader-check" },
      { label: { "en-US": "Multiple Cascader", "zh-CN": "单级多选级联选择框" }, value: "multiple-cascader" },
      { label: { "en-US": "Multiple Cascader Check", "zh-CN": "多级多选级联选择框" }, value: "multiple-cascader-check" }
    ]
  },
  { label: { "en-US": "Radio Box", "zh-CN": "单选框" }, value: "radio", children: [] },
  { label: { "en-US": "Checkbox", "zh-CN": "复选框" }, value: "checkbox", children: [] },
  {
    label: { "en-US": "Time Picker", "zh-CN": "时间选择框" },
    value: "time",
    children: [
      { label: { "en-US": "Date Picker Group", "zh-CN": "日期选择框组" }, value: "date-picker-group" },
      { label: { "en-US": "Date Picker", "zh-CN": "日期选择框" }, value: "date-picker" },
      { label: { "en-US": "Date Time Picker Group", "zh-CN": "日期时间选择框组" }, value: "date-time-picker-group" },
      { label: { "en-US": "Date Time Picker", "zh-CN": "日期时间选择框" }, value: "date-time-picker" },
      { label: { "en-US": "Month Picker Group", "zh-CN": "月份选择框组" }, value: "month-picker-group" },
      { label: { "en-US": "Month Picker", "zh-CN": "月份选择框" }, value: "month-picker" },
      { label: { "en-US": "Time Picker Group", "zh-CN": "时间选择框组" }, value: "time-picker-group" },
      { label: { "en-US": "Time Picker", "zh-CN": "时间选择框" }, value: "time-picker" },
      { label: { "en-US": "Year Picker Group", "zh-CN": "年份选择框组" }, value: "year-picker-group" },
      { label: { "en-US": "Year Picker", "zh-CN": "年份选择框" }, value: "year-picker" }
    ]
  },
  { label: { "en-US": "File Selector", "zh-CN": "文件选择框" }, value: "file", children: [] }
];

/**
 * @description 输入框配置
 * @type `Array<PaStructureType.FormV2>`
 * */
export const inputConfig: Array<PaStructureType.FormV2> = [
  {
    unitName: { "en-US": "Input Config", "zh-CN": "输入框配置" },
    label: { "en-US": "Placeholder", "zh-CN": "占位符" },
    prop: "placeholder",
    type: "input",
    rules: [{ required: false }]
  },
  {
    unitName: { "en-US": "Input Config", "zh-CN": "输入框配置" },
    label: { "en-US": "Max Length", "zh-CN": "最大长度" },
    prop: "maxLength",
    type: "number",
    rules: [{ required: false }]
  }
];

/**
 * @description 数字框配置
 * @type `Array<PaStructureType.FormV2>`
 * */
export const numberConfig: Array<PaStructureType.FormV2> = [
  {
    unitName: { "en-US": "Number Config", "zh-CN": "数字框配置" },
    label: { "en-US": "Placeholder", "zh-CN": "占位符" },
    prop: "placeholder",
    type: "input",
    rules: [{ required: false }]
  },
  {
    unitName: { "en-US": "Number Config", "zh-CN": "数字框配置" },
    label: { "en-US": "Max", "zh-CN": "最大值" },
    prop: "max",
    type: "number",
    rules: [{ required: false }]
  },
  {
    unitName: { "en-US": "Number Config", "zh-CN": "数字框配置" },
    label: { "en-US": "Min", "zh-CN": "最小值" },
    prop: "min",
    type: "number",
    rules: [{ required: false }]
  },
  {
    unitName: { "en-US": "Number Config", "zh-CN": "数字框配置" },
    label: { "en-US": "Unit", "zh-CN": "单位" },
    prop: "unit",
    type: "input",
    rules: [{ required: false }]
  },
  {
    unitName: { "en-US": "Number Config", "zh-CN": "数字框配置" },
    label: { "en-US": "Precision", "zh-CN": "精度" },
    prop: "precision",
    type: "number",
    rules: [{ required: false }]
  }
];

/**
 * @description 选择框配置
 * @type `Array<PaStructureType.FormV2>`
 * */
export const selectConfig: Array<PaStructureType.FormV2> = [
  {
    unitName: { "en-US": "Select Config", "zh-CN": "选择框配置" },
    label: { "en-US": "Options", "zh-CN": "选项" },
    prop: "exOptionsById",
    type: "select"
  },
  {
    unitName: { "en-US": "Select Config", "zh-CN": "选择框配置" },
    label: { "en-US": "Placeholder", "zh-CN": "占位符" },
    prop: "placeholder",
    type: "input",
    rules: [{ required: false }]
  }
];

/**
 * @description 级联选择框配置
 * @type `Array<PaStructureType.FormV2>`
 * */
export const cascaderConfig: Array<PaStructureType.FormV2> = [
  {
    unitName: { "en-US": "Cascader Config", "zh-CN": "级联选择框配置" },
    label: { "en-US": "Options", "zh-CN": "选项" },
    prop: "exOptionsById",
    type: "select"
  },
  {
    unitName: { "en-US": "Cascader Config", "zh-CN": "级联选择框配置" },
    label: { "en-US": "Placeholder", "zh-CN": "占位符" },
    prop: "placeholder",
    type: "input",
    rules: [{ required: false }]
  }
];

/**
 * @description 单选框配置
 * @type `Array<PaStructureType.FormV2>`
 * */
export const radioConfig: Array<PaStructureType.FormV2> = [
  {
    unitName: { "en-US": "Radio Config", "zh-CN": "单选框配置" },
    label: { "en-US": "Options", "zh-CN": "选项" },
    prop: "exOptionsById",
    type: "select"
  }
];

/**
 * @description 复选框配置
 * @type `Array<PaStructureType.FormV2>`
 * */
export const checkboxConfig: Array<PaStructureType.FormV2> = [
  {
    unitName: { "en-US": "Checkbox Config", "zh-CN": "复选框配置" },
    label: { "en-US": "Options", "zh-CN": "选项" },
    prop: "exOptionsById",
    type: "select"
  }
];

/**
 * @description 开关配置
 * @type `Array<PaStructureType.FormV2>`
 * */
export const switchConfig: Array<PaStructureType.FormV2> = [
  {
    unitName: { "en-US": "Switch Config", "zh-CN": "开关配置" },
    label: { "en-US": "Options", "zh-CN": "选项" },
    prop: "exOptionsById",
    type: "select"
  }
];
