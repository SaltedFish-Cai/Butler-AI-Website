<template>
  <div class="pa-empty">
    <div class="pa-empty_inner" :class="props.class" :style="props.style">
      <pa-icon class="pa-empty_icon" :name="props.icon" />
      <div class="pa-empty_message">{{ messageText }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { computed, inject, ComputedRef } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { ComponentProps } from "./types";
/**
 * 模块导入
 * @description 导入全局配置类型定义
 */
import type { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 默认语言标识
 * @description 当未获取到全局配置语言时的默认值
 */
const DEFAULT_LANG = "zh-CN";
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  icon: "folder_open_line",
  message: "暂无数据"
});
/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 从父组件注入的全局配置对象
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 计算属性：显示文本
 * @returns string
 * @description 根据语言设置返回对应的提示信息
 */
const messageText = computed(() => {
  if (typeof props.message === "string") return props.message;
  const lang = PancakeGlobalConfig.value?.language?.value || DEFAULT_LANG;
  return props.message?.[lang] || "暂无数据";
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
