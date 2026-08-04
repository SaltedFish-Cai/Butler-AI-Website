<template>
  <div ref="rootEl" :id="renderId" class="pa-accordion">
    <slot />
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { provide, ref, onMounted, onUnmounted } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { PaAccordionProps, PaAccordionContext } from "./types";
import useRenderId from "../tools/render-id";

const props = withDefaults(defineProps<PaAccordionProps>(), {
  singleExpand: false
});

const rootEl = ref<HTMLElement | null>(null);
const activeItemId = ref("");

const renderId = ref(props.renderId || (props.id ? props.id + "_" + useRenderId() : "pa-accordion_" + useRenderId()));

function setActiveItemId(id: string) {
  activeItemId.value = id;
}

// --- 单个 IntersectionObserver 管理所有 item 的吸顶检测 ---
const callbackMap = new WeakMap<HTMLElement, (stuck: boolean) => void>();
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!rootEl.value) return;
  observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        const cb = callbackMap.get(entry.target as HTMLElement);
        cb?.(!entry.isIntersecting);
      }
    },
    { threshold: 0 }
  );
});

onUnmounted(() => {
  observer?.disconnect();
  observer = null;
});

function registerSentinel(el: HTMLElement, onStuckChange: (stuck: boolean) => void) {
  callbackMap.set(el, onStuckChange);
  observer?.observe(el);
}

function unregisterSentinel(el: HTMLElement) {
  callbackMap.delete(el);
  observer?.unobserve(el);
}

provide<PaAccordionContext>("accordion", {
  singleExpand: props.singleExpand,
  activeItemId,
  setActiveItemId,
  registerSentinel,
  unregisterSentinel,
  renderId: renderId.value
});
</script>

<style lang="scss">
@use "../styles/default/pa-accordion.scss";
</style>
