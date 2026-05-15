<template>
  <pa-development :id="id">
    <div
      class="pa-table"
      ref="scrollBarList"
      :class="[
        props.class,
        isShiftPressed ? 'pa-table_shirft' : '',
        useSticky ? 'pa-table_sticky' : '',
        !isLeft ? 'pa-table_scroll_left' : '',
        !isRight ? 'pa-table_scroll_right' : ''
      ]"
      :style="{ ...props.style, '--pa-table-footer-height': footerHeight + 'px' }"
      :id="props.id"
    >
      <div class="pa-table_body_header_box" ref="headerBoxRef">
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
        <div class="pa-table_body_header_scroll" ref="mScrollbarHeaderListRef">
          <div :style="{ width: isLeft && isRight ? '100%' : 'max-content' }">
            <div class="pa-table_body_header_scroll_body">
              <template v-for="(item, index) in tableStructure" :key="item.prop">
                <template v-if="item.isShow !== false">
                  <div
                    class="pa-table_body_header_label"
                    :class="[
                      isRowIndex(item) ? 'pa-table_body_header_label_index' : '',
                      item.fixed == 'left'
                        ? 'sticky-left border-right'
                        : item.fixed == 'right'
                        ? 'sticky-right border-right'
                        : 'border-right',
                      item.lastLeftFixed ? 'last-left-fixed' : '',
                      item.lastRightFixed ? 'last-right-fixed' : '',
                      (!item.width && !state.setCellWidthIng) ||
                      (state.useAverageWidth == 1 && !item.baseWidth && item.prop != 'operation')
                        ? 'pa-table_body_header_label_flex'
                        : ''
                    ]"
                    :style="{
                      '--pa-table-sticky': item.fixedValue,
                      '--pa-table-sticky-index': item.fixedValueIndex,
                      '--pa-table-item-width': item.width,
                      '--pa-table-item-min-width': item.minWidth,
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
                      <pa-checkbox-item
                        v-if="!state.showSelectList"
                        :is-checked="isTableSelectAll"
                        :is-indeterminate="selectedRowsLength > 0"
                        @change="handleSelectAllStatus"
                      />
                    </template>
                    <template v-else-if="item.type == 'radio'"></template>
                    <template v-else-if="item.type == 'row'">
                      <div v-if="!usePagination" class="flex-center m-hand" style="width: 100%; height: 100%">
                        <pa-icon
                          name="right_line"
                          style="font-size: 18px; transition: var(--pa-animation-time, 0.2s)"
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

                    <pa-icon
                      v-if="!item.type && item.prop != 'operation'"
                      name="selector_horizontal"
                      class="dragover_width"
                      :class="[positionWidthIndex == index ? 'dragover' : '']"
                      :style="{ display: dragIng ? 'none' : '' }"
                      @mousedown="handleDragWidthStart($event, index)"
                    />
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- body -->
      <div class="pa-table_body" ref="bodyRef">
        <div
          v-if="state.tableLoadingSize != 100"
          class="pa-table_body_loading"
          :style="{ width: state.tableLoadingSize + '%' }"
        ></div>
        <div v-if="state.flatTableData.length == 0 && state.tableLoadingSize != 100" class="pa-table_body_first_loading">
          <m-icon class="loading_font" name="loading_line"></m-icon>
        </div>
        <pa-scrollbar
          ref="mScrollbarListRef"
          :useScrollY="!useSticky"
          @scroll-child-change="handleScrollChildChange"
          :onDirectlyScroll="directlyScroll"
        >
          <!-- content -->
          <div
            class="pa-table_body_content"
            ref="contentRef"
            :style="{
              '--body-content-height': showTableList.length > 1 ? bodyContentHeight + 'px' : '0px',
              '--body-content-width': bodyContentWidth + 'px',
              '--scroll-body-height': scrollBodyHeight,
              '--scroll-body-width': scrollBodyWidth,
              '--body_content_col_hover_index': -1
            }"
          >
            <template v-for="(item, index) in showTableList" :key="index">
              <div class="pa-table_body_content_rows" :style="{ opacity: state.flatTableData.length > 0 ? 1 : 0 }">
                <template v-for="row in item" :key="row[rowKey]">
                  <div
                    v-if="row.type == 'more'"
                    class="m-scrollbar-more"
                    :class="{ 'm-scrollbar-more_ing': state.listenCellInViewIng }"
                    :id="`${id}-more-${row.name}`"
                  >
                    <!-- PageNum:{{ state.PageNum }} ,type:{{ row.type }} ,index:{{ index }} -->
                  </div>
                  <template
                    v-if="row.type != 'more' && index + 1 <= Number(state.PageNum) + 2 && index + 1 >= Number(state.PageNum) - 3"
                  >
                    <div
                      v-if="row.type == 'empty' || index > Number(state.PageNum) + 2 || index < Number(state.PageNum) - 3"
                      class="pa-table_body_content_cell_empty"
                    ></div>

                    <div
                      v-else
                      class="pa-table_body_content_cell"
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
                          class="pa-table_body_content_children_box"
                        >
                          <template v-if="useChildren">
                            <template v-for="ch in row.children" :key="ch[rowKey]">
                              <div class="pa-table_body_content_cell">
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

            <template v-if="state.tableLoadStatus"> </template>
          </div>
          <div
            v-if="!state.flatTableData.length && state.tableLoadEndStatus"
            class="empty empty-table"
            style="text-align: center"
          >
            <pa-icon name="empty" style="font-size: 40px"></pa-icon>
            {{ languagePackage["empty"] }}
          </div>
          <!-- footer -->
          <div v-if="(useSummary && !usePagination) || summaryFunction" class="pa-table_body_summary">
            <template v-for="(val, index) in state.summaryData" :key="index">
              <div
                v-if="tableStructure[index].isShow != false"
                class="pa-table_body_summary_label border-right"
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
                    ? 'pa-table_body_summary_flex'
                    : ''
                ]"
                :style="{
                  '--pa-table-sticky': tableStructure[index]?.fixedValue,
                  '--pa-table-sticky-index': tableStructure[index]?.fixedValueIndex,
                  '--pa-table-item-width': tableStructure[index]?.width,
                  '--pa-table-item-min-width': tableStructure[index]?.minWidth
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
        </pa-scrollbar>
      </div>

      <!-- 分页组件 -->
      <div
        v-if="props.usePagination"
        class="flex-center-between pa-table_footer"
        :class="{ 'use-sticky-view-in': useStickyViewIn }"
        ref="footerRef"
      >
        <div class="table-flex-lf">
          <slot name="FooterLeft">
            <template v-if="useSelect">
              <pa-button
                :disabled="selectedRowsLength <= 0 && !state.showSelectList"
                @click="changeSelectListVisible"
                iconName="transfer_horizontal_line"
                style="--pa-size-padding: 8px; --pa-size-font: 14px; --pa-size-height: 28px"
              >
                {{ state.showSelectList ? languagePackage["switchSelect"] : languagePackage["switchInvert"] }}
              </pa-button>
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
              :handle-size-change="handleSizeChange"
              :handle-current-change="handleCurrentChange"
              :handleChangeMaxPage="value => (state.maxPage = value)"
            />
          </slot>
        </div>
      </div>
    </div>
  </pa-development>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 核心响应式 API
 */
