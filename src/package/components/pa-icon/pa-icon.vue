<template>
  <i class="pa-icon" :class="[props.class]" :style="iconStyle">
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
 * **模块导入**
 * @description 导入 Vue 组合式 API
 */
import { computed, inject, onMounted, ComputedRef } from "vue";
/**
 * **模块导入**
 * @description 导入组件类型定义
 */
import type { ComponentProps } from "./types";
/**
 * **模块导入**
 * @description 导入全局配置类型定义
 */
import type { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * **组件属性**
 * @type `ComponentProps`
 * @description 组件的属性对象，包含 name、tip 等
 */
const props = withDefaults(defineProps<ComponentProps>(), { name: "magic_line", fontFamily: "pa-iconfont" as const });
/**
 * **全局配置注入**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 从父组件注入的全局配置对象
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * **butler-iconfont CSS 按需加载标记**
 * @type `boolean`
 * @description 标记 butler-iconfont 字体是否已加载，避免重复注入
 */
let butlerFontLoaded = false;
/**
 * **图标类名列表**
 * @returns `Array<string>` 图标元素的类名数组
 * @description 根据 fontFamily 和 fontColor 计算图标元素的类名
 */
const iconClasses = computed(() => {
  const prefix = props.fontFamily === "pa-iconfont" ? "icon" : "butler";
  const base = ["pa-icon__font", `${prefix}-${props.name}`];
  if (props.fontColor?.length) base.push("pa-icon__font--gradient");
  return base;
});
/**
 * **图标容器样式**
 * @returns `Record<string, string>` 图标容器的行内样式对象
 * @description 图标容器的行内样式，合并自定义样式和字体设置
 */
const iconStyle = computed(() => {
  if (!props.style) return { fontFamily: props.fontFamily };
  return { ...props.style, fontFamily: props.fontFamily };
});
/**
 * **图标字体样式**
 * @returns `Record<string, string>` | `undefined` 图标字体元素的行内样式
 * @description 图标字体元素的行内样式，仅在有渐变色时设置 CSS 变量
 */
const iconFontStyle = computed(() => {
  if (!props.fontColor?.length) return undefined;
  return { "--pa-icon-gradient": `linear-gradient(45deg, ${props.fontColor.join(", ")})` };
});
/**
 * **提示文本**
 * @returns `string` 提示文字
 * @description 根据 tip 类型返回对应的提示文字
 */
const tipText = computed(() => {
  if (typeof props.tip === "string") return props.tip;
  const languageValue = PancakeGlobalConfig.value?.language?.value || "zh-CN";
  return props.tip?.[languageValue] ?? "";
});
/**
 * **动态加载 butler-iconfont 字体 CSS**
 * @returns `void`
 * @description 仅在 fontFamily 为 butler-iconfont 时按需加载，减少初始包体积
 */
function loadButlerFont(): void {
  if (butlerFontLoaded || props.fontFamily !== "butler-iconfont") return;
  butlerFontLoaded = true;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "butler-iconfont.css";
  document.head.appendChild(link);
}
/**
 * **组件挂载生命周期**
 * @description 按需加载 butler-iconfont 字体
 */
onMounted(() => {
  loadButlerFont();
});
</script>

<style lang="scss">
@use "./index.scss";
</style>
