<template>
  <slot></slot>
</template>

<script lang="ts" setup>
import { provide, reactive, computed, watch } from "vue";
import { setThemeColor } from "../tools/color";
import { ManagerGlobalConfigType, MManagerV2Type } from "./type";
import languageMap from "../language.json";
import { isNil } from "lodash";
import { createLog } from "../utils/develop-log";
import { useZIndex } from "element-plus";
/**
 * # 获取全局 Z 索引
 */
window.globalZIndex = window.globalZIndex || 1000;
const { nextZIndex } = useZIndex();
provide("getManagerV2GlobalZIndex", () => {
  return nextZIndex() || window.globalZIndex++;
});

const props = withDefaults(defineProps<MManagerV2Type>(), {});
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
} as ManagerGlobalConfigType);

window.ManagerGlobalConfig = { ...state, language: (state?.language?.value || "zh-CN") as any };

provide(
  "ManagerGlobalConfig",
  computed(() => {
    window.ManagerGlobalConfig = { ...state, language: (state?.language?.value || "zh-CN") as any };
    return state;
  })
);

window.developLog = createLog(props.env || "product");

setThemeColor(state.themeColor, state.isDark || false);
// setManagerV2Size(state.size || "default");

/**
 * # 设置主题颜色
 * @param themeColor 主题颜色
 * @param isDark 是否为暗黑模式
 */
function setManagerV2ThemeColor(themeColor, isDark) {
  state.themeColor = !isNil(themeColor) ? themeColor : state.themeColor;
  state.isDark = !isNil(isDark) ? isDark : state.isDark;
  setThemeColor(state.themeColor, state.isDark || false);
}

function setManagerV2Size(size: "default" | "large" | "small") {
  const classList = window.document?.documentElement.classList || null;
  classList?.toggle("small", size == "small");
  classList?.toggle("default", size == "default");
  classList?.toggle("large", size == "large");
}

/**
 * # 设置语言
 * @param language 语言
 */
function setManagerV2Language(language: "en-US" | "zh-CN") {
  state.language = {
    value: language,
    package: languageMap[language]
  };
}

/**
 * # 设置表格无限滚动
 * @param value 是否开启无限滚动
 */
function setManagerV2TableInfiniteScroll(value) {
  state.table_config = { ...state.table_config, ...value };
}

function setManagerV2Config(type: keyof ManagerGlobalConfigType & {}, config: any) {
  if (type == "language") setManagerV2Language(config);
  else if (type == "themeColor" || type == "isDark") setManagerV2ThemeColor(config.themeColor, config.isDark);
  else if (type == "size") setManagerV2Size(config.size);
  else if (type == "table_config") setManagerV2TableInfiniteScroll(config);
}
provide("setManagerV2Config", setManagerV2Config);

defineExpose({
  setManagerV2ThemeColor,
  setManagerV2Size,
  setManagerV2Language,
  setManagerV2TableInfiniteScroll,
  setManagerV2Config
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