import {
  ref,
  Ref,
  useTemplateRef,
  onBeforeMount,
  computed,
  watch,
  provide,
  onBeforeUnmount,
  nextTick,
  inject,
  onMounted,
  ComputedRef
} from "vue";
/**
 * 模块导入
 * @description 导入表格单元格子组件
 */
import mLightTableCell from "./pa-table-cell.vue";
/**
 * 模块导入
 * @description 导入表头子组件
 */
import headerItem from "./header-item.vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentItemProps, ComponentProps, ComponentUseItemProps, PaTableUseType } from "./types";
/**
 * 模块导入
 * @description 导入行索引判断工具
 */
import { isRowIndex } from "./hooks/isType";
/**
 * 模块导入
 * @description 导入分页子组件
 */
import Pagination from "./pagination.vue";
/**
 * 模块导入
 * @description 导入表格筛选子组件
 */
import mTableV2Filter from "./pa-table-filter.vue";
/**
 * 模块导入
 * @description 导入排序钩子
 */
import { useSortHooks } from "./hooks/use-sort-hooks";
/**
 * 模块导入
 * @description 导入状态钩子
 */
import { useStateHooks } from "./hooks/use-state-hooks";
/**
 * 模块导入
 * @description 导入滚动钩子
 */
import { useScrollHooks } from "./hooks/use-scroll-hooks";
/**
 * 模块导入
 * @description 导入选择钩子
 */
