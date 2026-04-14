<template>
  <div v-if="!display" class="m-number-v2" :class="[props.class, { 'is-disabled': props.disabled }]" :style="{ ...props.style }">
    <!-- input -->
    <div class="m-number-v2-input" :class="[isFocus ? 'is-focus' : '']">
      <input
        class="m-number-v2-input-inner"
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
      <m-icon-v2 v-if="!disabled && clearable && inValue" name="close_circle_line" class="clear-icon" @click="clearInput" />
      <div class="m-number-v2-input-controls" v-if="!disabled && controls">
        <m-icon-v2 name="up_line" class="control-icon top" @click="handleControl('up')" />
        <m-icon-v2 name="down_line" class="control-icon bottom" @click="handleControl('down')" />
      </div>
    </div>
  </div>
  <div v-else class="m-display-v2">
    <slot name="exDisplay"></slot>
    <template v-if="$slots.exDisplay"> ( {{ keepDecimalPlaces(inValue, precision) || "--" }}{{ unit }} )</template>
    <template v-else>{{ keepDecimalPlaces(inValue, precision) || "--" }}{{ unit }}</template>
  </div>
  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(inValue, contrastData))"
    :class="['m-contrast-v2']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ keepDecimalPlaces(contrastData, precision) || "--" }}{{ unit }} )</template>
    <template v-else>{{ keepDecimalPlaces(contrastData, precision) || "--" }}{{ unit }}</template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, ComputedRef, watch, onMounted, onUnmounted, inject, nextTick } from "vue";
import { MNumberV2Type } from "./type";
import lodashPkg from "lodash";
import { randChar } from "../tools/rand-char";

import { handlePrecision, keepDecimalPlaces } from "../utils/handlePrecision";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";

const { isEqual, isNil } = lodashPkg;
const inputRef = ref();
const isFocus = ref(false);
let setRange = false;

const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;
const languagePackage = computed(() => {
  return ManagerGlobalConfig.value?.language?.package?.["cell"] || {};
});

const computedPlaceholder: ComputedRef<string> = computed(() => {
  const language = ManagerGlobalConfig.value?.language?.value || "zh-CN";
  return typeof props.placeholder === "object"
    ? props.placeholder[language] || languagePackage.value[`inputPlaceholder`]
    : props.placeholder || languagePackage.value[`inputPlaceholder`];
});

const props = withDefaults(defineProps<MNumberV2Type>(), {
  id: randChar(),
  modelValue: "",
  clearable: true,
  showPassword: false,
  autofocus: false,
  controls: true,
  step: 1,
  precision: 0,
  unit: ""
});

const inValue = ref(handlePrecision(props.modelValue, props.precision));
const emits = defineEmits(["update:modelValue", "change", "blur", "focus"]);

// 检查最大最小值限制
function checkMinMaxLimit() {
  if (inValue.value === "" || inValue.value === "-") {
    return;
  }

  const numericValue = parseFloat(String(inValue.value));
  if (isNaN(numericValue)) {
    return;
  }

  // 检查最小值限制
  if (props.min !== undefined && numericValue < props.min) {
    inValue.value = props.min.toString();
  }

  // 检查最大值限制
  if (props.max !== undefined && numericValue > props.max) {
    inValue.value = props.max.toString();
  }
}

function handleInput(event) {
  // 允许输入数字、小数点、负号和空字符串
  const inputValue = event.target.value;

  // 使用正则表达式过滤非数字字符（允许数字、小数点、负号）
  const filteredValue = inputValue.replace(/[^0-9.\-]/g, "");

  // 处理多个小数点的情况
  const decimalCount = (filteredValue.match(/\./g) || []).length;
  if (decimalCount > 1) {
    // 如果有多于一个小数点，只保留第一个
    const firstDecimalIndex = filteredValue.indexOf(".");
    inValue.value =
      filteredValue.substring(0, firstDecimalIndex + 1) + filteredValue.substring(firstDecimalIndex + 1).replace(/\./g, "");
    return;
  }

  // 处理多个负号的情况
  const minusCount = (filteredValue.match(/\-/g) || []).length;
  if (minusCount > 1 || (minusCount === 1 && filteredValue.indexOf("-") !== 0)) {
    // 如果有多于一个负号，或者负号不在开头，只保留开头的负号
    inValue.value = filteredValue.replace(/\-/g, "");
    if (minusCount > 0) {
      inValue.value = "-" + inValue.value;
    }
    return;
  }

  // 更新输入值
  inValue.value = filteredValue;

  // 检查最大最小值限制
  checkMinMaxLimit();

  // 处理小数精度（避免四舍五入）
  inValue.value = handlePrecision(inValue.value, props.precision);
  if (setRange) {
    setRange = false;
    // 确保光标位置在数字末尾
    const inputElement = inputRef.value;
    if (inputElement) {
      nextTick(() => {
        inputElement.setSelectionRange(1, 1);
      });
    }
  }
  // 实时触发更新
  emits("update:modelValue", inValue.value);
}

