export const useTableHooks = () => {
  const getCurrentTableCell = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    let node = selection.anchorNode;

    if (!node) return null;
    // 如果是文本节点，获取其父元素
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }
    // 查找表格单元格
    while (node && node.nodeName !== "TD" && node.nodeName !== "TH") {
      node = node.parentNode;
      if (!node) break;
    }

    return node && (node.nodeName === "TD" || node.nodeName === "TH") ? node : null;
  };

  // 辅助函数：获取单元格所在的行和列信息
  const getTableCellInfo = (cell: any) => {
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
  };

  return {
    getCurrentTableCell,
    getTableCellInfo
  };
};
