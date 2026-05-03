<template>
  <div :style="style" :class="classes">
    <slot></slot>
  </div>
</template>

<script setup lang="ts" name="PaCol">
/**
 * 模块导入
 * @description 导入 Vue 核心库
 */
import { computed, inject, ref, Ref } from "vue";
/**
 * 模块导入
 * @description 导入 PaCol 类型定义
 */
import type { BreakPoint, ComponentProps } from "./types";
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  offset: 0,
  xs: undefined,
  sm: undefined,
  md: undefined,
  lg: undefined,
  xl: undefined
});
/**
 * 注入断点信息
 * @description 注入断点信息，如果没有则默认使用xl
 */
const breakPoint = inject<Ref<BreakPoint>>("breakPoint", ref<BreakPoint>("xl"));
/**
 * 注入行间隔
 * @description 注入行间隔值
 */
const rowGutter = inject<Ref<number>>("rowGutter", ref<number>(0));
/**
 * 获取当前断点对应的span值
 * @description 根据当前断点获取对应的span值
 */
const currentSpan = computed(() => {
  const responsive = props[breakPoint.value];
  if (props.span) return props.span;
  const span = typeof responsive === "number" ? responsive : responsive?.span;
  if (span !== undefined) {
    return span;
  }
  return props.span;
});
/**
 * 计算栅格间隔值
 * @description 优先使用 props.gutter，否则使用注入的行间隔
 */
const gutterValue = computed(() => {
  return props.gutter
    ? typeof props.gutter === "number"
      ? props.gutter / 2
      : Number(props.gutter.replace(/\D/g, "") || 0) / 2
    : rowGutter.value;
});
/**
 * 计算样式
 * @description 根据span和间隔计算列样式
 */
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
/**
 * 计算类名
 * @description 根据属性计算组件类名
 */
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
