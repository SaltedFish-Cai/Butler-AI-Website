import { PaOptionType } from "M_Types";

import _ from "lodash";
const { isNil } = _;

export function findData(data, options: PaOptionType.SelectList) {
  // SSR-safe: check if window exists
  const language = typeof window !== "undefined" 
    ? window.PancakeGlobalConfig?.language || "zh-CN"
    : "zh-CN";

  let text = "";
  if (!options?.length) return "--";
  if (Array.isArray(data)) {
    for (let I_index = 0; I_index < data.length; I_index++) {
      const row = data[I_index];
      for (let index = 0; index < options.length; index++) {
        const option = options[index];
        if (option.value == row) {
          text +=
            (typeof option.label == "string" ? option.label : option.label[language]) +
            `${I_index < data.length - 1 ? "，" : ""}`;
        }
      }
    }
  } else if (!isNil(data) && data != "") {
    for (let index = 0; index < options.length; index++) {
      const option = options[index];
      if (option.value == data) {
        text += typeof option.label == "string" ? option.label : option.label[language];
      }
    }
  }
  return text;
}
