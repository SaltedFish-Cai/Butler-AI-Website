import lodashPkg from "lodash";

import { DataConfigType, PropsDataConfigType } from "../type";
import inBrowser from "../../tools/inBrowser";

const { isArray, isObject } = lodashPkg;

// #Function 获取元素定位
export function getSvgPlace(SvgRef) {
  if (SvgRef) {
    const svgPlace = SvgRef.getBoundingClientRect();
    return svgPlace;
  }
  return {};
}

// #Function  扁平化元素
export function flatCoreData(Arr: PropsDataConfigType[]) {
  const outData: DataConfigType[] = [];
  const emptyValue = {};
  function loopFn(Arr: PropsDataConfigType[], parentId?: string) {
    for (let index = 0; index < Arr.length; index++) {
      const el = Arr[index];
      const exKeys = ["id", "place", "parent", "children", "condition"];

      const data = Object.keys(el)
        .filter(key => exKeys.indexOf(key) < 0)
        .reduce((acc, key) => {
          acc[key] = el[key];

          if (!emptyValue[key]) {
            let data: any = "";
            if (isArray(el[key])) {
              data = [];
            } else if (isObject(el[key])) {
              data = {};
            }

            emptyValue[key] = data;
          }
          return acc;
        }, {});

      const elConfig: any = Object.keys(el)
        .filter(key => exKeys.indexOf(key) > -1)
        .reduce((acc, key) => {
          acc[key] = el[key];
          return acc;
        }, {});

      const _eId = outData.findIndex(e => e.id == el.id);
      if (_eId < 0) {
        const baseData = { ...elConfig, parent: [], children: el?.children?.map(item => item.id) || [], data };
        if (parentId) baseData.parent?.push(parentId);
        outData.push(baseData);
        if (el.children?.length) {
          loopFn(el.children, el.id);
        }
      } else {
        if (parentId) outData[_eId].parent?.push(parentId);
        if (el.children?.length) {
          outData[_eId].children = el.children.map(item => item.id);
          loopFn(el.children, el.id);
        }
      }
    }
  }
  loopFn(Arr);
  return { outData, emptyValue };
}

// #Function 设置连线关系缩放结果
export function getPathWheelDelta(startId: string, endId: string, box: number[], wheelDelta: number) {
  if (inBrowser) {
    const pageEl = window.document.getElementById("SvgContent");
    const startEl = window.document.getElementById(startId);
    const endEl = window.document.getElementById(endId);

    const pagePlace = getSvgPlace(pageEl);
    const startPlace = getSvgPlace(startEl);
    const endPlace = getSvgPlace(endEl);

    const placeX = (startPlace.x + startPlace.width + box[0] * wheelDelta - pagePlace.x) / wheelDelta;
    const placeY = (startPlace.y + startPlace.height / 2 + box[1] * wheelDelta - pagePlace.y) / wheelDelta;

    const childX = (endPlace.x + box[0] * wheelDelta - pagePlace.x) / wheelDelta;
    const childY = (endPlace.y + endPlace.height / 2 + box[1] * wheelDelta - pagePlace.y) / wheelDelta;
    // M100 200 c100 0 100 100 200 100
    const c1 = (childX - placeX) / 2;
    const c2 = 0;
    const c3 = (childX - placeX) / 2;
    const c4 = childY - placeY;
    const c5 = childX - placeX;
    const c6 = childY - placeY;
    const text = `M${placeX} ${placeY} c${c1} ${c2} ${c3} ${c4} ${c5} ${c6}`;
    return text;
  } else {
    const text = `M0 0 c0 0 0 0 0 0`;
    return text;
  }
}

// #Function  扁平化连线关系
export function flatLineData(Arr: objectType[], box: number[], wheelDelta: number, flatArr: objectType = {}) {
  Arr.forEach(item => {
    if (item.children?.length) {
      for (let index = 0; index < item.children.length; index++) {
        const child = item.children[index];
        const _key = item.id + "-" + child;
        const line = getPathWheelDelta(item.id, child, box, wheelDelta);
        flatArr[_key] = {
          line,
          from: item.id,
          to: child,
          condition: item.condition
        };
      }
      flatLineData(item.children, box, wheelDelta, flatArr);
    }
  });
  return flatArr;
}

// #Function 查找元素关系图
// export function loopCheckMapData(_SetMapData: DataConfigType[]) {
//   let childrenArr: string[] = [];

//   function loopFn(Map) {
//     for (let index = 0; index < Map.length; index++) {
//       const element: DataConfigType = Map[index];
//       if (element?.children?.length) {
//         const arr = element?.children.map(item => item.id);
//         childrenArr = [...childrenArr, ...arr];
//         loopFn(element?.children);
//       }
//     }
//   }
//   loopFn(_SetMapData);

//   return childrenArr;
// }
