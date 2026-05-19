/**
 * 模块导入
 * @description 导入选项类型定义
 */
import { LanguagePackageType, PaOptionType } from "../manager-type";

/**
 * 默认激活文本
 * @description 默认的中英文激活文本
 */
const DEFAULT_ACTIVE_TEXT: LanguagePackageType = {
  "zh-CN": "是",
  "en-US": "Yes"
};

/**
 * 默认未激活文本
 * @description 默认的中英文未激活文本
 */
const DEFAULT_INACTIVE_TEXT: LanguagePackageType = {
  "zh-CN": "否",
  "en-US": "No"
};
function findDataWithSelect(data, options, useTextByLink = false, languageValue = "zh-CN") {
  let text = "";
  if (!options?.length) return "--";

  if (Array.isArray(data)) {
    for (let I_index = 0; I_index < data.length; I_index++) {
      const row = data[I_index];
      for (let index = 0; index < options.length; index++) {
        const option = options[index];
        if (option.value == row) {
          const findText = (option?.label && typeof option?.label === "object" ? option?.label[languageValue] : option?.label) || "";
          text += findText + `${I_index < data.length - 1 ? "，" : ""}`;
        }
      }
    }
  } else {
    for (let index = 0; index < options.length; index++) {
      const option = options[index];
      if (option.value == data) {
        const findText = (option?.label && typeof option?.label === "object" ? option?.label[languageValue] : option?.label) || "";
        text += useTextByLink ? findParent(option, findText, languageValue) : findText;
      }
    }
  }
  return text || "--";
}

function findParent(item, findText, languageValue) {
  if (item?.parent) {
    const _findText = (typeof item.parent.label === "object" ? item.parent.label[languageValue] : item.parent.label) + " / " + findText;
    return findParent(item.parent, _findText, languageValue);
  }
  return findText;
}

/**
 * 查找显示数据函数
 * @param data - 要查找的数据
 * @param options - 开关选项配置
 * @param language - 语言代码
 * @returns string 显示文本
 * @description 根据开关值和选项配置查找对应的显示文本
 */
function findDataWidthSwitch(data: boolean | number | string, options: PaOptionType.Switch, language: string = "zh-CN"): string {
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

export { findDataWithSelect, findDataWidthSwitch };
