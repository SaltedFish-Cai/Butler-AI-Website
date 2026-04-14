<template>
  <!-- 表格右键菜单 -->
  <div
    v-if="showContextMenu"
    ref="contextMenuRef"
    class="table-context-menu"
    :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }"
    @mousedown.prevent
  >
    <div class="menu-item" @click="executeTableCommand('insertTableRow', { position: 'above' })">
      <m-icon-v2 name="to-top"></m-icon-v2>
      <span>在上方插入行</span>
    </div>
    <div class="menu-item" @click="executeTableCommand('insertTableRow', { position: 'below' })">
      <m-icon-v2 name="to-bottom"></m-icon-v2>
      <span>在下方插入行</span>
    </div>
    <div class="menu-divider"></div>
    <div class="menu-item" @click="executeTableCommand('insertTableColumn', { position: 'left' })">
      <m-icon-v2 name="to-left"></m-icon-v2>
      <span>在左侧插入列</span>
    </div>
    <div class="menu-item" @click="executeTableCommand('insertTableColumn', { position: 'right' })">
      <m-icon-v2 name="to-right"></m-icon-v2>
      <span>在右侧插入列</span>
    </div>
    <div class="menu-divider"></div>
    <div class="menu-item" @click="executeTableCommand('deleteTableRow')">
      <m-icon-v2 name="transfer_horizontal_line"></m-icon-v2>
      <span>删除当前行</span>
    </div>
    <div class="menu-item" @click="executeTableCommand('deleteTableColumn')">
      <m-icon-v2 name="transfer_vertical_line"></m-icon-v2>
      <span>删除当前列</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, Ref } from "vue";

// 图片右键菜单相关
const showContextMenu = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextMenuRef = ref<HTMLElement | null>(null);
const selectedTableCell = ref<HTMLTableCellElement | null>(null);
const onContentChange = inject("onContentChange") as () => void;
const editorRef = inject("provideEditorRef") as Ref<HTMLDivElement | null>;
const saveToUndoStack = inject("saveToUndoStack") as () => void;

import { useTableHooks } from "./use-table-hooks";

