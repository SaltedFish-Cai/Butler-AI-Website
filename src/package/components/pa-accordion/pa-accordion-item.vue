<template>
  <div
    ref="rootEl"
    :id="accordionCtx?.renderId + '_' + itemId"
    class="pa-accordion-item"
    :class="{
      'pa-accordion-item--expand': isExpand,
      'pa-accordion-item--disabled': disabled,
      'pa-accordion-item--header-stuck': isHeaderStuck
    }"
  >
    <div class="pa-accordion-item__sticky-sentinel" ref="sentinelEl"></div>
    <div
      class="pa-accordion-item__header"
      :id="accordionCtx?.renderId + '_' + itemId"
      :data-label="(typeof title === 'string' ? title : title[languageValue]) + '(accordion)'"
      @click="handleHeaderClick"
      role="button"
      :tabindex="disabled ? -1 : 0"
      @keydown.enter="handleHeaderClick"
    >
      <div class="pa-accordion-item__header_content">
        <slot name="header" :expand="isExpand" :toggle="toggleExpand">
          {{ typeof title === "string" ? title : title[languageValue] }}
        </slot>
      </div>
      <pa-icon
        name="butler-caret-down"
        class="pa-accordion-item__arrow"
        :class="[isExpand ? 'pa-accordion-item__arrow--open' : '']"
      />
    </div>
    <Transition name="accordion-slide">
      <div v-if="isExpand" class="pa-accordion-item__body" :class="paddingClasses">
        <slot name="default" :expand="isExpand" />
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
import { computed, ComputedRef, inject, onMounted, onUnmounted, ref, watch } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { PaAccordionItemProps, PaAccordionItemEmits, PaAccordionContext } from "./types";
/**
 * 模块导入
 * @description 导入全局配置类型
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";

/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 注入全局配置对象
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;

const props = withDefaults(defineProps<PaAccordionItemProps>(), {
  expand: false,
  disabled: false,
  padding: () => ["all"],
  title: () => ({ "zh-CN": "节点", "en-US": "Node" })
});
const emit = defineEmits<PaAccordionItemEmits>();
/**
 * 当前语言值
 * @type ComputedRef<string>
 * @description 当前选中的语言
 */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language || "zh-CN";
});
/**
 * 展开状态
 */
const isExpand = computed({
  get: () => props.expand,
  set: (val: boolean) => emit("update:expand", val)
});

const accordionCtx = inject<PaAccordionContext>("accordion");
const itemId = `_item-${++itemIdCounter}`;
if (accordionCtx?.singleExpand) {
  watch(isExpand, val => {
    if (val) {
      accordionCtx.setActiveItemId(itemId);
    } else if (accordionCtx.activeItemId.value === itemId) {
      accordionCtx.setActiveItemId("");
    }
  });

  watch(accordionCtx.activeItemId, newId => {
    if (newId && newId !== itemId && isExpand.value) {
      isExpand.value = false;
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
 * 根元素 ref，用于 IntersectionObserver 检测 sticky 吸顶
 */
const rootEl = ref<HTMLElement | null>(null);
/**
 * 哨兵元素 ref，溢出时 header 处于吸顶状态
 */
const sentinelEl = ref<HTMLElement | null>(null);
/**
 * header 是否吸顶
 */
const isHeaderStuck = ref(false);

onMounted(() => {
  if (!rootEl.value || !sentinelEl.value) return;
  accordionCtx?.registerSentinel(sentinelEl.value, stuck => {
    isHeaderStuck.value = stuck;
  });
});

onUnmounted(() => {
  if (sentinelEl.value) {
    accordionCtx?.unregisterSentinel(sentinelEl.value);
  }
});

/**
 * 切换展开状态
 */
function toggleExpand() {
  if (props.disabled) return;
  isExpand.value = !isExpand.value;
}
/**
 * 头部点击处理
 * @param event - 鼠标事件
 */
function handleHeaderClick(event) {
  if (props.disabled) return;
  const target = event.target as HTMLElement;
  if (target.closest("button, a, [data-accordion-no-toggle]")) return;
  toggleExpand();
}
</script>

<style lang="scss">
@use "../styles/default/pa-accordion.scss";
</style>
