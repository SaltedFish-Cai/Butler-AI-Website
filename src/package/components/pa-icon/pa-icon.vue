<template>
  <section class="pa-icon" @click="props.onClick" :class="[props.class]" :style="{ ...props.style }">
    <span v-if="!tip" :class="['m-iconfont', 'm-iconfont_icon', `icon-${name}`]"></span>
    <template v-else>
      <pa-popover trigger="hover">
        <template #reference> <span class="m-iconfont m-iconfont_icon" :class="'icon-' + name"></span> </template>
        {{ typeof tip === "string" ? tip : tip[languageValue] }}
      </pa-popover>
    </template>
  </section>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, inject } from "vue";
import { ComponentProps } from "./types";
import { PancakeGlobalConfigType } from "../pa-manager/type";

// # Var
const props = withDefaults(defineProps<ComponentProps>(), {
  name: "magic_line"
});

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
