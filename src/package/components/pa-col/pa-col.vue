<template>
  <div :style="style" :class="classes">
    <slot></slot>
  </div>
</template>

<script setup lang="ts" name="PaCol">
/**
 * @component PaCol
 * @description 栅格列组件，需配合 PaRow 使用
 * @author Butler AI
 */
/** @description Vue 核心库 */
import { computed, inject, ref, Ref } from "vue";
/** @description 类型定义 */
import type { BreakPoint, Responsive } from "./types";
/**
 * PaCol 组件 Props
 */
interface Props {
  /** 栅格占据的列数（共24列） */
  span?: number;
  /** 栅格左侧的间隔格数 */
  offset?: number;
  /** <576px 响应式配置 */
  xs?: Responsive | number;
  /** ≥576px 响应式配置 */
  sm?: Responsive | number;
  /** ≥768px 响应式配置 */
  md?: Responsive | number;
  /** ≥992px 响应式配置 */
  lg?: Responsive | number;
  /** ≥1200px 响应式配置 */
  xl?: Responsive | number;
  /** 栅格间隔，覆盖 Row 的 gutter */
  gutter?: number | string;
}
const props = withDefaults(defineProps<Props>(), {
  offset: 0,
  xs: undefined,
  sm: undefined,
  md: undefined,
  lg: undefined,
  xl: undefined,
  gutter: undefined
});
/** @description 注入断点信息，如果没有则默认使用xl */
const breakPoint = inject<Ref<BreakPoint>>("breakPoint", ref<BreakPoint>("xl"));
/** @description 注入行间隔 */
const rowGutter = inject<Ref<number>>("rowGutter", ref<number>(0));
/** @description 获取当前断点对应的span值 */
const currentSpan = computed(() => {
  const responsive = props[breakPoint.value];
  if (props.span) return props.span;
  const span = typeof responsive === "number" ? responsive : responsive?.span;
  if (span !== undefined) {
    return span;
  }
  return props.span;
});
/** @description 计算栅格间隔值，优先使用 props.gutter，否则使用注入的行间隔 */
const gutterValue = computed(() => {
  return props.gutter
    ? typeof props.gutter === "number"
      ? props.gutter / 2
      : Number(props.gutter.replace(/\D/g, "") || 0) / 2
    : rowGutter.value;
});
/** @description 计算样式 */
const style = computed(() => {
  const span = currentSpan.value || 0;
  const data = {
    "--col-span-value": span,
    flex: `0 0 ${(100 / span).toFixed(2)}%`,
    maxWidth: gutterValue.value
      ? `calc(calc(100% - ${(span - 1) * gutterValue.value * 2}px) / var(--col-span-value))`
      : `calc(calc(100% - ${span - 1} * var(--pa-size-padding)) / var(--col-span-value))`,
    marginLeft: gutterValue.value ? `${gutterValue.value}px` : "calc(var(--pa-size-padding) / 2)",
    marginRight: gutterValue.value ? `${gutterValue.value}px` : "calc(var(--pa-size-padding) / 2)"
  };
  return data;
});
/** @description 计算类名 */
const classes = computed(() => {
  const classList = ["pa-col"];
  if (props.span !== 24) {
    classList.push(`pa-col-${props.span}`);
  }
  if (props.offset > 0) {
    classList.push(`pa-col-offset-${props.offset}`);
  }
  const breakPoints: BreakPoint[] = ["xs", "sm", "md", "lg", "xl"];
  breakPoints.forEach(bp => {
    const responsive = props[bp];
    if (responsive) {
      const span = typeof responsive === "number" ? responsive : responsive.span;
      if (span !== undefined) {
        classList.push(`pa-col-${bp}-${span}`);
      }
      const offset = typeof responsive === "number" ? 0 : responsive.offset;
      if (offset !== undefined && offset > 0) {
        classList.push(`pa-col-${bp}-offset-${offset}`);
      }
    }
  });
  return classList;
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
