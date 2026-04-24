<template>
  
  <div
    class="pa-title"
    :class="[
      props.class,
      !!props.line ? '' : 'pa-title_no-line',
      padding?.includes('top') ? 'padding-top' : '',
      padding?.includes('left') ? 'padding-left' : '',
      padding?.includes('bottom') ? 'padding-bottom' : '',
      padding?.includes('right') ? 'padding-right' : ''
    ]"
    :style="{ ...props.style }"
  >
    
    <div class="pa-title_box" :class="[!!props.line ? '' : 'pa-title_no-line']">
      
      <div class="pa-title_text"><slot /></div>
    
    </div>
    
    <div class="pa-title_tip">
      
      <slot name="tips">{{ tips }}</slot>
    
    </div>
  
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ComputedRef } from "vue";
import { ComponentProps } from "./types";
import { PancakeGlobalConfigType } from "../pa-manager/type";

// # Var
const props = withDefaults(defineProps<ComponentProps>(), {
  line: true
});

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
