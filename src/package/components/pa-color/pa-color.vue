<template>
  <div :id="props.id" :class="['pa-color', { 'pa-color-disabled': props.disabled }]" :style="props.style">
    <pa-popover ref="popoverRef" :disabled="props.disabled" autoWidth @change="e => (isPickerOpen = e)">
      <template #reference>
        <div class="pa-color-preview" :class="{ 'pa-color-preview-active': isPickerOpen, disabled: props.disabled }">
          <div class="pa-color-preview-color" :style="{ backgroundColor: currentColor }">
            <div class="pa-color-preview-mask" v-if="!isHexColor(String(currentColor))"></div>
          </div>
          <div class="pa-color-preview-text">{{ currentColor }}</div>
        </div>
      </template>
      <pa-color-box
        v-model="currentColor"
        :preset-colors="props.presetColors"
        :use-alpha="props.useAlpha"
        :use-input="props.useInput"
      >
      </pa-color-box>
    </pa-popover>
  </div>
</template>

<script setup lang="ts">
/**
 * Vue 核心响应式 API
 * @description 导入 Vue 组合式 API
 */
import { ref, watch, onMounted, onUnmounted } from "vue";
/**
 * 颜色工具函数
 * @description 导入颜色转换工具函数
 */
import { isHexColor, rgbToHsv, hsvToRgb, rgbToHex, hexToRgb } from "./color-utils";
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
 * 色相值
 * @type number
 * @description HSV 色彩空间中的色相值 (0-360)
 */
const hue = ref(0);
/**
 * 饱和度值
 * @type number
 * @description HSV 色彩空间中的饱和度值 (0-100)
 */
const saturation = ref(0);
/**
 * 明度值
 * @type number
 * @description HSV 色彩空间中的明度值 (0-100)
 */
const value = ref(0);
/**
 * 透明度值
 * @type number
 * @description 颜色的透明度值 (0-1)
 */
const alpha = ref(1);
/**
 * 颜色区域 DOM 引用
 * @description 颜色区域 DOM 引用
 */
const colorAreaRef = ref<HTMLElement | null>(null);
/**
 * 色相区域 DOM 引用
 * @description 色相区域 DOM 引用
 */
const hueAreaRef = ref<HTMLElement | null>(null);
/**
 * 透明度区域 DOM 引用
 * @description 透明度区域 DOM 引用
 */
const alphaAreaRef = ref<HTMLElement | null>(null);
/**
 * 弹窗组件引用
 * @description 弹窗组件引用
 */
const popoverRef = ref();

/**
 * 从 HSV 更新颜色值
 * @param color - 颜色字符串
 * @returns boolean 是否解析成功
 */
function parseColor(color: string): boolean {
  if (color.startsWith("rgba")) {
    const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      alpha.value = parseFloat(match[4]);
      const hsv = rgbToHsv(r, g, b);
      hue.value = hsv.h;
      saturation.value = hsv.s;
      value.value = hsv.v;
      return true;
    }
  } else if (color.startsWith("rgb")) {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      const hsv = rgbToHsv(r, g, b);
      hue.value = hsv.h;
      saturation.value = hsv.s;
      value.value = hsv.v;
      return true;
    }
  } else if (isHexColor(color)) {
    const rgb = hexToRgb(color);
    if (rgb) {
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      hue.value = hsv.h;
      saturation.value = hsv.s;
      value.value = hsv.v;
      return true;
    }
  }
  return false;
}
/**
 * 从 HSV 更新颜色值
 * @description 根据 HSV 值更新当前颜色并触发事件
 */
function updateColorFromHsv() {
  const rgb = hsvToRgb(hue.value, saturation.value, value.value);
  let color = rgbToHex(rgb.r, rgb.g, rgb.b);
  if (props.useAlpha) color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.value})`;
  currentColor.value = color;
  emit("update:modelValue", color);
  emit("change", color);
}

/**
 * 颜色区域鼠标移动处理
 * @param e - 鼠标事件
 */
function handleColorAreaMouseMove(e: MouseEvent) {
  if (!colorAreaRef.value) return;
  const target = colorAreaRef.value;
  const rect = target.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
  saturation.value = (x / rect.width) * 100;
  value.value = 100 - (y / rect.height) * 100;
  updateColorFromHsv();
}
/**
 * 颜色区域鼠标抬起处理
 */
function handleColorAreaMouseUp() {
  colorAreaRef.value = null;
  document.removeEventListener("mousemove", handleColorAreaMouseMove);
  document.removeEventListener("mouseup", handleColorAreaMouseUp);
}

/**
 * 色相区域鼠标移动处理
 * @param e - 鼠标事件
 */
function handleHueAreaMouseMove(e: MouseEvent) {
  if (!hueAreaRef.value) return;
  const target = hueAreaRef.value;
  const rect = target.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  hue.value = (x / rect.width) * 360;
  updateColorFromHsv();
}

/**
 * 色相区域鼠标抬起处理
 */
function handleHueAreaMouseUp() {
  hueAreaRef.value = null;
  document.removeEventListener("mousemove", handleHueAreaMouseMove);
  document.removeEventListener("mouseup", handleHueAreaMouseUp);
}
/**
 * 透明度区域鼠标移动处理
 * @param e - 鼠标事件
 */
function handleAlphaAreaMouseMove(e: MouseEvent) {
  if (!alphaAreaRef.value) return;
  const target = alphaAreaRef.value;
  const rect = target.getBoundingClientRect();
  const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
  alpha.value = 1 - y / rect.height;
  updateColorFromHsv();
}

/**
 * 透明度区域鼠标抬起处理
 */
function handleAlphaAreaMouseUp() {
  alphaAreaRef.value = null;
  document.removeEventListener("mousemove", handleAlphaAreaMouseMove);
  document.removeEventListener("mouseup", handleAlphaAreaMouseUp);
}
/**
 * 组件挂载生命周期
 * @description 初始化颜色值
 */
onMounted(() => {
  currentColor.value = props.modelValue;
  parseColor(String(props.modelValue));
});

/**
 * 组件卸载生命周期
 * @description 移除事件监听器
 */
onUnmounted(() => {
  document.removeEventListener("mousemove", handleColorAreaMouseMove);
  document.removeEventListener("mouseup", handleColorAreaMouseUp);
  document.removeEventListener("mousemove", handleHueAreaMouseMove);
  document.removeEventListener("mouseup", handleHueAreaMouseUp);
  document.removeEventListener("mousemove", handleAlphaAreaMouseMove);
  document.removeEventListener("mouseup", handleAlphaAreaMouseUp);
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
      parseColor(newValue);
    }
  }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
