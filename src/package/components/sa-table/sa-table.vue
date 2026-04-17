<template>
  <sa-development :id="id">
    <div
      class="sa-table"
      ref="scrollBarList"
      :class="[
        props.class,
        isShiftPressed ? 'sa-table_shirft' : '',
        useSticky ? 'sa-table_sticky' : '',
        !isLeft ? 'sa-table_scroll_left' : '',
        !isRight ? 'sa-table_scroll_right' : ''
      ]"
      :style="{ ...props.style, '--sa-table-footer-height': footerHeight + 'px' }"
      :id="props.id"
    >
      <div class="sa-table_body_header_box" ref="headerBoxRef">
        <mTableV2Filter
          ref="filterRef"
          :tableStructure="tableStructure"
          :tableQuery="state.tableQuery"
          :extraProps="props"
          :state="state"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope"></slot>
          </template>
        </mTableV2Filter>

        <!-- header -->
        <div class="sa-table_body_header_scroll" ref="mScrollbarHeaderListRef">
          <div :style="{ width: isLeft && isRight ? '100%' : 'max-content' }">
            <div class="sa-table_body_header_scroll_body">
              <template v-for="(item, index) in tableStructure" :key="item.prop">
                <template v-if="item.isShow !== false">
                  <div
                    class="sa-table_body_header_label"
                    :class="[
                      isRowIndex(item) ? 'sa-table_body_header_label_index' : '',
                      item.fixed == 'left'
                        ? 'sticky-left border-right'
                        : item.fixed == 'right'
                        ? 'sticky-right border-right'
                        : 'border-right',
                      item.lastLeftFixed ? 'last-left-fixed' : '',
                      item.lastRightFixed ? 'last-right-fixed' : '',
                      (!item.width && !state.setCellWidthIng) ||
                      (state.useAverageWidth == 1 && !item.baseWidth && item.prop != 'operation')
                        ? 'sa-table_body_header_label_flex'
                        : ''
                    ]"
                    :style="{
                      '--sa-table-sticky': item.fixedValue,
                      '--sa-table-sticky-index': item.fixedValueIndex,
                      '--sa-table-item-width': item.width,
                      '--sa-table-item-min-width': item.minWidth,
                      justifyContent: isRowIndex(item) ? 'center' : 'flex-start'
                    }"
                    :draggable="!item.fixed"
                    @dragstart="handleDragStart($event, index)"
                    @dragover="handleDragOver($event)"
                    @drop="handleDrop($event, index)"
                    @dragend="handleDragEnd($event)"
                  >
                    <template v-if="item.type == 'index'"> # </template>
                    <template v-else-if="item.type == 'selection'">
                      <sa-checkbox-item
                        v-if="!state.showSelectList"
                        :is-checked="isTableSelectAll"
                        :is-indeterminate="selectedRowsLength > 0"
                        @change="handleSelectAllStatus"
                      />
                    </template>
                    <template v-else-if="item.type == 'radio'"></template>
                    <template v-else-if="item.type == 'row'">
                      <div v-if="!usePagination" class="flex-center m-hand" style="width: 100%; height: 100%">
                        <sa-icon
                          name="right_line"
                          style="font-size: 18px; transition: var(--sa-animation-time, 0.2s)"
                          :style="{ transform: state.isRowOpenStatus ? 'rotate(90deg)' : 'rotate(0deg)' }"
                          @click="changeRowAllStatus"
                        />
                      </div>
                    </template>

                    <headerItem
                      v-else
                      :id="id"
                      :useOrderPropName="state.useOrderPropName"
                      :setCellWidthIng="state.setCellWidthIng"
                      :tableQuery="state.tableQuery"
                      :item="item"
                      :listeners="$"
                      @handle-sort-change="handleSortChange"
                      @save-and-filter="handleColSetting"
                      @open-senior-filter="val => filterRef?.openSeniorFilter(val)"
                    ></headerItem>

                    <sa-icon
                      v-if="!item.type && item.prop != 'operation'"
                      name="selector_horizontal"
                      class="dragover_width"
                      :class="[positionWidthIndex == index ? 'dragover' : '']"
                      :style="{ display: dragIng ? 'none' : '' }"
                      @mousedown="handleDragWidthStart($event, index)"
                    />
                    <!-- <template v-else>{{ item.label }}</template> -->
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- body -->
      <div class="sa-table_body" ref="bodyRef">
        <div
          v-if="state.tableLoadingSize != 100"
          class="sa-table_body_loading"
          :style="{ width: state.tableLoadingSize + '%' }"
        ></div>
        <div v-if="state.flatTableData.length == 0 && state.tableLoadingSize != 100" class="sa-table_body_first_loading">
          <m-icon class="loading_font" name="loading_line"></m-icon>
        </div>
        <sa-scrollbar
          ref="mScrollbarListRef"
          :useScrollY="!useSticky"
          @scroll-child-change="handleScrollChildChange"
          :onDirectlyScroll="directlyScroll"
        >
          <!-- content -->
          <div
            class="sa-table_body_content"
            ref="contentRef"
            :style="{
              '--body-content-height': showTableList.length > 1 ? bodyContentHeight + 'px' : '0px',
              '--body-content-width': bodyContentWidth + 'px',
              '--scroll-body-height': scrollBodyHeight,
              '--scroll-body-width': scrollBodyWidth,
              '--body_content_col_hover_index': -1
              // minHeight: useSummary
              //   ? `calc(${scrollBodyHeight} - var(--sa-size-padding, 10px) * 2 - 4em)`
              //   : `calc(${scrollBodyHeight} - var(--sa-size-padding, 10px) - 2em)`
            }"
          >
            <!-- <div style="width: 3200px; height: 3200px; background-color: bisque">
          cadcsadsccadcsadsccadcsadsccadcsadsccadcsadsccadcsadsccadcsadsccadcsadsccadcsadsc
        </div> -->
            <template v-for="(item, index) in showTableList" :key="index">
              <div class="sa-table_body_content_rows" :style="{ opacity: state.flatTableData.length > 0 ? 1 : 0 }">
                <template v-for="row in item" :key="row[rowKey]">
                  <div
                    v-if="row.type == 'more'"
                    class="m-scrollbar-more"
                    :class="{ 'm-scrollbar-more_ing': state.listenCellInViewIng }"
                    :id="`${id}-more-${row.name}`"
                  >
                    <!-- PageNum:{{ state.PageNum }} ,type:{{ row.type }} ,index:{{ index }} {{ index > Number(state.PageNum) + 1 }}
              {{ index < Number(state.PageNum) - 2 }} -->
                  </div>
                  <template
                    v-if="row.type != 'more' && index + 1 <= Number(state.PageNum) + 2 && index + 1 >= Number(state.PageNum) - 3"
                  >
                    <div
                      v-if="row.type == 'empty' || index > Number(state.PageNum) + 2 || index < Number(state.PageNum) - 3"
                      class="sa-table_body_content_cell_empty"
                    >
                      <!-- {{ index }} -->
                      <!-- <loading1></loading1> -->
                    </div>

                    <div
                      v-else
                      class="sa-table_body_content_cell"
                      :class="[row.isOpenChild && (useChildren || useExpand) ? 'open-child' : '']"
                    >
                      <mLightTableCell
                        :structure="tableStructure"
                        :row="row"
                        :rowKey="rowKey"
                        :useExpand="useExpand"
                        :rowIndex="row.rowIndex"
                        :display="display"
                        :useTableIndex="useTableIndex"
                        :showSelectList="state.showSelectList"
                        :useChildren="useChildren"
                        :setCellWidthIng="state.setCellWidthIng"
                        :useAverageWidth="state.useAverageWidth"
                        @change-row-status="changeRowStatus"
                      >
                        <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                          <slot :name="slot" v-bind="scope"></slot>
                        </template>
                      </mLightTableCell>
                    </div>

                    <template v-if="(row.children?.length && useChildren) || useExpand">
                      <transition name="mo-animation-fadeIn">
                        <div
                          v-if="row.isOpenChild && index <= Number(state.PageNum) + 2 && index >= Number(state.PageNum) - 2"
                          class="sa-table_body_content_children_box"
                        >
                          <template v-if="useChildren">
                            <template v-for="ch in row.children" :key="ch[rowKey]">
                              <div class="sa-table_body_content_cell">
                                <mLightTableCell
                                  :structure="tableStructure"
                                  :row="ch"
                                  :parentRowKey="row[props.rowKey]"
                                  :rowKey="rowKey"
                                  :useExpand="useExpand"
                                  :rowIndex="ch.rowIndex"
                                  :display="display"
                                  :useTableIndex="useTableIndex"
                                  :setCellWidthIng="state.setCellWidthIng"
                                  :useAverageWidth="state.useAverageWidth"
                                  :parentRow="row"
                                >
                                  <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                                    <slot :name="slot" v-bind="scope"></slot>
                                  </template>
                                </mLightTableCell>
                              </div>
                            </template>
                          </template>

                          <template v-else-if="useExpand">
                            <slot name="Expand"></slot>
                          </template>
                        </div>
                      </transition>
                    </template>
                  </template>
                </template>
              </div>
            </template>

            <template v-if="state.tableLoadStatus">
              <!-- <div v-for="index in Array.from({ length: 10 })" :key="String(index)" class="sa-table_body_content_cell_empty">
                <loading1></loading1>
              </div> -->
            </template>
          </div>
          <div
            v-if="!state.flatTableData.length && state.tableLoadEndStatus"
            class="empty empty-table"
            style="text-align: center"
          >
            <sa-icon name="empty" style="font-size: 40px"></sa-icon>
            {{ languagePackage["empyt"] }}
          </div>
          <!-- footer -->
          <div v-if="(useSummary && !usePagination) || summaryFunction" class="sa-table_body_summary">
            <template v-for="(val, index) in state.summaryData" :key="index">
              <div
                v-if="tableStructure[index].isShow != false"
                class="sa-table_body_summary_label border-right"
                :class="[
                  tableStructure[index]?.fixed == 'left'
                    ? 'sticky-left border-right'
                    : tableStructure[index]?.fixed == 'right'
                    ? 'sticky-right border-right'
                    : 'border-right',
                  tableStructure[index]?.lastLeftFixed ? 'last-left-fixed' : '',
                  tableStructure[index]?.lastRightFixed ? 'last-right-fixed' : '',
                  (!tableStructure[index].width && !state.setCellWidthIng) ||
                  (state.useAverageWidth == 1 && !tableStructure[index].baseWidth && tableStructure[index].prop != 'operation')
                    ? 'sa-table_body_summary_flex'
                    : ''
                ]"
                :style="{
                  '--sa-table-sticky': tableStructure[index]?.fixedValue,
                  '--sa-table-sticky-index': tableStructure[index]?.fixedValueIndex,
                  '--sa-table-item-width': tableStructure[index]?.width,
                  '--sa-table-item-min-width': tableStructure[index]?.minWidth
                }"
              >
                <div
                  :class="[
                    tableStructure[index].width && !state.setCellWidthIng
                      ? 'table_body_label_content'
                      : `find_cell_${tableStructure[index].prop || tableStructure[index].type}`
                  ]"
                  :style="{
                    justifyContent: isRowIndex(tableStructure[index]) ? 'center' : 'flex-start'
                  }"
                >
                  {{ val }}
                </div>
              </div>
            </template>
          </div>
        </sa-scrollbar>
      </div>

      <!-- 分页组件 -->
      <div
        v-if="props.usePagination"
        class="flex-center-between sa-table_footer"
        :class="{ 'use-sticky-view-in': useStickyViewIn }"
        ref="footerRef"
      >
        <div class="table-flex-lf">
          <slot name="FooterLeft">
            <template v-if="useSelect">
              <sa-button
                :disabled="selectedRowsLength <= 0 && !state.showSelectList"
                @click="changeSelectListVisible"
                font="transfer_horizontal_line"
                style="--sa-size-padding: 5px; --sa-size-font: 12px; --sa-size-height: 24px"
              >
                {{ state.showSelectList ? languagePackage["switchSelect"] : languagePackage["switchInvert"] }}
              </sa-button>
              <div class="ml-size">
                {{ languagePackage["selected"] }}
                <span class="bold-text ml3 mr3">{{ isTableSelectAll ? state.pageable.total : selectedRowsLength }}</span>
                {{ languagePackage["piece"] }}
              </div>
            </template>
          </slot>
        </div>

        <div v-if="$slots['FooterCenter']" class="table-flex-ct flex-center">
          <slot name="FooterCenter"></slot>
        </div>
        <div class="table-flex-ri width-int mb0">
          <div>
            <slot name="paginationLeft"></slot>
          </div>

          <slot name="Pagination">
            <Pagination
              v-if="usePagination && !state.showSelectList"
              :pageable="state.pageable"
              :pageNum="state.PageNum"
              :exPagination="exPagination"
              :handle-size-change="(handleSizeChange as (val: number) => void)"
              :handle-current-change="handleCurrentChange"
              :handleChangeMaxPage="value => (state.maxPage = value)"
            />
          </slot>
        </div>
      </div>
    </div>
  </sa-development>
