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
    const { Data, Code } = await props.requestApi(_query);
    if (Code == 200) {
      const { List, TotalCount } = Data;
      _data = props.usePagination ? List : Data;
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
    clearListen,
    changeData_All,
    changeData_Item
  };
};
