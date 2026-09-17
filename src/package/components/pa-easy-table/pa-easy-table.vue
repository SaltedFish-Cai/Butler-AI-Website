<template>
  <div
    :id="renderId"
    class="pa-easy-table"
    :class="[props.class, card ? 'card' : 'pa-easy-table--table', overflowX ? 'pa-easy-table--x-scroll' : '']"
    :style="props.style"
  >
    <div class="pa-easy-table__table">
      <div ref="headerRef" class="pa-easy-table__row pa-easy-table__row--header" :style="{ gridTemplateColumns: gridTemplate }">
        <template v-for="col in columns" :key="col.key">
          <div
            v-show="col !== operationColumn"
            class="pa-easy-table__cell pa-easy-table__cell--header"
            :class="{
              'pa-easy-table__cell--operation': col === operationColumn,
              'pa-easy-table__cell--operation-pinned': col === operationColumn && operationPinned
            }"
          >
            <div class="pa-easy-table__cell--header_inner">{{ col.label }}</div>
          </div>
        </template>
      </div>
      <pa-empty v-if="data.length === 0" :style="{ '--pa-color-bg': 'transparent' }" />
      <pa-scrollbar
        v-else
        ref="scrollbarRef"
        @directly-scroll="onDirectlyScroll"
        @scroll-child-change="onScrollChildChange"
        :paddingWidth="5"
        :padding="['top', 'bottom']"
        :overflowX="overflowX"
        :showThumbX="false"
      >
        <div class="pa-easy-table__virtual-space" :style="{ height: virtualTotalHeight + 'px' }">
          <div
            v-for="item in visibleItems"
            :key="item.key"
            :ref="(el: any) => observeRow(el as HTMLElement | null, item.index)"
            class="pa-easy-table__row-wrapper"
            :class="{ 'row-enter-active': !enteredKeys.has(item.key) }"
            :style="{ position: 'absolute', top: item.top + 'px', left: 0, right: 0, '--i': item.index - visibleRange.start }"
            @animationend="enteredKeys.add(item.key)"
            @mouseenter="hoveredRow = item.key"
            @mouseleave="hoveredRow = null"
            @click="emit('rowClick', item.data)"
          >
            <div
              class="pa-easy-table__row pa-easy-table__row--data"
              :class="{ 'pa-easy-table__row--hovered': hoveredRow === item.key }"
              :style="{ gridTemplateColumns: gridTemplate }"
            >
              <div
                v-for="col in columns"
                :key="col.key"
                class="pa-easy-table__cell"
                :class="{
                  'pa-easy-table__cell--operation': col === operationColumn,
                  'pa-easy-table__cell--operation-pinned': col === operationColumn && operationPinned
                }"
              >
                <div
                  class="pa-easy-table__cell_inner"
                  :style="{ whiteSpace: gridTemplate_Init ? '' : 'nowrap', width: gridTemplate_Init ? '100%' : '' }"
                >
                  <PaEasyTableMaxChild v-if="col.maxChild" :max="col.maxChild">
                    <slot :name="col.slot || col.key" :row="item.data" :value="item.data[col.key]" :index="item.index">
                      {{ item.data[col.key] }}
                    </slot>
                  </PaEasyTableMaxChild>
                  <template v-else>
                    <slot :name="col.slot || col.key" :row="item.data" :value="item.data[col.key]" :index="item.index">
                      {{ item.data[col.key] }}
                    </slot>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </pa-scrollbar>
    </div>

    <slot name="extra" />
  </div>
</template>

<script setup lang="ts">
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { ColumnDef } from "./types";
/**
 * 模块导入
 * @description 导入 PaEasyTableMaxChild 组件
 */
import PaEasyTableMaxChild from "./pa-easy-table-max-child";
import useRenderId from "../tools/render-id";

interface VirtualItem {
  data: Record<string, any>;
  index: number;
  top: number;
  key: number | string;
}

/**
 * 组件属性
 */
const props = withDefaults(
  defineProps<{
    id?: string;
    renderId?: string;
    class?: string;
    style?: Record<string, string>;
    columns: ColumnDef[];
    data: Record<string, any>[];
    title?: string;
    rowHeight?: number;
    card?: boolean;
  }>(),
  {
    rowHeight: 78,
    card: false
  }
);
/**
 * 组件事件
 */
const emit = defineEmits<{
  (e: "rowClick", row: Record<string, any>): void;
}>();
/**
 * 当前悬停行 key
 */
const hoveredRow = ref<number | string | null>(null);
/**
 * 滚动位置
 */
