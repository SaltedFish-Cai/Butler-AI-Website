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
    :style="{ ...props.style }"
    @click="changeEvent"
  >
    <div class="pa-checkbox-item-input-inner">
      <div class="pa-checkbox-item-input">
        <pa-icon v-if="isChecked" name="check_line"></pa-icon>
        <pa-icon v-else-if="isIndeterminate" name="minus"></pa-icon>
      </div>
      <div v-if="props.label || $slots.default" class="pa-checkbox-item-label">
        <slot>{{ typeof props.label === "object" ? props.label[language] : props.label }}</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 * */
import { computed, ComputedRef, inject, ref, watch } from "vue";

/**
 * **模块导入**
 * @description 导入组件类型定义
 * */
import { ComponentItemProps } from "./types";

/**
 * **模块导入**
 * @description 导入全局配置类型
 * */
import { PancakeGlobalConfigType } from "../pa-manager/type";

/**
 * **模块导入**
 * @description 导入 lodash 工具函数
 * */
import _ from "lodash";
const { isNil } = _;

/**
 * **组件属性**
 * @type `ComponentItemProps & { isOption?: boolean }`
 * @description 组件的属性对象
 * */
const props = withDefaults(defineProps<ComponentItemProps & { isOption?: boolean }>(), { isChecked: undefined });

/**
 * **全局配置注入**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 注入全局配置对象
 * */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;

/**
 * **当前语言**
 * @type `string`
 * @description 当前语言设置
 * */
const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";

/**
 * **内部值**
 * @type `Ref<boolean | number | string | undefined>`
 * @description 复选框子项的内部绑定值
 * */
const inValue = ref(props.modelValue);

/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean | number | string | undefined): void;
  (e: "change", payload: { value: boolean | number | string | undefined; oldValue: boolean | number | string | undefined }): void;
}>();

/**
 * **是否选中**
 * @type `ComputedRef<boolean>`
 * @description 计算当前复选框是否处于选中状态
 * */
const isChecked = computed(() => {
  if (!isNil(props.isChecked)) {
    return props.isChecked;
  } else if (props.isIndeterminate) {
    return false;
  }
  return inValue.value == props.value;
});

/**
 * **旧值存储**
 * @type `boolean | number | string | undefined`
 * @description 存储上一次的值，用于对比
 * */
let oldValue: boolean | number | string | undefined = props.modelValue;

/**
 * **处理点击事件**
 * @returns `void | undefined`
 * @description 处理复选框子项点击事件
 * */
function changeEvent(): void | undefined {
  if (props.disabled || !isNil(props.isChecked) || props.isIndeterminate) return;
  inValue.value = props.isOption ? props.value : inValue.value == props.value ? false : props.value;
  if (props.disabled) return;
  emits("update:modelValue", inValue.value);
  emits("change", { value: inValue.value, oldValue });
  oldValue = inValue.value;
  return;
}

/**
 * **监听 modelValue 变化**
 * @description 同步外部传入的值到内部状态
 * */
watch(
  () => props.modelValue,
  data => {
    inValue.value = data;
    oldValue = data;
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
