import inBrowser from "../tools/inBrowser";

/**
 * @description hex颜色转rgb颜色
 * @param {String} str 颜色值字符串
 * @returns {String} 返回处理后的颜色值
 */
export function hexToRgb(str: any) {
  let hexs: any = "";
  const reg = /^\#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(str)) return console.warn("输入错误的hex");
  str = str.replace("#", "");
  hexs = str.match(/../g);
  for (let i = 0; i < 3; i++) hexs[i] = parseInt(hexs[i], 16);
  return hexs;
}

/**
 * @description rgb颜色转Hex颜色
 * @param {*} r 代表红色
 * @param {*} g 代表绿色
 * @param {*} b 代表蓝色
 * @returns {String} 返回处理后的颜色值
 */
export function rgbToHex(r: any, g: any, b: any) {
  const reg = /^\d{1,3}$/;
  if (!reg.test(r) || !reg.test(g) || !reg.test(b)) {
    console.error("输入错误的rgb颜色值");
    return "";
  }
  const hexs = [r.toString(16), g.toString(16), b.toString(16)];
  for (let i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = `0${hexs[i]}`;
  return `#${hexs.join("")}`;
}

/**
 * @description 加深颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export function getDarkColor(color: string, level: number): string {
  const reg = /^\#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(color)) {
    console.error("输入错误的hex颜色值");
    return "";
  }
  const rgb = hexToRgb(color);
  for (let i = 0; i < 3; i++) rgb[i] = Math.round(20.5 * level + rgb[i] * (1 - level));
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

/**
 * @description 变浅颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export function getLightColor(color: string, level: number): string {
  const reg = /^\#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(color)) {
    console.error("输入错误的hex颜色值");
    return "";
  }
  const rgb = hexToRgb(color);
  for (let i = 0; i < 3; i++) rgb[i] = Math.round(255 * level + rgb[i] * (1 - level));
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

// #Function 设置主题色
export function setThemeColor(themeColor?: string, isDark?: boolean) {
  if (!inBrowser || !themeColor) return;

  const style = (typeof window !== "undefined" && window.document?.documentElement.style) || null;
  const classList = (typeof window !== "undefined" && window.document?.documentElement.classList) || null;

  classList?.toggle("pa-content", true);
  classList?.toggle("light", true);
  classList?.toggle("dark", isDark);

  const THEME_COLOR = themeColor;
  // const INFO_COLOR = "#909399";
  // const SUCCESS_COLOR = "#67c23a";
  // const WARNING_COLOR = "#e6a23c";
  // const DANGER_COLOR = "#f56c6c";
  // const DEFAULT_COLOR = "#909399";

  const LIGHT_COLOR_MAP = {};

  const DARK_COLOR_MAP = {};

  const BASE_COLOR_MAP = {
    "--pa-color-primary": THEME_COLOR
  };

  const COLORS = { ...BASE_COLOR_MAP, ...(isDark ? DARK_COLOR_MAP : LIGHT_COLOR_MAP) };
  for (const key in COLORS) {
    style?.setProperty(key, COLORS[key]);
  }

  for (let i = 1; i <= 9; i++) {
    const primaryColor = isDark ? `${getDarkColor(THEME_COLOR, i / 10)}` : `${getLightColor(THEME_COLOR, i / 10)}`;
    style?.setProperty(`--pa-color-primary-light-${i}`, primaryColor);
  }
}
