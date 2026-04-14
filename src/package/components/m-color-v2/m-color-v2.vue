<template>
  <div :id="props.id" :class="['m-color-v2', { 'm-color-v2-disabled': props.disabled }]" :style="props.style">
    <m-popover-v2 ref="popoverRef" :disabled="props.disabled" autoWidth @change="e => (isPickerOpen = e)">
      <template #reference>
        <!-- 颜色显示区域 -->
        <div class="m-color-v2-preview" :class="{ 'm-color-v2-preview-active': isPickerOpen }" v-if="!props.disabled">
          <div class="m-color-v2-preview-color" :style="{ backgroundColor: currentColor }">
            <div class="m-color-v2-preview-mask" v-if="!isHexColor(currentColor)"></div>
          </div>
          <div class="m-color-v2-preview-text">{{ currentColor }}</div>
        </div>
      </template>
      <m-color-v2-item v-model="currentColor"></m-color-v2-item>
    </m-popover-v2>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { MColorTypeV2 } from "./type";

// Props定义
const props = withDefaults(defineProps<MColorTypeV2>(), {
  id: undefined,
  class: undefined,
  style: undefined,
  modelValue: "#000000",
  disabled: false,
  showAlpha: false,
  presetColors: undefined,
  onChange: undefined
});

// Emits定义
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}>();

// 状态定义
const isPickerOpen = ref(false);
const currentColor = ref(props.modelValue);
const hue = ref(0);
const saturation = ref(0);
const value = ref(0);
const alpha = ref(1);
const hexInput = ref("");
const alphaInput = ref(1);

const isHexColor = (color: string): boolean => {
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

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

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    v = max;

  const d = max - min;
  s = max === 0 ? 0 : d / max;

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
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
};

const updateColorFromHsv = () => {
  const rgb = hsvToRgb(hue.value, saturation.value, value.value);
  let color = rgbToHex(rgb.r, rgb.g, rgb.b);

  if (props.showAlpha) {
    color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.value})`;
  }

  currentColor.value = color;
  hexInput.value = color;
  alphaInput.value = alpha.value;
  emit("update:modelValue", color);
  emit("change", color);
  if (props.onChange) {
    props.onChange(color);
  }
};

const parseColor = (color: string) => {
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

const colorAreaRef = ref<HTMLElement | null>(null);
const hueAreaRef = ref<HTMLElement | null>(null);
const alphaAreaRef = ref<HTMLElement | null>(null);

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

const handleColorAreaMouseUp = () => {
  colorAreaRef.value = null;
  document.removeEventListener("mousemove", handleColorAreaMouseMove);
  document.removeEventListener("mouseup", handleColorAreaMouseUp);
};

const handleHueAreaMouseMove = (e: MouseEvent) => {
  if (!hueAreaRef.value) return;

  const target = hueAreaRef.value;
  const rect = target.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));

  hue.value = (x / rect.width) * 360;

  updateColorFromHsv();
};

const handleHueAreaMouseUp = () => {
  hueAreaRef.value = null;
  document.removeEventListener("mousemove", handleHueAreaMouseMove);
  document.removeEventListener("mouseup", handleHueAreaMouseUp);
};

const handleAlphaAreaMouseMove = (e: MouseEvent) => {
  if (!alphaAreaRef.value) return;

  const target = alphaAreaRef.value;
  const rect = target.getBoundingClientRect();
  const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

  alpha.value = 1 - y / rect.height;
  alphaInput.value = alpha.value;

  updateColorFromHsv();
};

const handleAlphaAreaMouseUp = () => {
  alphaAreaRef.value = null;
  document.removeEventListener("mousemove", handleAlphaAreaMouseMove);
  document.removeEventListener("mouseup", handleAlphaAreaMouseUp);
};

// 生命周期钩子
onMounted(() => {
  currentColor.value = props.modelValue;
  hexInput.value = props.modelValue;
  parseColor(props.modelValue);
});

onUnmounted(() => {
  document.removeEventListener("mousemove", handleColorAreaMouseMove);
  document.removeEventListener("mouseup", handleColorAreaMouseUp);
  document.removeEventListener("mousemove", handleHueAreaMouseMove);
  document.removeEventListener("mouseup", handleHueAreaMouseUp);
  document.removeEventListener("mousemove", handleAlphaAreaMouseMove);
  document.removeEventListener("mouseup", handleAlphaAreaMouseUp);
});

// 监听props变化
watch(
  () => props.modelValue,
  newValue => {
    if (newValue !== currentColor.value) {
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
