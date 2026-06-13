<template>
  <div :id="props.id" class="pa-easy-table" :class="[props.class, card ? 'card' : 'pa-easy-table--table']" :style="props.style">
    <div class="pa-easy-table__table">
      <div class="pa-easy-table__row pa-easy-table__row--header" :style="{ gridTemplateColumns: gridTemplate }">
        <div v-for="col in columns" :key="col.key" class="pa-easy-table__cell pa-easy-table__cell--header">
          {{ col.label }}
        </div>
      </div>

      <pa-empty v-if="data.length === 0" style="--pa-color-bg: transparent" />

      <pa-scrollbar v-else :useScrollX="false" @directlyScroll="onDirectlyScroll" @scrollChildChange="onScrollChildChange" :padding="['top', 'bottom']">
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
            <div class="pa-easy-table__row pa-easy-table__row--data" :class="{ 'pa-easy-table__row--hovered': hoveredRow === item.key }" :style="{ gridTemplateColumns: gridTemplate }">
              <div v-for="col in columns" :key="col.key" class="pa-easy-table__cell">
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
import { ref, computed, onBeforeUnmount, nextTick } from "vue";
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

interface VirtualItem {
  data: Record<string, any>;
  index: number;
  top: number;
  key: string | number;
}

/**
 * 组件属性
 */
const props = withDefaults(
  defineProps<{
    id?: string;
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
const hoveredRow = ref<string | number | null>(null);
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
const enteredKeys = new Set<string | number>();

const OVERSCAN = 5;
const ROW_GAP = 5;

const rowHeightMap = new Map<number, number>();
const rowRefs = new Map<number, HTMLElement>();
const resizeObservers = new Map<number, ResizeObserver>();
let measureScheduled = false;
let pendingMeasureIndices = new Set<number>();

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

const gridTemplate = computed(() => props.columns.map(c => c.width || "1fr").join(" "));

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
function getRowKey(row: Record<string, any>, index: number): string | number {
  return row.id ?? row.key ?? index;
}

/**
 * 处理直接滚动
 * @param data - 滚动数据
 */
function onDirectlyScroll(data: { scrollTop: number }) {
  scrollTop.value = data.scrollTop;
}

/**
 * 处理滚动子元素变化
 * @param data - 滚动区域数据
 */
function onScrollChildChange(data: { bodyHeight: number }) {
  bodyHeight.value = data.bodyHeight;
}

/**
 * 组件卸载前清理
 * @description 清理 ResizeObserver 和行引用
 */
onBeforeUnmount(() => {
  for (const obs of resizeObservers.values()) {
    obs.disconnect();
  }
  resizeObservers.clear();
  rowRefs.clear();
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
