/**
 * 模块导入
 * @description 导入选项类型定义
 */
import { PaOptionType } from "M_Types";
/**
 * 模块导入
 * @description 导入工具函数
 */
import _ from "lodash";
const { isNil } = _;
/**
 * 查找显示数据函数
 * @param data - | `boolean` | `number` | `string` 要查找的数据
 * @param options - 选项列表
 * @returns string 显示文本
 * @description 根据值从选项列表中查找对应的显示文本
 */
export function findData(
  data: Array<boolean | number | string> | boolean | number | string,
  options: PaOptionType.SelectList
): string {
  const language: string = typeof window !== "undefined" ? window.PancakeGlobalConfig?.language || "zh-CN" : "zh-CN";
  let text: string = "";
  if (!options?.length) return "--";
  if (Array.isArray(data)) {
    for (let I_index: number = 0; I_index < data.length; I_index++) {
      const row: boolean | number | string = data[I_index];
      for (let index: number = 0; index < options.length; index++) {
        const option: PaOptionType.Select = options[index];
        if (option.value == row) {
          text +=
            (typeof option.label == "string" ? option.label : option.label[language]) +
            `${I_index < data.length - 1 ? "，" : ""}`;
        }
      }
    }
  } else if (!isNil(data) && data != "") {
    for (let index: number = 0; index < options.length; index++) {
      const option: PaOptionType.Select = options[index];
      if (option.value == data) {
        text += typeof option.label == "string" ? option.label : option.label[language];
      }
    }
  }
  return text;
}
