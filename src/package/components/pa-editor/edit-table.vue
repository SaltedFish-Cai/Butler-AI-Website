<template>
  <div
    v-if="showContextMenu"
    ref="contextMenuRef"
    class="table-context-menu"
    :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }"
    @mousedown.prevent
  >
    <div class="menu-item" @click="executeTableCommand('insertTableRow', { position: 'above' })">
      <pa-icon name="to-top"></pa-icon>
      <span>在上方插入行</span>
    </div>
    <div class="menu-item" @click="executeTableCommand('insertTableRow', { position: 'below' })">
      <pa-icon name="to-bottom"></pa-icon>
      <span>在下方插入行</span>
    </div>
    <div class="menu-divider"></div>
    <div class="menu-item" @click="executeTableCommand('insertTableColumn', { position: 'left' })">
      <pa-icon name="to-left"></pa-icon>
      <span>在左侧插入列</span>
    </div>
    <div class="menu-item" @click="executeTableCommand('insertTableColumn', { position: 'right' })">
      <pa-icon name="to-right"></pa-icon>
      <span>在右侧插入列</span>
    </div>
    <div class="menu-divider"></div>
    <div class="menu-item" @click="executeTableCommand('deleteTableRow')">
      <pa-icon name="transfer_horizontal_line"></pa-icon>
      <span>删除当前行</span>
    </div>
    <div class="menu-item" @click="executeTableCommand('deleteTableColumn')">
      <pa-icon name="transfer_vertical_line"></pa-icon>
      <span>删除当前列</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, Ref } from "vue";
import { useTableHooks } from "./use-table-hooks";

/**
 * @description 是否显示右键菜单
 */
const showContextMenu = ref(false);

/**
 * @description 右键菜单位置
 */
const contextMenuPosition = ref({ x: 0, y: 0 });

/**
 * @description 右键菜单元素引用
 */
const contextMenuRef = ref<HTMLElement | null>(null);

/**
 * @description 选中的表格单元格
 */
const selectedTableCell = ref<HTMLTableCellElement | null>(null);

/**
 * @description 内容变化函数注入
 */
const onContentChange = inject("onContentChange") as () => void;

/**
 * @description 编辑器引用注入
 */
const editorRef = inject("provideEditorRef") as Ref<HTMLDivElement | null>;

/**
 * @description 保存撤销栈函数注入
 */
const saveToUndoStack = inject("saveToUndoStack") as () => void;

/**
 * @description 表格操作钩子
 */
const { getCurrentTableCell, getTableCellInfo } = useTableHooks();

/**
 * @description 执行表格命令
 * @param command - 命令名称
 * @param value - 命令参数
 */
