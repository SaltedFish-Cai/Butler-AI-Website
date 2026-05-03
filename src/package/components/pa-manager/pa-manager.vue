<template>
  <slot></slot>
</template>

<script lang="ts" setup name="PaManager">
/** Vue 核心响应式 API @description Vue 核心响应式 API */
import { provide, reactive, computed, watch, onMounted } from "vue";
/** 主题颜色设置工具 @description 主题颜色设置工具 */
import { setThemeColor } from "../tools/color";
/** 全局配置组件 Props 和运行时类型 @description 全局配置组件 Props 和运行时类型 */
import type { ComponentProps, PancakeGlobalConfigType } from "./types";
/** 语言包映射 @description 语言包映射 */
import languageMap from "../language.json";
/** 开发日志工具 @description 开发日志工具 */
import { createLog } from "../utils/develop-log";
/** ZIndex 管理工具 @description ZIndex 管理工具 */
import { useZIndex } from "element-plus";
/** 深度工具函数 @description 深度工具函数 */
import _ from "lodash";
const { isNil } = _;
/** SSR 安全的全局 Z 索引 @description SSR 安全的全局 Z 索引 */
let globalZIndex = 1000;
/** ZIndex 管理器 @description ZIndex 管理器 */
const { nextZIndex } = useZIndex();
/** 全局 Z 索引获取方法 @description 提供全局 Z 索引获取方法给子组件 */
provide("getPaAnagerGlobalZIndex", () => {
  return nextZIndex() || globalZIndex++;
});
/** 组件 Props @description 组件 Props */
const props = withDefaults(defineProps<ComponentProps>(), {});
/** 全局配置状态 @description 全局配置状态 */
const state = reactive({
  baseHost: props.baseHost,
  themeColor: props.themeColor,
  size: props.size || "default",
  isDark: props.isDark,
  language: {
    value: props.language || "zh-CN",
    package: languageMap[props.language || "zh-CN"]
  },
  table_config: props.table_config,
  address_config: props.address_config,
  file_config: props.file_config,
  requestHeader: props.requestHeader
} as PancakeGlobalConfigType);
/** 全局配置注入 @description 提供全局配置给子组件 */
provide(
  "PancakeGlobalConfig",
  computed(() => {
    if (typeof window !== "undefined") {
      window.PancakeGlobalConfig = { ...state, language: (state?.language?.value || "zh-CN") as any };
    }
    return state;
  })
);
setThemeColor(state.themeColor, state.isDark || false);
/**
 * 设置主题颜色
 * @param themeColor - 主题颜色
 * @param isDark - 是否为暗黑模式
 * @returns void
 * @description 更新主题颜色和暗黑模式状态
 */
function setPaManagerThemeColor(themeColor: string | undefined, isDark: boolean | undefined): void {
  state.themeColor = !isNil(themeColor) ? themeColor : state.themeColor;
  state.isDark = !isNil(isDark) ? isDark : state.isDark;
  setThemeColor(state.themeColor, state.isDark || false);
}
/**
 * 设置组件尺寸
 * @param size - 组件尺寸
 * @returns void
 * @description 更新组件尺寸并切换对应 CSS 类名
 */
function setPaManagerSize(size: "default" | "large" | "small"): void {
  if (typeof window !== "undefined") {
    const classList = (typeof window !== "undefined" && window.document?.documentElement.classList) || null;
    classList?.toggle("small", size == "small");
    classList?.toggle("default", size == "default");
    classList?.toggle("large", size == "large");
  }
}
/**
 * 设置语言
 * @param language - 语言标识
 * @returns void
 * @description 更新语言配置和对应的语言包
 */
function setPaManagerLanguage(language: "en-US" | "zh-CN"): void {
  state.language = {
    value: language,
    package: languageMap[language]
  };
}
/**
 * 设置表格无限滚动配置
 * @param value - 表格配置项
 * @returns void
 * @description 更新表格配置
 */
function setPaManagerTableInfiniteScroll(value: Record<string, any>): void {
  state.table_config = { ...state.table_config, ...value };
}
/**
 * 统一设置配置项
 * @param type - 配置类型
 * @param config - 配置值
 * @returns void
 * @description 根据类型调用对应的配置方法
 */
function setPaManagerConfig(type: keyof PancakeGlobalConfigType & {}, config: any): void {
  if (type == "language") setPaManagerLanguage(config);
  else if (type == "themeColor" || type == "isDark") setPaManagerThemeColor(config.themeColor, config.isDark);
  else if (type == "size") setPaManagerSize(config.size);
  else if (type == "table_config") setPaManagerTableInfiniteScroll(config);
}
/** 配置设置方法注入 @description 提供配置设置方法给子组件 */
provide("setPaManagerConfig", setPaManagerConfig);
defineExpose({
  setPaManagerThemeColor,
  setPaManagerSize,
  setPaManagerLanguage,
  setPaManagerTableInfiniteScroll,
  setPaManagerConfig
});
/** 组件挂载 @description 组件挂载时初始化全局配置和日志 */
onMounted(() => {
  if (typeof window !== "undefined") {
    window.globalZIndex = window.globalZIndex || 1000;
    window.PancakeGlobalConfig = { ...state, language: (state?.language?.value || "zh-CN") as any };
    window.developLog = createLog(props.env || "product");
  }
});
/**
 * Props 同步监听
 * @description 监听 props 变化，同步更新全局配置状态
 */
watch(
  () => props,
  newVal => {
    Object.assign(state, newVal);
    state.language = {
      value: newVal.language || "zh-CN",
      package: languageMap[newVal.language || "zh-CN"]
    };
  },
  {
    immediate: true,
    deep: true
  }
);
</script>

<style lang="scss">
@use "../styles/index.scss";
@use "../styles/pt-size.scss";
@use "../styles/flex.scss";
@use "../styles/theme.scss";
@use "../styles/animation.scss";
</style>
