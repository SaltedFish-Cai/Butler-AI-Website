<template>
  <div v-if="!display" class="pa-radio" :class="[props.class]" ref="selectRef" :style="props.style" :disabled="props.disabled">
    <div v-if="title" :style="titleWidthStyle" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <pa-radio-item
      v-for="item in exOptionsList"
      :key="String(item.value)"
      :label="item.label"
      :value="item.value"
      :is-checked="inValue == item.value"
      :disabled="props.disabled"
      isOption
      @change="
        ({ value }) => {
          changeEvent({ value: value || '', option: item });
        }
      "
    ></pa-radio-item>
  </div>

  <div v-else class="pa-display-style" :class="[props.class]" :style="props.style">
    <div v-if="title" :style="titleWidthStyle" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <div class="pa-display-value_content">
      <slot name="exDisplay"></slot>
      <template v-if="$slots.exDisplay"> ( {{ findData(inValue) || "--" }} ) </template>
      <template v-else>{{ findData(inValue) || "--" }}</template>
    </div>
  </div>

  <div v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(inValue, contrastData))" :class="['pa-contrast-style']">
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ findData(contrastData || inValue) || "--" }} ) </template>
    <template v-else>{{ findData(contrastData || inValue) || "--" }}</template>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { ref, watch, computed, inject, type ComputedRef } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentProps, ComponentEmits } from "./types";
/**
 * 模块导入
 * @description 导入选项类型定义
 */
import { PaOptionType } from "../manager-type";
/**
 * 模块导入
 * @description 导入全局配置类型
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 模块导入
 * @description 导入数据查找工具函数
 */
import { findDataWithSelect } from "../utils/find-data";
/**
 * 模块导入
 * @description 导入 lodash isNil 工具函数
 */
import isNil from "../tools/is-nil";
/**
 * 模块导入
 * @description 导入 lodash isEqual 工具函数
 */
import isEqual from "../tools/is-equal";
/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 注入全局配置对象
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {});
/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
const emits = defineEmits<ComponentEmits>();
/**
 * 选项列表
 * @type Ref<Array<PaOptionType.Select>>
 * @description 外部传入的选项列表
 */
const exOptionsList = ref([] as PaOptionType.Select[]);
/**
 * 当前值
 * @type Ref<boolean | number | string>
 * @description 当前选中的值
 */
const inValue = ref<boolean | number | string>("");
/**
 * 旧值存储
 * @type boolean | number | string
 * @description 存储上一次的值，用于对比
 */
let oldValue: boolean | number | string = "";
/**
 * 当前语言值
 * @type ComputedRef<string>
 * @description 当前选中的语言
 */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
/**
 * 标签宽度样式
 * @type ComputedRef<Record<string, string>>
 * @description 根据 titleWidth 生成宽度样式
 */
const titleWidthStyle = computed(() => {
  return { width: props.titleWidth || "auto" };
});
/**
 * 处理变更事件
 * @param value 选中的值
 * @param option 选中的选项
 * @returns void
 * @description 处理单选框选中状态变更
 */
function changeEvent({ value, option }: { value: boolean | number | string; option: any }): void {
  if (props.disabled) return;
  inValue.value = value;
  emits("update:modelValue", value);
  emits("change", { value, oldValue, option });
  oldValue = value;
}
/**
 * 查找显示数据
 * @param data 要查找的数据
 * @returns string 显示的文本
 * @description 根据值查找对应的显示文本
 */
function findData(data: boolean | number | string | undefined): string {
  if (props.displayValue) {
    return props.displayValue || "--";
  }
  return findDataWithSelect(data, exOptionsList.value, false, languageValue.value);
}
/**
 * 监听 modelValue 变化
 * @description 同步外部传入的值到内部状态
 */
watch(
  () => props.modelValue,
  data => {
    inValue.value = !isNil(data) ? data || "" : "";
    oldValue = !isNil(data) ? data || "" : "";
  },
  { immediate: true, deep: true }
);
/**
 * 监听 exOptions 变化
 * @description 同步外部传入的选项列表
 */
watch(
  () => props.exOptions,
  data => {
    exOptionsList.value = data || [];
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
@use "./index.scss";
@use "../cell-style.scss";
</style>
