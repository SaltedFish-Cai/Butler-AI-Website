<template>
  <section class="pa-icon" @click="handleClick" :class="[props.class]" :style="{ ...props.style }">
    <span v-if="!tip" :class="['pa-icon_font', `icon-${name}`]"></span>
    <template v-else>
      <pa-popover trigger="hover">
        <template #reference> <span class="pa-icon_font" :class="'icon-' + name"></span> </template>
        {{ typeof tip === "string" ? tip : tip[languageValue] }}
      </pa-popover>
    </template>
  </section>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API、类型定义、工具函数等依赖
 * */
import { computed, ComputedRef, inject } from "vue";
import { ComponentProps, ComponentEmits } from "./types";
import { PancakeGlobalConfigType } from "../pa-manager/type";

/**
 * **组件属性**
 * @type `ComponentProps`
 * @description 组件的属性对象，包含 name、tip 等
 * */
const props = withDefaults(defineProps<ComponentProps>(), { name: "magic_line" });

/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
const emit = defineEmits<ComponentEmits>();

/**
 * **全局配置注入**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 从父组件注入的全局配置对象，包含语言设置等
 * */
const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;

/**
 * **获取当前语言值**
 * @returns `string` 返回当前语言标识，如 'zh-CN' 或 'en-US'
 * */
const languageValue = computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN");

/**
 * **点击事件处理**
 * @param `event` `MouseEvent` 鼠标事件对象
 * @returns `void`
 * */
function handleClick(event: MouseEvent) {
  emit("click", event);
}
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
