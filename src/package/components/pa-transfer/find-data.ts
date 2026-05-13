/**
 * @module pa-transfer/find-data
 * @description 穿梭框数据查找工具
 */
/**
 * 选项类型
 * @description 选项类型定义
 */
import type { PaOptionType } from "../manager-type";
/**
 * 查找数据标签
 * @param data - 要查找的数据值或数组
 * @param options - 选项列表
 * @returns string 对应的标签字符串
 * @description 根据 value 在选项列表中查找对应的 label
 */
export function findData(
  data: Array<boolean | number | string> | boolean | number | string,
  options: PaOptionType.SelectList
): string {
  let text = "";
  if (!options?.length) return "--";
  if (Array.isArray(data)) {
    for (let I_index = 0; I_index < data.length; I_index++) {
      const row = data[I_index];
      for (let index = 0; index < options.length; index++) {
        const option = options[index];
        if (option.value == row) {
          text += option.label + `${I_index < data.length - 1 ? "，" : ""}`;
        }
      }
    }
  } else {
    for (let index = 0; index < options.length; index++) {
      const option = options[index];
      if (option.value == data) {
        text += option.label;
      }
    }
  }
  return text || "--";
}
