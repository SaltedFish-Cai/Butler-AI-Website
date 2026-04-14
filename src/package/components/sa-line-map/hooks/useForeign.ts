// # Import
import { reactive, toRefs } from "vue";
import lodashPkg from "lodash";
import { flatLineData, getSvgPlace } from "../utils/index";

import { randChar } from "../../tools/rand-char";
import { DataConfigType } from "../type";
import inBrowser from "../../tools/inBrowser";

const { cloneDeep } = lodashPkg;

export const useForeign = (
  SvgRef,
  CoreData,
  EmptyData,
  StaticState,
  SvgState,
  ForeignState,
  LinkState,
  LineDataObj,
  menuSettingId,
  closeMenu
) => {
  const state = reactive({
    foreignItems: [] as objectType[],
    foreignIcons: {}
  });
  function mousedown(e: any, type: string, its?: any) {
    ForeignState.Index = its || 0;
    const _index: any = its.index;
    SvgState.global = [CoreData.value[_index].place.x, CoreData.value[_index].place.y];

    // const foreign = ForeignState.List[ForeignState.Index.index];
    // this.foreignItems = foreign.ColumnInfoList;

    // for (let index = 0; index < this.foreignItems.length; index++) {
    //   const key = foreign.Name + foreign.AliasName + "-" + this.foreignItems[index].DbColumnName;
    //   this.foreignIcons[key] = JSON.parse(JSON.stringify(ForeignState.Icons[key]));
    // }
  }

  function mousemove(e: { clientX: any; clientY: any }) {
    const offset = StaticState.offset;
    const X = offset[0] - e.clientX / StaticState.wheelDelta;
    const Y = offset[1] - e.clientY / StaticState.wheelDelta;

    const foreign = CoreData.value[ForeignState.Index.index];

    CoreData.value[ForeignState.Index.index].place = {
      x: Number((SvgState.global[0] - X).toFixed(0)),
      y: Number((SvgState.global[1] - Y).toFixed(0)),
      width: foreign.place.width,
      height: foreign.place.height
    };
    // setForeignIcon(false, ForeignState.Index.id);
  }

  function mouseup() {
    // for (let index = 0; index < LinkState.List.length; index++) {
    //   const element = LinkState.List[index];
    //   LinkState.List[index] = setDirection(element);
    // }
  }

  function remove(index: number) {
    LinkState.List.splice(index, 1);
  }

  function CheckAllChange(e: any, index: number) {
    const ForeignList = ForeignState.List[index].ColumnInfoList;
    for (let i = 0; i < ForeignList.length; i++) {
      ForeignState.List[index].ColumnInfoList[i].IsShow = e;
    }
  }

  // #Function 获取点击的位置信息
  function getPlace(e) {
    const svgPlace = getSvgPlace(SvgRef.value);
    const childX = (e.clientX + SvgState.box[0] * StaticState.wheelDelta - svgPlace.x) / StaticState.wheelDelta;
    const childY = (e.clientY + SvgState.box[1] * StaticState.wheelDelta - svgPlace.y) / StaticState.wheelDelta;

    return { childX, childY };
  }

  // #Function 添加节点
  function addItem(e) {
    if (!inBrowser) return;
    closeMenu();
    const _menuSettingId = menuSettingId.value;
    const _CoreData: DataConfigType[] = CoreData.value;
    if (_menuSettingId) {
      // 新增当前节点下节点
      const _targetId = menuSettingId.value;
      const _targetIndex = _CoreData.findIndex(item => item.id == _targetId);
      const _target = _CoreData[_targetIndex];
      const id = randChar();
      const _targetEl = window.document.getElementById("foreign-" + _target.id);
      const _targetElPlace = getSvgPlace(_targetEl);
      const X = _target.place.x + _targetElPlace.width + 200;
      const Y = _target.place.y + 40 * (_target.children.length - 2);
      _target.children.push(id);
      _CoreData.push({
        id,
        children: [],
        parent: [_target.id],
        data: cloneDeep(EmptyData),
        place: { x: X, y: Y }
      });
    } else {
      // 新增节点
      const { childX, childY } = getPlace(e);
      _CoreData.push({
        id: randChar(),
        children: [],
        parent: [],
        data: cloneDeep(EmptyData),
        place: { x: childX - 10, y: childY - 10 }
      });
    }
  }

  // #Function 删除节点
  function removeItem() {
    closeMenu();
    const _CoreData: DataConfigType[] = CoreData.value;
    const _targetId = menuSettingId.value;
    const _targetIndex = _CoreData.findIndex(item => item.id == _targetId);
    const _target = _CoreData[_targetIndex];
    if (_target?.children?.length) {
      const childArr = cloneDeep(_target?.children);
      for (let index = 0; index < childArr.length; index++) {
        const element = childArr[index];
        targetRemoveLine(_target.id, element);
      }
    }
    if (_target?.parent?.length) {
      const childArr = cloneDeep(_target?.parent);
      for (let index = 0; index < childArr.length; index++) {
        const element = childArr[index];
        targetRemoveLine(element, _target.id);
      }
    }
    _CoreData.splice(_targetIndex, 1);
  }

  // #Function 删除连线方法
  function targetRemoveLine(firstId, endId) {
    const _CoreData: DataConfigType[] = CoreData.value;

    const startIndex = _CoreData.findIndex(item => item.id == firstId);
    if (startIndex > -1) {
      const childId = _CoreData[startIndex].children?.indexOf(endId);
      if (childId > -1) {
        _CoreData[startIndex].children?.splice(childId, 1);
      }
    }

    const endIndex = _CoreData.findIndex(item => item.id == endId);
    if (endIndex > -1) {
      const childId = _CoreData[endIndex].parent?.indexOf(firstId);
      if (childId > -1) {
        _CoreData[endIndex].parent?.splice(childId, 1);
      }
    }
    const _lineData = flatLineData(_CoreData, SvgState.box, StaticState.wheelDelta);
    LineDataObj.value = _lineData;
  }

  // #Function 删除连线
  function removeLine() {
    closeMenu();
    const arr = menuSettingId.value.split("-");
    if (arr[0] == "line") {
      const firstId = arr[1];
      const endId = arr[2];
      targetRemoveLine(firstId, endId);
    }
  }

  function editItem() {
    closeMenu();
  }

  return {
    ...toRefs(state),
    foreignMousedown: mousedown,
    foreignMousemove: mousemove,
    foreignMouseup: mouseup,
    foreignRemove: remove,
    foreignCheckAllChange: CheckAllChange,
    foreignAddItem: addItem,
    foreignRemoveItem: removeItem,
    foreignRemoveLine: removeLine,
    foreignEditItem: editItem
  };
};