import { useSelectHooks } from "./hooks/use-select-hooks";
/**
 * 模块导入
 * @description 导入拖拽钩子
 */
import { useDragHooks } from "./hooks/use-drag-hooks";
/**
 * 模块导入
 * @description 导入校验钩子
 */
import { useValidateHooks } from "./hooks/use-validate-hooks";
/**
 * 模块导入
 * @description 导入全局配置类型
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 模块导入
 * @description 导入数组分割工具
 */
import { splitArray } from "../utils/arraySplit";
/**
 * 模块导入
 * @description 导入深拷贝工具函数
 */
import cloneDeep from "../tools/clone-deep";
/**
 * 模块导入
 * @description 导入防抖工具函数
 */
import debounce from "../tools/debounce";
/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 注入全局配置对象
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 滚动列表引用
 * @type Ref
 * @description 表格主体滚动容器引用
 */
const mScrollbarListRef = useTemplateRef("mScrollbarListRef");
/**
 * 表头滚动列表引用
 * @type Ref
 * @description 表头滚动容器引用
 */
const mScrollbarHeaderListRef = ref();
/**
 * 筛选组件引用
 * @type Ref
 * @description 表格筛选组件引用
 */
const filterRef = useTemplateRef("filterRef");
/**
 * 滚动主体高度
 * @type Ref<string>
 * @description 滚动主体的高度
 */
const scrollBodyHeight = ref("0px");
/**
 * 滚动主体宽度
 * @type Ref<string>
 * @description 滚动主体的宽度
 */
const scrollBodyWidth = ref("0px");
/**
 * 主体内容高度
 * @type Ref<number>
 * @description 表格主体内容区域高度
 */
const bodyContentHeight = ref(0);
/**
 * 主体内容宽度
 * @type Ref<number>
 * @description 表格主体内容区域宽度
 */
const bodyContentWidth = ref(0);
/**
 * 底部高度
 * @type Ref<string>
 * @description 表格底部区域高度
 */
const footerHeight = ref("0px");
/**
 * 表头盒子引用
 * @type Ref
 * @description 表头容器 DOM 引用
 */
const headerBoxRef = ref();
/**
 * 内容引用
 * @type Ref
 * @description 表格内容区域 DOM 引用
 */
const contentRef = ref();
/**
 * 主体引用
 * @type Ref
 * @description 表格主体 DOM 引用
 */
const bodyRef = ref();
/**
 * 底部引用
 * @type Ref
 * @description 表格底部 DOM 引用
 */
const footerRef = ref();
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
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
  exDependent: () => ({ disabledRule: {}, displayRule: {}, exCellRules: {} }),
  exCellDependent: () => ({
    select_RequestApi: {},
    file_attachedData: {},
    time_disabledDateFn: {},
    time_shortcuts: {},
    tag_click: {},
    tag_disabled: {}
  }),
  exPagination: () => ({ PageNum: 1, PageSize: 30, pageSizes: [30, 50, 100, 150] }),
  summaryConfig: () => ({ sumText: "合计", unitText: "" }),
  useSticky: false
});
/**
 * 组件事件
 * @description 组件的 emits 定义
 */
