import { isNil } from "lodash";

/**
 * #Function 宽度转换
 * @description 宽度转换，将宽度转换为数字或字符串
 * @param {string | number} value - 宽度值
 * @returns {string | number} - 转换后的宽度值
 */
function setWidthToNumber(value: number | string | undefined) {
  if (isNil(value)) {
    return 0;
  }
  if (typeof value == "string" && value.includes("px")) {
    return Number(value.replace("px", ""));
  }
  return Number(value);
}

/**
 * #Function 宽度转换
 * @description 宽度转换，将宽度转换为字符串
 * @param {string | number} value - 宽度值
 * @returns {string} - 转换后的宽度值
 */
function setWidthToString(value: number | string | undefined) {
  if (isNil(value)) {
    return undefined;
  }
  if (typeof value == "number") {
    return Number(value) + "px";
  }
  return setWidthToNumber(value) ? setWidthToNumber(value) + "px" : value;
}

export { setWidthToNumber, setWidthToString };
