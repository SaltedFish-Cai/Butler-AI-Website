/**
 * @description 导入类型定义
 */
import { PaStructureType } from "M_Types";
/**
 * @description 导入单元格配置
 */
import { cellMapConfig } from "./cell-config";

/**
 * @description 编辑表单列配置
 * @type Array<PaStructureType.FormV2>
 */
export const editFormColConfig: Array<PaStructureType.FormV2> = [
  {
    unitName: { "en-US": "Basic Config", "zh-CN": "基础配置" },
    label: { "en-US": "Column Name", "zh-CN": "列名" },
    prop: "label",
    type: "slot"
  },
  {
    unitName: { "en-US": "Basic Config", "zh-CN": "基础配置" },
    label: { "en-US": "Column Key", "zh-CN": "列Key" },
    prop: "prop",
    type: "input"
  },
  {
    unitName: { "en-US": "Basic Config", "zh-CN": "基础配置" },
    label: { "en-US": "Cell Type", "zh-CN": "单元格类型" },
    prop: "type",
    type: "cascader",
    exOptions: cellMapConfig
  }
];

/**
 * @description 额外配置_表单
 * @type Array<PaStructureType.FormV2>
 */
export const editOtherFormItemConfig: Array<PaStructureType.FormV2> = [
  {
    unitName: { "en-US": "Extra Config", "zh-CN": "额外配置" },
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
    unitName: { "en-US": "Extra Config", "zh-CN": "额外配置" },
    label: { "en-US": "unitName", "zh-CN": "归档名称" },
    prop: "unitName",
    type: "input",
    rules: [{ required: false }]
  },
  {
    unitName: { "en-US": "Extra Config", "zh-CN": "额外配置" },
    label: { "en-US": "unitTip", "zh-CN": "归档提示" },
    prop: "unitTip",
    type: "input",
    rules: [{ required: false }]
  },
  {
    unitName: { "en-US": "Extra Config", "zh-CN": "额外配置" },
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