const emits = defineEmits([
  "changeRowStatus",
  "tableCellChange",
  "changeRowAllStatus",
  "selectRowBack",
  "radioRowBack",
  "selectRowAllBack"
]);
/**
 * 交叉观察列表
 * @type Ref
 * @description 存储需要观察的交叉元素列表
 */
const isIntersectingList = ref(
  [] as unknown as Ref<{ isIntersecting: boolean; stopObserving: () => void; el: Element; Els: Element }[]>
);
/**
 * 视窗内元素列表
 * @type Ref
 * @description 存储已在视窗内的元素列表
 */
const isInViewList = ref(
  [] as unknown as Ref<{ isIntersecting: boolean; stopObserving: () => void; el: Element; Els: Element }[]>
);
/**
 * 粘性视图状态
 * @type Ref<boolean>
 * @description 是否使用粘性视图
 */
const useStickyViewIn = ref(false);
/**
 * 父级滚动条引用
 * @type Ref
 * @description 注入的父级滚动条引用
 */
const parentScrollbarRef = inject("parentScrollbarRef");
/**
 * 当前语言值
 * @type ComputedRef<string>
 * @description 当前选中的语言
 */
const languageValue = computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN");
/**
 * 语言包
 * @type ComputedRef
 * @description 当前语言的文本配置
 */
const languagePackage = computed(() => {
  return languageValue.value === "zh-CN"
    ? {
        required: "此项为必填项",
        export: "导出报表",
        refresh: "刷新",
        filter: "筛选",
        searchFilter: "搜索条件",
        search: "搜索",
        clean: "清除",
        del: "删除",
        filterText: "条件与条件关系",
        addFilter: "添加新条件",
        groupText: "组与组关系",
        group: "搜索条件组",
        addGroup: "新增条件组",
        enterSearch: "确认搜索",
        Advanced: "高级搜索",
        clenGroup: "删除当前组",
        tip: "温馨提示：",
        isDelGroup: "是否删除当前条件组?",
        enterDel: "确认删除",
        selectAdvanced: "请选择需要搜索的字段",
        inputAdvanced: "请输入搜索内容",
        selectConditional: "请选择关系类型",
        empty: "暂无数据",
        selectAll: "一键全选",
        selectInvert: "取消全选",
        switchSelect: "切换全选",
        switchInvert: "切换至已选择",
        selected: "已选择",
        piece: "条",
        all: "全部",
        warning: "请检查配置或权限",
        colSetting: "列设置",
        col: "列",
        inputPlaceholder: "请输入筛选条件",
        selectPlaceholder: "请选择筛选条件",
        startTime: "开始时间",
        endTime: "结束时间",
        editAdvancedSearch: "编辑高级搜索",
        noFilter: "无筛选条件",
        fixedState: "固定状态",
        clickChangeFixedState: "点击切换固定状态",
        visibleState: "显示状态",
        clickChangeVisibleState: "点击切换显示状态",
        visible: "显示",
        hide: "隐藏",
        noCol: "暂无可配置列",
        save: "保存配置",
        fixedLeft: "固定左侧",
        fixedRight: "固定右侧",
        fixedNone: "不固定",
        start: "开始",
        end: "结束",
        errorMessage: "设置错误：开始时间-需小于-结束时间",
        today: "今天",
        yesterday: "昨天",
        aWeekAgo: "一周前",
        useAdvancedSearch: "使用高级搜索",
        more: "更多",
        total: "合计",
        requiredMessage: "此项为必填项",
        input: "请输入",
        select: "请选择",
        records: "条",
        records2: "条/页",
        records3: "页",
        jumpTo: "前往",
        isClearAllFilters: "是否删除所有筛选项?",
        tips: "温馨提示",
        confirm: "确认"
      }
    : {
        required: "This Item Is Mandatory",
        export: "Export Table",
        refresh: "Refresh",
        filter: "Filter",
        searchFilter: "Search Filter",
        search: "Search",
        clean: "Clean",
        del: "Delete",
        filterText: "Filter Conditions And Condition Relationships",
        addFilter: "Add New Condition",
        groupText: "Group And Group Relationships",
        group: "Search Condition Group",
        addGroup: "Add New Condition Group",
        enterSearch: "Confirm Search",
        Advanced: "Advanced Search",
        clenGroup: "Delete Current Group",
        tip: "Tips：",
        isDelGroup: "Whether To Delete The Current Condition Group?",
        enterDel: "Confirm Delete",
        selectAdvanced: "Please Select The Fields To Search",
        inputAdvanced: "Please Enter The Search Content",
        selectConditional: "Please Select The Relationship Type",
        empty: "No Data",
        selectAll: "Select All",
        selectInvert: "Invert Selection",
        switchSelect: "Switch Selection",
        switchInvert: "Switch To Selected",
        selected: "Selected",
        piece: "Piece",
        all: "All",
        warning: "Please Check The Configuration Or Permissions",
        colSetting: "Column Settings",
        col: "Column",
        inputPlaceholder: "Please Enter Filter Conditions",
        selectPlaceholder: "Please Select Filter Conditions",
        startTime: "Start Time",
        endTime: "End Time",
        editAdvancedSearch: "Edit Advanced Search",
        noFilter: "No Filter Conditions",
        fixedState: "Fixed State",
        clickChangeFixedState: "Click To Switch Fixed State",
        visibleState: "Visible State",
        clickChangeVisibleState: "Click To Switch Visible State",
        visible: "Visible",
        hide: "Hide",
        noCol: "No Columns To Configure",
        save: "Save Configuration",
        fixedLeft: "Fixed Left",
        fixedRight: "Fixed Right",
        fixedNone: "Not Fixed",
        start: "Start",
        end: "End",
        errorMessage: "Setting Error: Start Time - Less Than - End Time",
        today: "Today",
        yesterday: "Yesterday",
        aWeekAgo: "A Week Ago",
        useAdvancedSearch: "Use Advanced Search",
        more: "More",
        total: "Total",
        requiredMessage: "This Item Is Mandatory",
        input: "Please Input ",
        select: "Please Select ",
        records: "",
        records2: "/Page",
        records3: "",
        jumpTo: "Jump To",
        isClearAllFilters: "Is Clear All Filters?",
        tips: "Tips",
        confirm: "Confirm"
      };
});
/**
 * 语言
 * @type ComputedRef<string>
 * @description 当前语言标识
 */
