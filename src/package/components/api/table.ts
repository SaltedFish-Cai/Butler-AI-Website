// # Import
import { MOptionType } from "MTypes";
import http from "../api/index";
import { useBaseStore as globalState } from "../store/index";

// #Function 获取字典(链接关系)
export async function GetConditionals(useType: "group" | "link", params?: objectType) {
  const useGlobalState = globalState();
  let KEY = "SystemDictionary-GetConditionals";
  if (useType == "group") KEY = "SystemDictionary-GetGroupConditionals";

  const data: MOptionType.Select[] | undefined = useGlobalState.getDictionary(KEY);
  if (data) {
    return data;
  } else {
    let url = useGlobalState.getTableConfig?.advancedQueryApi?.url;
    let type = useGlobalState.getTableConfig?.advancedQueryApi?.type;

    if (useType == "group") {
      url = useGlobalState.getTableConfig?.groupAdvancedQueryApi?.url;
      type = useGlobalState.getTableConfig?.groupAdvancedQueryApi?.type;
    }

    if (url) {
      const { Data, Code } = await http[type || "get"](url, params);
      if (Code == 200) {
        useGlobalState.setDictionary(KEY, Data);
        return Data;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
}
