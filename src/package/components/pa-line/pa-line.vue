<template>
  <div class="pa-line" :class="props.class" :style="lineStyle">
    <div v-if="$slots['default']" class="ml-size mr-size">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { ComponentProps } from "./types";
/**
 * 模块导入
 * @description 导入 vue 的 computed API
 */
import { computed } from "vue";
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  padding: () => [0, 0, 0, 0],
  height: "2px",
  width: "100%",
  borderColor: "var(--pa-color-primary-light-6)",
  borderStyle: "solid"
});
/**
 * 样式数值转 CSS 字符串
 * @description 判断 padding 值是否为数字，数字自动添加 px 后缀
 */
function toPx(value: number | string): string {
  return typeof value === "number" ? `${value}px` : String(value);
}
/**
 * 线条样式计算
 * @description 根据 padding 数组生成 CSS 变量
 */
const lineStyle = computed(() => ({
  ...props.style,
  "--pa-line-margin-top": toPx(props.padding[0]),
  "--pa-line-margin-right": toPx(props.padding[1]),
  "--pa-line-margin-bottom": toPx(props.padding[2]),
  "--pa-line-margin-left": toPx(props.padding[3]),
  "--pa-line-height": props.height,
  marginTop: `calc(0px - ${props.height})`,
  "--pa-line-width": props.width,
  "--pa-line-border-color": props.borderColor || "transparent",
  "--pa-line-border-style": props.borderStyle || "solid"
}));
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
