<template>
  <div class="pa-color-picker" v-if="!props.disabled">
    <div class="pa-color-picker-main">
      <div class="pa-color-picker-color-area" @mousedown="onColorAreaMouseDown">
        <div class="pa-color-picker-color-area-overlay" :style="{ backgroundColor: hueColor }"></div>
        <div class="pa-color-picker-color-area-mask"></div>
        <button class="pa-color-picker-color-area-pointer" :style="{ left: `${saturation}%`, top: `${100 - value}%` }"></button>
      </div>

      <div class="pa-color-picker-hue-area">
        <div class="pa-color-picker-hue-area-gradient" @mousedown="onHueAreaMouseDown"></div>
        <div class="pa-color-picker-hue-area-pointer" :style="{ left: `${(hue / 360) * 100}%` }"></div>
      </div>

      <div class="pa-color-picker-alpha-area" v-if="props.useAlpha">
        <div
          class="pa-color-picker-alpha-area-gradient"
          :style="{ backgroundColor: currentColorWithoutAlpha }"
          @mousedown="onAlphaAreaMouseDown"
        ></div>
        <div class="pa-color-picker-alpha-area-pointer" :style="{ left: `${100 - alpha * 100}%` }"></div>
      </div>
    </div>

    <div class="pa-color-picker-inputs">
      <div class="pa-color-picker-inputs-group" v-if="props.useInput">
        <input
          type="text"
          class="pa-color-picker-inputs-input"
          v-model="hexInput"
          @input="onHexInputChange"
          placeholder="#000000"
        />
      </div>
    </div>

    <div class="pa-color-picker-presets" v-if="presetColors && presetColors.length > 0">
      <button
        class="pa-color-picker-presets-preset"
        v-for="(color, index) in presetColors"
        :key="index"
        :style="{ backgroundColor: color }"
        @click="selectPresetColor(color)"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Vue 核心响应式 API
 * @description 导入 Vue 组合式 API
 */
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
/**
 * 颜色工具函数
 * @description 导入颜色转换工具函数
 */
import { isHexColor, hexToRgb, rgbToHsv, hsvToRgb, rgbToHex } from "./color-utils";
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
 * 十六进制输入值
 * @type string
 * @description 十六进制颜色输入框的值
 */
const hexInput = ref("");
/**
 * 色相颜色
 * @returns string HSL 颜色字符串
 */
const hueColor = computed(() => `hsl(${hue.value}, 100%, 50%)`);
/**
 * 不含透明度的当前颜色
 * @returns string RGB 颜色字符串
 */
const currentColorWithoutAlpha = computed(() => {
  const c = currentColor.value || "";
  // 从 rgba() 或 rgb() 中提取 RGB 部分
  const match = c.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (match) return `rgb(${match[1]}, ${match[2]}, ${match[3]})`;
  // hex 颜色直接返回
  const rgb = hexToRgb(c);
  return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : c;
});
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
 * 解析颜色字符串
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
  hexInput.value = color;
  emit("update:modelValue", color);
  emit("change", color);
}

/**
 * 颜色区域鼠标按下处理
 * @param e - 鼠标事件
 */
function onColorAreaMouseDown(e: MouseEvent) {
  colorAreaRef.value = e.currentTarget as HTMLElement;
  handleColorAreaMouseMove(e);
  document.addEventListener("mousemove", handleColorAreaMouseMove);
  document.addEventListener("mouseup", handleColorAreaMouseUp);
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
 * 色相区域鼠标按下处理
 * @param e - 鼠标事件
 */
function onHueAreaMouseDown(e: MouseEvent) {
  hueAreaRef.value = e.currentTarget as HTMLElement;
  handleHueAreaMouseMove(e);
  document.addEventListener("mousemove", handleHueAreaMouseMove);
  document.addEventListener("mouseup", handleHueAreaMouseUp);
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
 * 透明度区域鼠标按下处理
 * @param e - 鼠标事件
 */
function onAlphaAreaMouseDown(e: MouseEvent) {
  alphaAreaRef.value = e.currentTarget as HTMLElement;
  handleAlphaAreaMouseMove(e);
  document.addEventListener("mousemove", handleAlphaAreaMouseMove);
  document.addEventListener("mouseup", handleAlphaAreaMouseUp);
}

/**
 * 透明度区域鼠标移动处理
 * @param e - 鼠标事件
 */
function handleAlphaAreaMouseMove(e: MouseEvent) {
  if (!alphaAreaRef.value) return;
  const target = alphaAreaRef.value;
  const rect = target.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  alpha.value = parseFloat((1 - x / rect.width).toFixed(2));
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
 * 十六进制输入变化处理
 */
function onHexInputChange() {
  if (parseColor(hexInput.value)) updateColorFromHsv();
}

/**
 * 选择预设颜色
 * @param color - 预设颜色值
 */
function selectPresetColor(color: string) {
  currentColor.value = color;
  hexInput.value = color;
  parseColor(color);
  emit("update:modelValue", color);
  emit("change", color);
}

/**
 * 组件挂载生命周期
 * @description 初始化颜色值
 */
onMounted(() => {
  currentColor.value = props.modelValue;
  hexInput.value = String(props.modelValue);
  alpha.value = 1;
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
    if (newValue && newValue !== currentColor.value) {
      currentColor.value = newValue;
      hexInput.value = newValue;
      parseColor(newValue);
    }
  }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
