/**
 * 模块导入
 * @description 导入 Vue 响应式 API
 */
import { computed, ref } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentProps, PaTableUseType } from "../types";
/**
 * 模块导入
 * @description 导入深拷贝工具函数
 */
import cloneDeep from "../../tools/clone-deep";
/**
 * 选择变化状态类型
 */
type SelectChangeStateType = {
  row: PaTableUseType.PaTableInDataType;
  status?: boolean;
  parentRow?: PaTableUseType.PaTableInDataType;
};
/**
 * useSelectHooks 选择钩子
 * @param props - 组件属性
 * @param state - 表格状态
 * @param emits - 事件发射器
 * @param getTableList - 获取表格数据方法
 * @returns 选择相关方法和状态
 */
export const useSelectHooks = (
  props: ComponentProps,
  state: PaTableUseType.TableStateType,
  emits: any,
  getTableList: () => void
) => {
  const isBrowser = typeof window !== "undefined";
  /**
   * 全选状态
   * @type Ref<boolean>
   * @description 是否全选状态
   */
  const isTableSelectAll = ref<boolean>(false);
  /**
   * 上次选中索引
   * @type Ref<number>
   * @description 上次选中索引
   */
  const lastSelectedIndex = ref<number>(-1);
  /**
   * 上次选中索引状态
   * @type Ref<boolean>
   * @description 上次选中索引状态
   */
  const lastSelectedIndexStatus = ref<boolean>(true);
  /**
   * 上次选中是否子项
   * @type Ref<number>
   * @description 上次选中是否子项
   */
  const lastSelectIsChildren = ref<number>(-1);
  /**
   * Shift 键状态
   * @type Ref<boolean>
   * @description Shift 键是否按下
   */
  const isShiftPressed = ref<boolean>(false);
  /**
   * 选中行数
   * @type ComputedRef<number>
   * @description 选中行数计算属性
   */
  const selectedRowsLength = computed(() => {
    if (props.useChildren) {
      return state.selectTableData.reduce((acc, cur) => acc + (cur.children?.length || 0), 0);
    }
    return Object.keys(state.selectTableData).length;
  });
  /**
   * 键盘按下处理
   * @param event - 键盘事件
   * @description 监听 Shift 键按下
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Shift") isShiftPressed.value = true;
  };
  /**
   * 键盘释放处理
   * @param event - 键盘事件
   * @description 监听 Shift 键抬起
   */
  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Shift") isShiftPressed.value = false;
  };
  if (isBrowser && props.useSelect) {
    isBrowser && window.developLog.log(`添加监听——键盘事件`, props.id, "success");
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  }
  /**
   * 选择行处理
   * @param row - 行数据
   * @param parentRow - 父行数据
   * @description 处理行选择变化，支持 Shift 多选
   */
  function handleSelectChange({ row, parentRow }: SelectChangeStateType) {
    if (!props.rowKey) return;
    const rowIndex = Number(row.parentRenderIndex) || Number(row.renderIndex);
    if (isShiftPressed.value && lastSelectedIndex.value !== -1) {
      const relStartIndex = lastSelectedIndex.value;
      const relEndIndex = rowIndex - 1;
      const start = Math.min(relStartIndex, relEndIndex);
      const end = Math.max(relStartIndex, relEndIndex);
      const flatTableData = state.tableData.flat().filter((item: any) => item.type !== "more");
      if (!parentRow) {
        if (start <= end) {
          const splitData = flatTableData.slice(start, end + 1);
          splitData.forEach((item: any) => {
            handleSingeSelectChange({ row: item, status: lastSelectedIndexStatus.value });
          });
        }
      } else {
        if (start <= end || (lastSelectedIndex.value == rowIndex && lastSelectIsChildren.value <= row.renderIndex)) {
          if (end - start > 1) {
            const splitData = flatTableData.slice(start + 1, end);
            splitData.forEach((item: any) => {
              handleSingeSelectChange({ row: item, status: lastSelectedIndexStatus.value });
            });
          }
          if (start != end) {
            const startTargetChildIndex = lastSelectIsChildren.value;
            const endTargetChildIndex = row.renderIndex;
            const startEl = flatTableData[relStartIndex];
            const endEl = flatTableData[relEndIndex];
            const lastStatus = lastSelectedIndexStatus.value;
            if (startEl.children && endEl.children) {
              if (relStartIndex < relEndIndex) {
                for (let index = startTargetChildIndex; index < startEl.children.length; index++) {
                  const element = startEl.children[index];
                  handleSingeSelectChange({ row: element, parentRow: startEl, status: lastStatus });
                }
                for (let index = 0; index <= endTargetChildIndex; index++) {
                  const element = endEl.children[index];
                  handleSingeSelectChange({ row: element, parentRow: endEl, status: lastStatus });
                }
              } else {
                for (let index = row.renderIndex; index < endEl.children.length; index++) {
                  const element = endEl.children[index];
                  handleSingeSelectChange({ row: element, parentRow: endEl, status: lastStatus });
                }
                for (let index = 0; index <= lastSelectIsChildren.value; index++) {
                  const element = startEl.children[index];
                  handleSingeSelectChange({ row: element, parentRow: startEl, status: lastStatus });
                }
              }
            }
          } else {
            const _start = Math.min(lastSelectIsChildren.value, row.renderIndex);
            const _end = Math.max(lastSelectIsChildren.value, row.renderIndex);
            for (let index = _start; index <= _end; index++) {
              const element = flatTableData?.[start]?.children?.[index];
              if (element)
                handleSingeSelectChange({ row: element, parentRow: flatTableData[start], status: lastSelectedIndexStatus.value });
            }
          }
        }
      }
    } else {
      handleSingeSelectChange({ row, parentRow });
    }
  }
  /**
   * 处理单个选择变化
   * @param row - 行数据
   * @param parentRow - 父行数据
   * @param status - 选中状态
   * @description 切换单行选中状态并同步子行和父行状态
   */
  function handleSingeSelectChange({ row, parentRow, status }: SelectChangeStateType) {
    if (!props.rowKey) return;
    if (props.useRadio) {
      state.tableData.map((arrItem: any) => {
        arrItem.map((item: any) => {
          item.isSelected = false;
        });
      });
    }
    if (typeof status === "boolean") {
      row.isSelected = status;
      row.isIndeterminate = false;
    } else {
      row.isSelected = !row.isSelected;
      row.isIndeterminate = false;
    }
    if (!parentRow && row.children?.length) {
      row.children.forEach((item: any) => {
        item.isSelected = row.isSelected;
      });
    } else if (parentRow) {
      const selectChildren = parentRow.children?.filter((child: any) => child.isSelected);
      if (selectChildren?.length) parentRow.isIndeterminate = selectChildren?.length > 0;
      parentRow.isSelected = selectChildren?.length == parentRow.children?.length;
    }
    if (typeof status != "boolean") {
      const rowIndex = row.parentRenderIndex || row.renderIndex;
      lastSelectedIndex.value = rowIndex - 1 || 0;
      lastSelectIsChildren.value = row.renderIndex;
      lastSelectedIndexStatus.value = row.isSelected;
    }
    handleSelectStatusMap({ row: parentRow || row });
    if (props.useSelect) emits("selectRowBack", { row, isSelected: row.isSelected, parentRow });
    else if (props.useRadio) emits("radioRowBack", { row, isSelected: row.isSelected, parentRow });
  }
  /**
   * 处理选择状态映射
   * @param row - 行数据
   * @description 同步选中状态到 selectTableData 列表
   */
  function handleSelectStatusMap({ row }: { row: PaTableUseType.PaTableInDataType }) {
    const _row = cloneDeep(row);
    if (props.useChildren) {
      const isSelected = _row?.children?.some((child: any) => child.isSelected);
      const index = state.selectTableData.findIndex((item: any) => item[String(props.rowKey)] === _row[String(props.rowKey)]);
      if (isSelected) {
        if (index > -1) {
          _row.children = _row.children?.filter((child: any) => child.isSelected);
          state.selectTableData.splice(index, 1, _row);
        } else {
          state.selectTableData.push({ ..._row, children: _row.children?.filter((child: any) => child.isSelected) });
        }
      } else if (!isSelected && index >= 0) {
        state.selectTableData.splice(index, 1);
      }
    } else {
      const index = state.selectTableData.findIndex((item: any) => item[String(props.rowKey)] === _row[String(props.rowKey)]);
      if (_row.isSelected && index < 0) {
        state.selectTableData.push(_row);
      } else if (!_row.isSelected && index >= 0) {
        state.selectTableData.splice(index, 1);
      }
    }
  }
  /**
   * 处理全选状态变化
   * @description 切换全选状态并触发事件
   */
  function handleSelectAllStatus() {
    isTableSelectAll.value = !isTableSelectAll.value;
    state.selectTableData.length = 0;
    state.tableData.map((arrItem: any) => {
      arrItem.map((item: any) => {
        if (item.renderIndex) handleSingeSelectChange({ row: item, status: false });
      });
    });
    emits("selectRowAllBack", { isSelected: isTableSelectAll.value });
  }
  /**
   * 设置选中数据
   * @param dataKeys - 数据键列表
   * @description 设置外部传入的选中数据键并重新请求
   */
  function setSelectedData(dataKeys: Record<string, any>[]) {
    state.awaitSelectData = dataKeys;
    getTableList();
  }
  /**
   * 获取选中数据
   * @returns 选中的数据列表
   * @description 获取表格当前选中的所有数据
   */
  function getSelectedData() {
    return [...state.awaitSelectData, ...state.selectTableData];
  }
  /**
   * 清理函数
   * @description 移除键盘事件监听
   */
  const cleanup = () => {
    if (isBrowser) {
      window.developLog.log(`关闭监听——键盘事件`, props.id, "danger");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
  };
  return {
    isShiftPressed,
    selectedRowsLength,
    isTableSelectAll,
    handleSelectChange,
    handleSelectAllStatus,
    setSelectedData,
    getSelectedData,
    cleanup
  };
};