</template>

<script lang="ts" setup>
// >-------------> 依赖 <------------<
import {
  ref,
  Ref,
  useTemplateRef,
  onBeforeMount,
  computed,
  watch,
  provide,
  onUnmounted,
  nextTick,
  inject,
  onMounted,
  ComputedRef
} from "vue";

import mLightTableCell from "./sa-table-cell.vue";
// import loading1 from "./loading-1.vue";
import headerItem from "./header-item.vue";
// import Taro from "@tarojs/taro";

import { SaTableItemType, SaTableType, SaTableUseItemType, SaTableUseType } from "./type";
import { isRowIndex } from "./hooks/isType";

import Pagination from "./pagination.vue";
import mTableV2Filter from "./sa-table-filter.vue";

import { useSortHooks } from "./hooks/use-sort-hooks";
import { useStateHooks } from "./hooks/use-state-hooks";
import { useScrollHooks } from "./hooks/use-scroll-hooks";
import { useSelectHooks } from "./hooks/use-select-hooks";
import { useDragHooks } from "./hooks/use-drag-hooks";
import { useValidateHooks } from "./hooks/use-validate-hooks";
import { PancakeGlobalConfigType } from "../sa-content/type";
import { splitArray } from "../utils/arraySplit";

import _ from "lodash";
const { cloneDeep, debounce } = _;

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;

