<template>
  <div
    class="pa-radio-item"
    :class="[props.class, { 'is-disabled': props.disabled }, { 'is-checked': isChecked }]"
    ref="selectRef"
    :style="{ ...props.style }"
    @click="changeEvent"
  >
    <div class="pa-radio-item-input-inner">
      <div class="pa-radio-item-input">
        <transition name="mo-animation-fade" mode="out-in">
          <div v-if="isChecked" class="pa-radio-item-input-checked"></div>
        </transition>
      </div>
      <div v-if="props.label || $slots.default" class="pa-radio-item-label">
        <slot>{{ typeof props.label === "object" ? props.label[language] : props.label }}</slot>
      </div>
    </div>
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
import { ComponentItemProps, ComponentItemEmits } from "./types";

/**
 * 模块导入
 * @description 导入全局配置类型
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";

/**
 * 模块导入
 * @description 导入 lodash 工具函数
 */
import _ from "lodash";
const { isNil } = _;

/**
 * 组件属性
 * @type ComponentItemProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentItemProps>(), { isChecked: undefined });

/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 注入全局配置对象
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;

/**
 * 当前语言
 * @type string
 * @description 当前语言设置
 */
const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";

/**
 * 内部值
 * @type Ref<boolean | number | string | undefined>
 * @description 单选框子项的内部绑定值
 */
const inValue = ref(props.modelValue);

/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
const emits = defineEmits<ComponentItemEmits>();

/**
 * 是否选中
 * @type ComputedRef<boolean>
 * @description 计算当前单选框是否处于选中状态
 */
const isChecked = computed(() => {
  if (!isNil(props.isChecked)) {
    return props.isChecked;
  }
  return inValue.value == props.value;
});

/**
 * 旧值存储
 * @type boolean | number | string | undefined
 * @description 存储上一次的值，用于对比
 */
let oldValue: boolean | number | string | undefined = props.modelValue;

/**
 * 处理点击事件
 * @returns void | undefined
 * @description 处理单选框子项点击事件
 */
function changeEvent(): undefined | void {
  if (props.disabled || (!isNil(props.isChecked) && !props.isOption)) return;
  emits("update:modelValue", props.value);
  emits("change", { value: props.value, oldValue });
  oldValue = props.value;
  return;
}

/**
 * 监听 modelValue 变化
 * @description 同步外部传入的值到内部状态
 */
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
