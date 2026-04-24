<template>
  <section class="pa-icon" @click="props.onClick" :class="[props.class]" :style="{ ...props.style }">
    <span v-if="!tip" :class="['iconfont', 'pa-icon_font', `icon-${name}`]"></span>
    <template v-else>
      <pa-popover trigger="hover">
        <template #reference> <span class="iconfont pa-icon_font" :class="'icon-' + name"></span> </template>
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

/**
 * **获取当前语言值**
 * @returns `string` 返回当前语言标识，如 'zh-CN' 或 'en-US'
 * */
const languageValue = computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN");
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
