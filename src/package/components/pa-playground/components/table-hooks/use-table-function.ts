/**
 * @description 导入类型定义
 * */
import { PaOptionType, PaStructureType } from "../../../manager-type";
/**
 * @description 导入 Vue 相关类型
 * */
import { computed, nextTick, Ref } from "vue";
/**
 * @description 导入按钮类型
 * */
import { PaPlaygroundPageButtonType } from "../types";
/**
 * @description 导入消息框组件
 * */
import { M_MessageBox } from "../../../feedback";
/**
 * @description 导入 Playground 类型
 * */
import { PaPlaygroundItem, MStructureType } from "../../types";

/** @type `number` 表格最小宽度 */
const MIN_WIDTH = 520;

/**
 * @description 表格功能 Hooks 函数
 * @param emit 事件发射器
 * @param baseConfig 基础配置
 * @param dataStructures 数据结构列表
 * @param tableConfig 表格配置
 * @param tableConfigExOperation 表格操作列配置
 * @param tableExOptions 表格扩展选项
 * @param tableData 表格数据
 * @param tableWidth 表格宽度
 * @param editHeadersData 编辑表头数据
 * @param editOperationData 编辑操作数据
 * @param tableBaseCellWidth 表格单元格基础宽度
 * @param selectedColumnIndex 选中的列索引
 * @param closeContextMenu 关闭右键菜单函数
 * @returns 表格功能相关方法
 * */
export function useFunctionHooks(
  emit: any,
  baseConfig: Ref<PaPlaygroundItem | undefined>,
  dataStructures: Ref<Array<MStructureType>>,
  tableConfig: Ref<Array<PaStructureType.TableV2>>,
  tableConfigExOperation: Ref<Array<PaStructureType.TableV2>>,
  tableExOptions: Ref<Record<string, string>>,
  tableData: Ref<Array<Array<any>>>,
  tableWidth: Ref<number>,
  editHeadersData: Ref<Array<PaPlaygroundPageButtonType>>,
  editOperationData: Ref<Array<PaPlaygroundPageButtonType>>,
  tableBaseCellWidth: number,
  selectedColumnIndex: Ref<number>,
  closeContextMenu: () => void
) {
  /** @type `ComputedRef<number>` 列数量 */
  const columnCount = computed(() => tableConfigExOperation.value.length);

  /**
   * @description 创建表格
   * @returns `void`
   * */
  function createTable(): void {
    setMockTableData();
  }

  /**
   * @description 设置模拟表格数据
   * @returns `void`
   * */
  function setMockTableData(): void {
    tableData.value = [];
    for (let i = 0; i < 5; i++) {
      const row: Array<string> = [];
      for (let j = 0; j < tableConfigExOperation.value.length; j++) {
        row.push(`数据${i + 1}-${j + 1}`);
      }
      tableData.value.push(row);
    }
    setTableWidth();
  }

  /**
   * @description 设置表格宽度
   * @returns `void`
   * */
  function setTableWidth(): void {
    nextTick(() => {
      let width = tableConfigExOperation.value.reduce((total, col) => {
        const width = col.width;
        const widthNum = typeof width === "number" ? width : tableBaseCellWidth;
        return total + widthNum;
      }, 0);

      width = width <= MIN_WIDTH ? MIN_WIDTH : width;

      width += (editOperationData.value.length || 1) * 110;

      emit("updatePageSize", { width: width + 20, height: tableData.value.length * 40 + 82 + 40 + 10 });
      tableWidth.value = width;
    });
  }

  /**
   * @description 更新列
   * @param col 列配置
   * @param options 扩展选项
   * @returns `void`
   * */
  function updateCol(col: PaStructureType.TableV2 & { cellType: any }, options: Record<string, string>): void {
    tableConfig.value[selectedColumnIndex.value] = { ...col, cellConfig: { ...col.cellConfig, type: col.cellType } };
    tableExOptions.value = options;
    setTableWidth();
  }

  /**
   * @description 更新所有列
   * @param cols 列配置数组
   * @param options 扩展选项
   * @returns `void`
   * */
  function updateColAll(cols: Array<PaStructureType.TableV2>, options?: Record<string, string>): void {
    tableConfig.value = cols;
    if (options) tableExOptions.value = options;
    setTableWidth();
    setMockTableData();
  }

  /**
   * @description 处理删除列
   * @param columnIndex 列索引
   * @returns `void`
   * */
  function handleDeleteColumn(columnIndex: number): void {
    closeContextMenu();

    if (columnIndex >= 0) {
      M_MessageBox.delete({
        onConfirm: () => {
          tableConfig.value.splice(columnIndex!, 1);

          tableData.value = tableData.value.map(row => {
            row.splice(columnIndex!, 1);
            return row;
          });
          setTableWidth();
        }
      });
    }
  }

  /**
   * @description 导出表格配置
   * @returns `object` 包含 config、exOptions、actionButtons 的对象
   * */
  function exportTableConfig() {
    const _tableConfig: Array<PaStructureType.TableV2> = [];
    const exOptions: PaOptionType.Default = {};

    for (const item of tableConfig.value) {
      if (item.cellConfig?.exOptions) {
        exOptions[String(item.prop)] = item.cellConfig.exOptions;
        delete item.cellConfig.exOptions;
      }
      _tableConfig.push({
        label: item.label,
        prop: item.prop,
        fixed: item.fixed,
        width: item.width,
        useFilter: item.useFilter,
        useSort: item.useSort,
        filterType: item.filterType,
        cellConfig: item.cellConfig
      });
    }

    const actionButtons = [...editOperationData.value, ...editHeadersData.value];
    return { config: _tableConfig, exOptions, actionButtons };
  }

  /**
   * @description 刷新表格数据
   * @returns `void`
   * */
  function handleRefresh(): void {
    const _baseConfig = baseConfig.value;
    if (!_baseConfig) return;
    const oldConfig = tableConfig.value;
    const findConfig = dataStructures.value.find(config => config.id === _baseConfig.sourceTable);
    if (oldConfig && findConfig?.config) {
      const outData: Array<PaStructureType.TableV2> = [];
      for (const col of findConfig.config) {
        const oldCol = oldConfig.find(oldCol => oldCol.prop === col.prop);
        if (oldCol) {
          outData.push(oldCol);
        } else {
          if (findConfig.indexKey != col.id) {
            outData.push({
              prop: col.prop,
              label: { "en-US": col.label["en-US"] || col.prop, "zh-CN": col.label["zh-CN"] || col.prop },
              fixed: "default",
              useFilter: true,
              useSort: true,
              filterType: "input",
              cellConfig: { type: "text" }
            });
          }
        }
      }
      updateColAll(outData);
    }
  }

  return {
    columnCount,
    createTable,
    updateCol,
    updateColAll,
    handleDeleteColumn,
    setTableWidth,
    exportTableConfig,
    setMockTableData,
    handleRefresh
  };
}
