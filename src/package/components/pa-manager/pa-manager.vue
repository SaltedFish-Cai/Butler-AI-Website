<template>
  <slot></slot>
</template>

<script lang="ts" setup>
import { provide, reactive, computed, watch, onMounted } from "vue";
import { setThemeColor } from "../tools/color";
import { PancakeGlobalConfigType, PaManagerType } from "./type";
import languageMap from "../language.json";

import { createLog } from "../utils/develop-log";
import { useZIndex } from "element-plus";

import _ from "lodash";
const { isNil } = _;

// SSR-safe global Z index
let globalZIndex = 1000;

/**
 * # 获取全局 Z 索引
 */
const { nextZIndex } = useZIndex();
provide("getPaAnagerGlobalZIndex", () => {
  return nextZIndex() || globalZIndex++;
});

const props = withDefaults(defineProps<PaManagerType>(), {});
/**
 * # 状态
 */
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

// SSR-safe window initialization
onMounted(() => {
  if (typeof window !== "undefined") {
    window.globalZIndex = window.globalZIndex || 1000;
    window.PancakeGlobalConfig = { ...state, language: (state?.language?.value || "zh-CN") as any };
    window.developLog = createLog(props.env || "product");
  }
});

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
 * # 设置主题颜色
 * @param themeColor 主题颜色
 * @param isDark 是否为暗黑模式
 */
function setPaAnagerThemeColor(themeColor, isDark) {
  state.themeColor = !isNil(themeColor) ? themeColor : state.themeColor;
  state.isDark = !isNil(isDark) ? isDark : state.isDark;
  setThemeColor(state.themeColor, state.isDark || false);
}

function setPaAnagerSize(size: "default" | "large" | "small") {
  if (typeof window !== "undefined") {
    const classList = typeof window !== "undefined" && window.document?.documentElement.classList || null;
    classList?.toggle("small", size == "small");
    classList?.toggle("default", size == "default");
    classList?.toggle("large", size == "large");
  }
}

/**
 * # 设置语言
 * @param language 语言
 */
function setPaAnagerLanguage(language: "en-US" | "zh-CN") {
  state.language = {
    value: language,
    package: languageMap[language]
  };
}

/**
 * # 设置表格无限滚动
 * @param value 是否开启无限滚动
 */
function setPaAnagerTableInfiniteScroll(value) {
  state.table_config = { ...state.table_config, ...value };
}

function setPaAnagerConfig(type: keyof PancakeGlobalConfigType & {}, config: any) {
  if (type == "language") setPaAnagerLanguage(config);
  else if (type == "themeColor" || type == "isDark") setPaAnagerThemeColor(config.themeColor, config.isDark);
  else if (type == "size") setPaAnagerSize(config.size);
  else if (type == "table_config") setPaAnagerTableInfiniteScroll(config);
}
provide("setPaAnagerConfig", setPaAnagerConfig);

defineExpose({
  setPaAnagerThemeColor,
  setPaAnagerSize,
  setPaAnagerLanguage,
  setPaAnagerTableInfiniteScroll,
  setPaAnagerConfig
});

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
