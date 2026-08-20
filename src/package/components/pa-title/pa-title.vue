<template>
  <div :id="renderId" class="pa-title" :class="[props.class, styleMode.model, paddingClasses]" :style="props.style">
    <div class="pa-title_box">
      <div class="pa-title_text">
        <slot>
          {{ typeof text === "string" ? text : text?.[languageValue] || "" }}
        </slot>
        <div class="pa-title_tip" v-if="tipsPosition == 'right' && tips">
          <div class="pa-ml-size">
            (<slot name="tips"> {{ typeof tips === "string" ? tips : tips[languageValue] }} </slot>)
          </div>
        </div>
      </div>
    </div>
    <pa-line v-if="styleMode.lineConfig" v-bind="(styleMode.lineConfig as LineComponentProps)" />

    <div class="pa-title_tip" v-if="tipsPosition == 'bottom' && tips">
      <slot name="tips">{{ typeof tips === "string" ? tips : tips[languageValue] }}</slot>
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
import { computed, ComputedRef, inject, ref } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { ComponentProps } from "./types";
/**
 * 模块导入
 * @description 导入 render-id 工具函数
 */
import useRenderId from "../tools/render-id";
/**
 * 模块导入
 * @description 导入分割线组件类型定义（用于变量类型注解）
 */
import type { ComponentProps as LineComponentProps } from "../pa-line/types";
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
/**
 * render-id
 * @description 组件唯一标识
 */
const renderId = ref(props.renderId || (props.id ? props.id : "pa-title_" + useRenderId()));
defineExpose();
/**
 * 当前语言值
 * @type ComputedRef<string>
 * @description 当前选中的语言
 */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language || "zh-CN";
});
/**
 * padding class 计算（合并为单个 computed，减少 Vue 依赖追踪节点）
 * @description 根据 padding prop 计算 padding class 列表
 */
const paddingClasses = computed(() => {
  const padding = props.padding || [];
  const classes: string[] = [];
  if (padding.includes("top")) classes.push("padding-top");
  if (padding.includes("left")) classes.push("padding-left");
  if (padding.includes("bottom")) classes.push("padding-bottom");
  if (padding.includes("right")) classes.push("padding-right");
  return classes;
});
/**
 * 样式模式计算
 * @type ComputedRef<{ model: string; lineConfig: LineComponentProps | boolean }>
 * @description 根据属性计算标题的样式模式和分割线配置
 */
const styleMode = computed(() => {
  const model = props.styleMode || PancakeGlobalConfig.value?.titleStyle || "default";
  let lineConfig: LineComponentProps | boolean = false;
  if (props.lineConfig === true) {
    lineConfig = DEFAULT_LINE_CONFIG;
  } else if (typeof props.lineConfig === "object") {
    lineConfig = props.lineConfig;
  }
  if (!lineConfig && model === "default") {
    lineConfig = DEFAULT_LINE_CONFIG;
  }
  return { model, lineConfig };
});
</script>

<style lang="scss">
@use "../styles/default/pa-title.scss";
</style>