const mScrollbarListRef = useTemplateRef("mScrollbarListRef");
const mScrollbarHeaderListRef = ref();
const filterRef = useTemplateRef("filterRef");
const scrollBodyHeight = ref("0px");
const scrollBodyWidth = ref("0px");
const bodyContentHeight = ref(0);
const bodyContentWidth = ref(0);
const footerHeight = ref("0px");
const headerBoxRef = ref();
const contentRef = ref();
const bodyRef = ref();
const footerRef = ref();

// const isScrollEnd = ref(false);

const props = withDefaults(defineProps<SaTableType>(), {
  rowKey: "id",
  structure: () => [],
  requestAuto: true,
  expandAuto: false,
  usePagination: true,
  useExpandAll: true,
  useSummary: false,
  useTableIndex: true,
  useToolButton: true,
  display: true,
  embeddedToolButton: false,
  exOptions: () => ({}),
  exDependent: () => ({
    disabledRule: {},
    displayRule: {},
    exCellRules: {}
  }),
  exCellDependent: () => ({
    select_RequestApi: {},
    file_attachedData: {},
    time_disabledDateFn: {},
    time_shortcuts: {},
    tag_click: {},
    tag_disabled: {}
  }),
  exPagination: () => ({
    PageNum: 1,
    PageSize: 30,
    pageSizes: [30, 50, 100, 150]
  }),
  summaryConfig: () => ({
    sumText: "合计",
    unitText: ""
  }),
  useSticky: false
});

