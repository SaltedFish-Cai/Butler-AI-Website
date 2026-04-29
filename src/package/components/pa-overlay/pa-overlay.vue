<template>
  <teleport :to="teleportTo || 'body'">
    <transition name="mo-dialog-overlay-fade">
      <div v-show="state.visible" class="pa-overlay" :class="props.class" :style="{ ...props.style, zIndex: zIndex }">
        <div class="pa-overlay-content" :style="{ opacity: useBlock ? 1 : 0 }" @click="closeOverlay"></div>
        <slot></slot>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 响应式 API
 * */
import { ref, reactive, watch, inject } from "vue";
/**
 * **模块导入**
 * @description 导入组件类型定义
 * */
import { ComponentProps, ComponentEmits } from "./types.d.ts";
/**
 * **组件属性定义**
 * @description 定义组件的 props
 * */
const props = withDefaults(defineProps<ComponentProps>(), {
  useBlock: true
});
/**
 * **组件事件定义**
 * @description 定义组件的 emits
 * */
const emits = defineEmits<ComponentEmits>();
/**
 * **全局层级获取函数**
 * @description 从父组件注入的全局层级管理函数
 * */
const getPaAnagerGlobalZIndex = inject("getPaAnagerGlobalZIndex") as () => number;
/**
 * **遮罩层层级**
 * @description 当前遮罩层的 z-index 值
 * */
const zIndex = ref(getPaAnagerGlobalZIndex());
/**
 * **组件状态**
 * @description 遮罩层的可见状态
 * */
const state = reactive({
  visible: false
});
/**
 * **关闭遮罩层**
 * @description 触发关闭事件，更新 modelValue
 * */
function closeMenu(): void {
  emits("update:modelValue", false);
}
/**
 * **点击遮罩层回调**
 * @description 点击遮罩层时关闭并触发点击事件
 * */
function closeOverlay(): void {
  closeMenu();
  emits("clickOverlay");
}
/**
 * **暴露方法**
 * @description 暴露给父组件的方法
 * */
defineExpose({ closeMenu });
/**
 * **监听 modelValue 变化**
 * @description 同步 modelValue 到组件内部状态
 * */
watch(
  () => props.modelValue,
  data => {
    state.visible = data;
  },
  { immediate: true }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
