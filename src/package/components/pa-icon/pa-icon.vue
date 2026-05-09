<template>
  <i class="pa-icon" @click="emit('click', $event)" :class="[props.class]" :style="iconStyle">
    <span v-if="!tip" :class="iconClasses" :style="iconFontStyle"></span>
    <template v-else>
      <pa-popover trigger="hover">
        <template #reference>
          <span :class="iconClasses" :style="iconFontStyle"></span>
        </template>
        {{ tipText }}
      </pa-popover>
    </template>
  </i>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { computed, inject } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { ComponentProps, ComponentEmits } from "./types";
/**
 * 模块导入
 * @description 导入全局配置类型定义
 */
import type { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象，包含 name、tip 等
 */
const props = withDefaults(defineProps<ComponentProps>(), { name: "magic_line", fontFamily: "pa-iconfont", fontColor: () => [] });
/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
const emit = defineEmits<ComponentEmits>();
/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 从父组件注入的全局配置对象，包含语言设置等
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 图标类名列表
 * @type Array<string>
 * @description 根据 fontFamily 和 fontColor 计算图标元素的类名
 */
const iconClasses = computed(() => {
  const classes: Array<string> = [
    "pa-icon_font",
    props.fontFamily === "pa-iconfont" ? `icon-${props.name}` : `butler-${props.name}`
  ];
  if (props.fontColor.length) classes.push("background-color");
  return classes;
});
/**
 * 图标容器样式
 * @type Record<string, string | number | Record<string, string | number>>
 * @description 图标容器的行内样式，合并自定义样式和字体设置
 */
const iconStyle = computed(() => ({
  ...props.style,
  fontFamily: props.fontFamily
}));
/**
 * 图标字体样式
 * @type Record<string, string>
 * @description 图标字体元素的行内样式，仅在有渐变色时设置 CSS 变量
 */
const iconFontStyle = computed(() => {
  if (!props.fontColor.length) return {};
  return { "--set-icon-background-color": `linear-gradient(45deg, ${props.fontColor.join(", ")})` };
});
/**
 * 提示文本
 * @type string
 * @description 根据 tip 类型返回对应的提示文字
 */
const tipText = computed(() => {
  if (typeof props.tip === "string") return props.tip;
  const languageValue = PancakeGlobalConfig.value?.language?.value || "zh-CN";
  return props.tip?.[languageValue] ?? "";
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