const emits = defineEmits([
  "changeRowStatus",
  "tableCellChange",
  "changeRowAllStatus",
  "selectRowBack",
  "radioRowBack",
  "selectRowAllBack"
]);

// 要观察的元素
const isIntersectingList = ref(
  [] as unknown as Ref<{ isIntersecting: boolean; stopObserving: () => void; el: Element; Els: Element }[]>
);
const isInViewList = ref(
  [] as unknown as Ref<{ isIntersecting: boolean; stopObserving: () => void; el: Element; Els: Element }[]>
);
const useStickyViewIn = ref(false);

const parentScrollbarRef = inject("parentScrollbarRef");

const languagePackage = computed(() => PancakeGlobalConfig.value?.language?.package?.["table"] || {});
const language = computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN");
const infiniteScroll = computed(() => PancakeGlobalConfig.value?.table_config?.infiniteScroll || false);
const isScrollHeaderIng = ref(false);

// # Hooks
const {
  state,
  tableStructure,
  setTableConfig,
  getTableList,
  cleanTableData,
  changeRowStatus,
  changeRowAllStatus,
  changeSelectListVisible,
  handleCellMouseEnter,
  handleCellMouseLeave,
  listenCellInView,
  listenCellChildChange,
  clearListen
} = useStateHooks(props, emits, {
  isScrollHeaderIng,
  language,
  bodyRef,
  contentRef,
  mScrollbarListRef,
  isIntersectingList,
  isInViewList,
  infiniteScroll,
  languagePackage
});

