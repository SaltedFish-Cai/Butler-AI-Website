<template>
  <div class="pa-badge">
    <slot></slot>
    <template v-if="useShow || showVal || useDot">
      <div v-if="useDot" class="pa-badge__dot"></div>
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
  if (props.maxValue && typeof Number(props.value) === "number") {
    const _maxValue = Number(props.maxValue);
    const _value = Number(props.value);
    return _value > _maxValue ? _maxValue + "+" : _value;
  }
  return props.value;
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