const scrollTop = ref(0);
/**
 * 可视区域高度
 */
const bodyHeight = ref(0);
/**
 * 已进入动画的行 key 集合
 */
const enteredKeys = new Set<number | string>();
const renderId = ref(props.renderId || (props.id ? props.id : "pa-easy-table_" + useRenderId()));
const OVERSCAN = 5;
const ROW_GAP = 5;

const rowHeightMap = new Map<number, number>();
const rowRefs = new Map<number, HTMLElement>();
const resizeObservers = new Map<number, ResizeObserver>();
let measureScheduled = false;
const pendingMeasureIndices = new Set<number>();

/**
 * 调度测量
 */
function scheduleMeasure() {
  if (measureScheduled) return;
  measureScheduled = true;
  nextTick(() => {
    measureScheduled = false;
    if (pendingMeasureIndices.size === 0) return;
    let changed = false;
    for (const i of pendingMeasureIndices) {
      const el = rowRefs.get(i);
      if (!el) continue;
      const h = el.offsetHeight;
      if (h > 0 && rowHeightMap.get(i) !== h) {
        rowHeightMap.set(i, h);
        changed = true;
      }
    }
    pendingMeasureIndices.clear();
    if (changed) {
      triggerUpdate.value++;
    }
  });
}

/**
 * 观察行元素
 * @param el - 行元素
 * @param index - 行索引
 */
function observeRow(el: HTMLElement | null, index: number) {
  if (!el) {
    const obs = resizeObservers.get(index);
    if (obs) {
      obs.disconnect();
      resizeObservers.delete(index);
    }
    rowRefs.delete(index);
    return;
  }
  rowRefs.set(index, el);
  if (!resizeObservers.has(index)) {
    const obs = new ResizeObserver(() => {
      pendingMeasureIndices.add(index);
      scheduleMeasure();
    });
    resizeObservers.set(index, obs);
    obs.observe(el);
  }
  pendingMeasureIndices.add(index);
  scheduleMeasure();
}

/**
 * 获取实际行高
 * @param index - 行索引
 * @returns 行高
 */
function getActualHeight(index: number): number {
  return rowHeightMap.get(index) ?? props.rowHeight;
}

const triggerUpdate = ref(0);

const columnWidths = ref<number[]>([]);
const overflowX = ref(false);
const headerRef = ref<HTMLElement | null>(null);
/**
 * 滚动条组件引用
 */
const scrollbarRef = ref<{ bodyEl?: HTMLElement } | null>(null);
let measuring = false;

/**
 * 操作列（key 或 slot 为 operation）
 * @description 该列固定在表格右侧，不随水平滚动移动
 */
const operationColumn = computed(() => props.columns.find(col => col.key === "operation" || col.slot === "operation"));

/**
 * 操作列是否已固定在右侧
 */
const operationPinned = ref(false);
/**
 * 操作列水平偏移量（px），用于抵消水平滚动使其固定在右侧
 */
const operationOffset = ref(0);
/**
 * 表头操作列水平偏移量（px）
 */
const headerOperationOffset = ref(0);
/**
 * 操作列自然状态下右边缘在滚动内容坐标系中的位置（px）
 */
let operationEdge = 0;
/**
 * 表头操作列自然状态下右边缘在滚动内容坐标系中的位置（px）
 */
let headerOperationEdge = 0;

/**
 * 计算操作列的水平偏移量
 * @param edge - 操作列自然状态下右边缘位置
 * @param clientWidth - 容器可视宽度
 * @param scrollLeft - 当前水平滚动位置
 * @returns 偏移量（仅向左偏移，故不大于 0）
 */
function calcOperationOffset(edge: number, clientWidth: number, scrollLeft: number) {
  if (edge <= 0 || clientWidth <= 0) return 0;
  return Math.min(0, Math.round(clientWidth - edge + scrollLeft));
}

/**
 * 测量操作列自然状态下右边缘在滚动内容坐标系中的位置
 * @param container - 滚动容器（表头或滚动主体）
 * @param cell - 操作列单元格
 * @param offset - 当前已施加的偏移量
 * @returns 右边缘位置（px），未找到时返回 0
 */
function measureOperationEdge(container: HTMLElement | null, cell: HTMLElement | null, offset: number) {
  if (!container || !cell) return 0;
  const containerRect = container.getBoundingClientRect();
  const cellRect = cell.getBoundingClientRect();
  return cellRect.right - containerRect.left + container.scrollLeft - offset;
}

/**
 * 测量操作列位置并同步偏移状态
 */