const { isLeft, isRight, scrollDirectionY, handleSizeChange, handleCurrentChange, refreshTable, directlyScroll } = useScrollHooks(
  props,
  state,
  {
    isScrollHeaderIng,
    headerBoxRef,
    mScrollbarListRef,
    mScrollbarHeaderListRef,
    listenCellInView,
    parentScrollbarRef,
    infiniteScroll,
    getTableList
  }
);

const {
  isShiftPressed,
  selectedRowsLength,
  isTableSelectAll,
  handleSelectChange,
  handleSelectAllStatus,
  setSelectedData,
  getSelectedData,
  cleanup
} = useSelectHooks(props, state, emits, getTableList);

const { handleDragStart, handleDragOver, handleDrop, handleDragEnd, dragIng, handleDragWidthStart, positionWidthIndex } =
  useDragHooks(tableStructure);

const injectSetScrollToIntersect = inject("setScrollToIntersect", () => {
  console.warn("未找到滚动方法");
}) as (el: Element, callback?: () => void, options?: { offsetY?: number; offsetX?: number }) => void;

const { getSubmitTableList, validateField } = useValidateHooks(
  props,
  state.inRules,
  state.tableData,
  injectSetScrollToIntersect,
  mScrollbarListRef,
  getTableData
);

provide("getTableList", getTableList);
provide("cleanTableData", cleanTableData);
provide("setTableConfig", setTableConfig);
provide("refreshTable", refreshTable);
provide("handleSelectChange", handleSelectChange);
provide("isTableSelectAll", isTableSelectAll);
provide("handleCellMouseEnter", handleCellMouseEnter);
provide("handleCellMouseLeave", handleCellMouseLeave);

provide("tableCellChange", (data: SaTableUseType.dataType) => emits("tableCellChange", data));
provide("validateField", validateField);

const showTableList: Ref<Array<Array<SaTableUseType.SaTableInDataType>>> = computed(() => {
  if (state.showSelectList) {
    return [state.selectTableData];
  }
  return state.tableData;
});

provide(
  "languagePackage",
  computed(() => PancakeGlobalConfig.value?.language?.package?.["table"] || {})
);

provide(
  "language",
  computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN")
);

provide(
  "exOptions",
  computed(() => props.exOptions)
);

provide(
  "exDependent",
  computed(() => props.exDependent)
);

provide(
  "exCellDependent",
  computed(() => props.exCellDependent)
);

provide(
  "useGlobalSeniorFilter",
  computed(() => PancakeGlobalConfig.value?.table_config?.useSeniorFilter || false)
);

const exDisabled = ref({} as { [x: string]: (value) => boolean });
const exDisplay = ref({} as { [x: string]: (value) => boolean });
const scrollBarList = ref();

onBeforeMount(() => {
  if (!props.id) {
    window.developLog.log("警告", "SaTable 组件参数 id 必填", "warning");
    return;
  }
});

onMounted(() => {
  nextTick(() => {
    // 初始化列宽
    // if (!Taro.moTable) Taro.moTable = {};
    // if (!Taro.moTable[props.id]) Taro.moTable[props.id] = {};
    // Taro.moTable[props.id].getTableList = getTableList;
    if (!props.requestAuto) {
      // state.tableLoadStatus = false;
      return;
    }
    getTableList();
  });
});

function handleScrollChildChange({ bodyHeight, bodyWidth, useScrollX }) {
  bodyContentHeight.value = bodyHeight;
  bodyContentWidth.value = bodyWidth;
  if (useScrollX) {
    isLeft.value = useScrollX;
    isRight.value = !useScrollX;
  } else {
    isLeft.value = true;
    isRight.value = true;
  }
}

onUnmounted(() => {
  cleanup();
  clearListen();
});

