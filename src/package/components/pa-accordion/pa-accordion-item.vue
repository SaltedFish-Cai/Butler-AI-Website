<template>
  <div class="pa-accordion-item" :class="{ 'pa-accordion-item--expanded': isExpanded, 'pa-accordion-item--disabled': disabled }">
    <div class="pa-accordion-item__header" @click="handleHeaderClick" role="button" :tabindex="disabled ? -1 : 0" @keydown.enter="handleHeaderClick">
      <div class="pa-accordion-item__header_content">
        <slot name="header" :expanded="isExpanded" :toggle="toggleExpanded">节点</slot>
      </div>
      <pa-icon name="butler-caret-down" class="pa-accordion-item__arrow" :class="[isExpanded ? 'pa-accordion-item__arrow--open' : '']" />
    </div>
    <Transition name="accordion-slide">
      <div v-if="isExpanded" class="pa-accordion-item__body" :class="paddingClasses">
        <slot name="default" :expanded="isExpanded" />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
let itemIdCounter = 0;
</script>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { computed, inject, watch } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { PaAccordionItemProps, PaAccordionItemEmits, PaAccordionContext } from "./types";

const props = withDefaults(defineProps<PaAccordionItemProps>(), {
  expanded: false,
  disabled: false,
  padding: () => ["all"]
});
const emit = defineEmits<PaAccordionItemEmits>();
/**
 * 展开状态
 */
const isExpanded = computed({
  get: () => props.expanded,
  set: (val: boolean) => emit("update:expanded", val)
});

const accordionCtx = inject<PaAccordionContext>("accordion");
const itemId = `pa-accordion-item-${++itemIdCounter}`;
if (accordionCtx?.singleExpand) {
  watch(isExpanded, val => {
    if (val) {
      accordionCtx.setActiveItemId(itemId);
    } else if (accordionCtx.activeItemId.value === itemId) {
      accordionCtx.setActiveItemId("");
    }
  });

  watch(accordionCtx.activeItemId, newId => {
    if (newId && newId !== itemId && isExpanded.value) {
      isExpanded.value = false;
    }
  });
}
/**
 * 内边距样式类
 * @type ComputedRef<Record<string, boolean>>
 * @description 根据 padding 属性生成的样式类
 */
const paddingClasses = computed(() => ({
  "padding-top": props.padding?.includes("top") || props.padding?.includes("all"),
  "padding-left": props.padding?.includes("left") || props.padding?.includes("all"),
  "padding-bottom": props.padding?.includes("bottom") || props.padding?.includes("all"),
  "padding-right": props.padding?.includes("right") || props.padding?.includes("all")
}));
/**
 * 切换展开状态
 */
function toggleExpanded() {
  if (props.disabled) return;
  isExpanded.value = !isExpanded.value;
}
/**
 * 头部点击处理
 * @param event - 鼠标事件
 */
function handleHeaderClick(event) {
  if (props.disabled) return;
  const target = event.target as HTMLElement;
  if (target.closest("button, a, [data-accordion-no-toggle]")) return;
  toggleExpanded();
}
</script>

<style lang="scss">
@use "./index.scss";
</style>
