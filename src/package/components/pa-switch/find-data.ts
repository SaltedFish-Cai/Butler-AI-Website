/**
 * 模块导入
 * @description 导入选项类型定义
 */
import { LanguagePackageType, PaOptionType } from "../manager-type";

/**
 * 默认激活文本
 * @description 默认的中英文激活文本
 */
const DEFAULT_ACTIVE_TEXT: { "zh-CN": string; "en-US": string } = {
  "zh-CN": "是",
  "en-US": "Yes"
};

/**
 * 默认未激活文本
 * @description 默认的中英文未激活文本
 */
const DEFAULT_INACTIVE_TEXT: { "zh-CN": string; "en-US": string } = {
  "zh-CN": "否",
  "en-US": "No"
};

/**
 * 查找显示数据函数
 * @param data - 要查找的数据
 * @param options - 开关选项配置
 * @param language - 语言代码
 * @returns string 显示文本
 * @description 根据开关值和选项配置查找对应的显示文本
 */
export function findData(data: boolean | number | string, options: PaOptionType.Switch, language: string = "zh-CN"): string {
  /**
   * 基础选项配置
   * @description 合并默认配置和用户配置
   */
  const activeText = options?.activeText || DEFAULT_ACTIVE_TEXT[language] || DEFAULT_ACTIVE_TEXT["zh-CN"];
  const inActiveText = options?.inActiveText || DEFAULT_INACTIVE_TEXT[language] || DEFAULT_INACTIVE_TEXT["zh-CN"];
  const activeValue = options?.activeValue ?? true;
  const inActiveValue = options?.inActiveValue ?? false;

  if (data == activeValue) {
    return String(activeText);
  }
  if (data == inActiveValue) {
    return String(inActiveText);
  }
  return "--";
}