const language = computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN");
/**
 * 无限滚动
 * @type ComputedRef<boolean>
 * @description 是否启用无限滚动
 */
const infiniteScroll = computed(() => PancakeGlobalConfig.value?.table_config?.infiniteScroll || false);
/**
 * 表头滚动状态
 * @type Ref<boolean>
 * @description 表头是否正在滚动
 */
const isScrollHeaderIng = ref(false);
/**
 * 状态钩子
 * @description 初始化表格状态相关钩子
 */
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
/**
 * 滚动钩子
 * @description 初始化表格滚动相关钩子
 */
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
/**
 * 选择钩子
 * @description 初始化表格行选择相关钩子
 */
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
/**
 * 拖拽钩子
 * @description 初始化表格拖拽相关钩子
 */
const { handleDragStart, handleDragOver, handleDrop, handleDragEnd, dragIng, handleDragWidthStart, positionWidthIndex } =
  useDragHooks(tableStructure);
/**
 * 滚动到相交位置
 * @description 注入的滚动到视图方法
 */
const injectSetScrollToIntersect = inject("setScrollToIntersect", () => {
  console.warn("未找到滚动方法");
}) as (el: Element, callback?: () => void, options?: { offsetY?: number; offsetX?: number }) => void;
/**
 * 校验钩子
 * @description 初始化表格校验相关钩子
 */
