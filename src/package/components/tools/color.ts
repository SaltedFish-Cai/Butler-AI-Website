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

  const style = window.document?.documentElement.style || null;
  const classList = window.document?.documentElement.classList || null;

  classList?.toggle("m-manager-v2", true);
  classList?.toggle("light", true);
  classList?.toggle("dark", isDark);

  const THEME_COLOR = themeColor;
  // const INFO_COLOR = "#909399";
  // const SUCCESS_COLOR = "#67c23a";
  // const WARNING_COLOR = "#e6a23c";
  // const DANGER_COLOR = "#f56c6c";
  // const DEFAULT_COLOR = "#909399";

  const LIGHT_COLOR_MAP = {
    // "--m-bg-color": "#ffffff",
    // "--m-border-color": "#dcdfe6",
    // "--m-font-color": "#606266",
    // "--m-scrollbar-color": "#e4e7ed",
    // "--m-scrollbar-thumb-color": "#909399",
    // "--m-overlay-v2-color-lighter": "rgba(0,0,0,0.5)",
    // "--m-send-bg-color-lighter": "#f5f7fa",
    // "--m-hover-color-lighter": "#c0c4cc",
    // V2
    // "--m-color-v2-font": "#606266",
    // "--m-color-v2-cell-bg": "#f9f8fd",
    // "--m-color-v2-send-bg": "#f5f7fa",
    // "--m-color-v2-border": "#dcdfe6"
  };

  const DARK_COLOR_MAP = {
    // "--m-bg-color": "#282828",
    // "--m-border-color": "#4C4D4F",
    // "--m-font-color": "#bdbdc0",
    // "--m-scrollbar-color": "#414243",
    // "--m-scrollbar-thumb-color": "#A3A6AD",
    // "--m-overlay-v2-color-lighter": "rgba(0,0,0,0.5)",
    // "--m-send-bg-color-lighter": "#3c3c3c",
    // "--m-hover-color-lighter": "#6C6E72",
    // V2
    // "--m-color-v2-font": "#bdbdc0",
    // "--m-color-v2-cell-bg": "#f9f8fd",
    // "--m-color-v2-send-bg": "#f9f8fd",
    // "--m-color-v2-border": "#4C4D4F"
  };

  const BASE_COLOR_MAP = {
    // "--m-font-color-light": "#606266",
    // "--m-font-color-dark": "#bdbdc0",
    // "--m-font-color-white": "#ffffff",
    // "--m-font-color-black": "#000000",

    "--el-color-primary": THEME_COLOR,
    "--m-color-primary": THEME_COLOR,
    "--m-color-v2-primary": THEME_COLOR

    // "--m-color-info": INFO_COLOR,
    // "--m-color-success": SUCCESS_COLOR,
    // "--m-color-warning": WARNING_COLOR,
    // "--m-color-danger": DANGER_COLOR,
    // "--m-color-default": DEFAULT_COLOR,

    // "--m-color-v2-info": INFO_COLOR,
    // "--m-color-v2-success": SUCCESS_COLOR,
    // "--m-color-v2-warning": WARNING_COLOR,
    // "--m-color-v2-danger": DANGER_COLOR,
    // "--m-color-v2-default": DEFAULT_COLOR
  };

  const COLORS = { ...BASE_COLOR_MAP, ...(isDark ? DARK_COLOR_MAP : LIGHT_COLOR_MAP) };
  for (const key in COLORS) {
    style?.setProperty(key, COLORS[key]);
  }

  style?.setProperty(
    "--el-color-primary-dark-2",
    isDark ? `${getLightColor(themeColor, 0.2)}` : `${getDarkColor(themeColor, 0.3)}`
  );

  for (let i = 1; i <= 9; i++) {
    // const infoColor = isDark ? `${getDarkColor(INFO_COLOR, i / 10)}` : `${getLightColor(INFO_COLOR, i / 10)}`;
    // style?.setProperty(`--el-color-info-light-${i}`, infoColor);
    // style?.setProperty(`--m-color-info-light-${i}`, infoColor);
    // style?.setProperty(`--m-color-v2-info-light-${i}`, infoColor);

    // const successColor = isDark ? `${getDarkColor(SUCCESS_COLOR, i / 10)}` : `${getLightColor(SUCCESS_COLOR, i / 10)}`;
    // style?.setProperty(`--el-color-success-light-${i}`, successColor);
    // style?.setProperty(`--m-color-success-light-${i}`, successColor);
    // style?.setProperty(`--m-color-v2-success-light-${i}`, successColor);

    // const warningColor = isDark ? `${getDarkColor(WARNING_COLOR, i / 10)}` : `${getLightColor(WARNING_COLOR, i / 10)}`;
    // style?.setProperty(`--el-color-warning-light-${i}`, warningColor);
    // style?.setProperty(`--m-color-warning-light-${i}`, warningColor);
    // style?.setProperty(`--m-color-v2-warning-light-${i}`, warningColor);

    // const dangerColor = isDark ? `${getDarkColor(DANGER_COLOR, i / 10)}` : `${getLightColor(DANGER_COLOR, i / 10)}`;
    // style?.setProperty(`--el-color-danger-light-${i}`, dangerColor);
    // style?.setProperty(`--m-color-danger-light-${i}`, dangerColor);
    // style?.setProperty(`--m-color-v2-danger-light-${i}`, dangerColor);

    const primaryColor = isDark ? `${getDarkColor(THEME_COLOR, i / 10)}` : `${getLightColor(THEME_COLOR, i / 10)}`;
    style?.setProperty(`--el-color-primary-light-${i}`, primaryColor);
    style?.setProperty(`--m-color-primary-light-${i}`, primaryColor);
    style?.setProperty(`--m-color-v2-primary-light-${i}`, primaryColor);

    // const defaultColor = isDark ? `${getDarkColor(themeColor, i / 10)}` : `${getLightColor("#909399", i / 10)}`;
    // style?.setProperty(`--el-color-default-light-${i}`, defaultColor);
    // style?.setProperty(`--m-color-default-light-${i}`, defaultColor);
    // style?.setProperty(`--m-color-v2-default-light-${i}`, defaultColor);
  }
}
