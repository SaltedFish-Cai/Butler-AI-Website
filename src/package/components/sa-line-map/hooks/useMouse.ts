// # Import
import { nextTick } from "vue";
import lodashPkg from "lodash";
import inBrowser from "../../tools/inBrowser";

import { useSvgBoard } from "./useSvgBoard";
import { useForeign } from "./useForeign";
import { useLine } from "./useLine";
import { DataConfigType } from "../type";
import { getSvgPlace } from "../utils";

const { debounce } = lodashPkg;

export const useMouse = (
  SvgRef,
  coreData,
  EmptyData,
  State,
  StaticState,
  SvgState,
  ForeignState,
  LinkState,
  LineDataObj,
  TargetLineDataObj,
  LinkItem,
  linkInfo,
  openMenu,
  closeMenu,
  menuSettingId,
  mouseEnterEl,
  setForeignCss
) => {
  const { boardMousedown, boardMousemove, boardMouseup } = useSvgBoard(SvgRef, SvgState, StaticState);
  const {
    foreignMousedown,
    foreignMousemove,
    foreignMouseup,
    foreignAddItem,
    foreignRemoveItem,
    foreignRemoveLine,
    foreignEditItem
  } = useForeign(
    SvgRef,
    coreData,
    EmptyData,
    StaticState,
    SvgState,
    ForeignState,
    LinkState,
    LineDataObj,
    menuSettingId,
    closeMenu
  );
  const { lineMousedown, lineMousemove, lineMouseup } = useLine(
    SvgRef,
    coreData,
    StaticState,
    LinkState,
    LinkItem,
    SvgState,
    mouseEnterEl
  );

  function mouseDown(e: any, type: string, its?: any) {
    if (e.button != 0) return;
    if (StaticState.mouseType != "await") {
      return;
    }

    StaticState.offset = [e.clientX / StaticState.wheelDelta, e.clientY / StaticState.wheelDelta];

    StaticState.mouseType = "mouseDown";
    StaticState.MouseDownType = type;

    if (type == "svg") {
      boardMousedown();
    } else if (type == "foreign") {
      foreignMousedown(e, type, its);
    } else if (type == "link") {
      lineMousedown(e, its);
    }
  }

  function mouseMove(e: { clientX: number; clientY: number }) {
    if (StaticState.mouseType == "mouseDown" || StaticState.mouseType == "moving") {
      if (!StaticState.MouseDownType) return;

      if (StaticState.MouseDownType === "svg") {
        boardMousemove(e);
      } else if (StaticState.MouseDownType === "foreign") {
        StaticState.mouseType = "moving";
        foreignMousemove(e);
      } else if (StaticState.MouseDownType === "link") {
        lineMousemove(e);
      }
    }
  }

  function mouseUp(e?) {
    if (e?.button == 2) {
      openMenu(e);
    } else {
      if (e) closeMenu(e);

      if (StaticState.MouseDownType === "svg") {
        boardMouseup();
      }

      if (StaticState.MouseDownType === "foreign") {
        foreignMouseup();
      }

      if (StaticState.MouseDownType === "link" && mouseEnterEl) {
        lineMouseup();
      }

      StaticState.mouseType = "await";
      StaticState.MouseDownType = "";
      LinkState.Item = [0, 0, 0, 0];
    }
  }

  function setWheel(wheelDelta) {
    StaticState.wheelDelta = wheelDelta;
    State.wheelDelta = Number((wheelDelta * 100).toFixed(0));

    const _svg = SvgRef.value;
    SvgState.box = [
      StaticState.SvgStateBox[0] + (_svg.clientWidth - _svg.clientWidth / wheelDelta) / 2,
      StaticState.SvgStateBox[1] + (_svg.clientHeight - _svg.clientHeight / wheelDelta) / 2,
      _svg.clientWidth / wheelDelta,
      _svg.clientHeight / wheelDelta
    ];
  }

  function mouseWheel(e: any) {
    e.preventDefault();
    if (e.wheelDelta < 0) {
      StaticState.wheelDelta = StaticState.wheelDelta - 0.02 < 0 ? 0 : StaticState.wheelDelta - 0.02;
    } else {
      StaticState.wheelDelta += 0.02;
    }
    if (Number((StaticState.wheelDelta * 100).toFixed(0)) <= 2) {
      return;
    }
    setWheel(StaticState.wheelDelta);
  }

  function mouseEnter(id: string, e) {
    mouseEnterEl.value = id;
    setForeignCss(e.target);
    const _CoreData: DataConfigType[] = coreData.value;
    _CoreData.sort((a, b) => (a.id == id ? 1 : -1) - (b.id == id ? 1 : -1));
  }

  function mouseLeave() {
    if (!LinkState.ItemText) mouseEnterEl.value = "";
    LineDataObj.value = { ...LineDataObj.value, ...TargetLineDataObj.value };
    TargetLineDataObj.value = {};
  }

  const setLinkInfo = debounce(data => (linkInfo.value = data), 500, { trailing: true });

  function mouseEnterLeavePath(id: string, e) {
    mouseEnterEl.value = id;
    if (id) {
      const _id = id.replace(/line-/g, "");
      const _LineDataObj = LineDataObj.value;
      const _TargetLineDataObj = TargetLineDataObj.value;
      const _data = { ..._LineDataObj, ..._TargetLineDataObj };
      if (_data[_id]) {
        const { condition, from, to } = _data[_id];
        setLinkInfo({ position: { x: e.clientX + 15, y: e.clientY + 10 }, data: { from, to, ...condition } });
      }
    } else {
      linkInfo.value = undefined;
      setLinkInfo(undefined);
    }
  }

  // function mouseEnter(e: any, its?: any) {
  //   if (e && LinkItem.StartEl != e) {
  //     LinkItem.EndEl = its;
  //   }
  // }

  // #Function 格式化排版
  function repositioning() {
    if (!inBrowser) return;
    closeMenu();
    setWheel(1);

    const deviationX = 150;
    const deviationY = 15;

    nextTick(() => {
      const _CoreData: DataConfigType[] = coreData.value;
      const actArr = _CoreData.filter(item => item.parent.length == 0);

      const isSetting: string[] = [];
      let maxXCompensate = 0;
      let maxYCompensate = 0;
      let allMaxYCompensate = 0;

      actLoopFn(actArr);
      function actLoopFn(actArr) {
        for (let index = 0; index < actArr.length; index++) {
          const elementItem = actArr[index];
          const actIndex = _CoreData.findIndex(item => item.id == elementItem.id);
          const _targetEl = window.document.getElementById("foreign-" + elementItem.id);
          const _targetElPlace = getSvgPlace(_targetEl);

          const baseX = _targetElPlace.width;
          const baseY = _targetElPlace.height;

          if (index != 0) maxYCompensate = maxYCompensate + baseY + deviationY;
          allMaxYCompensate = allMaxYCompensate + baseY + deviationY;

          _CoreData[actIndex].place = { x: 0, y: maxYCompensate };

          function loopFn(xCompensate, childArray) {
            if (maxXCompensate < xCompensate) maxXCompensate = xCompensate;

            for (let chIndex = 0; chIndex < childArray.length; chIndex++) {
              const childId = childArray[chIndex];
              if (isSetting.indexOf(childId) < 0) {
                isSetting.push(childId);

                const childIndex = _CoreData.findIndex(item => item.id == childId);
                const _targetEl = window.document.getElementById("foreign-" + childId);
                const _targetElPlace = getSvgPlace(_targetEl);

                if (chIndex != 0) {
                  const childId = childArray[chIndex - 1];
                  const _targetEl = window.document.getElementById("foreign-" + childId);
                  const _preTargetElPlace = getSvgPlace(_targetEl);

                  maxYCompensate = maxYCompensate + _preTargetElPlace.height + deviationY;
                  allMaxYCompensate = allMaxYCompensate + _targetElPlace.height + deviationY;
                }

                const x = xCompensate;
                const y = maxYCompensate;

                _CoreData[childIndex].place = { x, y };

                if (_CoreData[childIndex].children.length) {
                  loopFn(xCompensate + _targetElPlace.width + deviationX, _CoreData[childIndex].children);
                } else {
                  const _maxXCompensate = xCompensate + _targetElPlace.width;
                  if (maxXCompensate < _maxXCompensate) maxXCompensate = _maxXCompensate;
                }
              }
            }
          }

          if (elementItem.children.length) {
            loopFn(baseX + deviationX, elementItem.children);
          } else {
            if (maxXCompensate < _targetElPlace.width) maxXCompensate = _targetElPlace.width;
          }
        }
      }

      nextTick(() => {
        if (!inBrowser) return;
        const pageEl = window.document.getElementById("SvgContent");
        const _pageElPlace = getSvgPlace(pageEl);

        nextTick(() => {
          const setX = -(_pageElPlace.width - (maxXCompensate || 0)) / 2;
          const setY = -(_pageElPlace.height - (allMaxYCompensate - 10 || 0)) / 2;

          SvgState.box = [setX, setY, SvgState.box[2], SvgState.box[3]];

          const _svg = SvgRef.value;
          const _w = (_svg.clientWidth - _svg.clientWidth / StaticState.wheelDelta) / 2;
          const _h = (_svg.clientHeight - _svg.clientHeight / StaticState.wheelDelta) / 2;

          StaticState.SvgStateBox = [
            SvgState.global[0] - (SvgState.global[0] - SvgState.box[0]) - _w,
            SvgState.global[1] - (SvgState.global[1] - SvgState.box[1]) - _h
          ];
        });

        nextTick(() => {
          const chrX = maxXCompensate ? _pageElPlace.width / maxXCompensate : 1;
          const chrY = allMaxYCompensate ? _pageElPlace.height / allMaxYCompensate : 1;
          const chrTF = chrX < chrY;
          const chrXY = chrTF ? chrX : chrY;
          setWheel(chrXY > 1 ? 1.001 : chrXY - 0.02);
        });
      });
    });
  }

  return {
    StaticState,
    mouseDown,
    mouseMove,
    mouseUp,
    mouseWheel,
    mouseEnter,
    mouseLeave,
    mouseEnterLeavePath,

    foreignAddItem,
    foreignRemoveItem,
    foreignRemoveLine,
    foreignEditItem,
    repositioning
  };
};
