/**
 * @description vue 响应式相关导入
 */
import { computed, ref } from "vue";
/**
 * @description ComponentProps 和 PaTableUseType 类型导入
 */
import { ComponentProps, PaTableUseType } from "../types";
/**
 * @description lodash 工具库
 */
import _ from "lodash";
const { cloneDeep } = _;
/**
 * @description 选择变化状态类型
 */
type selectChangeStateType = {
  row: PaTableUseType.PaTableInDataType;
  status?: boolean;
  parentRow?: PaTableUseType.PaTableInDataType;
};
/**
 * @description useSelectHooks 选择钩子
 * @param props 组件属性
 * @param state 表格状态
 * @param emits 事件发射器
 * @param getTableList 获取表格数据方法
 * @returns 选择相关方法和状态
 */
export const useSelectHooks = (
  props: ComponentProps,
  state: PaTableUseType.TableStateType,
  emits: any,
  getTableList: () => void
) => {
  /**
   * @description 是否全选状态
   */
  const isTableSelectAll = ref<boolean>(false);
  /**
   * @description 上次选中索引
   */
  const lastSelectedIndex = ref<number>(-1);
  /**
   * @description 上次选中索引状态
   */
  const lastSelectedIndexStatus = ref<boolean>(true);
  /**
   * @description 上次选中是否子项
   */
  const lastSelectIsChildren = ref<number>(-1);
  /**
   * @description Shift 键是否按下
   */
  const isShiftPressed = ref<boolean>(false);
  /**
   * @description 选中行数计算属性
   */
  const selectedRowsLength = computed(() => {
    let selectedArr;
    if (props.useChildren) {
      selectedArr = state.selectTableData.reduce((acc, cur) => acc + (cur.children?.length || 0), 0);
    } else {
      selectedArr = Object.keys(state.selectTableData).length;
    }
    return selectedArr;
  });
  /**
   * @description 键盘按下处理
   * @param event 键盘事件
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Shift") {
      isShiftPressed.value = true;
    }
  };
  /**
   * @description 键盘释放处理
   * @param event 键盘事件
   */
  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Shift") {
      isShiftPressed.value = false;
    }
  };
  if (typeof window !== "undefined" && props.useSelect) {
    typeof window !== "undefined" && window.developLog.log(`添加监听——键盘事件`, props.id, "success");
    if (typeof window !== "undefined") window.addEventListener("keydown", handleKeyDown);
    if (typeof window !== "undefined") window.addEventListener("keyup", handleKeyUp);
  }
  /**
   * @description 选择行处理
   * @param row 行数据
   * @param parentRow 父行数据
   */
  function handleSelectChange({ row, parentRow }: selectChangeStateType) {
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
   * @description 处理单个选择变化
   * @param row 行数据
   * @param parentRow 父行数据
   * @param status 选中状态
   */
  function handleSingeSelectChange({ row, parentRow, status }: selectChangeStateType) {
    if (!props.rowKey) return;
    const rowIndex = row.parentRenderIndex || row.renderIndex;
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
      lastSelectedIndex.value = rowIndex - 1 || 0;
      lastSelectIsChildren.value = row.renderIndex;
      lastSelectedIndexStatus.value = row.isSelected;
    }
    handleSelectStatusMap({ row: parentRow || row });
    if (props.useSelect) emits("selectRowBack", { row, isSelected: row.isSelected, parentRow });
    else if (props.useRadio) emits("radioRowBack", { row, isSelected: row.isSelected, parentRow });
  }
  /**
   * @description 处理选择状态映射
   * @param row 行数据
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
          state.selectTableData.push({
            ..._row,
            children: _row.children?.filter((child: any) => child.isSelected)
          });
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
   * @description 处理全选状态变化
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
   * @description 设置选中数据
   * @param dataKeys 数据键列表
   */
  function setSelectedData(dataKeys: Record<string, any>[]) {
    state.awaitSelectData = dataKeys;
    getTableList();
  }
  /**
   * @description 获取选中数据
   * @returns 选中的数据列表
   */
  function getSelectedData() {
    return [...state.awaitSelectData, ...state.selectTableData];
  }
  /**
   * @description 清理函数
   */
  const cleanup = () => {
    typeof window !== "undefined" && window.developLog.log(`关闭监听——键盘事件`, props.id, "danger");
    if (typeof window !== "undefined") {
      if (typeof window !== "undefined") window.removeEventListener("keydown", handleKeyDown);
      if (typeof window !== "undefined") window.removeEventListener("keyup", handleKeyUp);
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
