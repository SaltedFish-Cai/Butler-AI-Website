export function findData(data, options, language) {
  const baseOptions = {
    activeText: options?.activeText || (language == "zh-CN" ? "是" : "Yes"),
    inActiveText: options?.inActiveText || (language == "zh-CN" ? "否" : "No"),
    activeValue: options?.activeValue || true,
    inActiveValue: options?.inActiveValue || false
  };
  let text = "";
  const _options = [
    { label: baseOptions.activeText, value: baseOptions.activeValue },
    { label: baseOptions.inActiveText, value: baseOptions.inActiveValue }
  ];
  for (let index = 0; index < _options.length; index++) {
    const option = _options[index];
    if (option.value == data) {
      text += option.label;
    }
  }
  return text || "--";
}
