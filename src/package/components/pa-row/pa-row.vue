<template>
  <div :class="classes" :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts" name="PaRow">
/**
 * 模块导入
 * @description 导入 Vue 核心库
 */
import { computed, provide, ref, onMounted, onUnmounted } from "vue";
/**
 * 模块导入
 * @description 导入 PaRow 类型定义
 */
import type { ComponentProps } from "./types";
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  justify: "start",
  align: "top"
});
/**
 * 计算类名
 * @description 根据属性计算组件类名
 */
const classes = computed(() => {
  const classList = ["pa-row"];
  classList.push(`pa-row--${props.justify}`);
  classList.push(`pa-row--align-${props.align}`);
  return classList;
});
/**
 * 计算栅格间隔值
 * @description 计算实际的栅格间隔值
 */
const gutterValue = computed(() => {
  return props.gutter
    ? typeof props.gutter === "number"
      ? props.gutter / 2
      : Number(props.gutter.replace(/\D/g, "") || 0) / 2
    : 0;
});
/**
 * 计算样式
 * @description 根据间隔值计算行样式
 */
const style = computed(() => {
  const styles: Record<string, string> = {};
  styles["--row-gutter-value"] = gutterValue.value ? `${gutterValue.value}px` : "calc(var(--pa-size-padding) / 2)";
  styles.marginTop = gutterValue.value ? `calc(0px - ${gutterValue.value}px)` : "calc(0px - var(--pa-size-padding) / 2)";
  styles.marginBottom = gutterValue.value ? `calc(0px - ${gutterValue.value}px)` : "calc(0px - var(--pa-size-padding) / 2)";
  return styles;
});
/**
 * 断点类型
 * @description 响应式断点类型定义
 */
type BreakPoint = "lg" | "md" | "sm" | "xl" | "xs";
/**
 * 当前断点
 * @description 当前响应式断点
 */
const breakPoint = ref<BreakPoint>("xl");
/**
 * 计算当前断点
 * @returns BreakPoint
 * @description 根据窗口宽度计算当前断点
 */
const calculateBreakPoint = (): BreakPoint => {
  const width = typeof window !== "undefined" ? window.innerWidth : 0;
  if (width < 384) return "xs";
  if (width < 768) return "sm";
  if (width < 992) return "md";
  if (width < 1200) return "lg";
  return "xl";
};
/**
 * 监听窗口大小变化
 * @description 窗口大小变化时重新计算断点
 */
const handleResize = (): void => {
  breakPoint.value = calculateBreakPoint();
};
/**
 * 组件挂载
 * @description 初始化断点并添加事件监听
 */
onMounted(() => {
  breakPoint.value = calculateBreakPoint();
  if (typeof window !== "undefined") window.addEventListener("resize", handleResize);
});
/**
 * 组件卸载
 * @description 移除事件监听
 */
onUnmounted(() => {
  if (typeof window !== "undefined") window.removeEventListener("resize", handleResize);
});
/**
 * 提供断点信息给子组件
 * @description 向下注入断点信息
 */
provide("breakPoint", breakPoint);
/**
 * 提供行间隔信息给子组件
 * @description 向下注入行间隔值
 */
provide("rowGutter", gutterValue);
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