// function getScrollBodyHeight(value) {
//   scrollBodyHeight.value = mScrollbarListRef.value?.clientHeight + "px";
// }

const { handleSortChange, handleColSetting } = useSortHooks(state, getTableList);

// @ 清除表格数据中的多余属性
function cleanTableItemData(filterData) {
  return filterData?.map(item => {
    delete item.parentRenderIndex;
    delete item.rowIndex;
    delete item.renderIndex;
    delete item.isOpenChild;
    delete item.isSelected;
    delete item.isIndeterminate;
    delete item.type;
    delete item.name;

    if (item.children?.length) {
      item.children = cleanTableItemData(item.children);
    }
    delete item.children;
    return item;
  });
}

function getTableData(data?) {
  const arr: Array<SaTableUseType.SaTableInDataType> = cloneDeep(data?.flat?.(2) || state.tableData?.flat(2));
  const filterData = arr?.filter?.(item => item.type != "more");
  return cleanTableItemData(filterData);
}

/**
 * @description: 设置表格结构
 * @param {SaTableItemType[]} structure
 * @return {*}
 */
function setStructure_All(structure: SaTableItemType[]) {
  clearListen();
  tableStructure.value.length = 0;
  setTableConfig(structure as Array<SaTableItemType & SaTableUseItemType>, () => {
    listenCellInView.create();
    listenCellChildChange.create();
  });
}

/**
 * @description: 设置表格单个结构
 * @param {string} prop
 * @param {SaTableItemType} item
 * @return {*}
 */
function setStructure_Item(prop: string, item: SaTableItemType) {
  if (!prop) return;
  clearListen();
  const index = tableStructure.value.findIndex(i => i.prop == prop);
  if (index != -1) {
    tableStructure.value[index] = item as SaTableItemType & SaTableUseItemType;
    setTableConfig(tableStructure.value, () => {
      listenCellInView.create();
      listenCellChildChange.create();
    });
  }
}

/**
 * @description: 设置表格所有数据
 * @param {Record<string, any>} data
 * @return {*}
 */
function changeData_All(data: SaTableUseType.dataType) {
  const cloneData = cloneDeep(data);
  if (!props.usePagination) {
    state.tableData = [cloneData];
  } else {
    state.tableData = splitArray(cloneData, state.pageable.PageSize);
  }
}

/**
 * @description: 设置表格单个数据
 * @param {string} prop
 * @param {any} value
 * @return {*}
 */
function changeData_Item(rowKey: string, value: any) {
  if (!rowKey) return;
  const cloneValue = cloneDeep(value);
  let paretIndex = -1;
  let rowIndex = -1;
  for (let i = 0; i < state.tableData.length; i++) {
    const ArrayItem = state.tableData[i];
    const index = ArrayItem.findIndex(item => item[props.rowKey] == rowKey);
    if (index != -1) {
      paretIndex = i;
      rowIndex = index;
      break;
    }
  }
  if (paretIndex != -1 && rowIndex != -1) {
    state.tableData[paretIndex][rowIndex] = cloneValue;
  }
}

watch(
  () => isIntersectingList.value,
  debounce(newVal => {
    // const InView = newVal.find(item => !!item.Els);
    // if (InView) {
    //   useStickyViewIn.value = InView.isIntersecting;
    // }
    const filterList = newVal.filter(item => item.isIntersecting);
    const showItem = filterList[filterList.length - 1];
    const showIndex = showItem?.el?.id.split(props.id + "-more-")[1] || -1;
    const showIndexNumber = Number(showIndex);

    if (showIndexNumber == -1 || state.tableLoadStatus) return;

    if (state.maxPage != 0 && showIndexNumber + 1 >= state.maxPage) return;

    if (state.oldPageIndex == showIndexNumber) return;

    if (scrollDirectionY.value == "down") {
      getTableList({
        Page: {
          PageNum: showIndexNumber + 2
        }
      });
    } else {
      getTableList({
        Page: {
          PageNum: showIndexNumber
        }
      });
    }

    state.PageNum = showIndexNumber + 1;
    window.developLog.log("当前页面", state.PageNum, "danger");
    state.oldPageIndex = showIndexNumber;
    return;
    // for (let i = 0; i < newVal.length; i++) {
    //   const isIntersecting = newVal[i].isIntersecting;
    //   const el = newVal[i].el;
    //   if (isIntersecting) {
    //     showIndex = Number(el.id.split(props.id + "-more-")[1]);
    //     state.PageNum = showIndex + 1;
    //     if (isDown.value) {
    //       if (oldIndex == showIndex) return;
    //       oldIndex = showIndex;
    //       const _PageNum = showIndex + 2;
    //       if (state.tableLoadStatus) return;
    //       getTableList({
    //         Page: {
    //           PageNum: _PageNum
    //         }
    //       });
    //     } else {
    //       if (oldIndex == showIndex) return;
    //       oldIndex = showIndex;
    //       const _PageNum = showIndex;
    //       if (state.tableLoadStatus) return;
    //       getTableList({
    //         Page: {
    //           PageNum: _PageNum
    //         }
    //       });
    //     }
    //   }
    // }
  }, 50),
  {
    deep: true
  }
);

