<template>
  <div class="pa-button-group" :class="[props.type]">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
/**
 * **组件属性定义**
 * @type `object`
 * @description 按钮组的属性对象
 */
const props = withDefaults(
  defineProps<{
    /**
     * **按钮组类型**
     * @type `'danger'` | `'default'` | `'info'` | `'primary'` | `'success'` | `'warning'` | `undefined`
     * @default `"default"`
     * @description 按钮组的样式类型
     */
    type?: "danger" | "default" | "info" | "primary" | "success" | "warning";
  }>(),
  { type: "default" as const }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
