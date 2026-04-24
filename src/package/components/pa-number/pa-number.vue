<template>
  <div v-if="!display" class="pa-number" :class="[props.class, { 'is-disabled': props.disabled }]" :style="{ ...props.style }">
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>

    <div class="pa-number-input" :class="[isFocus ? 'is-focus' : '']">
      <input
        class="pa-number-input-inner"
        v-model="inValue"
        ref="inputRef"
        :name="id"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @change="handleChange"
        @keyup="handleKeyUp"
        @keyup.enter="handleChange"
        :disabled="disabled"
        autocomplete="off"
        :placeholder="computedPlaceholder"
      />
      <div v-if="unit" class="pa-number-input-unit">{{ unit }}</div>
      <pa-icon v-if="!disabled && clearable && inValue" name="close_circle_line" class="clear-icon" @click="clearInput" />
      <div class="pa-number-input-controls" v-if="!disabled && controls">
        <pa-icon name="up_line" class="control-icon top" @click="handleControl('up')" />
        <pa-icon name="down_line" class="control-icon bottom" @click="handleControl('down')" />
      </div>
    </div>
  </div>

  <div v-else class="pa-display-style" :class="[props.class]" :style="{ ...props.style }">
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <div class="pa-display-value_content">
      <slot name="exDisplay"></slot>
      <template v-if="$slots.exDisplay"> ( {{ keepDecimalPlaces(inValue, precision) || "--" }}{{ unit }} ) </template>
      <template v-else>{{ keepDecimalPlaces(inValue, precision) || "--" }}{{ unit }}</template>
    </div>
  </div>

  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(inValue, contrastData))"
    :class="['pa-contrast-style']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ keepDecimalPlaces(contrastData, precision) || "--" }}{{ unit }} ) </template>
    <template v-else>{{ keepDecimalPlaces(contrastData, precision) || "--" }}{{ unit }}</template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, ComputedRef, watch, onMounted, onUnmounted, inject, nextTick } from "vue";
import { ComponentProps, ComponentEmits } from "./types";

import { handlePrecision, keepDecimalPlaces } from "../utils/handlePrecision";
import { PancakeGlobalConfigType } from "../pa-manager/type";

import _ from "lodash";
const { isEqual, isNil } = _;

const inputRef = ref();
const isFocus = ref(false);
let setRange = false;

const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["cell"] || {};
});
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

const computedPlaceholder: ComputedRef<string> = computed(() => {
  const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";
  return typeof props.placeholder === "object"
    ? props.placeholder[language] || languagePackage.value[`inputPlaceholder`]
    : props.placeholder || languagePackage.value[`inputPlaceholder`];
});

const props = withDefaults(defineProps<ComponentProps>(), {
  clearable: true,
  controls: true,
  step: 1,
  precision: 0
});

const inValue = ref(handlePrecision(props.modelValue, props.precision));
const emits = defineEmits<ComponentEmits>();

let oldValue: number | string | undefined = props.modelValue;

/**
 * **检查最大最小值限制**
 * @description 验证当前值是否在 min/max 范围内
 * */
function checkMinMaxLimit() {
  if (inValue.value === "" || inValue.value === "-") {
    return;
  }

  const numericValue = parseFloat(String(inValue.value));
  if (isNaN(numericValue)) {
    return;
  }

  if (props.min !== undefined && numericValue < props.min) {
    inValue.value = props.min.toString();
  }

  if (props.max !== undefined && numericValue > props.max) {
    inValue.value = props.max.toString();
  }
}

/**
 * **处理输入事件**
 * @description 过滤非数字字符并更新值
 * */
function handleInput(event) {
  const inputValue = event.target.value;
  const filteredValue = inputValue.replace(/[^0-9.\-]/g, "");

  const decimalCount = (filteredValue.match(/\./g) || []).length;
  if (decimalCount > 1) {
    const firstDecimalIndex = filteredValue.indexOf(".");
    inValue.value =
      filteredValue.substring(0, firstDecimalIndex + 1) + filteredValue.substring(firstDecimalIndex + 1).replace(/\./g, "");
    return;
  }

  const minusCount = (filteredValue.match(/\-/g) || []).length;
  if (minusCount > 1 || (minusCount === 1 && filteredValue.indexOf("-") !== 0)) {
    inValue.value = filteredValue.replace(/\-/g, "");
    if (minusCount > 0) {
      inValue.value = "-" + inValue.value;
    }
    return;
  }

  inValue.value = filteredValue;
  checkMinMaxLimit();
  inValue.value = handlePrecision(inValue.value, props.precision);

  if (setRange) {
    setRange = false;
    const inputElement = inputRef.value;
    if (inputElement) {
      nextTick(() => {
        inputElement.setSelectionRange(1, 1);
      });
    }
  }

  emits("update:modelValue", Number(inValue.value));
}

/**
 * **处理变更事件**
 * @description 验证并格式化最终值
 * */
