import { dictType } from "./type";
import { GetDictionariesAll } from "./dictionaries-fn";
import { MOptionType } from "MTypes";
import { useBaseStore } from "../store/index";

// #Function 字典方法入口
async function dictionariesAll(value: dictType[]) {
  const options: { [x: string]: MOptionType.Select[] } = {};
  if (!Array.isArray(value)) return options;
  const _keyMap = JSON.parse(JSON.stringify(value));
  const globalState = useBaseStore();
  const language = globalState.getLanguage;
  const data = await GetDictionariesAll(_keyMap);

  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    options[item.Key] = [];
    for (let i = 0; i < item.Values.length; i++) {
      const it = item.Values[i];
      const Description = language == "zh-CN" ? it.Description : it.DescriptionEn || it.Description;
      options[item.Key].push({
        label: Description || it.Label,
        value: !isNaN(Number(it.Value)) ? Number(it.Value) : it.Value,
        tagStyle: { bgColor: it.Color },
        base: item
      });
    }
  }
  return options;
}

export default dictionariesAll;