function handleChange() {
  // 确保最终值是有效的数字格式（允许数字、小数点、负号、空字符串）
  if (inValue.value === "" || inValue.value === "-") {
    inValue.value = "";
  } else {
    // 验证数字格式，去除无效的字符
    const numericValue = String(inValue.value).replace(/[^0-9.\-]/g, "");

    // 处理多个小数点
    const decimalParts = numericValue.split(".");
    if (decimalParts.length > 2) {
      inValue.value = decimalParts[0] + "." + decimalParts.slice(1).join("");
    } else {
      inValue.value = numericValue;
    }

    // 处理负号位置
    if (String(inValue.value).includes("-") && String(inValue.value).indexOf("-") !== 0) {
      inValue.value = String(inValue.value).replace(/\-/g, "");
    }
  }

  // 检查最大最小值限制
  checkMinMaxLimit();

  // 处理小数精度（避免四舍五入）
  inValue.value = handlePrecision(inValue.value, props.precision);

  emits("change", { value: Number(inValue.value), oldValue: Number(oldValue) });
  emits("update:modelValue", Number(inValue.value));
}

function handleKeyUp(e) {
  const value = e.target.value;
  if (value === "" || value === "-" || (e.target.selectionStart === 0 && e.target.selectionEnd === e.target.value.length)) {
    setRange = true;
  } else {
    setRange = false;
  }
}

// 处理键盘事件
function handleKeyDown(event: KeyboardEvent) {
  if (props.disabled) {
    return;
  }

  // 监听上下箭头键
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault(); // 阻止默认行为（光标移动）

    if (event.key === "ArrowUp") {
      handleControl("up");
    } else if (event.key === "ArrowDown") {
      handleControl("down");
    }
  }
}

function handleFocus() {
  isFocus.value = true;
  // 添加滚动事件监听
  const inputElement = inputRef.value;
  if (inputElement) {
    inputElement.addEventListener("wheel", handleWheel, { passive: false });
    // 添加键盘事件监听
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

function handleBlur() {
  isFocus.value = false;
  const inputElement = inputRef.value;
  if (inputElement) {
    inputElement.removeEventListener("wheel", handleWheel);
    // 移除键盘事件监听
    inputElement.removeEventListener("keydown", handleKeyDown);
  }
  emits("blur");
}

function handleControl(type: "down" | "up") {
  // 确保当前值是有效的数字
  let currentValue = 0;
  if (inValue.value !== "" && inValue.value !== "-") {
    const numericValue = parseFloat(String(inValue.value));
    if (!isNaN(numericValue)) {
      currentValue = numericValue;
    }
  }

  // 根据操作类型增减值，使用更精确的计算方法
  let newValue;
  if (type === "up") {
    // 向上操作，增加值
    newValue = currentValue + props.step;
  } else {
    // 向下操作，减少值
    newValue = currentValue - props.step;
  }

  // 处理小数精度，避免浮点数精度问题
  if (props.precision !== undefined && props.precision >= 0) {
    // 使用toFixed处理小数精度，然后转换为数字再转回字符串以避免科学计数法
    newValue = parseFloat(newValue.toFixed(props.precision + 2));
  }

  inValue.value = newValue.toString();

  // 检查最大最小值限制
  checkMinMaxLimit();

  // 处理小数精度（避免四舍五入）
  inValue.value = handlePrecision(inValue.value, props.precision);

  // 触发更新
  emits("update:modelValue", inValue.value);
  emits("change", { value: inValue.value, oldValue });
}

// # 处理清除事件
function clearInput() {
  inValue.value = "";
  emits("update:modelValue", "");
  emits("change", { value: "", oldValue });
}

// # 处理滚动事件
let lastWheelTime = 0;
let wheelDelta = 0;
const handleWheel = (event: WheelEvent) => {
  if (isFocus.value && !props.disabled) {
    event.preventDefault();

    const now = Date.now();
    wheelDelta += Math.abs(event.deltaY);

    // 降低敏感度：只有当滚动量达到阈值时才触发月份切换
    if (wheelDelta < 25) {
      // 滚动量阈值，可以根据需要调整
      return;
    }

    // 防抖处理：避免快速连续滚动
    if (now - lastWheelTime < 50) {
      // 200ms防抖时间
      return;
    }

    // 重置滚动量和时间
    wheelDelta = 0;
    lastWheelTime = now;

    // 确保当前值是有效的数字
    let currentValue = 0;
    if (inValue.value !== "" && inValue.value !== "-") {
      const numericValue = parseFloat(String(inValue.value));
      if (!isNaN(numericValue)) {
        currentValue = numericValue;
      }
    }

    // 根据滚动方向增减值，使用更精确的计算方法
    let newValue;
    if (event.deltaY < 0) {
      // 向上滚动，增加值
      newValue = currentValue + props.step;
    } else {
      // 向下滚动，减少值
      newValue = currentValue - props.step;
    }

    // 处理小数精度，避免浮点数精度问题
    if (props.precision !== undefined && props.precision >= 0) {
      // 使用toFixed处理小数精度，然后转换为数字再转回字符串以避免科学计数法
      newValue = parseFloat(newValue.toFixed(props.precision + 2));
    }

    inValue.value = newValue.toString();

    // 检查最大最小值限制
    checkMinMaxLimit();

    // 处理小数精度（避免四舍五入）
    inValue.value = handlePrecision(inValue.value, props.precision);

    // 触发更新
    emits("update:modelValue", inValue.value);
    emits("change", { value: inValue.value, oldValue });
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

// 在组件卸载时移除事件监听
onUnmounted(() => {
  const inputElement = inputRef.value;
  if (inputElement) {
    inputElement.removeEventListener("wheel", handleWheel);
  }
});

let oldValue: number | string | undefined = props.modelValue;

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
