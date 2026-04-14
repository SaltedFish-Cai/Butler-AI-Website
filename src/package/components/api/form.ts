import lodashPkg from "lodash";
import { useBaseStore as globalState } from "../store/index";

// #Function 获取字典（地址）
export async function GetSystemAddressMap() {
  const useGlobalState = globalState();
  const KEY = "SystemDictionary-AddressMap";
  const data = useGlobalState.getDictionary(KEY);
  const { cloneDeep } = lodashPkg;
  const language = useGlobalState.getLanguage || "zh-CN";
  if (data) {
    const _data = cloneDeep(data);
    return _data;

    let isSuccess = true;
    const exData = _data.map(item => {
      if (!item.base?.languageLabel?.[language]) isSuccess = false;
      return {
        ...item,
        label: item.base?.languageLabel?.[language]
      };
    });
    if (isSuccess) {
      return exData;
    }
  } else {
    const API = useGlobalState.getFormConfig?.addressApi;

    if (typeof API == "object") {
      useGlobalState.setDictionary(KEY, API as any);
      return API;
    } else if (typeof API == "function") {
      const data: any = await API();
      useGlobalState.setDictionary(KEY, data);
      return data;
    } else {
      return [];
    }
  }
}
