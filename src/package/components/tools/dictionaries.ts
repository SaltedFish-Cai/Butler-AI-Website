// # Import
import { systemParamsType, tableParamsType } from "./type";
import { useBaseStore as globalState } from "../store/index";
import lodashPkg from "lodash";
import { GetTableDictionaries, GetSystemDictionaries } from "./dictionaries-fn";
import { MOptionType } from "MTypes";

// #Function 字典方法入口
async function dictionaries(
  type: "system" | "table",
  key: string[],
  params?: systemParamsType | tableParamsType[]
): Promise<MOptionType.Select[]> {
  const useGlobalState = globalState();
  const { cloneDeep } = lodashPkg;

  const options: MOptionType.Select[] = [];

  let KEY = "";
  if (key) {
    KEY = type + "_" + key.join("_");
  }
  const data = useGlobalState.getDictionary(KEY);
  // const timeOut = new Date().getTime();
  // const oldTime = useGlobalState.getDictionaryTimeout;
  // const MAX_TIME_OUT = useGlobalState.getDictionaryMaxTime;

  const language = useGlobalState.getLanguage || "zh-CN";

  if (Array.isArray(data)) {
    const _data = cloneDeep(data);
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
  }
  if (type == "system") {
    const data = await GetSystemDictionaries(key, params as systemParamsType);
    if (!data || data?.length == 0) {
      return options;
    }
    for (let index = 0; index < data[key[0]].length; index++) {
      const item = data[key[0]][index];
      // const Description =
      //   language == "zh-CN"
      //     ? item.Description || item.DictionaryKey
      //     : item.DescriptionEn || item.Description || item.DictionaryKey;
      const Description = language == "zh-CN" ? item.Description : item.DescriptionEn;

      options.push({
        label: Description,
        value: !isNaN(Number(item.Value)) ? Number(item.Value) : item.Value,
        tagStyle: { bgColor: item.Color },
        base: {
          ...item,
          languageLabel: {
            "zh-CN": item.Description,
            "en-US": item.DescriptionEn
          }
        }
      });
    }
  } else {
    const data = await GetTableDictionaries(key, params as tableParamsType[]);
    if (!data || data?.length == 0) {
      return options;
    }
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      // const Description = language == "zh-CN" ? item.Description || item.Key : item.DescriptionEn || item.Description || item.Key;
      const Description = language == "zh-CN" ? item.Description : item.DescriptionEn;
      options.push({
        label: Description,
        value: !isNaN(Number(item.Value)) ? Number(item.Value) : item.Value,
        tagStyle: { bgColor: item.Color },
        base: {
          ...item,
          languageLabel: {
            "zh-CN": item.Description,
            "en-US": item.DescriptionEn
          }
        }
      });
    }
  }

  if (KEY) {
    useGlobalState.setDictionary(KEY, options);
    // useGlobalState.setDictionaryTimeout(timeOut);
  }

  return cloneDeep(options);
}

export default dictionaries;
