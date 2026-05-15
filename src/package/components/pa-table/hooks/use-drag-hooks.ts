/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentItemProps, ComponentUseItemProps } from "../types";
/**
 * 模块导入
 * @description 导入宽度转换工具
 */
import { setWidthToNumber } from "./string-number";
/**
 * 模块导入
 * @description 导入 Vue 响应式 API
 */
import { Ref, ref } from "vue";
/**
 * 模块导入
 * @description 导入深拷贝工具函数
 */
import cloneDeep from "../../tools/clone-deep";
/**
 * 拖拽状态
 * @type Ref<number>
 * @description 当前拖拽宽度列索引
 */
const positionWidthIndex = ref(-1);
/**
 * 拖拽中状态
 * @type Ref<boolean>
 * @description 是否正在拖拽
 */
const dragIng = ref(false);
/**
 * useDragHooks 拖拽钩子
 * @param tableStructure - 表格结构引用
 * @returns 拖拽相关方法
 */
export const useDragHooks = (tableStructure: Ref<Array<ComponentItemProps & ComponentUseItemProps>>) => {
  const isBrowser = typeof window !== "undefined";
  /**
   * 拖拽开始处理
   * @param e - 拖拽事件
   * @param index - 索引
   * @description 拖拽列开始时设置透明度
   */
  function handleDragStart(e: DragEvent, index: number) {
    e.dataTransfer!.setData("text/plain", index.toString());
    (e.target as HTMLElement).style.opacity = "0.5";
    dragIng.value = true;
  }
  /**
   * 拖拽经过处理
   * @param e - 拖拽事件
   * @description 拖拽经过列时高亮
   */
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    const items = document.querySelectorAll(".pa-table_body_header_label");
    items.forEach(item => item.classList.remove("dragover"));
    if (e.currentTarget) (e.currentTarget as HTMLElement).classList.add("dragover");
  }
  /**
   * 拖拽放置处理
   * @param e - 拖拽事件
   * @param newIndex - 新索引
   * @description 拖拽放置列时重新排列
   */
  function handleDrop(e: DragEvent, newIndex: number) {
    e.preventDefault();
    const oldIndex = parseInt(e.dataTransfer!.getData("text/plain"));
    if (oldIndex !== newIndex) {
      const newStructure = [...tableStructure.value];
      const [removed] = newStructure.splice(oldIndex, 1);
      newStructure.splice(newIndex, 0, removed);
      tableStructure.value = newStructure;
    }
    (e.target as HTMLElement).style.opacity = "1";
  }
  /**
   * 拖拽结束处理
   * @param e - 拖拽事件
   * @description 拖拽结束后恢复样式
   */
  function handleDragEnd(e: DragEvent) {
    (e.target as HTMLElement).style.opacity = "1";
    const items = document.querySelectorAll(".pa-table_body_header_label");
    items.forEach(item => item.classList.remove("dragover"));
    dragIng.value = false;
  }
  /**
   * 拖拽宽度开始处理
   * @param e - 鼠标事件
   * @param index - 索引
   * @description 拖拽调整列宽度
   */
  function handleDragWidthStart(e: DragEvent, index: number) {
    e.preventDefault();
    const basePositionX = e.clientX;
    const basePositionRow = cloneDeep(tableStructure.value[index]);
    let basePositionIndex = index;
    positionWidthIndex.value = index;
    function handleDragWidthOver(e: MouseEvent) {
      e.preventDefault();
      if (!basePositionRow) return;
      const currentPositionX = e.clientX;
      const offsetX = currentPositionX - basePositionX;
      const isWidth = (setWidthToNumber(basePositionRow.width || 0) || 0) + offsetX;
      const width = `${isWidth % 2 == 0 ? isWidth : isWidth + 1}px`;
      tableStructure.value[basePositionIndex].baseWidth = width;
      tableStructure.value[basePositionIndex].width = width;
    }
    function handleDragWidthEnd(e: MouseEvent) {
      e.preventDefault();
      basePositionIndex = -1;
      positionWidthIndex.value = -1;
      if (isBrowser) {
        window.removeEventListener("mousemove", handleDragWidthOver);
        window.removeEventListener("mouseup", handleDragWidthEnd);
      }
    }
    if (isBrowser) {
      window.addEventListener("mousemove", handleDragWidthOver);
      window.addEventListener("mouseup", handleDragWidthEnd);
    }
  }
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
