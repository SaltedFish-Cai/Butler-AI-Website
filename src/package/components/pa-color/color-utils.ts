/**
 * 颜色工具函数模块
 * @description 提供颜色转换的公共工具函数
 */

/**
 * 十六进制颜色正则
 * @description 用于验证十六进制颜色格式
 */
const HEX_COLOR_REG = /^#([0-9A-Fa-f]{3}){1,2}$/;
/**
 * RGB/RGBA 解析正则
 * @description 用于解析 rgb() 和 rgba() 颜色格式
 */
const RGB_REG = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i;
/**
 * HEX 转 RGB 解析正则（预编译）
 * @description 用于解析 #RRGGBB 和 RRGGBB 格式
 */
const HEX_RGB_REG = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

/**
 * 判断是否为十六进制颜色
 * @param color - 颜色字符串
 * @returns boolean 是否为有效的十六进制颜色
 */
export function isHexColor(color: string): boolean {
  return HEX_COLOR_REG.test(color);
}

/**
 * 十六进制转 RGB
 * @param hex - 十六进制颜色值
 * @returns { r: number; g: number; b: number } | null RGB 对象或 null
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = HEX_RGB_REG.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

/**
 * RGB 转十六进制（使用查表法优化）
 * @param r - 红色值
 * @param g - 绿色值
 * @param b - 蓝色值
 * @returns string 十六进制颜色值
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * HSV 转 RGB
 * @param h - 色相值
 * @param s - 饱和度值
 * @param v - 明度值
 * @returns { r: number; g: number; b: number } RGB 对象
 */
export function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  h = h / 360;
  s = s / 100;
  v = v / 100;
  let r: number, g: number, b: number;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

/**
 * RGB 转 HSV
 * @param r - 红色值
 * @param g - 绿色值
 * @param b - 蓝色值
 * @returns { h: number; s: number; v: number } HSV 对象
 */
export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

/**
 * 解析颜色字符串获取 RGB 和 Alpha
 * @param color - 颜色字符串
 * @returns { r: number; g: number; b: number; alpha: number } | null RGB 和透明度对象或 null
 */
export function parseColorToRgb(color: string): { r: number; g: number; b: number; alpha: number } | null {
  if (color.startsWith("rgba") || color.startsWith("rgb(")) {
    const match = RGB_REG.exec(color);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        alpha: match[4] !== undefined ? parseFloat(match[4]) : 1
      };
    }
  }
  return null;
}
