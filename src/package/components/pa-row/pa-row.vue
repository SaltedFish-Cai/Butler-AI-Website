<template>
  <div :class="classes" :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts" name="PaRow">
/**
 * @component PaRow
 * @description 栅格行组件，需配合 PaCol 使用
 * @author Butler AI
 */
/** @description Vue 核心库 */
import { computed, provide, ref, onMounted, onUnmounted } from "vue";
/** @description PaRow 类型定义 */
import type { ComponentProps } from "./types";
const props = withDefaults(defineProps<ComponentProps>(), {
  justify: "start",
  align: "top"
});
/** @description 计算类名 */
const classes = computed(() => {
  const classList = ["pa-row"];
  classList.push(`pa-row--${props.justify}`);
  classList.push(`pa-row--align-${props.align}`);
  return classList;
});
/** @description 计算栅格间隔值 */
const gutterValue = computed(() => {
  return props.gutter
    ? typeof props.gutter === "number"
      ? props.gutter / 2
      : Number(props.gutter.replace(/\D/g, "") || 0) / 2
    : 0;
});
/** @description 计算样式 */
const style = computed(() => {
  const styles: Record<string, string> = {};
  styles["--row-gutter-value"] = gutterValue.value ? `${gutterValue.value}px` : "calc(var(--pa-size-padding) / 2)";
  styles.marginTop = gutterValue.value ? `calc(0px - ${gutterValue.value}px)` : "calc(0px - var(--pa-size-padding) / 2)";
  styles.marginBottom = gutterValue.value ? `calc(0px - ${gutterValue.value}px)` : "calc(0px - var(--pa-size-padding) / 2)";
  return styles;
});
/** @description 断点类型 */
type BreakPoint = "lg" | "md" | "sm" | "xl" | "xs";
/** @description 当前断点 */
const breakPoint = ref<BreakPoint>("xl");
/** @description 计算当前断点 */
const calculateBreakPoint = (): BreakPoint => {
  const width = typeof window !== "undefined" ? window.innerWidth : 0;
  if (width < 384) return "xs";
  if (width < 768) return "sm";
  if (width < 992) return "md";
  if (width < 1200) return "lg";
  return "xl";
};
/** @description 监听窗口大小变化 */
const handleResize = (): void => {
  breakPoint.value = calculateBreakPoint();
};
/** @description 组件挂载时初始化断点并添加事件监听 */
onMounted(() => {
  breakPoint.value = calculateBreakPoint();
  if (typeof window !== "undefined") window.addEventListener("resize", handleResize);
});
/** @description 组件卸载时移除事件监听 */
onUnmounted(() => {
  if (typeof window !== "undefined") window.removeEventListener("resize", handleResize);
});
/** @description 提供断点信息给子组件 */
provide("breakPoint", breakPoint);
/** @description 提供行间隔信息给子组件 */
provide("rowGutter", gutterValue);
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
