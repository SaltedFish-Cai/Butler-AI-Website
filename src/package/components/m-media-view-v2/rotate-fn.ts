// 将样式字符串转换为对象
export function convertStyleStringToObject(styleString) {
  const styleObject = {};
  const properties = styleString.split(";").filter(prop => prop.trim() !== "");

  properties.forEach(prop => {
    const [key, value] = prop.split(":").map(item => item.trim());
    if (key && value) {
      styleObject[key] = value;
    }
  });
  return styleObject;
}

// 将对象转换为样式字符串
export function objectToStyleString(styleObject: { [key: string]: number | string }) {
  let styleString = "";
  for (const key in styleObject) {
    if (styleObject.hasOwnProperty(key)) {
      const value = styleObject[key];
      styleString += `${key}: ${typeof value === "number" ? value + "px" : value}; `;
    }
  }
  return styleString.trim();
}

let targetEl = <HTMLElement | null>null;

export function left90(id: string, type: number) {
  if (targetEl) {
    const style = (targetEl as HTMLElement).getAttribute("style");
    const styleObject = convertStyleStringToObject(style);
    if (type == 1) {
      styleObject["--rotate-Z"] = Number(styleObject["--rotate-Z"]?.replace(/(px|deg)/g, "") || 0) + 90 + "deg";
      styleObject["--rotate-Index"] =
        (Number(styleObject["--rotate-Index"]?.replace(/(px|deg)/g, "") || 1) + 1 > 4
          ? 1
          : Number(styleObject["--rotate-Index"]?.replace(/(px|deg)/g, "") || 1) + 1) + "px";
    } else if (type == 2) {
      styleObject["--rotate-Z"] = Number(styleObject["--rotate-Z"]?.replace(/(px|deg)/g, "") || 0) - 90 + "deg";
      styleObject["--rotate-Index"] =
        (Number(styleObject["--rotate-Index"]?.replace(/(px|deg)/g, "") || 1) + 1 > 4
          ? 1
          : Number(styleObject["--rotate-Index"]?.replace(/(px|deg)/g, "") || 1) + 1) + "px";
    } else if (type == 3) {
      styleObject["--rotate-Y"] = Number(styleObject["--rotate-Y"]?.replace(/(px|deg)/g, "") || 0) - 180 + "deg";
    } else if (type == 4) {
      styleObject["--rotate-X"] = Number(styleObject["--rotate-X"]?.replace(/(px|deg)/g, "") || 0) - 180 + "deg";
    }

    (targetEl as HTMLElement).setAttribute("style", objectToStyleString(styleObject));
  }
  setItemTop(id);
}

export function mouseUp(e: any, backFn: Function) {
  targetEl = e.target.parentElement;
  e.preventDefault();
  if (e.button == 2) {
    setTimeout(() => {
      backFn(e);
    }, 20);
  }
  return false;
}

export function leftAll90(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const container = el.querySelectorAll(id.indexOf("pdf") < 0 ? ".image-wrapper" : ".pageContainer");
    const style = (container[0] as HTMLElement).getAttribute("style");
    for (let i = 0; i < container.length; i++) {
      const item = container[i] as HTMLElement;
      const styleObject = convertStyleStringToObject(style);
      styleObject["--rotate-Z"] = Number(styleObject["--rotate-Z"]?.replace(/(px|deg)/g, "") || 0) + 90 + "deg";
      styleObject["--rotate-Index"] =
        (Number(styleObject["--rotate-Index"]?.replace(/(px|deg)/g, "") || 1) + 1 > 4
          ? 1
          : Number(styleObject["--rotate-Index"]?.replace(/(px|deg)/g, "") || 1) + 1) + "px";
      (item as HTMLElement).setAttribute("style", objectToStyleString(styleObject));
    }
  }
  setItemTop(id);
}

export function setItemTop(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const container = el.querySelectorAll(id.indexOf("pdf") < 0 ? ".image-wrapper" : ".pageContainer");
    const containerImg = el.querySelectorAll(id.indexOf("pdf") < 0 ? ".image-wrapper img" : ".pageContainer img");
    console.dir(container);

    for (let i = 0; i < containerImg.length; i++) {
      const item = container[i] as HTMLElement;
      const style = (container[i] as HTMLElement).getAttribute("style");
      const styleObject = convertStyleStringToObject(style);
      const { clientWidth, clientHeight } = containerImg[i] as HTMLElement;
      if (styleObject["--rotate-Index"] == "2px" || styleObject["--rotate-Index"] == "4px") {
        styleObject["--position-width"] = clientHeight + "px";
        styleObject["--position-height"] = clientWidth + "px";
      } else {
        styleObject["--position-width"] = clientWidth + "px";
        styleObject["--position-height"] = clientHeight + "px";
      }
      (item as HTMLElement).setAttribute("style", objectToStyleString(styleObject));
    }
    console.dir(container);
  }
}
