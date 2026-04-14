import { isNil } from "lodash";

// 处理小数精度（避免四舍五入）
export function handlePrecision(value, precision, round = false) {
  if (value === "" || value === "-" || precision === undefined) {
    return value;
  }

  // 直接处理字符串，避免parseFloat的精度问题
  let valueStr = String(value);

  // 检查是否为有效数字格式（数字、小数点、负号）
  if (!/^-?\d*\.?\d*$/.test(valueStr)) {
    return value;
  }

  // 处理小数精度
  if (precision >= 0) {
    const decimalIndex = valueStr.indexOf(".");

    if (decimalIndex !== -1) {
      const integerPart = valueStr.substring(0, decimalIndex);
      let decimalPart = valueStr.substring(decimalIndex + 1);

      if (decimalPart.length > precision) {
        if (round) {
          // 四舍五入处理
          const num = parseFloat(valueStr);
          const factor = Math.pow(10, precision);
          value = String(Math.round(num * factor) / factor);
        } else {
          // 截断小数部分
          decimalPart = decimalPart.substring(0, precision);
          value = integerPart + "." + decimalPart;
        }
      }
    } else {
      if (precision > 0) valueStr = valueStr + ".";
      // 没有小数点但需要四舍五入，直接返回原值
      while (precision-- > 0) {
        valueStr += "0";
      }
      value = valueStr;
    }
  }
  return value;
}

// # Function 加小数点
function keepDecimal(_numStr, precision) {
  const numStr = _numStr < 0 ? String(0 - _numStr) : String(_numStr);
  const regexp = new RegExp(`^\\d+(?:\\.\\d{0,${precision}})?`);
  const result = numStr.match(regexp);
  return result ? (_numStr < 0 ? String(0 - Number(result[0])) : result[0]) : "0";
}

// # Function 加数字分号
function numberWithCommas(numStr, precision) {
  const _numStr = numStr.toString();
  const _numStrArr = _numStr.split(".");
  let x = _numStrArr[0];
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  return precision > 0 ? [x, _numStrArr[1]].join(".") : x;
}

// # Function 设置数字格式
export function keepDecimalPlaces(numStr, precision) {
  if (isNil(numStr)) return "--";
  let numberStr = keepDecimal(numStr, precision);
  let rs = numberStr.indexOf(".");

  if (precision == undefined) return (numberStr = numberStr.split(".")[0]);

  if (precision == 0) {
    return numberWithCommas((numberStr = numberStr.split(".")[0]), precision);
  }
  if (rs < 0 && precision > 0) {
    rs = numberStr.length;
    numberStr += ".";
  }
  while (numberStr.length <= rs + precision) {
    numberStr += "0";
  }
  return numberWithCommas(numberStr, precision);
}
