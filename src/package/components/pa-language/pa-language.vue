<template>
  <span class="pa-language" :class="props.class" :style="props.style">{{ displayText }}</span>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue";
import type { ComputedRef } from "vue";
import type { ComponentProps } from "./types";
import type { PancakeGlobalConfigType } from "../pa-manager/types";

const DEFAULT_LANG = "zh-CN";

const props = withDefaults(defineProps<ComponentProps>(), {
  text: () => ({ "zh-CN": "", "en-US": "" })
});

const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;

const displayText = computed(() => {
  const lang = PancakeGlobalConfig.value?.language || DEFAULT_LANG;
  return props.text?.[lang] || "";
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
