<template>
  <div :id="id" class="pa-slider" :class="[props.class, { 'is-disabled': disabled, 'is-range': range }]" :style="props.style">
    <div ref="runwayRef" class="pa-slider__runway" @mousedown.prevent="onRunwayClick">
      <div v-for="m in parsedMarks" :key="m.value" class="pa-slider__stop" :style="{ left: m.position + '%' }">
        <div class="pa-slider__marks-dot" :class="{ 'pa-slider__marks-dot--active': m.isActive }" />
        <div v-if="m.label" class="pa-slider__marks-label">{{ m.label }}</div>
      </div>

      <div class="pa-slider__bar" :style="barStyle" />

      <div
        v-for="(h, i) in handleValues"
        :key="i"
        class="pa-slider__handle"
        :class="{ 'pa-slider__handle--dragging': draggingIndex === i }"
        :style="{ left: h.percent + '%' }"
        :tabindex="disabled ? -1 : 0"
        role="slider"
        :aria-valuenow="h.value"
        :aria-valuemin="min"
        :aria-valuemax="max"
        @mousedown.stop.prevent="onHandleMouseDown($event, i)"
        @keydown.stop.prevent="onHandleKeydown($event, i)"
      >
        <div v-show="showTooltip && (hoverIndex === i || draggingIndex === i)" class="pa-slider__tooltip">
          <span>{{ h.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, type Ref } from "vue";
import type { ComponentProps, ComponentEmits } from "./types";

const props = withDefaults(defineProps<ComponentProps>(), {
  min: 0,
  max: 100,
  step: 1,
  range: false,
  showTooltip: true,
  disabled: false
});
const emits = defineEmits<ComponentEmits>();

type MarkItem = {
  value: number;
  position: number;
  label: string;
  isActive: boolean;
};

/**
 * 滑道元素引用
 */
const runwayRef = ref<HTMLElement | null>(null);

/**
 * 当前拖拽中的滑块索引
 */
const draggingIndex = ref<number | null>(null);

/**
 * 当前悬停的滑块索引
 */
const hoverIndex = ref<number | null>(null);

/**
 * 当前值数组
 */
const currentValues: Ref<number[]> = ref([]);

/**
 * 将值限制在范围内
 * @param val - 原始值
 * @returns 限制后的值
 */
const clamp = (val: number): number => Math.min(props.max, Math.max(props.min, val));

/**
 * 解析后的标记列表
 */
const parsedMarks = computed<MarkItem[]>(() => {
  if (!props.marks) return [];
  const vals = currentValues.value;
  const min = props.min;
  const max = props.max;
  return Object.entries(props.marks).map(([key, mark]) => {
    const numKey = Number(key);
    const position = ((numKey - min) / (max - min)) * 100;
    const label = typeof mark === "string" ? mark : mark.label;
    const isActive = rangeActiveRange.value !== null ? numKey >= rangeActiveRange.value[0] && numKey <= rangeActiveRange.value[1] : vals.length > 0 && numKey <= vals[0];
    return { value: numKey, position, label, isActive };
  });
});

/**
 * 范围选择时的激活区间
 */
const rangeActiveRange = computed<[number, number] | null>(() => {
  if (!props.range || currentValues.value.length < 2) return null;
  return [Math.min(currentValues.value[0], currentValues.value[1]), Math.max(currentValues.value[0], currentValues.value[1])];
});

/**
 * 滑块值与位置映射
 */
const handleValues = computed(() =>
  currentValues.value.map(v => ({
    value: v,
    percent: ((v - props.min) / (props.max - props.min)) * 100
  }))
);

/**
 * 已激活滑块的样式
 */
const barStyle = computed(() => {
  if (handleValues.value.length === 0) return { width: "0%" };
  if (props.range && handleValues.value.length === 2) {
    const pct0 = handleValues.value[0].percent;
    const pct1 = handleValues.value[1].percent;
    return {
      left: Math.min(pct0, pct1) + "%",
      width: Math.abs(pct1 - pct0) + "%"
    };
  }
  return { width: handleValues.value[0].percent + "%" };
});

/**
 * 查找最近的标记值
 * @param rawValue - 原始值
 * @returns 最近的标记值
 */
const findNearestMarkValue = (rawValue: number): number => {
  const markKeys = Object.keys(props.marks!)
    .map(Number)
    .sort((a, b) => a - b);
  if (rawValue <= markKeys[0]) return markKeys[0];
  if (rawValue >= markKeys[markKeys.length - 1]) return markKeys[markKeys.length - 1];
  let lo = 0;
  let hi = markKeys.length - 1;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (markKeys[mid] <= rawValue) lo = mid;
    else hi = mid;
  }
  return Math.abs(rawValue - markKeys[lo]) <= Math.abs(rawValue - markKeys[hi]) ? markKeys[lo] : markKeys[hi];
};

