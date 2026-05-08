<template>
  <div
    class="pa-title"
    :class="[
      props.class,
      styleMode.model,
      padding?.includes('top') ? 'padding-top' : '',
      padding?.includes('left') ? 'padding-left' : '',
      padding?.includes('bottom') ? 'padding-bottom' : '',
      padding?.includes('right') ? 'padding-right' : ''
    ]"
    :style="{ ...props.style }"
  >
    <div class="pa-title_box">
      <div class="pa-title_text">
        <slot />
        <div class="pa-title_tip" v-if="tipsPosition == 'right'">
          <div class="ml-size">
            (<slot name="tips"> {{ tips }} </slot>)
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
import { ComponentProps } from "./types";
/**
 * 模块导入
 * @description 导入全局配置类型
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
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
/**
 * 样式模式计算
 * @type ComputedRef<object>
 * @description 根据属性计算标题的样式模式、内边距和分割线配置
 */
const styleMode = computed(() => {
  const model = props.styleMode || PancakeGlobalConfig.value?.titleStyle || "default";
  const padding = props.padding || [];
  let lineConfig = (props.lineConfig == true ? { padding: [0, 0, 0, 5], height: "3px" } : props.lineConfig) || false;
  if (!lineConfig && model == "default") {
    lineConfig = { padding: [0, 0, 0, 5], height: "3px" };
  }
  return { model, padding, lineConfig };
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
