// # Import
import { Reactive, Ref, ref, reactive, nextTick } from "vue";
import { MTableV2Type, MTableV2ItemType, MTableV2UseItemType, MTableV2UseType } from "../type";
import { useObserverHooks } from "./use-observer-hooks";
import lodashPkg from "lodash";
import { setWidthToNumber, setWidthToString } from "./string-number";
import { MFormV2ChildType } from "../../m-form-v2/type";

export const useStateHooks = (
  props: MTableV2Type,
  emits,
  { language, languagePackage, bodyRef, contentRef, mScrollbarListRef, isIntersectingList, isInViewList, infiniteScroll }
) => {
  const { debounce, isNil, cloneDeep } = lodashPkg;
  const { listenCellInView, listenCellChildChange, clearListen } = useObserverHooks(props, {
    mScrollbarListRef,
    contentRef,
    isIntersectingList,
    isInViewList,
    setCellWidth,
    infiniteScroll
  });
  const rowIndexWidth = 20;

  const PAGE_NUM = 1;
  const PAGE_SIZE = 30;
  const tableStructure: Ref<Array<MTableV2ItemType & MTableV2UseItemType>> = ref([]);
  const state: Reactive<MTableV2UseType.TableStateType> = reactive({
    tableData: [],
    flatTableData: [],
    selectTableData: [],
    summaryData: [],
    PageNum: 1,
    maxPage: 0,
    pageable: {
      PageNum: PAGE_NUM,
      PageSize: PAGE_SIZE,
      pageSizes: [PAGE_SIZE, 50, 100, 150],
      total: 0
    },
    tableQuery: {
      Filter: [],
      AdvancedFilter: [],
      Page: {
        PageNum: PAGE_NUM,
        PageSize: PAGE_SIZE
      },
      Params: {},
      Sort: []
    },
    setCellWidthIng: true,
    tableLoadStatus: false,
    tableLoadEndStatus: false,
    useOrderPropName: "",
    isRowOpenStatus: false,
    showSelectList: false,
    hoveredRowIndex: -1,
    hoveredColumnIndex: -1,

    listenCellInViewIng: false,

    oldPageIndex: -1,

    useAverageWidth: -1,

    inRules: {}
  });

  // 添加鼠标悬停事件处理函数
  function handleCellMouseEnter(rowIndex: number, columnIndex: number) {
    state.hoveredRowIndex = rowIndex;
    state.hoveredColumnIndex = columnIndex;
  }

  function handleCellMouseLeave() {
    state.hoveredRowIndex = -1;
    state.hoveredColumnIndex = -1;
  }

  function isFixedLeftItem(item) {
    return item.type == "row" || item.type == "selection" || item.type == "index" || item.type == "radio";
  }

  function isFixedRightItem(item) {
    return item.prop == "operation";
  }

  // # Function  解析·校验规则
  function setRule(item: MFormV2ChildType) {
    const baseRules =
      item.display || item.disabled
        ? []
        : [{ required: true, message: languagePackage.value["requiredMessage"], trigger: "blur" }];
    // if (item.type == "select" || item.type == "multiple-select" || item.type == "number") {
    //   baseRules = [{ required: true, message: "此项为必填项", trigger: "change" }];
    // }
    // const _rules = item?.isText == true ? [] : item.rules ? item.rules : [{ required: true, message: "此项为必填项", trigger: "blur" }];
    let _rules = baseRules;
    if (item.rules && Array.isArray(item.rules)) {
      let isRequired = true;
      _rules = item.rules.map(item => {
        if (item.required == false) {
          isRequired = false;
        }
        const data = {
          trigger: "blur",
          required: item.required || true,
          ...item,
          message:
            typeof item.message == "string"
              ? item.message
              : item.message?.[language?.value || "zh-CN"] || languagePackage.value["requiredMessage"]
        };
        return data;
      });

      if (!isRequired) {
        item.rules = false;
      }
    }

    if (item.required == false) {
      item.rules = false;
    }

    // >-------------> 强制不使用校验 <------------<
    const _prop = item.prop as string;
    // if (props.display) {
    //   state.inRules[_prop] = item.display || item.disabled ? [] : item.rules || [];
    //   return;
    // }
    if (_prop && item.rules != false && _rules.length) {
      const _baseRules = props.exDependent?.exCellRules || {};
      if (_baseRules[_prop]) {
        state.inRules[_prop] = [..._rules, ..._baseRules[_prop]];
      } else {
        state.inRules[_prop] = _rules;
      }
    }
  }

  /**
   * # Function 设置表格配置
   * @description 设置表格配置，根据 props.useChildren 或 props.useExpand 来添加 row 类型的列
   * @param {Array<MTableV2ItemType>} _config - 表格配置
   */
  function setTableConfig(_config: Array<MTableV2ItemType & MTableV2UseItemType>, callback?: () => void) {
    const config = cloneDeep(_config);
    const stringRowIndexWidth = setWidthToString(rowIndexWidth);
    const list: Array<MTableV2ItemType & MTableV2UseItemType> = [
      ...config.map(item => {
        if (item.cellConfig) {
          item.cellConfig.display = item?.cellConfig?.display || false;
        } else {
          item.cellConfig = {
            type: item.filterType == "select" ? "select" : "input",
            display: true
          };
        }
        const data: MTableV2ItemType & MTableV2UseItemType = {
          ...item,
          label: String(item.label?.[language.value || "zh-CN"] || item.label),
          filterType: item.filterType || undefined,
          fixed: (isFixedLeftItem(item) ? "left" : isFixedRightItem(item) ? "right" : item.fixed) as "left" | "right" | undefined,
          // width: isFixedLeftItem(item) ? stringRowIndexWidth : setWidthToString(item.width),
          minWidth: item.minWidth || (isFixedLeftItem(item) ? stringRowIndexWidth : setWidthToString(item.width)),
          baseWidth: item.baseWidth || (isFixedLeftItem(item) ? stringRowIndexWidth : setWidthToString(item.width)),
          useSort: item.prop == "operation" ? false : item.useSort,
          useFilter: item.prop == "operation" ? false : item.useFilter
        };
        if (data.cellConfig) setRule({ ...data.cellConfig, prop: data.prop });
        return data;
      })
    ];

    // @ 添加左侧固定列
    const leftFixedItem: MTableV2ItemType & MTableV2UseItemType = {
      minWidth: stringRowIndexWidth,
      width: stringRowIndexWidth,
      baseWidth: stringRowIndexWidth,
      fixed: "left"
    };
    if (props.useChildren || props.useExpand) list.unshift({ type: "row", ...leftFixedItem });
    if (props.useSelect) list.unshift({ type: "selection", ...leftFixedItem });
    else if (props.useRadio) list.unshift({ type: "radio", ...leftFixedItem });
    else if (props.useTableIndex) list.unshift({ type: "index", ...leftFixedItem });

    // @ 设置排序位置
    const showArr = list.filter(item => item.isShow !== false);
    const hideArr = list.filter(item => item.isShow === false);

    const LeftArr = showArr.filter(item => item.fixed == "left");
    const RightArr = showArr.filter(item => item.fixed == "right");

    const defaultArr = showArr.filter(item => item.fixed != "left" && item.fixed != "right");
    const _tableStructure = [...LeftArr, ...defaultArr, ...RightArr, ...hideArr];

    // @ 初始化表头（未请求接口，仅初始化一次）
    tableStructure.value = _tableStructure;
    callback?.();
  }
  setTableConfig(props.structure as Array<MTableV2ItemType & MTableV2UseItemType>);

  // # Function 获取合计值
  function getSummary() {
    const baseData = state.tableData.flat(2);
    const tableData = flatTableDataFunc(state.tableData.flat(2));
    if (props.summaryFunction) {
      const outData = props.summaryFunction({ columns: tableStructure.value, data: baseData });
      return (state.summaryData = outData);
    }

    const data = tableData;
    const sums: string[] = [];
    const exText = "";
    tableStructure.value.forEach((column: MTableV2ItemType, index) => {
      if (index === 0) {
        sums[index] = props?.summaryConfig?.sumText || "合计";
        return;
      }

      if (column?.useSum == false) {
        return (sums[index] = exText);
      }
      const values = data.map(item => item.map(_item => Number(_item[String(column.prop)])));
      const _value = values.flat(Infinity);
      if (!_value.every(value => Number.isNaN(value))) {
        sums[index] = `${_value.reduce((prev, curr) => {
          const value = Number(curr);
          if (!Number.isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0)}`;
        sums[index] =
          Number(sums[index])?.toLocaleString("zh", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
          (!isNil(column?.unitText) ? column?.unitText : props?.summaryConfig?.unitText);
      } else {
        sums[index] = exText;
      }
    });

    state.summaryData = sums;
  }

  const debounceGetSummary = debounce(getSummary, 50, { trailing: true });

  function flatTableDataFunc(tableData: Array<{ [x: string]: any }>, flatArr: any = []) {
    tableData.forEach(async (col: any) => {
      if (col?.children?.length) {
        flatArr.push(...flatTableDataFunc(col.children, []));
      }
      flatArr.push(col);
    });
    return flatArr;
  }

  function cleanTableData() {
    state.tableData.length = 0;
  }

  // # Function 获取表格数据
  async function getTableList(exQuery: MTableV2UseType.TableQueryType = {}, stopListen: boolean = false) {
    if (state.showSelectList) return;

    // @ 如果没有Page对象，重制分页请求，关闭监听
    const keys = Object.keys(exQuery).filter(item => item !== "Page");
    if (keys.length || (exQuery.Page && exQuery.Page?.PageSize)) {
      listenCellInView.close();
      state.listenCellInViewIng = false;
      state.PageNum = 1;
      state.tableData.length = 0;
      state.flatTableData.length = 0;
      state.tableLoadEndStatus = false;
      state.oldPageIndex = -1;

      exQuery.Page = {
        PageNum: 1,
        PageSize: exQuery.Page?.PageSize || state.pageable.PageSize || 1
      };
    }
    if (stopListen) {
      listenCellInView.close();
      state.listenCellInViewIng = false;
    }

    if (!infiniteScroll.value) {
      state.flatTableData.length = 0;
      state.tableData.length = 0;
    }

    // @ 如果存在Page，更新Page信息
    if (exQuery?.Page) {
      const _page = {
        PageNum: exQuery.Page.PageNum || state.pageable.PageNum,
        PageSize: exQuery.Page.PageSize || state.pageable.PageSize
      };
      exQuery.Page = _page;
      // const max_page = Math.ceil(state.pageable.total / state.pageable.PageSize);
      state.pageable = { ...state.pageable, ..._page };
      // if (state.pageable.PageNum > max_page) return;
    }

    const _pageNum = (exQuery.Page?.PageNum || 1) - 1 <= 0 ? 0 : (exQuery.Page?.PageNum || 1) - 1;

    // @ 如果数据加载结束或者当前页数据已经存在，则不再请求数据
    if (
      state.tableLoadEndStatus ||
      (state.tableData?.length && state.tableData[_pageNum]?.length && state.tableData[_pageNum][1].type != "empty")
    ) {
      if (props.useSummary && !props.usePagination) debounceGetSummary();
      window.developLog.log("当前页数据已经存在", _pageNum, "info");
      if (props.usePagination && !stopListen) {
        // @ 开始监听元素是否进入视窗
        nextTick(() => {
          listenCellInView.create();
          state.listenCellInViewIng = true;
        });
      }
      return;
    }

    if (state.tableLoadStatus) return;
    state.tableLoadStatus = true;

    const _query = { ...state.tableQuery, ...exQuery };

    state.tableQuery = _query;

    let index = _pageNum * state.pageable.PageSize;
    let renderIndex = _pageNum * state.pageable.PageSize;

    // @ requestApi
    const { Data, Code } = await props.requestApi(_query);
    if (Code == 200) {
      const { List, TotalCount } = Data;
      const _data = props.usePagination ? List : Data;
      const ar: MTableV2UseType.dataType = [
        { renderIndex: -1, parentRenderIndex: -1, rowIndex: -1, type: "more", name: String(_pageNum) }
      ];
      _data.forEach(item => {
        index++;
        renderIndex++;
        const selectedItem = state.selectTableData.find(child => child[String(props.rowKey)] === item[String(props.rowKey)]);
        ar.push({
          rowIndex: index,
          renderIndex: renderIndex,
          parentRenderIndex: renderIndex,
          isIndeterminate: selectedItem?.children?.length && selectedItem?.children?.length > 0,
          isSelected: props.useChildren ? selectedItem?.children?.length == item?.children?.length : selectedItem?.isSelected,
          isOpenChild: props.expandAuto || false,
          ...item,
          children: item?.children?.map((ch, ch_i) => {
            index++;
            return {
              rowIndex: index,
              parentRenderIndex: renderIndex,
              isSelected: selectedItem?.children?.some(child => child[String(props.rowKey)] === ch[String(props.rowKey)]),
              renderIndex: ch_i,
              ...ch
            };
          })
        });
      });
      state.flatTableData = [...state.flatTableData, ..._data];

      state.tableData[_pageNum] = ar;

      // @ 删除当前页 上下5页 的数据
      // const sliceStart = _pageNum - 5 < 0 ? 0 : _pageNum - 5;
      // const sliceEnd = _pageNum + 5;

      // for (let index = 0; index < sliceStart; index++) {
      //   delete state.tableData[index];
      // }
      // for (let index = sliceEnd; index < state.tableData.length; index++) {
      //   delete state.tableData[index];
      // }

      if (infiniteScroll.value) {
        const up_pageNum = _pageNum - 1 >= 0 ? _pageNum - 1 : 0;
        if (!state.tableData[up_pageNum]?.length) {
          state.tableData[up_pageNum] = [
            { renderIndex: -1, parentRenderIndex: -1, rowIndex: -1, type: "more", name: String(up_pageNum) }
          ];
          const emptyArr = Array.from({ length: 15 });
          // const _emptyMoreIndex = Math.round(emptyArr.length / 2);
          emptyArr.forEach(() => {
            state.tableData[up_pageNum].push({ renderIndex: -1, parentRenderIndex: -1, rowIndex: -1, type: "empty" });
          });
        }
      }

      state.pageable.total = TotalCount;

      // @ 使用统计功能时，不可使用分页功能
      if (props.useSummary && !props.usePagination) debounceGetSummary();

      if (props.summaryFunction) debounceGetSummary();

      state.tableLoadStatus = false;

      // 结束全部请求
      if (state.flatTableData.length >= Data.TotalCount || !props.usePagination) {
        state.tableLoadEndStatus = true;
      }
    }

    listenCellChildChange.create?.();
    if (props.usePagination && !stopListen) {
      // @ 开始监听元素是否进入视窗
      nextTick(() => {
        listenCellInView.create();
        state.listenCellInViewIng = true;
      });
    }
  }

  // # Function 设置单元格宽度
  function setCellWidth() {
    state.setCellWidthIng = true;
    state.useAverageWidth = -1;
    nextTick(() => {
      const maxWidth = 500;
      let maxIndex = -1;
      let isMaxValue = 0;
      // @ 计算所有单元格宽度总和
      let allWidth = 0;

      // 去掉px单位，转换为数字
      const contentClientWidth = Number(bodyRef.value.clientWidth);
      const exOut = ["selection", "radio", "expand", "row"];
      const _tableStructure = cloneDeep(tableStructure.value);

      const indexArr = window.document?.querySelectorAll(`#${props.id} .find_cell_index`);
      let maxIndexNumber = 20;
      indexArr?.forEach(item => {
        if (item.clientWidth > maxIndexNumber) {
          maxIndexNumber = item?.clientWidth || 20;
        }
      });
      _tableStructure?.forEach((item, index) => {
        if (exOut.indexOf(String(item.type)) > -1) return;
        if (item.type == "index") {
          item.width = setWidthToString(maxIndexNumber);
          return;
        }
        const operation_item = window.document?.querySelectorAll(`#${props.id} .find_cell_${item.prop}`);
        let useWidth = 0;

        if (operation_item && operation_item.length > 0) {
          for (let index = 0; index < operation_item.length; index++) {
            const element = operation_item[index] as HTMLElement;
            const offsetWidth = element.clientWidth;
            if (useWidth < offsetWidth) {
              useWidth = offsetWidth;
            }
          }

          const _width = (useWidth > maxWidth ? maxWidth : useWidth) + 1;

          item.width = item.baseWidth || setWidthToString(_width);

          allWidth += setWidthToNumber(item.width);

          item.minWidth = item.baseWidth || item.minWidth || String(item.width);
          if (!item.baseWidth && item.prop != "operation" && _width > isMaxValue) {
            maxIndex = index;
          }
          isMaxValue = _width;
        }
      });

      if (contentClientWidth > allWidth) {
        window.developLog.log(`滚动条值大于所有宽度`, props.id, "info");
        state.useAverageWidth = 1;
      } else {
        window.developLog.log(`滚动条值大于所有宽度`, props.id, "info");
        state.useAverageWidth = 0;
        if (maxIndex != -1) _tableStructure[maxIndex].width = "";
      }
      // _tableStructure[maxIndex].width =
      //   exOut.indexOf(String(_tableStructure[maxIndex].type)) < 0 ? "" : _tableStructure[maxIndex].width;

      //  else {
      //   const widthArr = {};
      //   for (let index = 0; index < props.structure.length; index++) {
      //     const element = props.structure[index];
      //     widthArr[element.prop] = setWidthToString(element.width);
      //   }
      //   _tableStructure.forEach(item => {
      //     if (exOut.indexOf(String(item.type)) > -1) {
      //       return;
      //     }
      //     if (item.prop && widthArr[item.prop]) {
      //       item.width = widthArr[item.prop];
      //     } else if (item.prop != "operation") {
      //       item.width = "";
      //     }
      //   });
      // }

      const showArr = _tableStructure.filter(item => item.isShow !== false);
      const hideArr = _tableStructure.filter(item => item.isShow === false);

      const LeftArr = showArr.filter(item => item.fixed == "left");
      let _fixedValue = 0;
      LeftArr.forEach((item, index) => {
        item.fixedValueIndex = index;
        item.fixedValue = setWidthToString(_fixedValue);
        item.lastLeftFixed = index == LeftArr.length - 1;
        _fixedValue += setWidthToNumber(item.width || item.minWidth);
      });

      const RightArr = showArr.filter(item => item.fixed == "right");
      RightArr.reverse();
      let _rightFixedValue = 0;
      RightArr.forEach((item, index) => {
        item.fixedValueIndex = index;
        item.fixedValue = setWidthToString(_rightFixedValue);
        item.lastRightFixed = index == RightArr.length - 1;
        _rightFixedValue += setWidthToNumber(item.width || item.minWidth);
      });
      RightArr.reverse();

      const defaultArr = showArr.filter(item => item.fixed != "left" && item.fixed != "right");
      const _Structure = [...LeftArr, ...defaultArr, ...RightArr, ...hideArr];

      tableStructure.value = _Structure;
      state.setCellWidthIng = false;
    });
  }

  // # Function 切换行状态
  function changeRowStatus({ item, row }) {
    row.isOpenChild = !row.isOpenChild;
    state.isRowOpenStatus = state.tableData.flat().filter(item => item.isOpenChild).length > 0;
    emits("changeRowStatus", { item, row });
  }

  // # Function 切换所有行状态
  function changeRowAllStatus() {
    state.isRowOpenStatus = !state.isRowOpenStatus;
    state.tableData = state.tableData.map(item =>
      item.map(child => {
        child.isOpenChild = state.isRowOpenStatus;
        return child;
      })
    );
    emits("changeRowAllStatus", state.isRowOpenStatus);
  }

  function changeSelectListVisible() {
    if (state.showSelectList) {
      const _selectTableData = state.selectTableData;
      state.tableData = state.tableData.map(row => {
        return row.map(item => {
          const targetRow = _selectTableData.find(row => row[String(props.rowKey)] === item[String(props.rowKey)]);
          if (targetRow) {
            if (props.useChildren) {
              item.isIndeterminate = targetRow?.children?.length ? targetRow?.children?.length > 0 : false;
              item.isSelected = targetRow?.children?.length == item?.children?.length;
              item.children = item?.children?.map(ch => {
                ch.isSelected = targetRow?.children?.some(child => child[String(props.rowKey)] === ch[String(props.rowKey)]);
                return ch;
              });
              return item;
            } else {
              item.isIndeterminate = false;
              item.isSelected = targetRow?.isSelected;
              return item;
            }
          } else {
            if (props.useChildren) {
              item.isIndeterminate = false;
              item.isSelected = false;
              item.children = item?.children?.map(ch => {
                ch.isSelected = false;
                return ch;
              });
              return item;
            } else {
              item.isIndeterminate = false;
              item.isSelected = false;
              return item;
            }
          }
        });
      });
    }
    state.showSelectList = !state.showSelectList;
  }

  return {
    // ...toRefs(state),
    state,
    tableStructure,
    setTableConfig,
    getTableList,
    cleanTableData,
    getSummary,
    changeRowStatus,
    changeRowAllStatus,
    changeSelectListVisible,
    handleCellMouseEnter,
    handleCellMouseLeave,
    listenCellInView,
    listenCellChildChange,
    clearListen
  };
};
