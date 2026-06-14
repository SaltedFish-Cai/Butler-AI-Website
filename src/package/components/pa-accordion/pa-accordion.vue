<template>
  <div class="pa-accordion">
    <slot />
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { provide, ref } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { PaAccordionProps, PaAccordionContext } from "./types";

const props = withDefaults(defineProps<PaAccordionProps>(), {
  singleExpand: false
});

const activeItemId = ref("");

function setActiveItemId(id: string) {
  activeItemId.value = id;
}

provide<PaAccordionContext>("accordion", {
  singleExpand: props.singleExpand,
  activeItemId,
  setActiveItemId
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
