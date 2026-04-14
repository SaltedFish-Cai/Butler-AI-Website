<template>
  <!-- 颜色选择器面板 -->
  <div class="m-color-v2-picker" v-if="!props.disabled">
    <!-- 颜色选择区域 -->
    <div class="m-color-v2-picker-main">
      <div class="m-color-v2-picker-color-area" @mousedown="onColorAreaMouseDown">
        <div class="m-color-v2-picker-color-area-overlay" :style="{ backgroundColor: hueColor }"></div>
        <div class="m-color-v2-picker-color-area-mask"></div>
        <button class="m-color-v2-picker-color-area-pointer" :style="{ left: `${saturation}%`, top: `${100 - value}%` }"></button>
      </div>

      <!-- 色相选择条 -->
      <div class="m-color-v2-picker-hue-area">
        <div class="m-color-v2-picker-hue-area-gradient" @mousedown="onHueAreaMouseDown"></div>
        <div class="m-color-v2-picker-hue-area-pointer" :style="{ left: `${(hue / 360) * 100}%` }"></div>
      </div>

      <!-- 透明度选择条 -->
      <div class="m-color-v2-picker-alpha-area" v-if="props.showAlpha">
        <div
          class="m-color-v2-picker-alpha-gradient"
          :style="{ backgroundColor: currentColorWithoutAlpha }"
          @mousedown="onAlphaAreaMouseDown"
        ></div>
        <div class="m-color-v2-picker-alpha-pointer" :style="{ top: `${100 - alpha * 100}%` }"></div>
      </div>
    </div>

    <!-- 颜色值输入区域 -->
    <div class="m-color-v2-picker-inputs">
      <div class="m-color-v2-picker-inputs-group" v-if="props.showInput">
        <input
          type="text"
          class="m-color-v2-picker-inputs-input"
          v-model="hexInput"
          @input="onHexInputChange"
          placeholder="#000000"
        />
      </div>
      <div class="m-color-v2-picker-inputs-group" v-if="props.showAlpha">
        <input
          type="number"
          class="m-color-v2-picker-input"
          v-model.number="alphaInput"
          @input="onAlphaInputChange"
          min="0"
          max="1"
          step="0.01"
          placeholder="Alpha"
        />
      </div>
    </div>

    <!-- 预设颜色列表 -->
    <div class="m-color-v2-picker-presets" v-if="presetColors && presetColors.length > 0">
      <button
        class="m-color-v2-picker-presets-preset"
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
import { MColorTypeV2 } from "./type";

// Props定义
const props = withDefaults(defineProps<MColorTypeV2>(), {
  id: undefined,
  class: undefined,
  style: undefined,
  modelValue: "#000000",
  value: "#000000",
  disabled: false,
  showAlpha: false,
  showInput: false,
  presetColors: undefined
});

// Emits定义
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}>();

// 状态定义
const currentColor = ref(props.value || props.modelValue);
const hue = ref(0);
const saturation = ref(0);
const value = ref(0);
const alpha = ref(1);
const hexInput = ref("");
const alphaInput = ref(1);

// 计算属性
const hueColor = computed(() => `hsl(${hue.value}, 100%, 50%)`);
const currentColorWithoutAlpha = computed(() => {
  const color = hexToRgb(currentColor.value);
  if (color) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }
  return currentColor.value;
});

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

const onColorAreaMouseDown = (e: MouseEvent) => {
  colorAreaRef.value = e.currentTarget as HTMLElement;
  handleColorAreaMouseMove(e);
  document.addEventListener("mousemove", handleColorAreaMouseMove);
  document.addEventListener("mouseup", handleColorAreaMouseUp);
};

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

const onHueAreaMouseDown = (e: MouseEvent) => {
  hueAreaRef.value = e.currentTarget as HTMLElement;
  handleHueAreaMouseMove(e);
  document.addEventListener("mousemove", handleHueAreaMouseMove);
  document.addEventListener("mouseup", handleHueAreaMouseUp);
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

const onAlphaAreaMouseDown = (e: MouseEvent) => {
  alphaAreaRef.value = e.currentTarget as HTMLElement;
  handleAlphaAreaMouseMove(e);
  document.addEventListener("mousemove", handleAlphaAreaMouseMove);
  document.addEventListener("mouseup", handleAlphaAreaMouseUp);
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

const onHexInputChange = () => {
  if (parseColor(hexInput.value)) {
    updateColorFromHsv();
  }
};

const onAlphaInputChange = () => {
  alpha.value = Math.max(0, Math.min(alphaInput.value, 1));
  updateColorFromHsv();
};

const selectPresetColor = (color: string) => {
  currentColor.value = color;
  hexInput.value = color;
  parseColor(color);
  emit("update:modelValue", color);
  emit("change", color);
};

// 生命周期钩子
onMounted(() => {
  currentColor.value = props.value || props.modelValue;
  hexInput.value = props.value || props.modelValue;
  parseColor(props.value || props.modelValue);
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
  () => props.value || props.modelValue,
  newValue => {
    console.log("++++++++++> newValue:", newValue);
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
