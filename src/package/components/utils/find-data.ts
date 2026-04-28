export function findData(data, options, useTextByLink = false, languageValue = "zh-CN") {
  let text = "";
  if (!options?.length) return "--";

  if (Array.isArray(data)) {
    for (let I_index = 0; I_index < data.length; I_index++) {
      const row = data[I_index];
      for (let index = 0; index < options.length; index++) {
        const option = options[index];
        if (option.value == row) {
          const findText =
            (option?.label && typeof option?.label === "object" ? option?.label[languageValue] : option?.label) || "";
          text += findText + `${I_index < data.length - 1 ? "，" : ""}`;
        }
      }
    }
  } else {
    for (let index = 0; index < options.length; index++) {
      const option = options[index];
      if (option.value == data) {
        const findText =
          (option?.label && typeof option?.label === "object" ? option?.label[languageValue] : option?.label) || "";
        text += useTextByLink ? findParent(option, findText, languageValue) : findText;
      }
    }
  }
  return text || "--";
}

function findParent(item, findText, languageValue) {
  if (item?.parent) {
    const _findText =
      (typeof item.parent.label === "object" ? item.parent.label[languageValue] : item.parent.label) + " / " + findText;
    return findParent(item.parent, _findText, languageValue);
  }
  return findText;
}
