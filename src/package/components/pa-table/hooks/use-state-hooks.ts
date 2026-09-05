/**
 * @description useStateHooks 状态钩子
 */
import { Ref, ref, reactive, nextTick, Reactive } from "vue";
import { ComponentProps, ComponentItemProps, ComponentUseItemProps, PaTableUseType } from "../types";
import { useObserverHooks } from "./use-observer-hooks";
import { setWidthToNumber, setWidthToString } from "./string-number";
import { PaFormChildType } from "../../pa-form/types";
/**
 * 模块导入
 * @description 导入数组分割工具
 */
import { splitArray } from "../../utils/arraySplit";
/**
 * @description 防抖工具函数
 */
import debounce from "../../tools/debounce";
/**
 * @description 空值检查工具函数
 */
import isNil from "../../tools/is-nil";
/**
 * @description 深拷贝工具函数
 */
import cloneDeep from "../../tools/clone-deep";

export const useStateHooks = (
  props: ComponentProps,
  emits,
  { isScrollHeaderIng, language, bodyRef, contentRef, mScrollbarListRef, isIntersectingList, isInViewList, infiniteScroll }
) => {
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
  const tableStructure: Ref<Array<ComponentItemProps & ComponentUseItemProps>> = ref([]);
  const state: Reactive<PaTableUseType.TableStateType> = reactive({
    tableLoadingSize: 100,
    tableData: [],
    flatTableData: [],
    selectTableData: [],
    summaryData: [],
    PageNum: 1,
    maxPage: 0,
    pageable: {
      PageNum: PAGE_NUM,
      PageSize: PAGE_SIZE,
      pageSizes: [PAGE_SIZE, 50, 100, 150, 500],
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
    widthAnimIng: false,
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

    inRules: {},

    awaitSelectData: []
  });

  /**
   * 鼠标悬停事件处理
   * @param rowIndex - 行索引
   * @param columnIndex - 列索引
   * @description 鼠标移入单元格时更新悬停状态
   */
  function handleCellMouseEnter(rowIndex: number, columnIndex: number) {
    state.hoveredRowIndex = rowIndex;
    state.hoveredColumnIndex = columnIndex;

    if (isScrollHeaderIng.value) {
      state.hoveredRowIndex = -1;
      state.hoveredColumnIndex = -1;
      contentRef.value?.classList?.remove("use-hover");
      return contentRef.value?.style?.setProperty(`--body_content_col_hover_index`, -1);
    }
    clearTimeout(timeOut);
    contentRef.value?.classList?.add("use-hover");
    contentRef.value?.style?.setProperty(`--body_content_col_hover_index`, columnIndex);
  }

  let timeOut: any = null;
  function handleCellMouseLeave() {
    if (timeOut) {
      clearTimeout(timeOut);
    }
    timeOut = setTimeout(() => {
      state.hoveredRowIndex = -1;
      state.hoveredColumnIndex = -1;
      contentRef.value?.classList?.remove("use-hover");
      contentRef.value?.style?.setProperty(`--body_content_col_hover_index`, -1);
      isScrollHeaderIng.value = false;
    }, 300);
  }

  function isFixedLeftItem(item) {
    return item.type == "row" || item.type == "selection" || item.type == "index" || item.type == "radio";
  }

  function isFixedRightItem(item) {
    return item.prop == "operation";
  }

  /**
   * 解析·校验规则
   * @param item - 表单项配置
   * @description 解析并设置单元格的校验规则
   */
  function setRule(item: PaFormChildType) {
    const baseRules =
      item.display || item.disabled
        ? []
        : [
            {
              required: true,
              message: { "zh-CN": "此项为必填项", "en-US": "Please input" }[language.value || "zh-CN"],
              trigger: "blur"
            }
          ];
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
              : item.message?.[language?.value || "zh-CN"] ||
                { "zh-CN": "此项为必填项", "en-US": "Please input" }[language.value || "zh-CN"]
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

    const _prop = item.prop as string;
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
   * 设置表格配置
   * @param _config - 表格列配置数组
   * @param callback - 配置完成回调
   * @description 根据 props.useChildren 或 props.useExpand 添加 row 类型的列
   */
  function setTableConfig(_config: Array<ComponentItemProps & ComponentUseItemProps>, callback?: () => void) {
    const config = cloneDeep(_config);
    const stringRowIndexWidth = setWidthToString(rowIndexWidth);
    const list: Array<ComponentItemProps & ComponentUseItemProps> = [
      ...config.map(item => {
        if (item.cellConfig) {
          item.cellConfig.display = item?.cellConfig?.display || false;
        } else {
          item.cellConfig = {
            type: item.filterType == "select" ? "select" : "input",
            display: true
          };
        }
        const data: ComponentItemProps & ComponentUseItemProps = {
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
    const leftFixedItem: ComponentItemProps & ComponentUseItemProps = {
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
  setTableConfig(props.structure as Array<ComponentItemProps & ComponentUseItemProps>);

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
    tableStructure.value.forEach((column: ComponentItemProps, index) => {
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

  let intervalId: any = null;
  let timeoutId: any = null;

  /**
   * 构建表格行数据
   * @param items - 原始行数组
   * @param startIndex - 起始索引（rowIndex/renderIndex 起点，分页时按页码 * PageSize 计算）
   * @description 与 getTableList 对齐，为每行补充 rowIndex/renderIndex/isSelected 等内部字段，并同步选中态
   */
  function buildRows(items: any[], startIndex: number) {
    let index = startIndex;
    let renderIndex = startIndex;
    const ar: PaTableUseType.dataType = [];
    items.forEach(item => {
      index++;
      renderIndex++;
      let selectedItem = state.selectTableData.find(child => child[String(props.rowKey)] === item[String(props.rowKey)]);
      if (!selectedItem) {
        const _index = state.awaitSelectData.findIndex(data => data[String(props.rowKey)] === item[String(props.rowKey)]);

        if (_index >= 0) {
          state.awaitSelectData.splice(_index, 1);
        }

        selectedItem = {
          ...item,
          children: item?.children?.map(ch => {
            const _ind = state.awaitSelectData.findIndex(data => data[String(props.rowKey)] === ch[String(props.rowKey)]);
            if (_ind >= 0) {
              state.awaitSelectData.splice(_ind, 1);
            }
            const outData = { ...ch, isSelected: _ind >= 0 };

            if (_ind >= 0) {
              state.selectTableData.push(outData);
            }

            return outData;
          }),
          isSelected: _index >= 0
        };
        if (_index >= 0) {
          state.selectTableData.push(selectedItem as PaTableUseType.PaTableInDataType);
        }
      }

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
    return ar;
  }

  // # Function 获取表格数据
  async function getTableList(exQuery: PaTableUseType.TableQueryType = {}, stopListen: boolean = false) {
    if (state.showSelectList) return;

    // @ 如果没有Page对象，重制分页请求，关闭监听
    const keys = Object.keys(exQuery).filter(item => item !== "Page");
    if (keys.length || (exQuery.Page && exQuery.Page?.PageSize)) {
      listenCellChildChange.close?.();
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
      clearListen();
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
      typeof window !== "undefined" && window.developLog.log("当前页数据已经存在", _pageNum, "info");

      state.tableLoadingSize = 100;
      clearInterval(intervalId);
      clearTimeout(timeoutId);

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

    // mock loading
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    state.tableLoadingSize = Math.floor(Math.random() * (23 - 5 + 1)) + 5;
    await nextTick();
    intervalId = setInterval(() => {
      state.tableLoadingSize += Math.floor(Math.random() * (20 - 10 + 1)) + 10;
      if (state.tableLoadingSize >= 87) state.tableLoadingSize = 87;
    }, 500);
    timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    }, 8000);

    const _query = { ...state.tableQuery, ...exQuery };

    state.tableQuery = _query;

    let _data: any = [];

    // @ requestApi
    const _Data = (await props.requestApi(_query)) || {};
    const { Data = { List: [], TotalCount: 0 }, Code = 200 } = _Data;
    if (Code == 200) {
      const { List, TotalCount } = Data;
      _data = props.usePagination ? List : Data || [];
      const ar: PaTableUseType.dataType = [
        { renderIndex: -1, parentRenderIndex: -1, rowIndex: -1, type: "more", name: String(_pageNum) }
      ];
      ar.push(...buildRows(_data, _pageNum * state.pageable.PageSize));

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
        // 虚拟滚动模式下不再创建 "more" 和 "empty" 占位元素
        // 改为在首次加载时设置初始占位，用于触发后续页面的 IntersectionObserver（兼容模式）
        // 后续版本可完全移除 IntersectionObserver，改为基于 scrollTop 触发加载
        const up_pageNum = _pageNum - 1 >= 0 ? _pageNum - 1 : 0;
        if (!state.tableData[up_pageNum]?.length) {
          state.tableData[up_pageNum] = [
            { renderIndex: -1, parentRenderIndex: -1, rowIndex: -1, type: "more", name: String(up_pageNum) }
          ];
        }
      }

      state.pageable.total = TotalCount;

      // @ 使用统计功能时，不可使用分页功能
      if (props.useSummary && !props.usePagination) debounceGetSummary();

      if (props.summaryFunction) debounceGetSummary();

      // 结束全部请求
      if (state.flatTableData.length >= Data.TotalCount || !props.usePagination) {
        state.tableLoadEndStatus = true;
      }
    }
    // console.log("++++++++++> mScrollbarListRef.value:", mScrollbarListRef.value);
    // mScrollbarListRef.value.update();
    state.tableLoadStatus = false;

    listenCellChildChange.create?.(async () => {
      state.flatTableData = [...state.flatTableData, ..._data];
    });

    state.tableLoadingSize = 100;
    clearInterval(intervalId);
    clearTimeout(timeoutId);

    if (props.usePagination && !stopListen) {
      // @ 开始监听元素是否进入视窗
      nextTick(() => {
        listenCellInView.create();
        state.listenCellInViewIng = true;
      });
    }
  }

  // # Function 设置单元格宽度
  // 虚拟滚动模式下，可视区行首次加载时可能未渲染（virtualBodyHeight 尚未就绪），
  // 此时没有可测量的单元格；用重试等待行渲染出来一次性完成测量，避免列宽失效与二次闪烁
  let retryCellWidthCount = 0;
  function setCellWidth(skipFade = false) {
    state.setCellWidthIng = true;
    state.useAverageWidth = -1;
    bodyRef.value.style.transition = "0s";
    nextTick(() => {
      // skipFade 为 true（changeData_* 触发）时不隐藏，避免页面先空白后显示
      bodyRef.value.style.opacity = skipFade === true ? 1 : 0;
      const maxWidth = 500;
      let maxIndex = -1;
      let isMaxValue = 0;
      // @ 计算所有单元格宽度总和
      let allWidth = 0;

      // 有数据但尚未渲染出任何单元格（首次加载虚拟滚动高度未就绪）时延迟重试
      const hasCell = typeof window === "undefined" || !!document.querySelector(`#${props.id} .pa-table_body_content_cell`);
      if (!skipFade && state.flatTableData.length > 0 && !hasCell && retryCellWidthCount < 10) {
        state.setCellWidthIng = false;
        retryCellWidthCount++;
        setTimeout(() => setCellWidth(false), 300);
        return;
      }
      retryCellWidthCount = 0;

      // 去掉px单位，转换为数字
      const contentClientWidth = Number(bodyRef.value.clientWidth);
      const exOut = ["selection", "radio", "expand", "row"];
      const _tableStructure = cloneDeep(tableStructure.value);

      // 原始配置宽度 Map（按 prop），用于每次测量前重置 width/minWidth/baseWidth，
      // 避免上一次实测值残留导致二次 setCellWidth / changeData_All 时宽度与真实内容产生偏差
      const originConfigMap: { [x: string]: { width?: string; baseWidth?: string; minWidth?: string } } = {};
      (props.structure || []).forEach((cfg: any) => {
        if (!cfg.prop) return;
        originConfigMap[cfg.prop] = {
          width: setWidthToString(cfg.width),
          baseWidth: cfg.baseWidth || setWidthToString(cfg.width),
          minWidth: cfg.minWidth || setWidthToString(cfg.width)
        };
      });

      const indexArr = typeof window !== "undefined" && window.document?.querySelectorAll(`#${props.id} .find_cell_index`);
      let maxIndexNumber = 20;
      if (indexArr)
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
        // 重置为原始配置，避免上次实测值粘连
        const origin = item.prop ? originConfigMap[item.prop] : null;
        if (origin) {
          item.width = origin.width;
          item.baseWidth = origin.baseWidth;
          item.minWidth = origin.minWidth;
        }
        const operation_item =
          typeof window !== "undefined" && window.document?.querySelectorAll(`#${props.id} .find_cell_${item.prop}`);
        let useWidth = 0;

        if (operation_item && operation_item.length > 0) {
          for (let index = 0; index < operation_item.length; index++) {
            const element = operation_item[index] as HTMLElement;
            const offsetWidth = element.clientWidth;
            if (useWidth < offsetWidth) {
              useWidth = offsetWidth;
            }
          }
          const isWidth = (useWidth > maxWidth ? maxWidth : useWidth) + 1;
          const _width = isWidth % 2 == 0 ? isWidth : isWidth + 1;
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
        typeof window !== "undefined" && window.developLog.log(`滚动条值大于所有宽度`, props.id, "info");
        state.useAverageWidth = 1;
      } else {
        typeof window !== "undefined" && window.developLog.log(`滚动条值大于所有宽度`, props.id, "info");
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

      nextTick(() => {
        if (contentClientWidth > allWidth) {
          // @ 查找宽度最大的元素，忽略存在 type 属性的元素（如 row/selection/index/radio）及 operation 列
          let findMaxWidthItem = _Structure.find(item => isNil(item.baseWidth));
          if (!findMaxWidthItem) {
            const _findMaxWidthItem = _Structure
              .filter(item => !item.type && item.prop != "operation")
              .reduce<(ComponentItemProps & ComponentUseItemProps) | null>(
                (max, item) => (setWidthToNumber(item.width) > setWidthToNumber(max?.width) ? item : max),
                null
              );
            if (_findMaxWidthItem) {
              findMaxWidthItem = _findMaxWidthItem;
            }
          }

          tableStructure.value.forEach(item => {
            if (item.prop == findMaxWidthItem?.prop) {
              item.width = "auto";
            }
          });
        }

        if (skipFade !== true) {
          setTimeout(() => {
            bodyRef.value.style.transition = "opacity var(--pa-animation-time, 0.2s)";
            bodyRef.value.style.opacity = 1;
          }, 500);
        }

        // if (contentClientWidth > allWidth) {
        //   showScrollX.value = true;
        // } else {
        //   showScrollX.value = false;
        // }
      });
    });
  }

  // # Function 虚拟滚动 - 增量列宽重算
  // 全量 setCellWidth 只在数据重置（首次加载/刷新/换页/changeData_*）时被触发；
  // 虚拟滚动模式下后续追加的数据页、滚动进入可视区的新内容不会触发它，
  // 更宽的内容会被固定列宽挤压换行，更窄的内容又会让列宽显得过宽。
  // 这里提供"空闲防抖 + 按可视内容自适应（可增可减）"的增量测量：
  //   1. 由 props.alwaysWatchWidth 控制是否开启：开启后内容列随滚动持续动态计算；
  //      关闭（默认）时仅最后一列操作列（operation）保持滚动动态计算；
  //   2. 滚动空闲 / 数据追加后再测量，避免滚动过程中反复重排影响流畅度；
  //   3. 引入迟滞阈值，实测宽度与当前列宽差异过小时不回写，
  //      吸收取整误差与轻微波动，抑制来回滚动时列宽的抖动；
  //   4. 测量态切换与宽度回写在同一任务内完成（仅 nextTick 微任务，无中间渲染帧），
  //      且不整体隐藏内容、不做透明度过渡，避免页面闪白；
  //   5. 配置了固定宽度的内容列遵循用户约束，不做自动缩放（operation 列除外）。
  let columnWidthReCalcTimer: any = null;
  function isVirtualMode() {
    return !!(props.usePagination || infiniteScroll.value);
  }
  /**
   * 是否存在可参与滚动增量测量的列
   * @description 开启 alwaysWatchWidth 时内容列均可参与；未开启时仅 operation 列参与
   */
  function hasWatchableColumn() {
    return !!props.alwaysWatchWidth || tableStructure.value.some(item => item.isShow !== false && item.prop == "operation");
  }
  /**
   * 调度虚拟滚动列宽增量重算
   * @param onBeforeExec - 空闲窗口真正执行测量前的回调（如校准位移触发基准）
   * @description 空闲防抖：滚动 / 追加数据过程中仅重置定时器，停止 350ms 后触发一次测量
   */
  function scheduleColumnWidthReCalc(onBeforeExec?: () => void) {
    if (!isVirtualMode()) return;
    if (typeof window === "undefined") return;
    // 请求装载 / 选择视图 / 全量测量进行中不叠加调度
    if (state.tableLoadStatus || state.showSelectList || state.setCellWidthIng) return;
    // 没有可参与测量的列时不安排任务
    if (!hasWatchableColumn()) return;
    clearTimeout(columnWidthReCalcTimer);
    columnWidthReCalcTimer = setTimeout(() => {
      // 执行前先回调（校准位移基准），避免防抖等待期间继续滚动造成的基准偏差
      onBeforeExec?.();
      incrementalColumnWidthReCalc();
    }, 350);
  }
  /**
   * 自动列宽写入过渡
   * @description 宽度回写渲染的同一批次开启过渡 class，300ms 后移除；
   * @description 仅增量重算路径调用，不影响手动拖拽列宽与数据重置时的整体淡入淡出
   */
  let columnWidthAnimTimer: any = null;
  function playColumnWidthAnim() {
    if (typeof window === "undefined") return;
    state.widthAnimIng = true;
    clearTimeout(columnWidthAnimTimer);
    columnWidthAnimTimer = setTimeout(() => {
      state.widthAnimIng = false;
    }, 300);
  }
  /**
   * 虚拟滚动 - 增量列宽测量（按可视内容自适应）
   * @description 仅对可视区内已渲染的单元格测量，实测内容宽于/窄于当前列宽时，同步回写该列宽度
   */
  function incrementalColumnWidthReCalc() {
    if (!isVirtualMode()) return;
    if (typeof window === "undefined") return;
    const body = bodyRef.value;
    if (!body || !body.clientHeight) return;
    // 全量测量（含透明度隐藏过渡期）或请求装载中跳过，避免叠加干扰
    if (state.setCellWidthIng || state.tableLoadStatus) return;
    if (body.style.opacity == "0" || state.showSelectList) return;
    if (!state.flatTableData.length) return;
    // 无任何可参与测量的列（未开启 alwaysWatchWidth 且无 operation 列）时直接跳过
    if (!hasWatchableColumn()) return;
    // 切换到测量态：单元格内容 nowrap 并提供 find_cell_${prop} 类，便于读取真实内容宽度
    state.setCellWidthIng = true;
    nextTick(() => {
      const doc = window.document;
      const maxWidth = 500;
      const exOut = ["selection", "radio", "expand", "row"];
      const _tableStructure = cloneDeep(tableStructure.value);
      const pendingChanges: Array<{ prop: string; width: number }> = [];
      // 仅测量真实可视区内的单元格：虚拟滚动会预渲染 OVERSCAN 缓冲行，
      // 若缓冲行的内容参与 max 计算，窗口内残留的一行宽内容会长期顶住列宽，窄内容行无法触发收缩
      const bodyRect = body.getBoundingClientRect();
      _tableStructure?.forEach(item => {
        if (exOut.indexOf(String(item.type)) > -1 || !item.prop) return;
        // 开关门控：内容列仅在开启 alwaysWatchWidth 时参与；operation 列始终参与滚动动态计算
        if (item.prop != "operation" && !props.alwaysWatchWidth) return;
        // 配置了固定宽度的内容列遵循用户约束，不做自动缩放；operation 列内容随行变化，允许扩宽/收缩
        if (item.prop != "operation" && item.baseWidth) return;
        const currentWidth = setWidthToNumber(item.width);
        if (!currentWidth) return;
        const cellEls = doc.querySelectorAll(`#${props.id} .find_cell_${item.prop}`);
        if (!cellEls?.length) return;
        let useWidth = 0;
        for (let index = 0; index < cellEls.length; index++) {
          const element = cellEls[index] as HTMLElement;
          const rect = element.getBoundingClientRect();
          // 跳过 OVERSCAN 缓冲行（不在可视区域内），列宽只按真实可见内容计算
          if (rect.bottom <= bodyRect.top || rect.top >= bodyRect.bottom) continue;
          if (useWidth < element.clientWidth) {
            useWidth = element.clientWidth;
          }
        }
        if (!useWidth) return;
        const isWidth = (useWidth > maxWidth ? maxWidth : useWidth) + 1;
        const _width = isWidth % 2 == 0 ? isWidth : isWidth + 1;
        // 迟滞阈值：变化过小（含 0/2px 圆整误差）不进候选，抑制滚动宽窄内容交错时的列宽抖动
        if (Math.abs(_width - currentWidth) < 4) return;
        pendingChanges.push({ prop: String(item.prop), width: _width });
      });
      if (!pendingChanges.length) {
        state.setCellWidthIng = false;
        return;
      }
      // 收缩保护：若存在 flex/auto 列可吸收剩余空间，或收缩后整表总宽仍不小于可视容器宽度，
      // 才允许收缩，避免内容区右侧留白 / 横向滚动条抖动；扩宽始终放行
      const contentClientWidth = Number(body.clientWidth) || 0;
      const pendingMap: { [prop: string]: number } = {};
      let pendingTotal = 0;
      pendingChanges.forEach(item => {
        pendingMap[item.prop] = item.width;
      });
      _tableStructure.forEach(item => {
        const cur = setWidthToNumber(item.width);
        pendingTotal += pendingMap[String(item.prop)] || cur;
      });
      const hasFlexColumn = _tableStructure.some(
        item => item.isShow !== false && item.prop && !item.baseWidth && !setWidthToNumber(item.width)
      );
      const canShrink = hasFlexColumn || !contentClientWidth || pendingTotal >= contentClientWidth;
      const changedList: string[] = [];
      _tableStructure.forEach(item => {
        const prop = String(item.prop);
        if (pendingMap[prop] === undefined) return;
        const currentWidth = setWidthToNumber(item.width);
        const _width = pendingMap[prop];
        // 收缩受容器宽度保护时拦截
        if (_width < currentWidth && !canShrink) return;
        // operation 列收缩以配置的 baseWidth 为下限；扩宽则按内容宽度
        if (prop == "operation" && item.baseWidth && _width < setWidthToNumber(item.baseWidth)) {
          if (currentWidth <= setWidthToNumber(item.baseWidth)) return;
          item.width = item.baseWidth;
          item.minWidth = item.baseWidth;
          changedList.push(prop);
          return;
        }
        item.width = setWidthToString(_width);
        // minWidth 同步跟随（operation 保留 baseWidth 下限），避免收缩时被旧的 min-width 卡住无法收窄
        item.minWidth = item.baseWidth || String(item.width);
        changedList.push(prop);
      });
      if (!changedList.length) {
        state.setCellWidthIng = false;
        return;
      }
      if (typeof window !== "undefined")
        window.developLog.log(`虚拟滚动增量列宽重算：${changedList.join(",")}`, props.id, "info");
      // 与宽度回写同一批次开启过渡动画，让列宽变化平滑（200ms）
      playColumnWidthAnim();
      // 重排固定列偏移与顺序（与 setCellWidth 末尾逻辑保持一致）
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
      tableStructure.value = [...LeftArr, ...defaultArr, ...RightArr, ...hideArr];
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

  /**
   * 刷新表格配置操作
   * @description 数据变更后与 getTableList 对齐，重新触发动态列宽计算与合计值刷新
   */
  function refreshTableConfig() {
    // 数据变更后重新测量列宽；skipFade 避免页面先空白后显示的闪烁
    setCellWidth(true);
    if (props.useSummary && !props.usePagination) debounceGetSummary();
    if (props.summaryFunction) debounceGetSummary();
  }

  /**
   * 设置表格所有数据
   * @param data - 表格数据
   * @description 替换表格所有数据
   */
  function changeData_All(data: PaTableUseType.dataType) {
    state.flatTableData.length = 0;
    const cloneData = cloneDeep(data);
    if (!props.usePagination) {
      state.tableData = [buildRows(cloneData, 0)];
    } else {
      const pages = splitArray(cloneData, state.pageable.PageSize);
      state.tableData = pages.map((page, pageIndex) => buildRows(page, pageIndex * state.pageable.PageSize));
    }
    state.flatTableData = cloneData;
    // 与 getTableList 对齐，更新总条数
    state.pageable.total = cloneData.length;
    refreshTableConfig();
  }
  /**
   * 设置表格单个数据
   * @param rowKey - 行标识值
   * @param value - 新数据
   * @description 更新指定行的数据
   */
  function changeData_Item(rowKey: string, value: any) {
    if (!rowKey || !props.rowKey) return;
    const cloneValue = cloneDeep(value);
    let paretIndex = -1;
    let rowIndex = -1;
    for (let i = 0; i < state.tableData.length; i++) {
      const ArrayItem = state.tableData[i];
      const index = ArrayItem.findIndex(item => item[String(props.rowKey)] == rowKey);
      if (index != -1) {
        paretIndex = i;
        rowIndex = index;
        break;
      }
    }
    if (paretIndex != -1 && rowIndex != -1) {
      // 保留原行的 rowIndex/renderIndex，并为新值及子行补充内部字段（与 getTableList 对齐）
      const oldRowIndex = Number(state.tableData[paretIndex][rowIndex]?.rowIndex) || 0;
      const enriched = buildRows([cloneValue], oldRowIndex - 1)[0];
      state.tableData[paretIndex][rowIndex] = enriched;
      refreshTableConfig();
    }
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
    scheduleColumnWidthReCalc,
    clearListen,
    changeData_All,
    changeData_Item
  };
};
