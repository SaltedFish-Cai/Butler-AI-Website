<template>
  <div
    class="pa-line"
    :class="[props.class]"
    :style="{
      ...props.style,
      '--pa-line-margin-top': !isNaN(+padding[0]) ? padding[0] + 'px' : padding[0],
      '--pa-line-margin-right': !isNaN(+padding[1]) ? padding[1] + 'px' : padding[1],
      '--pa-line-margin-bottom': !isNaN(+padding[2]) ? padding[2] + 'px' : padding[2],
      '--pa-line-margin-left': !isNaN(+padding[3]) ? padding[3] + 'px' : padding[3],
      '--pa-line-height': height,
      marginTop: `calc(0px - ${height})`,
      '--pa-line-width': width,
      '--pa-line-border-color': borderColor || 'transparent',
      '--pa-line-border-style': borderStyle || 'solid'
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
 * @description 导入 lodash 工具库
 */
import _ from "lodash";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentProps } from "./types";
/**
 * 解构工具方法
 * @description 从 lodash 中解构 isNaN 方法
 */
const { isNaN } = _;
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
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
