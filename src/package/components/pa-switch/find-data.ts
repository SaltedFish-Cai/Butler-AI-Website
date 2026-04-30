/**
 * **模块导入**
 * @description 导入选项类型定义
 * */
import { LanguagePackageType, PaOptionType } from "../manager-type";

/**
 * **查找显示数据函数**
 * @param `data` `boolean | number | string` 要查找的数据
 * @param `options` `PaOptionType.Switch` 开关选项配置
 * @param `language` `string` 语言代码
 * @returns `string` 显示文本
 * @description 根据开关值和选项配置查找对应的显示文本
 * */
export function findData(data: boolean | number | string, options: PaOptionType.Switch, language: string = "zh-CN"): string {
  /**
   * **基础选项配置**
   * @type `{ activeText: string; inActiveText: string; activeValue: boolean | number | string; inActiveValue: boolean | number | string }`
   * @description 合并默认配置和用户配置
   * */
  const baseOptions: {
    activeText: LanguagePackageType | string;
    inActiveText: LanguagePackageType | string;
    activeValue: boolean | number | string;
    inActiveValue: boolean | number | string;
  } = {
    activeText: options?.activeText || (language == "zh-CN" ? "是" : "Yes"),
    inActiveText: options?.inActiveText || (language == "zh-CN" ? "否" : "No"),
    activeValue: options?.activeValue || true,
    inActiveValue: options?.inActiveValue || false
  };

  let text: string = "";
  const _options: Array<{ label: LanguagePackageType | string; value: boolean | number | string }> = [
    { label: baseOptions.activeText, value: baseOptions.activeValue },
    { label: baseOptions.inActiveText, value: baseOptions.inActiveValue }
  ];
  for (let index: number = 0; index < _options.length; index++) {
    const option: { label: LanguagePackageType | string; value: boolean | number | string } = _options[index];
    if (option.value == data) {
      text += option.label;
    }
  }
  return text || "--";
}
