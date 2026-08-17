<template>
  <div :id="renderId" class="pa-timeline" :class="props.class" :style="props.style">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue ref
 */
import { ref } from "vue";
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
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = defineProps<ComponentProps>();
/**
 * 组件唯一标识
 * @type Ref<string>
 * @description 组件的唯一标识
 */
const renderId = ref(props.renderId || (props.id ? props.id : "pa-timeline_" + useRenderId()));
</script>

<style lang="scss">
@use "../styles/default/pa-timeline.scss";
</style>
