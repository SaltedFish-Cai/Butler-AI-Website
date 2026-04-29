/**
 * @description 表格操作钩子函数
 * @returns 包含表格操作方法的对象
 */
export function useTableHooks() {
  /**
   * @description 获取当前选中的表格单元格
   * @returns 表格单元格元素或 null
   */
  function getCurrentTableCell(): HTMLTableCellElement | null {
    const selection = typeof window !== "undefined" ? window.getSelection() : null();
    if (!selection || selection.rangeCount === 0) return null;
    let node = selection.anchorNode;
    if (!node) return null;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }
    while (node && node.nodeName !== "TD" && node.nodeName !== "TH") {
      node = node.parentNode;
      if (!node) break;
    }
    return node && (node.nodeName === "TD" || node.nodeName === "TH") ? node : null;
  }

  /**
   * @description 获取单元格所在的行和列信息
   * @param cell - 表格单元格元素
   * @returns 单元格信息对象或 null
   */
  function getTableCellInfo(cell: any): {
    cell: HTMLTableCellElement;
    row: HTMLTableRowElement;
    table: HTMLTableElement;
    rowIndex: number;
    colIndex: number;
    rowCount: number;
    colCount: number;
  } | null {
    if (!cell || (cell.tagName !== "TD" && cell.tagName !== "TH")) return null;
    const row = cell.parentNode;
    if (!row || row.tagName !== "TR") return null;
    let table = row.parentNode;
    while (table && table.tagName !== "TABLE") {
      table = table.parentNode;
    }
    if (!table || table.tagName !== "TABLE") return null;
    const rows = Array.from(table.querySelectorAll("tr"));
    const rowIndex = rows.indexOf(row);
    const cells = Array.from(row.querySelectorAll("td, th"));
    const colIndex = cells.indexOf(cell);
    return {
      cell,
      row,
      table,
      rowIndex,
      colIndex,
      rowCount: rows.length,
      colCount: cells.length
    };
  }

  return {
    getCurrentTableCell,
    getTableCellInfo
  };
}