function measureOperation() {
  if (!operationColumn.value) {
    operationEdge = 0;
    headerOperationEdge = 0;
    operationOffset.value = 0;
    operationPinned.value = false;
    return;
  }
  const body = scrollbarRef.value?.bodyEl;
  const header = headerRef.value;
  if (!body) return;

  operationEdge = measureOperationEdge(
    body,
    body.querySelector(".pa-easy-table__cell--operation") as HTMLElement | null,
    operationOffset.value
  );
  headerOperationEdge = measureOperationEdge(
    header,
    header?.querySelector(".pa-easy-table__cell--operation") as HTMLElement | null,
    headerOperationOffset.value
  );
  updateOperationOffset(body.scrollLeft, body.clientWidth, header?.clientWidth ?? 0);
}

/**
 * 同步将偏移量写入操作列 DOM
 * @description 滚动过程中直接改写 style，使偏移与滚动在同一帧生效，
 * 避免经由 Vue 响应式渲染到下一帧才更新而产生的错位抖动
 * @param offset - 偏移量（px）
 */
function applyOperationOffset(offset: number) {
  const body = scrollbarRef.value?.bodyEl;
  if (!body) return;
  const cells = body.querySelectorAll<HTMLElement>(".pa-easy-table__cell--operation");
  cells.forEach(cell => {
    cell.style.transform = `translateX(${offset}px)`;
  });
}

/**
 * 更新操作列偏移状态
 * @param scrollLeft - 当前水平滚动位置
 * @param bodyClientWidth - 滚动主体可视宽度
 * @param headerClientWidth - 表头可视宽度
 */
function updateOperationOffset(scrollLeft: number, bodyClientWidth: number, headerClientWidth: number) {
  const offset = calcOperationOffset(operationEdge, bodyClientWidth, scrollLeft);
  operationOffset.value = offset;
  operationPinned.value = offset < 0;
  headerOperationOffset.value = calcOperationOffset(headerOperationEdge, headerClientWidth, scrollLeft);
  applyOperationOffset(offset);
}

/**
 * 渲染完成后回填偏移量
 * @description 虚拟滚动会新建行元素，这些元素没有携带偏移，需要在渲染后补写；
 * 此时偏移值未变化，不会产生视觉效果
 */
function syncOperationOffset() {
  nextTick(() => applyOperationOffset(operationOffset.value));
}

const gridTemplate = computed(() => {
  if (props.columns.length === 0) return "";
  const cw = columnWidths.value;
  if (cw.length === props.columns.length) {
    return cw.map(w => `${w}px`).join(" ");
  }
  return props.columns.map(() => "auto").join(" ");
});

const gridTemplate_Init = computed(() => {
  return gridTemplate.value.indexOf("px") > -1;
});

function measureColumns() {
  if (measuring) return;
  measuring = true;
  const header = headerRef.value;
  const table = header?.closest(`#${renderId.value}`) as HTMLElement | null;
  if (!header || !table) {
    measuring = false;
    return;
  }

  columnWidths.value = [];

  nextTick(() => {
    const cells = header.querySelectorAll(`#${renderId.value} .pa-easy-table__cell--header_inner`);
    let widths: number[] = [];
    cells.forEach((el, i) => {
      widths[i] = (el as HTMLElement).clientWidth;
    });

    const rows = table.querySelectorAll(`#${renderId.value} .pa-easy-table__row--data`);
    rows.forEach(row => {
      const rowCells = row.querySelectorAll(`#${renderId.value} .pa-easy-table__cell_inner`);
      rowCells.forEach((cell, i) => {
        if (i < widths.length) {
          widths[i] = Math.max(widths[i], (cell as HTMLElement).clientWidth);
        }
      });
    });

    // 应用用户设置的固定宽度（仅接受正数值，单位为 px）
    props.columns.forEach((col, i) => {
      if (typeof col.width === "number" && col.width > 0 && widths[i] !== undefined) {
        widths[i] = col.width;
      }
    });

    if (widths.length > 0 && widths.every(w => w > 0)) {
      const gapTotal = (props.columns.length - 1) * 12;
      const totalWidth = widths.reduce((s, w) => s + w, 0) + gapTotal;
      const containerWidth = table.clientWidth;
      if (totalWidth <= containerWidth) {
        const _gapTotal = gapTotal + 32;
        const flexIndices = props.columns.map((_, i) => i).filter(i => typeof props.columns[i].width !== "number");
        const flexCount = flexIndices.length;
        if (flexCount > 0 && flexCount < props.columns.length) {
          // 部分列固定宽度：剩余空间分配给非固定列
          const flexWidthsSum = flexIndices.reduce((s, i) => s + widths[i], 0);
          const fixedWidthsSum = widths.reduce((s, w) => s + w, 0) - flexWidthsSum;
          const remaining = containerWidth - _gapTotal - fixedWidthsSum;
          flexIndices.forEach(i => {
            widths[i] = Math.floor((widths[i] * remaining) / flexWidthsSum);
          });
        } else if (flexCount === 0) {
          // 全设了固定宽度：直接使用，不做缩放
        } else {
          const _containerWidth = containerWidth - _gapTotal;
          const _totalWidth = totalWidth - gapTotal;
          // 全未设宽度：保持原有等比分配逻辑
          widths = widths.map(w => {
            return Math.floor((w * _containerWidth) / _totalWidth);
          });
        }
        columnWidths.value = widths;
        overflowX.value = false;
      } else {
        columnWidths.value = widths;
        overflowX.value = true;
      }
    } else {
      columnWidths.value = [];
      overflowX.value = false;
    }
    measuring = false;
    nextTick(measureOperation);
  });
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  measureColumns();
  const table = headerRef.value?.closest(`#${renderId.value}`) as HTMLElement | null;
  if (table) {
    resizeObserver = new ResizeObserver(() => measureColumns());
    resizeObserver.observe(table);
  }
});

