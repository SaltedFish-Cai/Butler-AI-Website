// # Import
import { computed, ref } from "vue";
import { MTableV2Type, MTableV2UseType } from "../type";
import { cloneDeep } from "lodash";

// type allType = Array<boolean | number | string> | boolean | number | string | null | undefined;

type selectChangeStateType = {
  row: MTableV2UseType.MTableV2InDataType;
  status?: boolean;
  parentRow?: MTableV2UseType.MTableV2InDataType;
};

export const useSelectHooks = (props: MTableV2Type, state: MTableV2UseType.TableStateType, emits) => {
  // #State
  const isTableSelectAll = ref<boolean>(false);
  const lastSelectedIndex = ref<number>(-1);
  const lastSelectedIndexStatus = ref<boolean>(true);
  const lastSelectIsChildren = ref<number>(-1);
  const isShiftPressed = ref<boolean>(false);

  const selectedRowsLength = computed(() => {
    let selectedArr;
    if (props.useChildren) {
      selectedArr = state.selectTableData.reduce((acc, cur) => acc + (cur.children?.length || 0), 0);
    } else {
      selectedArr = Object.keys(state.selectTableData).length;
    }
    return selectedArr;
  });

  // 监听键盘事件
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Shift") {
      isShiftPressed.value = true;
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Shift") {
      isShiftPressed.value = false;
    }
  };

  // 添加全局键盘事件监听
  if (typeof window !== "undefined" && props.useSelect) {
    window.developLog.log(`添加监听——键盘事件`, props.id, "success");
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  }

  // # Function 选择行
  function handleSelectChange({ row, parentRow }: selectChangeStateType) {
    if (!props.rowKey) return;

    const rowIndex = Number(row.parentRenderIndex) || Number(row.renderIndex);

    if (isShiftPressed.value && lastSelectedIndex.value !== -1) {
      // SHIFT多选逻辑
      const relStartIndex = lastSelectedIndex.value;
      const relEndIndex = rowIndex - 1;

      const start = Math.min(relStartIndex, relEndIndex);
      const end = Math.max(relStartIndex, relEndIndex);

      // 获取当前页面的所有行数据
      const flatTableData = state.tableData.flat().filter(item => item.type !== "more");
      if (!parentRow) {
        // 点击非子元素
        // console.log("===========> 点击非子元素");
        if (start <= end) {
          const splitData = flatTableData.slice(start, end + 1);
          splitData.forEach(item => {
            handleSingeSelectChange({ row: item, status: lastSelectedIndexStatus.value });
          });
        }
      } else {
        // 点击子元素
        if (start <= end || (lastSelectedIndex.value == rowIndex && lastSelectIsChildren.value <= row.renderIndex)) {
          // 处理父数据
          if (end - start > 1) {
            const splitData = flatTableData.slice(start + 1, end);
            splitData.forEach(item => {
              handleSingeSelectChange({ row: item, status: lastSelectedIndexStatus.value });
            });
          }

          // 处理子数据
          if (start != end) {
            const startTargetChildIndex = lastSelectIsChildren.value;
            const endTargetChildIndex = row.renderIndex;
            // 父类不同，补全父类余下
            // console.log("++++++++++> 父类不同，补全父类余下");
            const startEl = flatTableData[relStartIndex];
            const endEl = flatTableData[relEndIndex];

            const lastStatus = lastSelectedIndexStatus.value;

            if (startEl.children && endEl.children) {
              if (relStartIndex < relEndIndex) {
                // console.log("===========> A<B");
                for (let index = startTargetChildIndex; index < startEl.children.length; index++) {
                  const element = startEl.children[index];
                  handleSingeSelectChange({ row: element, parentRow: startEl, status: lastStatus });
                }
                for (let index = 0; index <= endTargetChildIndex; index++) {
                  const element = endEl.children[index];
                  handleSingeSelectChange({ row: element, parentRow: endEl, status: lastStatus });
                }
              } else {
                // console.log("===========> B<A");
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
            // 父类相同，补全当前行到renderIndex
            // console.log("++++++++++> 父类相同，补全当前行到renderIndex");
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

  // # 处理单个选择变化
  function handleSingeSelectChange({ row, parentRow, status }: selectChangeStateType) {
    if (!props.rowKey) return;
    const rowIndex = row.parentRenderIndex || row.renderIndex;

    if (props.useRadio) {
      state.tableData.map(arrItem => {
        arrItem.map(item => {
          item.isSelected = false;
        });
      });
    }

    // 传统点击
    if (typeof status === "boolean") {
      row.isSelected = status;
      row.isIndeterminate = false;
    } else {
      row.isSelected = !row.isSelected;
      row.isIndeterminate = false;
    }

    // 设置子元素选择状态
    if (!parentRow && row.children?.length) {
      row.children.forEach(item => {
        item.isSelected = row.isSelected;
      });
    } else if (parentRow) {
      const selectChildren = parentRow.children?.filter(child => child.isSelected);
      if (selectChildren?.length) parentRow.isIndeterminate = selectChildren?.length > 0;
      parentRow.isSelected = selectChildren?.length == parentRow.children?.length;
    }

    // 更新最后选择的索引
    if (typeof status != "boolean") {
      lastSelectedIndex.value = rowIndex - 1 || 0;
      lastSelectIsChildren.value = row.renderIndex;
      lastSelectedIndexStatus.value = row.isSelected;
    }
    handleSelectStatusMap({ row: parentRow || row });
    if (props.useSelect) emits("selectRowBack", { row, isSelected: row.isSelected, parentRow });
    else if (props.useRadio) emits("radioRowBack", { row, isSelected: row.isSelected, parentRow });
  }

  // # 处理选择状态映射
  type handleSelectStatusMapType = {
    row: MTableV2UseType.MTableV2InDataType;
  };
  function handleSelectStatusMap({ row }: handleSelectStatusMapType) {
    const _row = cloneDeep(row);
    if (props.useChildren) {
      const isSelected = _row?.children?.some(child => child.isSelected);
      const index = state.selectTableData.findIndex(item => item[String(props.rowKey)] === _row[String(props.rowKey)]);

      if (isSelected) {
        if (index > -1) {
          _row.children = _row.children?.filter(child => child.isSelected);
          state.selectTableData.splice(index, 1, _row);
        } else {
          state.selectTableData.push({
            ..._row,
            children: _row.children?.filter(child => child.isSelected)
          });
        }
      } else if (!isSelected && index >= 0) {
        state.selectTableData.splice(index, 1);
      }
    } else {
      const index = state.selectTableData.findIndex(item => item[String(props.rowKey)] === _row[String(props.rowKey)]);
      if (_row.isSelected && index < 0) {
        state.selectTableData.push(_row);
      } else if (!_row.isSelected && index >= 0) {
        state.selectTableData.splice(index, 1);
      }
    }
  }

  // # 处理全选状态变化
  function handleSelectAllStatus() {
    isTableSelectAll.value = !isTableSelectAll.value;
    state.selectTableData.length = 0;
    state.tableData.map(arrItem => {
      arrItem.map(item => {
        if (item.renderIndex) handleSingeSelectChange({ row: item, status: false });
      });
    });

    emits("selectRowAllBack", { isSelected: isTableSelectAll.value });
  }

  // 清理函数
  const cleanup = () => {
    window.developLog.log(`关闭监听——键盘事件`, props.id, "danger");
    if (typeof window !== "undefined") {
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
    cleanup
  };
};
