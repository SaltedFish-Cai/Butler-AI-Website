<template>
  <div :style="style" :class="classes">
    <slot></slot>
  </div>
</template>

<script setup lang="ts" name="PaCol">
/**
 * **模块导入**
 * @description 导入 Vue 核心库
 */
import { computed, inject, ref, type Ref } from "vue";
/**
 * **模块导入**
 * @description 导入 PaCol 类型定义
 */
import type { BreakPoint, ComponentProps } from "./types";
/**
 * **组件属性**
 * @type `ComponentProps`
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
 * **注入断点信息**
 * @type `Ref<BreakPoint>`
 * @description 注入断点信息，如果没有则默认使用 xl
 */
const breakPoint = inject<Ref<BreakPoint>>("breakPoint", ref<BreakPoint>("xl"));
/**
 * **注入行间隔**
 * @type `Ref<number>`
 * @description 注入行间隔值
 */
const rowGutter = inject<Ref<number>>("rowGutter", ref<number>(0));
/**
 * **当前断点 span 值**
 * @returns `number` | `undefined` 当前断点对应的 span 值
 * @description 根据当前断点获取对应的 span 值
 */
const currentSpan = computed(() => {
  if (props.span) return props.span;
  const responsive = props[breakPoint.value];
  if (!responsive) return undefined;
  return typeof responsive === "number" ? responsive : responsive.span;
});
/**
 * **栅格间隔值**
 * @returns `number` 栅格间隔值
 * @description 优先使用 props.gutter，否则使用注入的行间隔
 */
const gutterValue = computed(() => {
  const { gutter } = props;
  if (gutter) {
    return typeof gutter === "number" ? gutter / 2 : (parseInt(gutter, 10) || 0) / 2;
  }
  return rowGutter.value;
});
/**
 * **列样式**
 * @returns `Record<string, string | number>` 列样式对象
 * @description 根据 span 和间隔计算列样式
 */
const style = computed(() => {
  const span = currentSpan.value || 0;
  const value = gutterValue.value;
  const hasGutter = !!value;
  return {
    "--col-span-value": span,
    flex: `0 0 ${(100 / span).toFixed(2)}%`,
    maxWidth: hasGutter
      ? `calc(calc(100% - ${(span - 1) * value * 2}px) / var(--col-span-value))`
      : `calc(calc(100% - ${span - 1} * var(--pa-size-padding)) / var(--col-span-value))`,
    marginLeft: hasGutter ? `${value}px` : "calc(var(--pa-size-padding) / 2)",
    marginRight: hasGutter ? `${value}px` : "calc(var(--pa-size-padding) / 2)"
  };
});
/**
 * **响应式断点列表**
 * @type `ReadonlyArray<string>`
 * @description 响应式断点类型定义
 */
const BREAK_POINT_LIST = ["xs", "sm", "md", "lg", "xl"] as const;
/**
 * **计算类名**
 * @returns `Array<string>` 组件类名数组
 * @description 根据属性计算组件类名
 */
const classes = computed(() => {
  const cls: string[] = ["pa-col"];
  if (props.span && props.span !== 24) cls.push(`pa-col-${props.span}`);
  if (props.offset > 0) cls.push(`pa-col-offset-${props.offset}`);
  // 响应式断点类名
  for (let i = 0; i < BREAK_POINT_LIST.length; i++) {
    const bp = BREAK_POINT_LIST[i];
    const responsive = props[bp];
    if (!responsive) continue;
    const span = typeof responsive === "number" ? responsive : responsive.span;
    if (span !== undefined) cls.push(`pa-col-${bp}-${span}`);
    const offset = typeof responsive === "number" ? 0 : responsive.offset;
    if (offset && offset > 0) cls.push(`pa-col-${bp}-offset-${offset}`);
  }
  return cls;
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