const { getCurrentTableCell, getTableCellInfo } = useTableHooks();
const executeCommand = (command: string, value?: any) => {
  editorRef?.value?.focus?.();

  // 在执行表格操作前保存当前状态到撤销栈
  saveToUndoStack();

  // 处理插入表格列命令
  if (command === "insertTableColumn") {
    const { position = "right" } = typeof value === "object" ? value : { position: "right" };

    // 优先使用selectedTableCell.value（从右键菜单传递），如果没有则调用getCurrentTableCell
    const cell = selectedTableCell.value || getCurrentTableCell();
    if (!cell) return;
    const cellInfo = getTableCellInfo(cell);
    if (!cellInfo) return;

    const { table, colIndex } = cellInfo;
    const insertIndex = position === "left" ? colIndex : colIndex + 1;

    try {
      // 获取表格的所有行
      const rows: any = Array.from(table.querySelectorAll("tr"));

      // 遍历每一行，在指定位置插入新单元格
      rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll("td, th"));
        const newCell = document.createElement("td");
        newCell.style.border = "1px solid #ccc";
        newCell.style.padding = "8px";
        newCell.style.textAlign = "left";
        newCell.style.minWidth = "100px";
        newCell.innerHTML = "&nbsp;";

        // 找到要插入的位置
        if (insertIndex >= cells.length) {
          row.appendChild(newCell);
        } else {
          row.insertBefore(newCell, cells[insertIndex]);
        }
      });

      // 选中新插入的第一行单元格
      const selection = window.getSelection();
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
  }

  // 处理删除表格列命令
  else if (command === "deleteTableColumn") {
    // 优先使用selectedTableCell.value（从右键菜单传递），如果没有则调用getCurrentTableCell
    const cell = selectedTableCell.value || getCurrentTableCell();
    if (!cell) return;

    const cellInfo = getTableCellInfo(cell);
    if (!cellInfo) return;

    const { table, colCount, colIndex } = cellInfo;

    // 确保表格至少保留一列
    if (colCount <= 1) return;

    try {
      // 获取表格的所有行
      const rows = Array.from(table.querySelectorAll("tr"));

      // 遍历每一行，删除指定索引的单元格
      rows.forEach((row: any) => {
        const cells = Array.from(row.querySelectorAll("td, th"));
        if (cells[colIndex]) {
          row.removeChild(cells[colIndex]);
        }
      });

      // 将光标移动到当前行的对应列单元格
      const selection = window.getSelection();
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
  }

  // 处理插入表格行命令
  else if (command === "insertTableRow") {
    const { position = "below" } = typeof value === "object" ? value : { position: "below" };
    // 优先使用selectedTableCell.value（从右键菜单传递），如果没有则调用getCurrentTableCell
    const cell = selectedTableCell.value || getCurrentTableCell();
    if (!cell) return;
    const cellInfo = getTableCellInfo(cell);
    if (!cellInfo) return;
    const { row, colCount } = cellInfo;

    try {
      // 创建新行
      const newRow = document.createElement("tr");

      // 添加与当前行相同数量的单元格
      for (let i = 0; i < colCount; i++) {
        const newCell = document.createElement("td");
        newCell.style.border = "1px solid #ccc";
        newCell.style.padding = "8px";
        newCell.style.textAlign = "left";
        newCell.style.minWidth = "100px";
        newCell.innerHTML = "&nbsp;";
        newRow.appendChild(newCell);
      }

      // 插入新行 - 使用row的父元素（可能是tbody）而不是直接使用table
      const rowParent = row.parentNode;
      if (position === "above") {
        rowParent.insertBefore(newRow, row);
      } else {
        rowParent.insertBefore(newRow, row.nextSibling);
      }

      // 选中新行的第一个单元格
      const selection = window.getSelection();
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
  }

  // 处理删除表格行命令
  else if (command === "deleteTableRow") {
    // 优先使用selectedTableCell.value（从右键菜单传递），如果没有则调用getCurrentTableCell
    const cell = selectedTableCell.value || getCurrentTableCell();
    if (!cell) return;

    const cellInfo = getTableCellInfo(cell);
    if (!cellInfo) return;

    const { row, rowCount } = cellInfo;

    // 确保表格至少保留一行
    if (rowCount <= 1) return;

    try {
      // 找到要删除行的下一行或上一行
      const nextRow = row.nextSibling;
      const prevRow = row.previousSibling;
      const targetRow = nextRow || prevRow;

      // 删除当前行 - 使用row的父元素（可能是tbody）而不是直接使用table
      const rowParent = row.parentNode;
      rowParent.removeChild(row);

      // 将光标移动到目标行的对应列单元格
      const selection = window.getSelection();
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
};

// 执行表格命令
const executeTableCommand = (command: string, value?: any) => {
  if (!selectedTableCell.value) return;
  // 先选择表格单元格
  const range = document.createRange();
  range.selectNode(selectedTableCell.value);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  // 执行表格命令
  executeCommand(command, value);

  // 关闭右键菜单
  showContextMenu.value = false;
};

// 处理右键菜单
const handleContextMenu = (e: MouseEvent) => {
  // 检查点击的是否是表格单元格或表格单元格的子元素
  const target = e.target as HTMLElement;
  const cellElement = target.closest("td, th") as HTMLTableCellElement;
  if (cellElement) {
    // 显示右键菜单
    showContextMenu.value = true;
    contextMenuPosition.value = { x: e.clientX, y: e.clientY };
    selectedTableCell.value = cellElement;

    // 阻止默认右键菜单
    e.preventDefault();

    // 点击外部关闭菜单
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
};

defineExpose({
  handleContextMenu
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
