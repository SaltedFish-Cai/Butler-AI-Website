<template>
  <div class="pa-accordion">
    <slot />
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { PaAccordionProps } from "./types";

defineProps<PaAccordionProps>();
</script>

<style lang="scss">
@use "./index.scss";
</style>
