import { GetDictionariesByKeys, GetTableDictionaryByCondition, GetDictionariesByAll } from "../api/modules";
import { dictType, systemParamsType, tableParamsType } from "./type";

// #Function 表格字典
async function GetTableDictionaries(key: string[], params?: tableParamsType[]) {
  let filter: tableParamsType[] = [];
  if (!key) return [];
  if (params) {
    filter = params;
  } else {
    filter = [
      {
        fieldName: "TableName",
        fieldValue: key[0],
        conditionalType: "Equal"
      }
    ];
    if (key[1]) {
      filter.push({
        fieldName: "ColumnName",
        fieldValue: key[1],
        conditionalType: "Equal"
      });
    }
  }

  const List = await GetTableDictionaryByCondition({ filter });
  return List;
}

// #Function 系统字典
async function GetSystemDictionaries(key: string[], params?: systemParamsType) {
  let _params = { keys: key[0] };
  if (params) {
    _params = params;
  }
  const List = await GetDictionariesByKeys(_params);
  return List;
}

async function GetDictionariesAll(params: dictType[]) {
  const List = await GetDictionariesByAll(params);
  return List;
}

export { GetTableDictionaries, GetSystemDictionaries, GetDictionariesAll };
