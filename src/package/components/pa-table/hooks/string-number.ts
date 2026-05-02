/**
 * @description lodash 工具库
 */
import _ from "lodash";
const { isNil } = _;
/**
 * @description 宽度转换函数，将宽度转换为数字
 * @param value 宽度值
 * @returns 转换后的数字宽度值
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
 * @description 宽度转换函数，将宽度转换为字符串
 * @param value 宽度值
 * @returns 转换后的字符串宽度值
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
