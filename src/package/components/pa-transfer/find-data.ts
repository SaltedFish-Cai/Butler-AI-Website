/**
 * @module pa-transfer/find-data
 * @description 穿梭框数据查找工具
 */
/**
 * 模块导入
 * @description 导入选项类型定义
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
  if (!options || !options.length) return "--";
  const optionsMap = new Map<string, PaOptionType.Select>();
  for (let index = 0; index < options.length; index++) {
    const option = options[index];
    optionsMap.set(String(option.value), option);
  }
  if (Array.isArray(data)) {
    const results: string[] = [];
    for (let I_index = 0; I_index < data.length; I_index++) {
      const row = data[I_index];
      const option = optionsMap.get(String(row));
      if (option) {
        results.push(option.label);
      }
    }
    return results.length > 0 ? results.join("，") : "--";
  } else {
    const option = optionsMap.get(String(data));
    return option ? option.label : "--";
  }
}
