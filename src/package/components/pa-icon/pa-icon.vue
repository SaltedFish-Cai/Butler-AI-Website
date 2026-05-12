<template>
  <i
    class="pa-icon"
    :class="[props.class]"
    :style="iconStyle"
    @click="emit('click', $event)"
    @mouseenter="emit('mouseenter', $event)"
    @mouseleave="emit('mouseleave', $event)"
  >
    <template v-if="!tip">
      <span :class="iconClasses" :style="iconFontStyle"></span>
    </template>
    <template v-else>
      <pa-popover trigger="hover" placement="top">
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
 * @type {ComponentProps}
 * @description 组件的属性对象，包含 name、tip 等
 */
const props = withDefaults(defineProps<ComponentProps>(), { name: "magic_line", fontFamily: "pa-iconfont" as const });
/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
const emit = defineEmits<ComponentEmits>();
/**
 * 全局配置注入
 * @type {PancakeGlobalConfigType}
 * @description 从父组件注入的全局配置对象，包含语言设置等
 */
const PancakeGlobalConfig = inject<PancakeGlobalConfigType>("PancakeGlobalConfig", {});
/**
 * 图标类名列表
 * @type {ReturnType<typeof computed>}
 * @description 根据 fontFamily 和 fontColor 计算图标元素的类名
 */
const iconClasses = computed(() => {
  const prefix = props.fontFamily === "pa-iconfont" ? "icon" : "butler";
  return ["pa-icon__font", `${prefix}-${props.name}`, ...(props.fontColor?.length ? ["pa-icon__font--gradient"] : [])];
});
/**
 * 图标容器样式
 * @type {ReturnType<typeof computed>}
 * @description 图标容器的行内样式，合并自定义样式和字体设置
 */
const iconStyle = computed(() => ({ ...props.style, fontFamily: props.fontFamily }));
/**
 * 图标字体样式
 * @type {ReturnType<typeof computed>}
 * @description 图标字体元素的行内样式，仅在有渐变色时设置 CSS 变量
 */
const iconFontStyle = computed(() => {
  if (!props.fontColor?.length) return {};
  return { "--pa-icon-gradient": `linear-gradient(45deg, ${props.fontColor.join(", ")})` };
});
/**
 * 提示文本
 * @type {ReturnType<typeof computed>}
 * @description 根据 tip 类型返回对应的提示文字
 */
const tipText = computed(() => {
  if (typeof props.tip === "string") return props.tip;
  const languageValue = PancakeGlobalConfig?.language?.value || "zh-CN";
  return props.tip?.[languageValue] ?? "";
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