const { getSubmitTableList, validateField } = useValidateHooks(
  props,
  state.inRules,
  state.tableData,
  injectSetScrollToIntersect,
  mScrollbarListRef,
  getTableData
);
/**
 * 显示表格列表
 * @type ComputedRef
 * @description 当前需要展示的表格数据列表
 */
const showTableList: Ref<Array<Array<PaTableUseType.PaTableInDataType>>> = computed(() => {
  if (state.showSelectList) return [state.selectTableData];
  return state.tableData;
});
/**
 * 注入 getTableList
 * @description 提供获取表格列表方法
 */
provide("getTableList", getTableList);
provide("cleanTableData", cleanTableData);
provide("setTableConfig", setTableConfig);
provide("refreshTable", refreshTable);
provide("handleSelectChange", handleSelectChange);
provide("isTableSelectAll", isTableSelectAll);
provide("handleCellMouseEnter", handleCellMouseEnter);
provide("handleCellMouseLeave", handleCellMouseLeave);
provide("tableCellChange", (data: PaTableUseType.dataType) => emits("tableCellChange", data));
provide("validateField", validateField);
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
/**
 * 禁用规则
 * @type Ref
 * @description 存储外部传入的禁用规则
 */
const exDisabled = ref({} as { [x: string]: (value) => boolean });
/**
 * 显示规则
 * @type Ref
 * @description 存储外部传入的显示规则
 */
const exDisplay = ref({} as { [x: string]: (value) => boolean });
/**
 * 滚动条列表引用
 * @type Ref
 * @description 滚动条列表的 DOM 引用
 */
const scrollBarList = ref();
/**
 * 排序钩子
 * @description 初始化表格排序相关钩子
 */
const { handleSortChange, handleColSetting } = useSortHooks(state, getTableList);
/**
 * 组件挂载前
 * @description 检查组件 id 是否必填
 */
onBeforeMount(() => {
  if (!props.id) {
    if (typeof window !== "undefined") window.developLog.log("警告", "PaTable 组件参数 id 必填", "warning");
    return;
  }
});
/**
 * 组件挂载后
 * @description 自动请求表格数据
 */
onMounted(() => {
  nextTick(() => {
    if (!props.requestAuto) return;
    getTableList();
  });
});
/**
 * 处理滚动子元素变化
 * @param bodyHeight - 主体高度
 * @param bodyWidth - 主体宽度
 * @param useScrollX - 是否使用水平滚动
 * @description 同步表格主体和表头的滚动位置
 */
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
/**
 * 组件卸载前
 * @description 清理事件监听和观察器
 */
onBeforeUnmount(() => {
  cleanup();
  clearListen();
});
/**
 * 清除表格数据中的多余属性
 * @param filterData - 过滤后的数据
 * @returns 清除多余属性后的数据
 * @description 递归删除表格数据中的内部属性
 */
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
    if (item.children?.length) item.children = cleanTableItemData(item.children);
    delete item.children;
    return item;
  });
}
/**
 * 获取表格数据
 * @param data - 可选的数据源
 * @returns 清理后的表格数据
 * @description 获取并清理表格数据，供外部提交使用
 */
function getTableData(data?) {
  const arr: Array<PaTableUseType.PaTableInDataType> = cloneDeep(data?.flat?.(2) || state.tableData?.flat(2));
  const filterData = arr?.filter?.(item => item.type != "more");
  return cleanTableItemData(filterData);
}
/**
 * 设置表格结构
 * @param structure - 表格列配置数组
 * @description 重置表格结构并重新监听视窗变化
 */
function setStructure_All(structure: ComponentItemProps[]) {
  clearListen();
  tableStructure.value.length = 0;
  setTableConfig(structure as Array<ComponentItemProps & ComponentUseItemProps>, () => {
    listenCellInView.create();
    listenCellChildChange.create();
  });
}
/**
 * 设置表格单个结构
 * @param prop - 列标识
 * @param item - 列配置对象
 * @description 更新指定列的配置
 */
