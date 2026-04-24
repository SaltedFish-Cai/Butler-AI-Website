<template>
  <div class="pa-empty">
    <div class="pa-empty_inner" :class="[props.class]" :style="{ ...props.style }">
      <pa-icon class="pa-empty_icon" :name="props.icon" />
      <div class="pa-empty_message">{{ messageText }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ComputedRef } from "vue";
import { ComponentProps } from "./types";
import { PancakeGlobalConfigType } from "../pa-manager/type";

// # Var
const props = withDefaults(defineProps<ComponentProps>(), {
  icon: "folder_open_line",
  message: "暂无数据"
});

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

const messageText = computed(() => {
  if (typeof props.message === "string") {
    return props.message;
  }
  return props.message?.[languageValue.value] || "暂无数据";
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