watch(
  () => isInViewList.value,
  newVal => {
    const InView = newVal.find(item => !!item.Els);
    if (InView) {
      useStickyViewIn.value = InView.isIntersecting;
      footerHeight.value = footerRef.value?.clientHeight || "0px";
    }
  },
  {
    deep: true
  }
);

// watch(
//   () => isEndIntersectingList.value,
//   newVal => {
//     let showIndex = -1;
//     if (state.tableLoadStatus) return;
//     for (let i = 0; i < newVal.length; i++) {
//       const isIntersecting = newVal[i].isIntersecting;
//       const el = newVal[i].el;
//       if (isIntersecting) {
//         showIndex = Number(el.id.split(props.id + "-more-end-")[1]);
//         if (isDown.value) {
//           if (oldIndex == showIndex) return;
//           oldIndex = showIndex;
//           const _PageNum = showIndex + 2;
//           if (state.tableLoadStatus) return;
//           getTableList({
//             Page: {
//               PageNum: _PageNum,
//               PageSize: state.pageable.PageSize
//             }
//           });
//         } else {
//           if (oldIndex == showIndex) return;
//           oldIndex = showIndex;
//           const _PageNum = showIndex;
//           if (state.tableLoadStatus) return;
//           getTableList({
//             Page: {
//               PageNum: _PageNum,
//               PageSize: state.pageable.PageSize
//             }
//           });
//         }
//       }
//     }
//   },
//   {
//     deep: true
//   }
// );

defineExpose({
  /**
   * @description: 获取表格查询参数
   * @return {*}
   */
  getTableQuery: () => state.tableQuery,
  /**
   * @description: 请求表格用数据
   * @return {*}
   */
  getTableList: refreshTable,
  /**
   * @description: 清除表格数据
   * @return {*}
   */
  cleanTableData,
  /**
   * @description: 请求提交表格用数据
   * @return {*}
   */
  getSubmitTableList,
  /**
   * @description: 获取表格内数据
   * @return {*}
   */
  getTableData,

  /**
   * @description: 获取表格内选中数据
   * @return {*}
   */
  getSelectedData,

  /**
   * @description: 设置表格内选中数据
   * @param {Array<any>} data
   * @return {*}
   */
  setSelectedData,
  /**
   * @description: 设置表格所有结构
   * @param {Array<SaTableItemType & SaTableUseItemType>} structure
   * @return {*}
   */
  setStructure_All,
  /**
   * @description: 设置表格单个结构
   * @param {string} prop
   * @param {SaTableItemType} item
   * @return {*}
   */
  setStructure_Item,

  /**
   * @description: 设置表格所有数据
   * @param {Record<string, any>} data
   * @return {*}
   */
  changeData_All,

  /**
   * @description: 设置表格单个数据
   * @param {string} prop
   * @param {any} value
   * @return {*}
   */
  changeData_Item
});

// #Watch exDependent
watch(
  () => props.exDependent,
  data => {
    if (data.disabledRule) exDisabled.value = data.disabledRule;
    if (data.displayRule) exDisplay.value = data.displayRule;
  },
  { deep: true, immediate: true }
);

// @ watch 结构配置
watch(
  () => props.structure,
  value => {
    setStructure_All(value);
  }
);

watch(
  () => infiniteScroll.value,
  () => {
    refreshTable();
  }
);
</script>

<style lang="scss">
@import "./index.scss";
</style>