function executeCommand(command: string, value?: any): void {
  editorRef?.value?.focus?.();
  saveToUndoStack();
  if (command === "insertTableColumn") {
    const { position = "right" } = typeof value === "object" ? value : { position: "right" };
    const cell = selectedTableCell.value || getCurrentTableCell();
    if (!cell) return;
    const cellInfo = getTableCellInfo(cell);
    if (!cellInfo) return;
    const { table, colIndex } = cellInfo;
    const insertIndex = position === "left" ? colIndex : colIndex + 1;
    try {
      const rows: any = Array.from(table.querySelectorAll("tr"));
      rows.forEach((row: any) => {
        const cells = Array.from(row.querySelectorAll("td, th"));
        const newCell = document.createElement("td");
        newCell.style.border = "1px solid var(--pa-color-border)";
        newCell.style.padding = "8px";
        newCell.style.textAlign = "left";
        newCell.style.minWidth = "100px";
        newCell.innerHTML = "&nbsp;";
        if (insertIndex >= cells.length) {
          row.appendChild(newCell);
        } else {
          row.insertBefore(newCell, cells[insertIndex]);
        }
      });
      const selection = typeof window !== "undefined" ? window.getSelection() : null();
      if (selection && rows.length > 0) {
        const firstRowCells = Array.from(rows[0].querySelectorAll("td, th"));
        const newCell: any = firstRowCells[insertIndex];
        if (newCell) {
          const range = document.createRange();
          range.selectNodeContents(newCell);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    } catch (error) {
      console.error("插入表格列失败:", error);
    }
  } else if (command === "deleteTableColumn") {
    const cell = selectedTableCell.value || getCurrentTableCell();
    if (!cell) return;
    const cellInfo = getTableCellInfo(cell);
    if (!cellInfo) return;
    const { table, colCount, colIndex } = cellInfo;
    if (colCount <= 1) return;
    try {
      const rows = Array.from(table.querySelectorAll("tr"));
      rows.forEach((row: any) => {
        const cells = Array.from(row.querySelectorAll("td, th"));
        if (cells[colIndex]) {
          row.removeChild(cells[colIndex]);
        }
      });
      const selection = typeof window !== "undefined" ? window.getSelection() : null();
      if (selection) {
        const currentRow = cellInfo.row;
        const currentCells = Array.from(currentRow.querySelectorAll("td, th"));
        const newColIndex = colIndex >= currentCells.length ? currentCells.length - 1 : colIndex;
        const targetCell: any = currentCells[newColIndex] || currentCells[0];
        if (targetCell) {
          const range = document.createRange();
          range.selectNodeContents(targetCell);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    } catch (error) {
      console.error("删除表格列失败:", error);
    }
  } else if (command === "insertTableRow") {
    const { position = "below" } = typeof value === "object" ? value : { position: "below" };
    const cell = selectedTableCell.value || getCurrentTableCell();
    if (!cell) return;
    const cellInfo = getTableCellInfo(cell);
    if (!cellInfo) return;
    const { row, colCount } = cellInfo;
    try {
      const newRow = document.createElement("tr");
      for (let i = 0; i < colCount; i++) {
        const newCell = document.createElement("td");
        newCell.style.border = "1px solid var(--pa-color-border)";
        newCell.style.padding = "8px";
        newCell.style.textAlign = "left";
        newCell.style.minWidth = "100px";
        newCell.innerHTML = "&nbsp;";
        newRow.appendChild(newCell);
      }
      const rowParent = row.parentNode;
      if (position === "above") {
        rowParent.insertBefore(newRow, row);
      } else {
        rowParent.insertBefore(newRow, row.nextSibling);
      }
      const selection = typeof window !== "undefined" ? window.getSelection() : null();
      if (selection) {
        const newCell = newRow.querySelector("td");
        if (newCell) {
          const range = document.createRange();
          range.selectNodeContents(newCell);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    } catch (error) {
      console.error("插入表格行失败:", error);
    }
  } else if (command === "deleteTableRow") {
    const cell = selectedTableCell.value || getCurrentTableCell();
    if (!cell) return;
    const cellInfo = getTableCellInfo(cell);
    if (!cellInfo) return;
    const { row, rowCount } = cellInfo;
    if (rowCount <= 1) return;
    try {
      const nextRow = row.nextSibling;
      const prevRow = row.previousSibling;
      const targetRow = nextRow || prevRow;
      const rowParent = row.parentNode;
      rowParent.removeChild(row);
      const selection = typeof window !== "undefined" ? window.getSelection() : null();
      if (selection && targetRow) {
        const targetCells = Array.from(targetRow.querySelectorAll("td, th"));
        const targetCell: any = targetCells[cellInfo.colIndex] || targetCells[0];
        if (targetCell) {
          const range = document.createRange();
          range.selectNodeContents(targetCell);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    } catch (error) {
      console.error("删除表格行失败:", error);
    }
  }
  onContentChange();
  editorRef?.value?.focus?.();
}

/**
 * @description 执行表格命令（从右键菜单触发）
 * @param command - 命令名称
 * @param value - 命令参数
 */
function executeTableCommand(command: string, value?: any): void {
  if (!selectedTableCell.value) return;
  const range = document.createRange();
  range.selectNode(selectedTableCell.value);
  const selection = typeof window !== "undefined" ? window.getSelection() : null();
  selection?.removeAllRanges();
  selection?.addRange(range);
  executeCommand(command, value);
  showContextMenu.value = false;
}

/**
 * @description 处理右键菜单显示
 * @param e - 鼠标事件
 */
function handleContextMenu(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  const cellElement = target.closest("td, th") as HTMLTableCellElement;
  if (cellElement) {
    showContextMenu.value = true;
    contextMenuPosition.value = { x: e.clientX, y: e.clientY };
    selectedTableCell.value = cellElement;
    e.preventDefault();
    setTimeout(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (contextMenuRef.value && !contextMenuRef.value.contains(event.target as Node)) {
          showContextMenu.value = false;
          document.removeEventListener("click", handleClickOutside);
        }
      };
      document.addEventListener("click", handleClickOutside);
    }, 0);
  }
}

defineExpose({
  handleContextMenu
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
