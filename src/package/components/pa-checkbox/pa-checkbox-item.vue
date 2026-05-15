<template>
  <div
    class="pa-checkbox-item"
    :class="[
      props.class,
      { 'is-disabled': props.disabled },
      { 'is-checked': isChecked },
      { 'is-indeterminate': isIndeterminate }
    ]"
    ref="selectRef"
    :style="props.style"
    @click="changeEvent"
  >
    <div class="pa-checkbox-item-input-inner">
      <div class="pa-checkbox-item-input">
        <pa-icon v-if="isChecked" name="check_line"></pa-icon>
        <pa-icon v-else-if="isIndeterminate" name="minus1"></pa-icon>
      </div>
      <div v-if="props.label || $slots.default" class="pa-checkbox-item-label">
        <slot>{{ typeof props.label === "object" ? props.label[languageValue] : props.label }}</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 */
import { computed, inject, ref, watch, type ComputedRef } from "vue";

/**
 * **模块导入**
 * @description 导入组件类型定义
 */
import type { ComponentItemProps, ComponentItemEmits } from "./types";

/**
 * **模块导入**
 * @description 导入全局配置类型
 */
import type { PancakeGlobalConfigType } from "../pa-manager/types";

/**
 * **模块导入**
 * @description 导入 lodash isNil 工具函数
 */
import isNil from "../tools/is-nil";

/**
 * **组件属性**
 * @type `ComponentItemProps & { isOption?: boolean }`
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentItemProps & { isOption?: boolean }>(), { value: "", isChecked: undefined });

/**
 * **全局配置注入**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 注入全局配置对象
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;

/**
 * **当前语言值**
 * @returns `string` 当前选中的语言
 * @description 当前选中的语言
 */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 */
const emits = defineEmits<ComponentItemEmits>();

/**
 * **内部值**
 * @type `Ref<boolean | number | string>`
 * @description 复选框子项的内部绑定值
 */
const inValue = ref<boolean | number | string | string>("");

/**
 * **是否选中**
 * @returns `boolean` 当前复选框是否选中
 * @description 计算当前复选框是否处于选中状态
 */
const isChecked = computed(() => {
  if (!isNil(props.isChecked)) {
    return props.isChecked;
  } else if (props.isIndeterminate) {
    return false;
  }
  return String(inValue.value) == String(props.value);
});

/**
 * **旧值存储**
 * @type `boolean` | `number` | `string`
 * @description 存储上一次的值，用于对比
 */
let oldValue: boolean | number | string = "";

/**
 * **处理点击事件**
 * @returns `void` | `undefined`
 * @description 处理复选框子项点击事件
 */
function changeEvent(): undefined | void {
  if (props.disabled || (!isNil(props.isChecked) && !props.isOption) || (!props.isOption && props.isIndeterminate)) return;
  const _data: any = props.isOption ? props.value !== props.value : inValue.value == props.value ? "false" : props.value;
  inValue.value = _data;
  if (props.disabled) return;
  emits("update:modelValue", inValue.value);
  emits("change", { value: inValue.value, oldValue });
  oldValue = inValue.value;
  return;
}

/**
 * **监听 modelValue 变化**
 * @description 同步外部传入的值到内部状态
 */
watch(
  () => props.modelValue,
  data => {
    inValue.value = data || "";
    oldValue = data || "";
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
