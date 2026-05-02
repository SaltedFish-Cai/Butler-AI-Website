/**
 * @description ComponentItemProps 和 ComponentUseItemProps 类型导入
 */
import { ComponentItemProps, ComponentUseItemProps } from "../types";
/**
 * @description setWidthToNumber 函数导入
 */
import { setWidthToNumber } from "./string-number";
/**
 * @description vue 响应式相关导入
 */
import { Ref, ref } from "vue";
/**
 * @description lodash 工具库
 */
import _ from "lodash";
const { cloneDeep } = _;
/**
 * @description 拖拽状态
 */
const positionWidthIndex = ref(-1);
const dragIng = ref(false);
/**
 * @description useDragHooks 拖拽钩子
 * @param tableStructure 表格结构
 * @returns 拖拽相关方法
 */
export const useDragHooks = (tableStructure: Ref<Array<ComponentItemProps & ComponentUseItemProps>>) => {
  /**
   * @description 拖拽开始处理
   * @param e 拖拽事件
   * @param index 索引
   */
  const handleDragStart = (e: DragEvent, index: number) => {
    e.dataTransfer!.setData("text/plain", index.toString());
    (e.target as HTMLElement).style.opacity = "0.5";
    dragIng.value = true;
  };
  /**
   * @description 拖拽经过处理
   * @param e 拖拽事件
   */
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    const items = document.querySelectorAll(".pa-table_body_header_label");
    items.forEach(item => item.classList.remove("dragover"));
    if (e.currentTarget) {
      (e.currentTarget as HTMLElement).classList.add("dragover");
    }
  };
  /**
   * @description 拖拽放置处理
   * @param e 拖拽事件
   * @param newIndex 新索引
   */
  const handleDrop = (e: DragEvent, newIndex: number) => {
    e.preventDefault();
    const oldIndex = parseInt(e.dataTransfer!.getData("text/plain"));
    if (oldIndex !== newIndex) {
      const newStructure = [...tableStructure.value];
      const [removed] = newStructure.splice(oldIndex, 1);
      newStructure.splice(newIndex, 0, removed);
      tableStructure.value = newStructure;
    }
    (e.target as HTMLElement).style.opacity = "1";
  };
  /**
   * @description 拖拽结束处理
   * @param e 拖拽事件
   */
  const handleDragEnd = (e: DragEvent) => {
    (e.target as HTMLElement).style.opacity = "1";
    const items = document.querySelectorAll(".pa-table_body_header_label");
    items.forEach(item => item.classList.remove("dragover"));
    dragIng.value = false;
  };
  /**
   * @description 拖拽宽度开始处理
   * @param e 鼠标事件
   * @param index 索引
   */
  const handleDragWidthStart = (e: DragEvent, index: number) => {
    e.preventDefault();
    const basePositionX = e.clientX;
    const basePositionRow = cloneDeep(tableStructure.value[index]);
    let basePositionIndex = index;
    positionWidthIndex.value = index;
    const handleDragWidthOver = (e: MouseEvent) => {
      e.preventDefault();
      if (!basePositionRow) return;
      const currentPositionX = e.clientX;
      const offsetX = currentPositionX - basePositionX;
      const isWidth = (setWidthToNumber(basePositionRow.width || 0) || 0) + offsetX;
      const width = `${isWidth % 2 == 0 ? isWidth : isWidth + 1}px`;
      tableStructure.value[basePositionIndex].baseWidth = width;
      tableStructure.value[basePositionIndex].width = width;
    };
    const handleDragWidthEnd = (e: MouseEvent) => {
      e.preventDefault();
      basePositionIndex = -1;
      positionWidthIndex.value = -1;
      if (typeof window !== "undefined") window.removeEventListener("mousemove", handleDragWidthOver);
      if (typeof window !== "undefined") window.removeEventListener("mouseup", handleDragWidthEnd);
    };
    if (typeof window !== "undefined") window.addEventListener("mousemove", handleDragWidthOver);
    if (typeof window !== "undefined") window.addEventListener("mouseup", handleDragWidthEnd);
  };
  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    dragIng,
    handleDragWidthStart,
    positionWidthIndex
  };
};
