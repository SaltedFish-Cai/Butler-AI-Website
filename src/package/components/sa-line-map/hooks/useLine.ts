// # Import
import { reactive, toRefs } from "vue";
import { getSvgPlace } from "../utils/index";

import { DataConfigType } from "../type";

export const useLine = (SvgRef, CoreData, StaticState, LinkState, LinkItem, SvgState, mouseEnterEl) => {
  const state = reactive({
    SvgPlace: {} as objectType
  });

  function mousedown(e: any, its?: any) {
    const startEl = getSvgPlace(e.target);
    const svgPlace = getSvgPlace(SvgRef.value);

    const startElX = startEl.x + startEl.width / 2;
    const startElY = startEl.y + startEl.height / 2;

    state.SvgPlace = svgPlace;
    const _x = startElX - svgPlace.x + SvgState.box[0] * StaticState.wheelDelta;
    const _y = startElY - svgPlace.y + SvgState.box[1] * StaticState.wheelDelta;

    LinkState.Item = [
      _x / StaticState.wheelDelta,
      _y / StaticState.wheelDelta,
      _x / StaticState.wheelDelta,
      _y / StaticState.wheelDelta
    ];
    LinkItem.StartEl = its;
  }

  function mousemove(e: { clientX: any; clientY: any }) {
    const svgPlace = state.SvgPlace || getSvgPlace(SvgRef.value);

    const placeX = LinkState.Item[0];
    const placeY = LinkState.Item[1];

    const childX = (e.clientX + SvgState.box[0] * StaticState.wheelDelta - svgPlace.x) / StaticState.wheelDelta;
    const childY = (e.clientY + SvgState.box[1] * StaticState.wheelDelta - svgPlace.y) / StaticState.wheelDelta;

    const c1 = (childX - placeX) / 2;
    const c2 = 0;
    const c3 = (childX - placeX) / 2;
    const c4 = childY - placeY;
    const c5 = childX - placeX;
    const c6 = childY - placeY;

    const text = `M${placeX} ${placeY} c${c1} ${c2} ${c3} ${c4} ${c5} ${c6}`;
    LinkState.ItemText = text;
  }

  function mouseup() {
    if (!!mouseEnterEl.value && LinkItem.StartEl.id != mouseEnterEl.value && mouseEnterEl.value.indexOf("line-") < 0) {
      const StartEl: DataConfigType = LinkItem.StartEl;
      const _CoreData: DataConfigType[] = CoreData.value;

      const startIndex = _CoreData.findIndex(item => item.id == StartEl.id);
      if (startIndex > -1) {
        if (_CoreData[startIndex].children?.indexOf(mouseEnterEl.value) < 0) {
          _CoreData[startIndex].children?.push(mouseEnterEl.value);
        }
      }

      const endIndex = _CoreData.findIndex(item => item.id == mouseEnterEl.value);
      if (endIndex > -1) {
        if (_CoreData[endIndex].parent?.indexOf(StartEl.id) < 0) {
          _CoreData[endIndex].parent?.push(StartEl.id);
        }
      }

      LinkState.Item.length = 0;
      LinkState.ItemText = "";
    } else {
      LinkState.Item.length = 0;
      LinkState.ItemText = "";
    }
  }

  function isInGroup(data: any) {
    const Item = data;
    const arr = [data.StartEl.TableName + data.StartEl.AliasName, data.EndEl.TableName + data.EndEl.AliasName];
    let flg = -1;
    const str1 = arr.join("-");
    const str2 = arr.reverse().join("-");
    let needReverse = false;
    if (LinkState.ListMap.indexOf(str1) > -1) {
      flg = LinkState.ListMap.indexOf(str1);
    } else if (LinkState.ListMap.indexOf(str2) > -1) {
      needReverse = true;
      flg = LinkState.ListMap.indexOf(str2);
    }

    if (needReverse) {
      const oldStart = Item.StartEl;
      Item.StartEl = Item.EndEl;
      Item.EndEl = oldStart;
    }
    return { isIn: flg, Item };
  }

  return {
    ...toRefs(state),
    lineMousedown: mousedown,
    lineMousemove: mousemove,
    lineMouseup: mouseup,
    lineIsInGroup: isInGroup
  };
};
