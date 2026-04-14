// 补充 TypeScript 类型声明，增强输入校验
function isDarkColor(color: string): boolean {
  let r: number, g: number, b: number;

  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    // 校验十六进制长度（仅支持 3/6 位）
    if (![3, 6].includes(hex.length)) return false;

    if (hex.length === 3) {
      // 短格式转换（如 #abc → #aabbcc）
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      // 标准 6 位格式
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
  } else if (color.startsWith("rgb")) {
    // 提取 rgb 数值（兼容 rgb(255, 255, 255) 或 rgb(255,255,255) 格式）
    const rgbValues = color.match(/\d+/g)?.map(Number);
    if (!rgbValues || rgbValues.length !== 3) return false; // 校验 rgb 数值有效性
    [r, g, b] = rgbValues;
  } else {
    return false; // 不支持的颜色格式
  }

  // 校验 RGB 分量是否在有效范围（0-255）
  if ([r, g, b].some(v => v < 0 || v > 255)) return false;

  // 计算亮度并判断（阈值 192 可根据需求调整）
  const value = 0.299 * r + 0.587 * g + 0.114 * b;
  return value < 192;
}

export default isDarkColor;
