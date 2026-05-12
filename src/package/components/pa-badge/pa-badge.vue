<template>
  <div class="pa-badge">
    <slot></slot>
    <template v-if="useShow || showVal || useDot">
      <div v-if="useDot || !showVal" class="pa-badge__dot"></div>
      <div v-else class="pa-badge__content">{{ showVal }}</div>
    </template>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { computed } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentProps } from "./types";
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {});
/**
 * 计算属性：显示值
 * @returns number | string
 * @description 根据最大值限制计算实际显示的值
 */
const showVal = computed(() => {
  if (props.maxValue) {
    const numValue = Number(props.value);
    if (typeof numValue === "number" && !isNaN(numValue)) {
      const numMaxValue = Number(props.maxValue);
      return numValue > numMaxValue ? numMaxValue + "+" : numValue;
    }
  }
  return props.value;
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
