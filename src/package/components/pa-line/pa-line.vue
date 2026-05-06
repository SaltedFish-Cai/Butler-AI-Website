<template>
  <div
    class="pa-line"
    :class="[props.class]"
    :style="{
      ...props.style,
      margin: padding.join('px ') + 'px',
      '--pa-line-height': height,
      marginTop: `calc(0px - ${height})`,
      width: width,
      '--pa-line-border-color': borderColor || 'transparent'
    }"
  >
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
import { ComponentProps } from "./types";
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  padding: () => [0, 0, 0, 0],
  height: "2px",
  width: "100%",
  borderColor: "var(--pa-color-primary-light-6)"
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
