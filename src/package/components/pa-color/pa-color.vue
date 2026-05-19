<template>
  <div :id="props.id" :class="['pa-color', { 'pa-color-disabled': props.disabled }]" :style="props.style">
    <pa-popover ref="popoverRef" :disabled="props.disabled" autoWidth @change="togglePicker">
      <template #reference>
        <div class="pa-color-preview" :class="{ 'pa-color-preview-active': isPickerOpen, disabled: props.disabled }">
          <div class="pa-color-preview-color" :style="{ backgroundColor: currentColor }">
            <div class="pa-color-preview-mask" v-if="!isHexColor(String(currentColor))"></div>
          </div>
          <div class="pa-color-preview-text">{{ currentColor }}</div>
        </div>
      </template>
      <pa-color-box v-model="currentColor" :preset-colors="props.presetColors" :use-alpha="props.useAlpha" :use-input="props.useInput" @change="handleChange"> </pa-color-box>
    </pa-popover>
  </div>
</template>

<script setup lang="ts">
/**
 * Vue 核心响应式 API
 * @description 导入 Vue 组合式 API
 */
import { ref, watch, onMounted } from "vue";
/**
 * 颜色工具函数
 * @description 导入颜色转换工具函数
 */
import { isHexColor } from "./color-utils";
/**
 * 组件类型定义
 * @description 导入组件 Props 和 Emits 类型
 */
import { ComponentProps, ComponentEmits } from "./types";

/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), { useAlpha: true, useInput: true });
/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
const emit = defineEmits<ComponentEmits>();
/**
 * 选择器打开状态
 * @type boolean
 * @description 控制颜色选择器面板的显示状态
 */
const isPickerOpen = ref(false);
/**
 * 当前颜色值
 * @type string
 * @description 当前选中的颜色值
 */
const currentColor = ref(props.modelValue);
/**
 * 弹窗组件引用
 * @description 弹窗组件引用
 */
const popoverRef = ref();
/** 切换弹出层状态 */
function togglePicker(val: boolean) {
  isPickerOpen.value = val;
}
function handleChange(val: string) {
  emit("update:modelValue", val);
}
/**
 * 组件挂载生命周期
 * @description 初始化颜色值
 */
onMounted(() => {
  currentColor.value = props.modelValue;
});

/**
 * 监听 modelValue 变化
 * @description 当外部传入的 modelValue 变化时更新组件内部状态
 */
watch(
  () => props.modelValue,
  newValue => {
    if (newValue && newValue !== String(currentColor.value)) {
      currentColor.value = newValue;
    }
  }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
