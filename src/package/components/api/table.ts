// # Import
import { useBaseStore as globalState } from "../store/index";

// #Function 获取字典(链接关系)
export async function GetConditionals(useType: "group" | "link", params?: objectType) {
  const useGlobalState = globalState();

  let API = useGlobalState.getTableConfig?.advancedQueryApi;

  if (useType == "group") {
    API = useGlobalState.getTableConfig?.groupAdvancedQueryApi;
  }

  if (typeof API == "object") {
    return API;
  } else if (typeof API == "function") {
    return API(params);
  } else {
    return [];
  }
}
