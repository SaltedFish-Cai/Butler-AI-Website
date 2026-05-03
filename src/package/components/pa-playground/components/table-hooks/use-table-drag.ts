/**
 * @description 导入类型定义
 */
import { PaStructureType } from "M_Types";
/**
 * @description 导入 Vue 相关类型
 */
import { Ref, ref } from "vue";

/**
 * @description 表格拖拽 Hooks 函数
 * @param tableConfig 表格配置
 * @param tableData 表格数据
 * @returns 拖拽相关方法
 */
export function useDragHooks(tableConfig: Ref<Array<PaStructureType.TableV2>>, tableData: Ref<Array<Array<any>>>) {
  /** @type ReturnType<typeof ref<number | null>> 被拖拽的列索引 */
  const draggedColumn = ref<number | null>(null);

  /**
   * @description 拖拽开始
   * @param event 拖拽事件
   * @param index 列索引
   * @returns void
   */
  function dragStart(event: DragEvent, index: number): void {
    event.stopPropagation();
    event.dataTransfer?.setData("text/plain", index.toString());
    (event.target as HTMLElement).style.opacity = "0.5";
    draggedColumn.value = index;
  }

  /**
   * @description 拖拽结束
   * @param event 拖拽事件
   * @returns void
   */
  function dragEnd(event: DragEvent): void {
    event.stopPropagation();
    (event.target as HTMLElement).style.opacity = "1";
    const items = document.querySelectorAll(".table-header-cell");
    items.forEach(item => item.classList.remove("dragover"));
    draggedColumn.value = null;
  }

  /**
   * @description 拖拽悬停
   * @param event 拖拽事件
   * @returns void
   */
  function dragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const items = document.querySelectorAll(".table-header-cell");
    items.forEach(item => item.classList.remove("dragover"));
    if (event.currentTarget) {
      (event.currentTarget as HTMLElement).classList.add("dragover");
    }
  }

  /**
   * @description 拖拽进入
   * @param event 拖拽事件
   * @returns void
   */
  function dragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * @description 拖拽离开
   * @param event 拖拽事件
   * @returns void
   */
  function dragLeave(event: DragEvent): void {
    event.stopPropagation();
    if (event.currentTarget) {
      (event.currentTarget as HTMLElement).classList.remove("dragover");
    }
  }

  /**
   * @description 拖拽结束，处理排序
   * @param event 拖拽事件
   * @param targetIndex 目标列索引
   * @returns void
   */
  function drop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    event.stopPropagation();

    const oldIndex = parseInt(event.dataTransfer!.getData("text/plain"));
    if (oldIndex !== targetIndex) {
      const newColumnNames = [...tableConfig.value];
      const [removed] = newColumnNames.splice(oldIndex, 1);
      newColumnNames.splice(targetIndex, 0, removed);
      tableConfig.value = newColumnNames;

      tableData.value = tableData.value.map(row => {
        const newRow = [...row];
        const [removedValue] = newRow.splice(oldIndex, 1);
        newRow.splice(targetIndex, 0, removedValue);
        return newRow;
      });
    }

    (event.target as HTMLElement).style.opacity = "1";
    const items = document.querySelectorAll(".table-header-cell");
    items.forEach(item => item.classList.remove("dragover"));
  }

  return {
    dragStart,
    dragEnd,
    dragOver,
    dragEnter,
    dragLeave,
    drop
  };
}