watch(() => props.data, measureColumns);

/**
 * 虚拟滚动切换可见行后回填偏移量
 */
watch(scrollTop, syncOperationOffset);

const accumulatedTops = computed(() => {
  triggerUpdate.value;
  const acc: number[] = [];
  let sum = 0;
  for (let i = 0; i < props.data.length; i++) {
    acc.push(sum);
    sum += getActualHeight(i) + ROW_GAP;
  }
  return acc;
});

const virtualTotalHeight = computed(() => {
  triggerUpdate.value;
  let total = 0;
  for (let i = 0; i < props.data.length; i++) {
    total += getActualHeight(i) + ROW_GAP;
  }
  return total;
});

const useVirtual = computed(() => bodyHeight.value > 0 && virtualTotalHeight.value > bodyHeight.value);

const visibleRange = computed(() => {
  if (!useVirtual.value) {
    return { start: 0, end: props.data.length };
  }
  const tops = accumulatedTops.value;
  const scrollEnd = scrollTop.value + bodyHeight.value;

  let start = 0;
  let lo = 0,
    hi = tops.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (tops[mid] + getActualHeight(mid) <= scrollTop.value) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  start = Math.max(0, lo - OVERSCAN);

  let end = props.data.length;
  lo = 0;
  hi = tops.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (tops[mid] < scrollEnd) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  end = Math.min(props.data.length, lo + OVERSCAN);

  return { start, end };
});

const visibleItems = computed<VirtualItem[]>(() => {
  triggerUpdate.value;
  const tops = accumulatedTops.value;
  const items: VirtualItem[] = [];
  for (let i = visibleRange.value.start; i < visibleRange.value.end; i++) {
    items.push({
      data: props.data[i],
      index: i,
      top: tops[i] ?? i * props.rowHeight,
      key: getRowKey(props.data[i], i)
    });
  }
  return items;
});

/**
 * 获取行 key
 * @param row - 行数据
 * @param index - 行索引
 * @returns 行唯一标识
 */
function getRowKey(row: Record<string, any>, index: number): number | string {
  return row.id ?? row.key ?? index;
}

/**
 * 处理直接滚动
 * @param data - 滚动数据
 */
function onDirectlyScroll(data: { scrollTop: number; scrollLeft: number }) {
  scrollTop.value = data.scrollTop;
  if (headerRef.value?.scrollLeft != null) headerRef.value.scrollLeft = data.scrollLeft;
  const body = scrollbarRef.value?.bodyEl;
  updateOperationOffset(data.scrollLeft, body?.clientWidth ?? 0, headerRef.value?.clientWidth ?? 0);
}

/**
 * 处理滚动子元素变化
 * @param data - 滚动区域数据
 */
function onScrollChildChange(data: { bodyHeight: number; bodyWidth?: number }) {
  bodyHeight.value = data.bodyHeight;
  nextTick(measureOperation);
}

/**
 * 组件卸载前清理
 * @description 清理 ResizeObserver 和行引用
 */
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  for (const obs of resizeObservers.values()) {
    obs.disconnect();
  }
  resizeObservers.clear();
  rowRefs.clear();
});
</script>

<style lang="scss">
@use "../styles/default/pa-easy-table.scss";
</style>
