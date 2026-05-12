<template>
  <div
    class="pa-title"
    :class="[props.class, styleMode.model, paddingTopClass, paddingLeftClass, paddingBottomClass, paddingRightClass]"
    :style="{ ...props.style }"
  >
    <div class="pa-title_box">
      <div class="pa-title_text">
        <slot />
        <div class="pa-title_tip" v-if="tipsPosition == 'right'">
          <div class="ml-size">
            (<slot name="tips">{{ tips }}</slot
            >)
          </div>
        </div>
      </div>
    </div>
    <pa-line v-if="styleMode.lineConfig" v-bind="styleMode.lineConfig" />

    <div class="pa-title_tip" v-if="tipsPosition == 'bottom'">
      <slot name="tips">{{ tips }}</slot>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * 默认分割线配置
 * @description 当样式模式为 default 或 lineConfig 为 true 时使用的分割线配置
 */
const DEFAULT_LINE_CONFIG = { padding: [0, 0, 0, 5] as [number, number, number, number], height: "3px" };
</script>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { computed, ComputedRef, inject } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { ComponentProps } from "./types";
/**
 * 模块导入
 * @description 导入全局配置类型
 */
import type { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 从父组件注入的全局配置信息
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  tipsPosition: "bottom"
});
defineEmits();
defineExpose();
/**
 * padding class 缓存
 * @description 使用 Set 避免重复 includes 调用
 */
const paddingSet = computed(() => new Set(props.padding || []));
const paddingTopClass = computed(() => (paddingSet.value.has("top") ? "padding-top" : ""));
const paddingLeftClass = computed(() => (paddingSet.value.has("left") ? "padding-left" : ""));
const paddingBottomClass = computed(() => (paddingSet.value.has("bottom") ? "padding-bottom" : ""));
const paddingRightClass = computed(() => (paddingSet.value.has("right") ? "padding-right" : ""));
/**
 * 样式模式计算
 * @type ComputedRef<object>
 * @description 根据属性计算标题的样式模式、内边距和分割线配置
 */
const styleMode = computed(() => {
  const model = props.styleMode || PancakeGlobalConfig.value?.titleStyle || "default";
  const padding = props.padding || [];
  let lineConfig = false;
  if (props.lineConfig === true) {
    lineConfig = DEFAULT_LINE_CONFIG;
  } else if (typeof props.lineConfig === "object") {
    lineConfig = props.lineConfig;
  }
  if (!lineConfig && model === "default") {
    lineConfig = DEFAULT_LINE_CONFIG;
  }
  return { model, padding, lineConfig };
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
