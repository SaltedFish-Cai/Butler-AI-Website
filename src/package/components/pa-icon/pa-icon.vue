<template>
  <section class="pa-icon" @click="props.onClick" :class="[props.class]" :style="{ ...props.style }">
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
import { computed, ComputedRef, inject } from "vue";
import { ComponentProps } from "./types";
import { PancakeGlobalConfigType } from "../pa-manager/type";

/**
 * **组件属性**
 * @type `ComponentProps`
 * @description 组件的属性对象，包含 name、tip、onClick 等
 * */
const props = withDefaults(defineProps<ComponentProps>(), {
  name: "magic_line"
});

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
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
