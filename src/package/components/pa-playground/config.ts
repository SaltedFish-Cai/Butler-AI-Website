/**
 * @description 导入类型定义
 * */
import { PaStructureType } from "M_Types";

/**
 * @description 基础配置
 * @type `Array<PaStructureType.FormV2>`
 * */
export const baseConfig: Array<PaStructureType.FormV2> = [
  { label: { "en-US": "Project Name", "zh-CN": "项目名称" }, prop: "projectName", type: "input" },
  { label: { "en-US": "Project Description", "zh-CN": "项目描述" }, prop: "projectDescription", type: "input" },
  { label: { "en-US": "Submit API", "zh-CN": "提交接口" }, prop: "submitApi", type: "input" }
];

/**
 * @description 选项配置
 * @type `Array<PaStructureType.FormV2>`
 * */
export const optionsConfig: Array<PaStructureType.FormV2> = [
  { label: { "en-US": "label", "zh-CN": "选项标签" }, prop: "label", type: "input" },
  { label: { "en-US": "Value", "zh-CN": "选项值" }, prop: "value", type: "input" }
];

/**
 * @description 表单配置
 * @type `Array<PaStructureType.FormV2>`
 * */
export const formConfig: Array<PaStructureType.FormV2> = [
  {
    label: { "en-US": "Label", "zh-CN": "标签" },
    prop: "label",
    type: "input",
    rules: [{ required: true }]
  },
  {
    label: { "en-US": "prop", "zh-CN": "属性名" },
    prop: "prop",
    tip: {
      "en-US": "Attribute names must use lowercase letters and underscores in English",
      "zh-CN": "属性名必须使用英文小写字母和下划线"
    },
    type: "input",
    rules: [{ required: true }]
  },
  {
    label: { "en-US": "type", "zh-CN": "类型" },
    prop: "type",
    type: "cascader",
    exOptions: [
      { label: "输入框 Input", value: "input", children: [] },
      { label: "数字框 Number", value: "number", children: [] },
      {
        label: "选择框 Select",
        value: "select",
        children: [
          { label: "单择框 Select", value: "select" },
          { label: "多选框 Multiple Select", value: "multiple-select" },
          { label: "远端单选框 Remote Select", value: "online-select" },
          { label: "远端多选框 Remote Multiple Select", value: "multiple-online-select" }
        ]
      },
      {
        label: "级联选择框 Cascader",
        value: "cascader",
        children: [
          { label: "单级级联选择框 Cascader", value: "cascader" },
          { label: "多级联选择框 Cascader Check", value: "cascader-check" },
          { label: "单级多选级联选择框 Multiple Cascader", value: "multiple-cascader" },
          { label: "多级多选级联选择框 Multiple Cascader Check", value: "multiple-cascader-check" }
        ]
      },
      { label: "单选框 Radio", value: "radio", children: [] },
      { label: "复选框 Checkbox", value: "checkbox", children: [] },
      {
        label: "时间选择框 Time",
        value: "time",
        children: [
          { label: "日期选择框组 Date Picker Group", value: "date-picker-group" },
          { label: "日期选择框 Date Picker", value: "date-picker" },
          { label: "日期时间选择框组 Date Time Picker Group", value: "date-time-picker-group" },
          { label: "日期时间选择框 Date Time Picker", value: "date-time-picker" },
          { label: "月份选择框组 Month Picker Group", value: "month-picker-group" },
          { label: "月份选择框 Month Picker", value: "month-picker" },
          { label: "时间选择框组 Time Picker Group", value: "time-picker-group" },
          { label: "时间选择框 Time Picker", value: "time-picker" },
          { label: "年份选择框组 Year Picker Group", value: "year-picker-group" },
          { label: "年份选择框 Year Picker", value: "year-picker" }
        ]
      },
      { label: "文件选择框 File", value: "file", children: [] },
      { label: "开关 Switch", value: "switch", children: [] }
    ],
    rules: [{ required: true }]
  }
];

/**
 * @description 输入框配置
 * @type `Array<PaStructureType.FormV2>`
 * */
export const inputConfig: Array<PaStructureType.FormV2> = [
  {
    label: { "en-US": "Placeholder", "zh-CN": "占位符" },
    prop: "placeholder",
    type: "input",
    rules: [{ required: false }]
  },
  {
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
    label: { "en-US": "Placeholder", "zh-CN": "占位符" },
    prop: "placeholder",
    type: "input",
    rules: [{ required: false }]
  },
  {
    label: { "en-US": "Max", "zh-CN": "最大值" },
    prop: "max",
    type: "number",
    rules: [{ required: false }]
  },
  {
    label: { "en-US": "Min", "zh-CN": "最小值" },
    prop: "min",
    type: "number",
    rules: [{ required: false }]
  },
  {
    label: { "en-US": "Unit", "zh-CN": "单位" },
    prop: "unit",
    type: "input",
    rules: [{ required: false }]
  },
  {
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
    label: { "en-US": "Options", "zh-CN": "选项" },
    prop: "options"
  },
  {
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
    label: { "en-US": "Options", "zh-CN": "选项" },
    prop: "options"
  },
  {
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
    label: { "en-US": "Options", "zh-CN": "选项" },
    prop: "options"
  }
];

/**
 * @description 复选框配置
 * @type `Array<PaStructureType.FormV2>`
 * */
export const checkboxConfig: Array<PaStructureType.FormV2> = [
  {
    label: { "en-US": "Options", "zh-CN": "选项" },
    prop: "options"
  }
];

/**
 * @description 其他配置
 * @type `Array<PaStructureType.FormV2>`
 * */
export const otherConfig: Array<PaStructureType.FormV2> = [
  {
    label: { "en-US": "required", "zh-CN": "必选项" },
    prop: "required",
    type: "radio",
    exOptions: [
      { label: "是", value: 1 },
      { label: "否", value: 0 }
    ],
    rules: [{ required: false }]
  },
  {
    label: { "en-US": "unitName", "zh-CN": "归档名称" },
    prop: "unitName",
    type: "input",
    rules: [{ required: false }]
  },
  {
    label: { "en-US": "unitTip", "zh-CN": "归档提示" },
    prop: "unitTip",
    type: "input",
    rules: [{ required: false }]
  },
  {
    label: { "en-US": "colSpan", "zh-CN": "列数" },
    prop: "exSpan",
    type: "select",
    exOptions: [
      { label: "占行1/4栏", value: "1", children: [] },
      { label: "占行2/4栏", value: "2", children: [] },
      { label: "占行3/4栏", value: "3", children: [] },
      { label: "占行4/4栏", value: "4", children: [] }
    ],
    rules: [{ required: false }]
  }
];
