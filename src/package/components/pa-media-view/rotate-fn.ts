/**
 * 样式字符串转对象工具
 * @description 将 CSS 样式字符串解析为对象，便于操作
 * @param styleString - CSS 样式字符串
 * @returns 解析后的样式对象
 */
export function convertStyleStringToObject(styleString: string | null): Record<string, string> {
  const styleObject: Record<string, string> = {};
  if (!styleString) return styleObject;
  const properties = styleString.split(";").filter(prop => prop.trim() !== "");

  properties.forEach(prop => {
    const [key, value] = prop.split(":").map(item => item.trim());
    if (key && value) {
      styleObject[key] = value;
    }
  });
  return styleObject;
}

/**
 * 样式对象转字符串工具
 * @description 将样式对象转换为 CSS 样式字符串
 * @param styleObject - 样式对象
 * @returns CSS 样式字符串
 */
export function objectToStyleString(styleObject: Record<string, number | string>): string {
  let styleString = "";
  for (const key in styleObject) {
    if (Object.prototype.hasOwnProperty.call(styleObject, key)) {
      const value = styleObject[key];
      styleString += `${key}: ${typeof value === "number" ? value + "px" : value}; `;
    }
  }
  return styleString.trim();
}

/**
 * 当前旋转目标元素
 * @description 记录当前需要旋转的 DOM 元素
 */
let targetEl: HTMLElement | null = null;

/**
 * 旋转元素
 * @param id - 元素ID
 * @param type - 旋转类型 (1: 左旋转90度, 2: 右旋转90度, 3: 左右翻转, 4: 上下翻转)
 * @returns void
 * @description 根据类型对元素进行旋转变换
 */
export function left90(id: string, type: number): void {
  if (targetEl) {
    const style = targetEl.getAttribute("style");
    const styleObject = convertStyleStringToObject(style);
    if (type === 1) {
      styleObject["--rotate-Z"] = Number(styleObject["--rotate-Z"]?.replace(/(px|deg)/g, "") || 0) + 90 + "deg";
      styleObject["--rotate-Index"] =
        (Number(styleObject["--rotate-Index"]?.replace(/(px|deg)/g, "") || 1) + 1 > 4 ? 1 : Number(styleObject["--rotate-Index"]?.replace(/(px|deg)/g, "") || 1) + 1) + "px";
    } else if (type === 2) {
      styleObject["--rotate-Z"] = Number(styleObject["--rotate-Z"]?.replace(/(px|deg)/g, "") || 0) - 90 + "deg";
      styleObject["--rotate-Index"] =
        (Number(styleObject["--rotate-Index"]?.replace(/(px|deg)/g, "") || 1) + 1 > 4 ? 1 : Number(styleObject["--rotate-Index"]?.replace(/(px|deg)/g, "") || 1) + 1) + "px";
    } else if (type === 3) {
      styleObject["--rotate-Y"] = Number(styleObject["--rotate-Y"]?.replace(/(px|deg)/g, "") || 0) - 180 + "deg";
    } else if (type === 4) {
      styleObject["--rotate-X"] = Number(styleObject["--rotate-X"]?.replace(/(px|deg)/g, "") || 0) - 180 + "deg";
    }

    targetEl.setAttribute("style", objectToStyleString(styleObject));
  }
  setItemTop(id);
}

/**
 * 鼠标右键释放事件处理
 * @param e - 鼠标事件
 * @param backFn - 回调函数
 * @returns boolean
 * @description 处理鼠标右键点击事件，设置目标元素并触发回调
 */
export function mouseUp(e: MouseEvent, backFn: (e: MouseEvent) => void): boolean {
  targetEl = e.target as HTMLElement;
  e.preventDefault();
  if (e.button === 2) {
    setTimeout(() => {
      backFn(e);
    }, 20);
  }
  return false;
}

/**
 * 将所有页面旋转90度
 * @param id - 元素ID
 * @returns void
 * @description 遍历容器内所有元素并执行90度旋转
 */
export function leftAll90(id: string): void {
  const el = document.getElementById(id);
  if (el) {
    const container = el.querySelectorAll(id.indexOf("pdf") < 0 ? ".image-wrapper" : ".pageContainer");
    const style = (container[0] as HTMLElement).getAttribute("style");
    for (let i = 0; i < container.length; i++) {
      const item = container[i] as HTMLElement;
      const styleObject = convertStyleStringToObject(style);
      styleObject["--rotate-Z"] = Number(styleObject["--rotate-Z"]?.replace(/(px|deg)/g, "") || 0) + 90 + "deg";
      styleObject["--rotate-Index"] =
        (Number(styleObject["--rotate-Index"]?.replace(/(px|deg)/g, "") || 1) + 1 > 4 ? 1 : Number(styleObject["--rotate-Index"]?.replace(/(px|deg)/g, "") || 1) + 1) + "px";
      item.setAttribute("style", objectToStyleString(styleObject));
    }
  }
  setItemTop(id);
}

/**
 * 设置元素位置尺寸
 * @param id - 元素ID
 * @returns void
 * @description 根据旋转角度调整元素的宽高尺寸
 */
export function setItemTop(id: string): void {
  const el = document.getElementById(id);
  if (el) {
    const container = el.querySelectorAll(id.indexOf("pdf") < 0 ? ".image-wrapper" : ".pageContainer");
    const containerImg = el.querySelectorAll(id.indexOf("pdf") < 0 ? ".image-wrapper img" : ".pageContainer img");

    for (let i = 0; i < containerImg.length; i++) {
      const item = container[i] as HTMLElement;
      const style = item.getAttribute("style");
      const styleObject = convertStyleStringToObject(style);
      const { clientWidth, clientHeight } = containerImg[i] as HTMLElement;
      if (styleObject["--rotate-Index"] === "2px" || styleObject["--rotate-Index"] === "4px") {
        styleObject["--position-width"] = clientHeight + "px";
        styleObject["--position-height"] = clientWidth + "px";
      } else {
        styleObject["--position-width"] = clientWidth + "px";
        styleObject["--position-height"] = clientHeight + "px";
      }
      item.setAttribute("style", objectToStyleString(styleObject));
    }
  }
}
