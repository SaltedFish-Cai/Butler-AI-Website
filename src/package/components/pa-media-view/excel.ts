/**
 * 生成字母序列
 * @param end - 结束字母，默认为 "ZZ"
 * @param start - 开始字母，默认为 "A"
 * @param tableEnd - 表格结束字母，默认为 "ZZ"
 * @returns Array<string>
 * @description 生成从 start 到 end 的字母序列
 */
export function generateAlphabetSequence(end = "ZZ", start = "A", tableEnd = "ZZ"): Array<string> {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const sequence: Array<string> = [];
  let RIndexText = "";
  let RIndex = 0;
  let startSave = false;
  function generateAlphabetSequenceAr(startText: string): void {
    for (let i = 0; i < alphabet.length; i++) {
      const Text = startText + alphabet[i];
      if (Text == start) startSave = true;
      if (end && (Text == end || Text == tableEnd) && startSave) {
        sequence.push(Text);
        return;
      }
      if (startSave) sequence.push(Text);

      if (i == alphabet.length - 1) {
        RIndexText = alphabet.split("")[RIndex];
        RIndex++;
        generateAlphabetSequenceAr(RIndexText);
      }
    }
  }
  generateAlphabetSequenceAr(RIndexText);

  return sequence;
}
/**
 * 判断是否有合并单元格
 * @param worksheet - 工作表对象
 * @returns boolean
 * @description 检查工作表是否存在合并单元格
 */
export function hasMergedCells(worksheet: Record<string, any>): boolean {
  return worksheet["!merges"] && worksheet["!merges"].length > 0;
}
/**
 * 获取合并单元格数组
 * @param worksheet - 工作表对象
 * @param tableEnd - 表格结束位置
 * @returns Array<string>
 * @description 获取所有合并单元格范围内的单元格坐标
 */
export function getMergedCellArr(worksheet: Record<string, any>, tableEnd: string): Array<string> {
  const arr: Array<string> = [];
  if (hasMergedCells(worksheet)) {
    for (const merge of worksheet["!merges"]) {
      const startCell = `${getColumnName(merge.s.c)}${merge.s.r + 1}`;
      const endCell = `${getColumnName(merge.e.c)}${merge.e.r + 1}`;

      const colStart = Number(startCell.replace(/[a-zA-Z]/g, ""));
      const colEnd = Number(endCell.replace(/[a-zA-Z]/g, ""));
      const _endCell = endCell.replace(/\d/g, "");
      const _startCell = startCell.replace(/\d/g, "");
      arr.push(startCell);
      arr.push(endCell);
      const row = generateAlphabetSequence(_endCell, _startCell, tableEnd);
      for (let index = 0; index < row.length; index++) {
        const _row = row[index];
        for (let i = colStart; i < colEnd + 1; i++) {
          const element = _row + i;
          arr.push(element);
        }
      }
    }
  }

  return arr;
}
/**
 * 获取合并单元格
 * @param worksheet - 工作表对象
 * @param configDataArrWidthMap - 列宽配置映射
 * @param key - 单元格键名
 * @param tableEnd - 表格结束位置
 * @returns { row: number, col: number }
 * @description 获取指定单元格的合并尺寸
 */
export function getMergedCells(
  worksheet: Record<string, any>,
  configDataArrWidthMap: Record<string, number>,
  key: string,
  tableEnd: string
): { row: number; col: number } {
  const CELL_HEIGHT = 30;
  const KEY = key.replace(/\d/g, "");

  const mergedCells = { row: configDataArrWidthMap[KEY], col: CELL_HEIGHT };
  if (hasMergedCells(worksheet)) {
    for (const merge of worksheet["!merges"]) {
      const startCell = `${getColumnName(merge.s.c)}${merge.s.r + 1}`;
      const endCell = `${getColumnName(merge.e.c)}${merge.e.r + 1}`;

      const colStart = Number(startCell.replace(/[a-zA-Z]/g, ""));
      const colEnd = Number(endCell.replace(/[a-zA-Z]/g, ""));
      const _endCell = endCell.replace(/\d/g, "");
      const _startCell = startCell.replace(/\d/g, "");

      const row = generateAlphabetSequence(_endCell, _startCell, tableEnd);
      if (startCell == key) {
        mergedCells.col = (colEnd - colStart + 1) * CELL_HEIGHT;
        mergedCells.row = row.reduce((pre, cur) => {
          return pre + configDataArrWidthMap[cur];
        }, 0);
      }

      const ch_key = key.split("");

      if (row.indexOf(ch_key[0]) > -1 && ch_key[1] <= colEnd && ch_key[1] >= colStart && key != startCell) {
        mergedCells.col = 0;
        mergedCells.row = 0;
      }
    }
  }

  return mergedCells;
}
/**
 * 获取列名称
 * @param columnIndex - 列索引
 * @returns string
 * @description 根据列索引获取对应的字母列名
 */
export function getColumnName(columnIndex: number): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let columnName = "";
  while (columnIndex >= 0) {
    columnName = alphabet[columnIndex % 26] + columnName;
    columnIndex = Math.floor(columnIndex / 26) - 1;
  }
  return columnName;
}
/**
 * 获取合并单元格范围内的所有单元格
 * @param startCell - 起始单元格
 * @param endCell - 结束单元格
 * @returns Array<string>
 * @description 获取指定范围内的所有单元格坐标
 */
export function getCellsInMergedRange(startCell: string, endCell: string): Array<string> {
  const cells: Array<string> = [];
  const startCol = getColumnIndex(startCell);
  const endCol = getColumnIndex(endCell);
  const startRow = parseInt(startCell.match(/\d+/)?.[0] || "0") - 1;
  const endRow = parseInt(endCell.match(/\d+/)?.[0] || "0") - 1;

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      cells.push(`${getColumnName(col)}${row + 1}`);
    }
  }

  return cells;
}
/**
 * 获取列索引
 * @param columnName - 列名称
 * @returns number
 * @description 根据列名称获取对应的列索引
 */
export function getColumnIndex(columnName: string): number {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let columnIndex = 0;
  for (let i = 0; i < columnName.length; i++) {
    columnIndex = columnIndex * 26 + alphabet.indexOf(columnName[i]) + 1;
  }
  return columnIndex - 1;
}
/**
 * 计算字符串长度
 * @param str - 输入字符串
 * @returns number
 * @description 计算字符串的显示长度，中文字符按双字节计算
 */
export function getStringLength(str: string): number {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      length += 2;
    } else {
      length += 1.3;
    }
  }
  return length;
}
