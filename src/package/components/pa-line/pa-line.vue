<template>
  <div class="pa-line" :class="[props.class]" :style="lineStyle">
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
 * 线条样式计算
 * @description 根据 padding 数组生成 CSS 变量，处理数值和字符串类型
 */
const lineStyle = computed(() => {
  const paddingValue = (value: number | string) => (Number.isNaN(+value) ? value : `${value}px`);
  return {
    ...props.style,
    "--pa-line-margin-top": paddingValue(props.padding[0]),
    "--pa-line-margin-right": paddingValue(props.padding[1]),
    "--pa-line-margin-bottom": paddingValue(props.padding[2]),
    "--pa-line-margin-left": paddingValue(props.padding[3]),
    "--pa-line-height": props.height,
    marginTop: `calc(0px - ${props.height})`,
    "--pa-line-width": props.width,
    "--pa-line-border-color": props.borderColor || "transparent",
    "--pa-line-border-style": props.borderStyle || "solid"
  };
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
