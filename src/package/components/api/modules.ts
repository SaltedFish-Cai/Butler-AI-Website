// # Import
import http from "../api/index";
import { useBaseStore as globalState } from "../store/index";
import { ReqDictionaryParams } from "./type";
import { dictType } from "../tools/type";
import { MOptionType } from "MTypes";

// #Function 获取表字典方法
export async function GetTableDictionaryByCondition(params: ReqDictionaryParams, options?: { noStore: boolean }) {
  const useGlobalState = globalState();
  const FILTER = params.filter;
  let KEY = "";
  for (let index = 0; index < FILTER.length; index++) {
    const element = FILTER[index];
    KEY += `${element.fieldName}-${element.fieldValue}-`;
  }
  const data: MOptionType.Select[] | undefined = useGlobalState.getDictionary(KEY);
  const _params = {
    page: {},
    params: {},
    sort: [],
    ...params
  };

  if (data && data?.length && !options?.noStore) {
    return data;
  } else {
    const apiBaseUrl = useGlobalState.getApiBaseUrl;
    const url = apiBaseUrl + "/newapi/TableDictionary/GetTableDictionaryByCondition";
    const type = "post";

    if (url) {
      const { Data, Code } = await http[type || "get"](url, _params);
      if (Code == 200) {
        useGlobalState.setDictionary(KEY, Data.List);
        // useGlobalState.setDictionaryTimeout(timeOut);
        return Data.List;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
}

// #Function 系统字典方法
export async function GetDictionariesByKeys(params: objectType, options?: { noStore: boolean }) {
  const useGlobalState = globalState();
  const KEY = params.keys;
  const data: MOptionType.Select[] | undefined = useGlobalState.getDictionary(KEY);
  if (data && data?.length && !options?.noStore) {
    return data;
  } else {
    const apiBaseUrl = useGlobalState.getApiBaseUrl;
    const url = apiBaseUrl + "/newapi/SystemDictionary/GetDictionariesByKeys";
    const type = "get";
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

// #Function 字典合集方法
export async function GetDictionariesByAll(params: dictType[]) {
  const useGlobalState = globalState();
  const result: any[] = [];
  for (const element of params) {
    const KEY = "ByAll" + element.dictionaryType + "_" + element.key;
    const data: MOptionType.Select[] | undefined = useGlobalState.getDictionary(KEY);
    if (data) {
      result.push(data);
    } else {
      result.length = 0;
    }
  }
  if (!result.length || params.length != result.length) {
    const apiBaseUrl = useGlobalState.getApiBaseUrl;
    const url = apiBaseUrl + "/newapi/Common/GetDictionarys";
    const type = "post";
    if (url) {
      const { Data, Code } = await http[type || "get"](url, params);
      if (Code == 200) {
        for (const element of Data) {
          const key = "ByAll" + element.DictionaryType + "_" + element.Key;
          useGlobalState.setDictionary(key, element);
        }
        return Data;
      } else {
        return [];
      }
    } else {
      return [];
    }
  } else {
    return result;
  }
}