function handleChange() {
  if (inValue.value === "" || inValue.value === "-") {
    inValue.value = "";
  } else {
    const numericValue = String(inValue.value).replace(/[^0-9.\-]/g, "");

    const decimalParts = numericValue.split(".");
    if (decimalParts.length > 2) {
      inValue.value = decimalParts[0] + "." + decimalParts.slice(1).join("");
    } else {
      inValue.value = numericValue;
    }

    if (String(inValue.value).includes("-") && String(inValue.value).indexOf("-") !== 0) {
      inValue.value = String(inValue.value).replace(/\-/g, "");
    }
  }

  checkMinMaxLimit();
  inValue.value = handlePrecision(inValue.value, props.precision);

  emits("change", { value: Number(inValue.value), oldValue: Number(oldValue) });
  emits("update:modelValue", Number(inValue.value));
}

/**
 * **处理键盘抬起事件**
 * @description 判断光标位置
 * */
function handleKeyUp(e) {
  const value = e.target.value;
  if (value === "" || value === "-" || (e.target.selectionStart === 0 && e.target.selectionEnd === e.target.value.length)) {
    setRange = true;
  } else {
    setRange = false;
  }
}

/**
 * **处理键盘按下事件**
 * @description 监听上下箭头键
 * */
function handleKeyDown(event: KeyboardEvent) {
  if (props.disabled) {
    return;
  }

  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();

    if (event.key === "ArrowUp") {
      handleControl("up");
    } else if (event.key === "ArrowDown") {
      handleControl("down");
    }
  }
}

/**
 * **处理聚焦事件**
 * @description 添加事件监听并触发 focus 事件
 * */
function handleFocus() {
  isFocus.value = true;
  const inputElement = inputRef.value;
  if (inputElement) {
    inputElement.addEventListener("wheel", handleWheel, { passive: false });
    inputElement.addEventListener("keydown", handleKeyDown);
  }
  if (inValue.value === "" || inValue.value === "-") {
    setRange = true;
  } else {
    const index = inValue.value.indexOf(".");
    if (index > -1) {
      const inputElement = inputRef.value;
      if (inputElement) {
        const time = setTimeout(() => {
          inputElement.setSelectionRange(index, index);
          clearTimeout(time);
        }, 10);
      }
    }
  }
  emits("focus");
}

/**
 * **处理失焦事件**
 * @description 移除事件监听并触发 blur 事件
 * */
function handleBlur() {
  isFocus.value = false;
  const inputElement = inputRef.value;
  if (inputElement) {
    inputElement.removeEventListener("wheel", handleWheel);
    inputElement.removeEventListener("keydown", handleKeyDown);
  }
  emits("blur");
}

/**
 * **处理控制按钮点击**
 * @description 增减数字值
 * */
function handleControl(type: "down" | "up") {
  let currentValue = 0;
  if (inValue.value !== "" && inValue.value !== "-") {
    const numericValue = parseFloat(String(inValue.value));
    if (!isNaN(numericValue)) {
      currentValue = numericValue;
    }
  }

  let newValue;
  if (type === "up") {
    newValue = currentValue + props.step;
  } else {
    newValue = currentValue - props.step;
  }

  if (props.precision !== undefined && props.precision >= 0) {
    newValue = parseFloat(newValue.toFixed(props.precision + 2));
  }

  inValue.value = newValue.toString();
  checkMinMaxLimit();
  inValue.value = handlePrecision(inValue.value, props.precision);

  emits("update:modelValue", Number(inValue.value));
  emits("change", { value: Number(inValue.value), oldValue: Number(oldValue) });
}

/**
 * **清空输入内容**
 * @description 清空数字框并触发相关事件
 * */
function clearInput() {
  inValue.value = "";
  emits("update:modelValue", 0);
  emits("change", { value: 0, oldValue: Number(oldValue) });
}

/**
 * **处理滚动事件**
 * @description 通过滚轮增减数字值
 * */
let lastWheelTime = 0;
let wheelDelta = 0;
const handleWheel = (event: WheelEvent) => {
  if (isFocus.value && !props.disabled) {
    event.preventDefault();

    const now = Date.now();
    wheelDelta += Math.abs(event.deltaY);

    if (wheelDelta < 25) {
      return;
    }

    if (now - lastWheelTime < 50) {
      return;
    }

    wheelDelta = 0;
    lastWheelTime = now;

    let currentValue = 0;
    if (inValue.value !== "" && inValue.value !== "-") {
      const numericValue = parseFloat(String(inValue.value));
      if (!isNaN(numericValue)) {
        currentValue = numericValue;
      }
    }

    let newValue;
    if (event.deltaY < 0) {
      newValue = currentValue - props.step;
    } else {
      newValue = currentValue + props.step;
    }

    if (props.precision !== undefined && props.precision >= 0) {
      newValue = parseFloat(newValue.toFixed(props.precision + 2));
    }

    inValue.value = newValue.toString();
    checkMinMaxLimit();
    inValue.value = handlePrecision(inValue.value, props.precision);

    emits("update:modelValue", Number(inValue.value));
    emits("change", { value: Number(inValue.value), oldValue: Number(oldValue) });
  }
};

onMounted(() => {
  if (props.autofocus) {
    setTimeout(() => {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    }, 300);
  }
});

onUnmounted(() => {
  const inputElement = inputRef.value;
  if (inputElement) {
    inputElement.removeEventListener("wheel", handleWheel);
  }
});

watch(
  () => props.modelValue,
  data => {
    inValue.value = handlePrecision(data, props.precision);
    oldValue = handlePrecision(data, props.precision);
  }
);
</script>

<style lang="scss">
@use "./index.scss";
@use "../cell-style.scss";
</style>
