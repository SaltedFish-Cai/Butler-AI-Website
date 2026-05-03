<template>
  <div
    v-if="!display"
    class="pa-checkbox"
    :class="[props.class]"
    ref="selectRef"
    :style="{ ...props.style }"
    :disabled="props.disabled"
  >
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <pa-checkbox-item
      v-for="item in exOptionsList"
      :key="String(item.value)"
      :label="item.label"
      :value="item.value"
      :is-checked="inValue?.includes?.(item.value || '')"
      :disabled="props.disabled"
      isOption
      @change="
        ({ value }) => {
          changeEvent({ value: value || '', option: item });
        }
      "
    ></pa-checkbox-item>
  </div>

  <div v-else class="pa-display-style" :class="[props.class]" :style="{ ...props.style }">
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <div class="pa-display-value_content">
      <slot name="exDisplay"></slot>
      <template v-if="$slots.exDisplay"> ( {{ findData(inValue) || "--" }} ) </template>
      <template v-else>{{ findData(inValue) || "--" }}</template>
    </div>
  </div>

  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(inValue, contrastData))"
    :class="['pa-contrast-style']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ findData(contrastData) || "--" }} ) </template>
    <template v-else>{{ findData(contrastData) || "--" }}</template>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { computed, ComputedRef, inject, ref, watch } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentProps, ComponentEmits } from "./types";
/**
 * 模块导入
 * @description 导入全局配置类型
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 模块导入
 * @description 导入数据查找工具函数
 */
import { findData as findDataSelect } from "../utils/find-data";
/**
 * 模块导入
 * @description 导入 lodash 工具函数
 */
import _ from "lodash";
const { isEqual, isNil } = _;
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {});
/**
 * 选项列表
 * @type Ref<Array<PaOptionType.Select>>
 * @description 外部传入的选项列表
 */
const exOptionsList = ref(props?.exOptions || []);
/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 注入全局配置对象
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 当前语言值
 * @type ComputedRef<string>
 * @description 当前选中的语言
 */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
/**
 * 当前值
 * @type Ref<Array<boolean | number | string>>
 * @description 当前选中的值列表
 */
const inValue = ref<Array<boolean | number | string>>(props.modelValue || []);
/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
const emits = defineEmits<ComponentEmits>();
/**
 * 旧值存储
 * @type Array<boolean | number | string>
 * @description 存储上一次的值，用于对比
 */
let oldValue: Array<boolean | number | string> = props.modelValue || [];
/**
 * 处理变更事件
 * @param `value` 选中的值
 * @param `option` 选中的选项
 * @returns void
 * @description 处理复选框选中状态变更
 */
function changeEvent({ value, option }: { value: boolean | number | string; option: any }): void {
  if (props.disabled) return;
  if (inValue?.value?.includes(value)) {
    inValue.value = inValue.value.filter(item => item !== value);
  } else {
    inValue.value.push(value);
  }
  emits("update:modelValue", inValue.value);
  emits("change", { value: inValue.value, oldValue, option });
  oldValue = inValue.value;
}
/**
 * 查找显示数据
 * @param `data` 要查找的数据
 * @returns string 显示的文本
 * @description 根据值查找对应的显示文本
 */
function findData(data: Array<boolean | number | string>): string {
  if (props.displayValue) {
    return props.displayValue || "--";
  }
  return findDataSelect(data, props.exOptions, false, languageValue.value);
}
/**
 * 监听 modelValue 变化
 * @description 同步外部传入的值到内部状态
 */
watch(
  () => props.modelValue,
  data => {
    inValue.value = !isNil(data) ? data : [];
    oldValue = !isNil(data) ? data : [];
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
