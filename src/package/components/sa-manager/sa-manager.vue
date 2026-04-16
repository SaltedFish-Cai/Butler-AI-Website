<template>
  <slot></slot>
</template>

<script lang="ts" setup>
import { provide, reactive, computed, watch } from "vue";
import { setThemeColor } from "../tools/color";
import { SaltedGlobalConfigType, SaManagerType } from "./type";
import languageMap from "../language.json";
import { isNil } from "lodash";
import { createLog } from "../utils/develop-log";
import { useZIndex } from "element-plus";
/**
 * # 获取全局 Z 索引
 */
window.globalZIndex = window.globalZIndex || 1000;
const { nextZIndex } = useZIndex();
provide("getSaAnagerGlobalZIndex", () => {
  return nextZIndex() || window.globalZIndex++;
});

const props = withDefaults(defineProps<SaManagerType>(), {});
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
} as SaltedGlobalConfigType);

window.SaltedGlobalConfig = { ...state, language: (state?.language?.value || "zh-CN") as any };

provide(
  "SaltedGlobalConfig",
  computed(() => {
    window.SaltedGlobalConfig = { ...state, language: (state?.language?.value || "zh-CN") as any };
    return state;
  })
);

window.developLog = createLog(props.env || "product");

setThemeColor(state.themeColor, state.isDark || false);
// setSaAnagerSize(state.size || "default");

/**
 * # 设置主题颜色
 * @param themeColor 主题颜色
 * @param isDark 是否为暗黑模式
 */
function setSaAnagerThemeColor(themeColor, isDark) {
  state.themeColor = !isNil(themeColor) ? themeColor : state.themeColor;
  state.isDark = !isNil(isDark) ? isDark : state.isDark;
  setThemeColor(state.themeColor, state.isDark || false);
}

function setSaAnagerSize(size: "default" | "large" | "small") {
  const classList = window.document?.documentElement.classList || null;
  classList?.toggle("small", size == "small");
  classList?.toggle("default", size == "default");
  classList?.toggle("large", size == "large");
}

/**
 * # 设置语言
 * @param language 语言
 */
function setSaAnagerLanguage(language: "en-US" | "zh-CN") {
  state.language = {
    value: language,
    package: languageMap[language]
  };
}

/**
 * # 设置表格无限滚动
 * @param value 是否开启无限滚动
 */
function setSaAnagerTableInfiniteScroll(value) {
  state.table_config = { ...state.table_config, ...value };
}

function setSaAnagerConfig(type: keyof SaltedGlobalConfigType & {}, config: any) {
  if (type == "language") setSaAnagerLanguage(config);
  else if (type == "themeColor" || type == "isDark") setSaAnagerThemeColor(config.themeColor, config.isDark);
  else if (type == "size") setSaAnagerSize(config.size);
  else if (type == "table_config") setSaAnagerTableInfiniteScroll(config);
}
provide("setSaAnagerConfig", setSaAnagerConfig);

defineExpose({
  setSaAnagerThemeColor,
  setSaAnagerSize,
  setSaAnagerLanguage,
  setSaAnagerTableInfiniteScroll,
  setSaAnagerConfig
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

// setThemeColor(state.themeColor, state.isDark);

// watch(
//   () => props,
//   newVal => {
//     state.themeColor = newVal.themeColor;
//   },
//   {
//     immediate: true,
//     deep: true
//   }
// );
</script>

<style lang="scss">
@use "../styles/index.scss";
@use "../styles/pt-size.scss";
@use "../styles/flex.scss";
@use "../styles/theme.scss";
@use "../styles/animation.scss";
</style>
