import { PaTableItemType, PaTableUseItemType } from "../type";
import { setWidthToNumber } from "./string-number";
import { Ref, ref } from "vue";

import _ from "lodash";
const { cloneDeep } = _;

const positionWidthIndex = ref(-1);
const dragIng = ref(false);
export const useDragHooks = (tableStructure: Ref<Array<PaTableItemType & PaTableUseItemType>>) => {
  const handleDragStart = (e: DragEvent, index: number) => {
    e.dataTransfer!.setData("text/plain", index.toString());
    (e.target as HTMLElement).style.opacity = "0.5";
    dragIng.value = true;
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    const items = document.querySelectorAll(".pa-table_body_header_label");
    items.forEach(item => item.classList.remove("dragover"));
    if (e.currentTarget) {
      (e.currentTarget as HTMLElement).classList.add("dragover");
    }
  };

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

  const handleDragEnd = (e: DragEvent) => {
    (e.target as HTMLElement).style.opacity = "1";
    const items = document.querySelectorAll(".pa-table_body_header_label");
    items.forEach(item => item.classList.remove("dragover"));
    dragIng.value = false;
  };

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
