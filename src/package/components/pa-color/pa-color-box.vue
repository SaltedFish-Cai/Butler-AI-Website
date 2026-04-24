<template>
  <!-- 颜色选择器面板 -->
  <div class="pa-color-picker" v-if="!props.disabled">
    <!-- 颜色选择区域 -->
    <div class="pa-color-picker-main">
      <div class="pa-color-picker-color-area" @mousedown="onColorAreaMouseDown">
        <div class="pa-color-picker-color-area-overlay" :style="{ backgroundColor: hueColor }"></div>
        <div class="pa-color-picker-color-area-mask"></div>
        <button class="pa-color-picker-color-area-pointer" :style="{ left: `${saturation}%`, top: `${100 - value}%` }"></button>
      </div>

      <!-- 色相选择条 -->
      <div class="pa-color-picker-hue-area">
        <div class="pa-color-picker-hue-area-gradient" @mousedown="onHueAreaMouseDown"></div>
        <div class="pa-color-picker-hue-area-pointer" :style="{ left: `${(hue / 360) * 100}%` }"></div>
      </div>

      <!-- 透明度选择条 -->
      <div class="pa-color-picker-alpha-area" v-if="useAlpha">
        <div
          class="pa-color-picker-alpha-area-gradient"
          :style="{ backgroundColor: currentColorWithoutAlpha }"
          @mousedown="onAlphaAreaMouseDown"
        ></div>
        <div class="pa-color-picker-alpha-area-pointer" :style="{ left: `${100 - alpha * 100}%` }"></div>
      </div>
    </div>

    <!-- 颜色值输入区域 -->
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

    <!-- 预设颜色列表 -->
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
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { ComponentProps } from "./types";

/**
 * **组件属性**
 * @type `ComponentProps`
 * @description 组件的属性对象
 * */
const props = withDefaults(defineProps<ComponentProps>(), { useAlpha: true, useInput: true });

/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}>();

/**
 * **当前颜色值**
 * @type `string`
 * @description 当前选中的颜色值
 * */
const currentColor = ref(props.modelValue);

/**
 * **色相值**
 * @type `number`
 * @description HSV 色彩空间中的色相值 (0-360)
 * */
const hue = ref(0);

/**
 * **饱和度值**
 * @type `number`
 * @description HSV 色彩空间中的饱和度值 (0-100)
 * */
const saturation = ref(0);

/**
 * **明度值**
 * @type `number`
 * @description HSV 色彩空间中的明度值 (0-100)
 * */
const value = ref(0);

/**
 * **透明度值**
 * @type `number`
 * @description 颜色的透明度值 (0-1)
 * */
const alpha = ref(1);

/**
 * **十六进制输入值**
 * @type `string`
 * @description 十六进制颜色输入框的值
 * */
const hexInput = ref("");

/**
 * **透明度输入值**
 * @type `number`
 * @description 透明度输入框的值
 * */
const alphaInput = ref(1);

/**
 * **色相颜色**
 * @returns `string` HSL 颜色字符串
 * */
const hueColor = computed(() => `hsl(${hue.value}, 100%, 50%)`);

/**
 * **不含透明度的当前颜色**
 * @returns `string` RGB 颜色字符串
 * */
const currentColorWithoutAlpha = computed(() => {
  const color = hexToRgb(String(currentColor.value));
  return color ? `rgb(${color.r}, ${color.g}, ${color.b})` : currentColor.value;
});

/**
 * **判断是否为十六进制颜色**
 * @param `color` `string` 颜色字符串
 * @returns `boolean` 是否为有效的十六进制颜色
 * */
const isHexColor = (color: string): boolean => /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);

/**
 * **十六进制转 RGB**
 * @param `hex` `string` 十六进制颜色值
 * @returns `{ r: number; g: number; b: number } | null` RGB 对象或 null
 * */
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
};

/**
 * **RGB 转十六进制**
 * @param `r` `number` 红色值
 * @param `g` `number` 绿色值
 * @param `b` `number` 蓝色值
 * @returns `string` 十六进制颜色值
 * */
const rgbToHex = (r: number, g: number, b: number): string => `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

/**
 * **HSV 转 RGB**
 * @param `h` `number` 色相值
 * @param `s` `number` 饱和度值
 * @param `v` `number` 明度值
 * @returns `{ r: number; g: number; b: number }` RGB 对象
 * */
const hsvToRgb = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
  h = h / 360;
  s = s / 100;
  v = v / 100;
  let r, g, b;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return { r: Math.round(r! * 255), g: Math.round(g! * 255), b: Math.round(b! * 255) };
};

/**
 * **RGB 转 HSV**
 * @param `r` `number` 红色值
 * @param `g` `number` 绿色值
 * @param `b` `number` 蓝色值
 * @returns `{ h: number; s: number; v: number }` HSV 对象
 * */
const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h! /= 6;
  }
  return { h: Math.round(h! * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
};

/**
 * **从 HSV 更新颜色值**
 * @description 根据 HSV 值更新当前颜色并触发事件
 * */
const updateColorFromHsv = () => {
  const rgb = hsvToRgb(hue.value, saturation.value, value.value);
  let color = rgbToHex(rgb.r, rgb.g, rgb.b);
  if (props.useAlpha) color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.value})`;
  currentColor.value = color;
  hexInput.value = color;
  alphaInput.value = alpha.value;
  emit("update:modelValue", color);
  emit("change", color);
};

