// # Import
import { SaltedGlobalConfigType } from "../sa-content/type";

/**
 * @description 获取字典(链接关系)
 * @param config 全局配置
 * @param useType 使用类型
 * @param params 参数
 * @returns 字典(链接关系)
 */
export async function GetConditionals(config: SaltedGlobalConfigType, useType: "group" | "link", params?: objectType) {
  let API = config?.table_config?.advancedQueryApi;

  if (useType == "group") {
    API = config?.table_config?.groupAdvancedQueryApi;
  }

  if (typeof API == "object") {
    return API;
  } else if (typeof API == "function") {
    return API(params);
  } else {
    return [];
  }
}
