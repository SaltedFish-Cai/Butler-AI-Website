<template>
  <div
    class="pa-title"
    :class="[
      props.class,
      !!props.line ? '' : 'pa-title_no-line',
      padding?.includes('top') ? 'padding-top' : '',
      padding?.includes('left') ? 'padding-left' : '',
      padding?.includes('bottom') ? 'padding-bottom' : '',
      padding?.includes('right') ? 'padding-right' : ''
    ]"
    :style="{ ...props.style }"
  >
    <div class="pa-title_box" :class="[!!props.line ? '' : 'pa-title_no-line']">
      <div class="pa-title_text"><slot /></div>
    </div>
    <div class="pa-title_tip">
      <slot name="tips">{{ tips }}</slot>
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
const props = withDefaults(defineProps<ComponentProps>(), { line: true });
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