/**
 * 获取步进后的值
 * @param rawValue - 原始值
 * @returns 步进后的值
 */
const getStepValue = (rawValue: number): number => {
  if (props.marks) return findNearestMarkValue(rawValue);
  const stepped = Math.round((rawValue - props.min) / props.step) * props.step + props.min;
  return clamp(stepped);
};

/**
 * 根据鼠标位置计算值
 * @param clientX - 鼠标 X 坐标
 * @returns 计算后的值
 */
const getValueFromPosition = (clientX: number): number => {
  const rect = runwayRef.value!.getBoundingClientRect();
  const percent = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  const rawValue = props.min + percent * (props.max - props.min);
  return getStepValue(rawValue);
};

/**
 * 更新指定滑块的值
 * @param val - 新值
 * @param index - 滑块索引
 */
const updateValue = (val: number, index: number) => {
  if (props.range && currentValues.value.length === 2) {
    const otherIdx = index === 0 ? 1 : 0;
    const other = currentValues.value[otherIdx];
    if (index === 0) val = Math.min(val, other - props.step);
    else val = Math.max(val, other + props.step);
  }
  const clamped = clamp(val);
  if (currentValues.value[index] !== clamped) {
    currentValues.value[index] = clamped;
    syncToModel();
  }
};

/**
 * 同步值到 modelValue
 */
const syncToModel = () => {
  const val = props.range ? ([...currentValues.value] as [number, number]) : currentValues.value[0];
  emits("update:modelValue", val as any);
};

/**
 * 点击滑道处理
 * @param event - 鼠标事件
 */
const onRunwayClick = (event: MouseEvent) => {
  if (props.disabled) return;
  const val = getValueFromPosition(event.clientX);
  if (props.range && currentValues.value.length === 2) {
    const dist0 = Math.abs(val - currentValues.value[0]);
    const dist1 = Math.abs(val - currentValues.value[1]);
    updateValue(val, dist0 <= dist1 ? 0 : 1);
  } else {
    updateValue(val, 0);
  }
};

/**
 * 滑块鼠标按下处理
 * @param _event - 鼠标事件
 * @param index - 滑块索引
 */
const onHandleMouseDown = (_event: MouseEvent, index: number) => {
  if (props.disabled) return;
  draggingIndex.value = index;

  const onMouseMove = (e: MouseEvent) => {
    const val = getValueFromPosition(e.clientX);
    updateValue(val, index);
  };

  const onMouseUp = () => {
    draggingIndex.value = null;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    emits("change", (props.range ? ([...currentValues.value] as [number, number]) : currentValues.value[0]) as any);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

/**
 * 滑块键盘事件处理
 * @param event - 键盘事件
 * @param index - 滑块索引
 */
const onHandleKeydown = (event: KeyboardEvent, index: number) => {
  if (props.disabled) return;
  let delta = 0;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") delta = props.step;
  else if (event.key === "ArrowLeft" || event.key === "ArrowDown") delta = -props.step;
  else return;
  const newVal = clamp(currentValues.value[index] + delta);
  updateValue(newVal, index);
  emits("change", (props.range ? ([...currentValues.value] as [number, number]) : currentValues.value[0]) as any);
};

/**
 * 监听 modelValue 变化
 * @description 同步外部传入的值到内部状态
 */
watch(
  () => props.modelValue,
  val => {
    if (props.range && Array.isArray(val)) {
      currentValues.value = [clamp(val[0]), clamp(val[1])];
    } else if (typeof val === "number") {
      currentValues.value = [clamp(val)];
    } else {
      currentValues.value = props.range ? [props.min, props.max] : [props.min];
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