/**
 * **解析颜色字符串**
 * @param `color` `string` 颜色字符串
 * @returns `boolean` 是否解析成功
 * */
const parseColor = (color: string): boolean => {
  if (color.startsWith("rgba")) {
    const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      alpha.value = parseFloat(match[4]);
      alphaInput.value = alpha.value;
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
};

/** @description 颜色区域 DOM 引用 */
const colorAreaRef = ref<HTMLElement | null>(null);
/** @description 色相区域 DOM 引用 */
const hueAreaRef = ref<HTMLElement | null>(null);
/** @description 透明度区域 DOM 引用 */
const alphaAreaRef = ref<HTMLElement | null>(null);

/**
 * **颜色区域鼠标按下处理**
 * @param `e` `MouseEvent` 鼠标事件
 * */
const onColorAreaMouseDown = (e: MouseEvent) => {
  colorAreaRef.value = e.currentTarget as HTMLElement;
  handleColorAreaMouseMove(e);
  document.addEventListener("mousemove", handleColorAreaMouseMove);
  document.addEventListener("mouseup", handleColorAreaMouseUp);
};

/**
 * **颜色区域鼠标移动处理**
 * @param `e` `MouseEvent` 鼠标事件
 * */
const handleColorAreaMouseMove = (e: MouseEvent) => {
  if (!colorAreaRef.value) return;
  const target = colorAreaRef.value;
  const rect = target.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
  saturation.value = (x / rect.width) * 100;
  value.value = 100 - (y / rect.height) * 100;
  updateColorFromHsv();
};

/**
 * **颜色区域鼠标抬起处理**
 * */
const handleColorAreaMouseUp = () => {
  colorAreaRef.value = null;
  document.removeEventListener("mousemove", handleColorAreaMouseMove);
  document.removeEventListener("mouseup", handleColorAreaMouseUp);
};

/**
 * **色相区域鼠标按下处理**
 * @param `e` `MouseEvent` 鼠标事件
 * */
const onHueAreaMouseDown = (e: MouseEvent) => {
  hueAreaRef.value = e.currentTarget as HTMLElement;
  handleHueAreaMouseMove(e);
  document.addEventListener("mousemove", handleHueAreaMouseMove);
  document.addEventListener("mouseup", handleHueAreaMouseUp);
};

/**
 * **色相区域鼠标移动处理**
 * @param `e` `MouseEvent` 鼠标事件
 * */
const handleHueAreaMouseMove = (e: MouseEvent) => {
  if (!hueAreaRef.value) return;
  const target = hueAreaRef.value;
  const rect = target.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  hue.value = (x / rect.width) * 360;
  updateColorFromHsv();
};

/**
 * **色相区域鼠标抬起处理**
 * */
const handleHueAreaMouseUp = () => {
  hueAreaRef.value = null;
  document.removeEventListener("mousemove", handleHueAreaMouseMove);
  document.removeEventListener("mouseup", handleHueAreaMouseUp);
};

/**
 * **透明度区域鼠标按下处理**
 * @param `e` `MouseEvent` 鼠标事件
 * */
const onAlphaAreaMouseDown = (e: MouseEvent) => {
  alphaAreaRef.value = e.currentTarget as HTMLElement;
  handleAlphaAreaMouseMove(e);
  document.addEventListener("mousemove", handleAlphaAreaMouseMove);
  document.addEventListener("mouseup", handleAlphaAreaMouseUp);
};

/**
 * **透明度区域鼠标移动处理**
 * @param `e` `MouseEvent` 鼠标事件
 * */
const handleAlphaAreaMouseMove = (e: MouseEvent) => {
  if (!alphaAreaRef.value) return;
  const target = alphaAreaRef.value;
  const rect = target.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  alpha.value = parseFloat((1 - x / rect.width).toFixed(2));
  alphaInput.value = alpha.value;
  updateColorFromHsv();
};

/**
 * **透明度区域鼠标抬起处理**
 * */
const handleAlphaAreaMouseUp = () => {
  alphaAreaRef.value = null;
  document.removeEventListener("mousemove", handleAlphaAreaMouseMove);
  document.removeEventListener("mouseup", handleAlphaAreaMouseUp);
};

/**
 * **十六进制输入变化处理**
 * */
const onHexInputChange = () => {
  if (parseColor(hexInput.value)) updateColorFromHsv();
};

/**
 * **选择预设颜色**
 * @param `color` `string` 预设颜色值
 * */
const selectPresetColor = (color: string) => {
  currentColor.value = color;
  hexInput.value = color;
  parseColor(color);
  emit("update:modelValue", color);
  emit("change", color);
};

/**
 * **组件挂载生命周期**
 * @description 初始化颜色值
 * */
onMounted(() => {
  currentColor.value = props.modelValue;
  hexInput.value = String(props.modelValue);
  parseColor(String(props.modelValue));
});

/**
 * **组件卸载生命周期**
 * @description 移除事件监听器
 * */
onUnmounted(() => {
  document.removeEventListener("mousemove", handleColorAreaMouseMove);
  document.removeEventListener("mouseup", handleColorAreaMouseUp);
  document.removeEventListener("mousemove", handleHueAreaMouseMove);
  document.removeEventListener("mouseup", handleHueAreaMouseUp);
  document.removeEventListener("mousemove", handleAlphaAreaMouseMove);
  document.removeEventListener("mouseup", handleAlphaAreaMouseUp);
});

/**
 * **监听 modelValue 变化**
 * */
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