function setStructure_Item(prop: string, item: ComponentItemProps) {
  if (!prop) return;
  clearListen();
  const index = tableStructure.value.findIndex(i => i.prop == prop);
  if (index != -1) {
    tableStructure.value[index] = item as ComponentItemProps & ComponentUseItemProps;
    setTableConfig(tableStructure.value, () => {
      listenCellInView.create();
      listenCellChildChange.create();
    });
  }
}
/**
 * 设置表格所有数据
 * @param data - 表格数据
 * @description 替换表格所有数据
 */
function changeData_All(data: PaTableUseType.dataType) {
  const cloneData = cloneDeep(data);
  if (!props.usePagination) {
    state.tableData = [cloneData];
  } else {
    state.tableData = splitArray(cloneData, state.pageable.PageSize);
  }
}
/**
 * 设置表格单个数据
 * @param rowKey - 行标识值
 * @param value - 新数据
 * @description 更新指定行的数据
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
/**
 * 暴露组件方法
 * @description 对外暴露表格操作方法
 */
defineExpose({
  /** @description 获取表格查询参数 */
  getTableQuery: () => state.tableQuery,
  /** @description 请求表格数据 */
  getTableList: refreshTable,
  /** @description 清除表格数据 */
  cleanTableData,
  /** @description 获取提交表格数据 */
  getSubmitTableList,
  /** @description 获取表格内数据 */
  getTableData,
  /** @description 获取选中数据 */
  getSelectedData,
  /** @description 设置选中数据 */
  setSelectedData,
  /** @description 设置表格所有结构 */
  setStructure_All,
  /** @description 设置表格单个结构 */
  setStructure_Item,
  /** @description 设置表格所有数据 */
  changeData_All,
  /** @description 设置表格单个数据 */
  changeData_Item
});
/**
 * 监听交叉元素列表
 * @description 根据滚动方向自动加载更多数据
 */
watch(
  () => isIntersectingList.value,
  debounce(newVal => {
    const filterList = newVal.filter(item => item.isIntersecting);
    const showItem = filterList[filterList.length - 1];
    const showIndex = showItem?.el?.id.split(props.id + "-more-")[1] || -1;
    const showIndexNumber = Number(showIndex);
    if (showIndexNumber == -1 || state.tableLoadStatus) return;
    if (state.maxPage != 0 && showIndexNumber + 1 >= state.maxPage) return;
    if (state.oldPageIndex == showIndexNumber) return;
    if (scrollDirectionY.value == "down") {
      getTableList({ Page: { PageNum: showIndexNumber + 2 } });
    } else {
      getTableList({ Page: { PageNum: showIndexNumber } });
    }
    state.PageNum = showIndexNumber + 1;
    if (typeof window !== "undefined") window.developLog.log("当前页面", state.PageNum, "danger");
    state.oldPageIndex = showIndexNumber;
  }, 50),
  { deep: true }
);
/**
 * 监听视窗内元素列表
 * @description 更新粘性视图状态和底部高度
 */
watch(
  () => isInViewList.value,
  newVal => {
    const InView = newVal.find(item => !!item.Els);
    if (InView) {
      useStickyViewIn.value = InView.isIntersecting;
      footerHeight.value = footerRef.value?.clientHeight || "0px";
    }
  },
  { deep: true }
);
/**
 * 监听外部依赖变化
 * @description 同步外部传入的禁用和显示规则
 */
watch(
  () => props.exDependent,
  data => {
    if (data.disabledRule) exDisabled.value = data.disabledRule;
    if (data.displayRule) exDisplay.value = data.displayRule;
  },
  { deep: true, immediate: true }
);
/**
 * 监听表格结构变化
 * @description 当传入的 structure 变化时重新设置表格配置
 */
watch(
  () => props.structure,
  value => {
    setStructure_All(value);
  }
);
/**
 * 监听无限滚动配置变化
 * @description 刷新表格以应用新的滚动模式
 */
watch(
  () => infiniteScroll.value,
  () => {
    refreshTable();
  }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
