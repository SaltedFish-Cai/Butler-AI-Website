<template>
  <div class="m-timer-v2" ref="timerRef" :class="[props.class, { 'is-disabled': props.disabled }]" :style="{ ...props.style }">
    <m-popover-v2
      ref="popoverRef"
      @change="handlePopoverChange"
      :disabled="props.disabled"
      :popoverWidth="240"
      class="m-timer-v2-popover"
      :teleportTo="timerRef"
      :targetClose="false"
    >
      <template #reference>
        <!-- 时间输入框 -->
        <div class="m-timer-v2-input" :class="[isFocus ? 'is-focus' : '']">
          <!-- 小时 -->
          <input
            class="m-timer-v2-input-inner"
            v-model="hours"
            ref="hourInputRef"
            :name="id + '_h'"
            placeholder="HH"
            maxlength="2"
            autocomplete="off"
            @focus="() => handleFocus('hour')"
            @blur="() => handleBlur()"
            @input="e => handleTimeInput(e, 'hour')"
            @keydown="e => handleTimeKeyDown(e, 'hour')"
            @change="validateTime"
          />
          :
          <!-- 分钟 -->
          <input
            class="m-timer-v2-input-inner"
            v-model="minutes"
            ref="minuteInputRef"
            :name="id + '_m'"
            placeholder="MM"
            maxlength="2"
            autocomplete="off"
            @focus="() => handleFocus('minute')"
            @blur="() => handleBlur()"
            @input="e => handleTimeInput(e, 'minute')"
            @keydown="e => handleTimeKeyDown(e, 'minute')"
            @change="validateTime"
          />
          :
          <!-- 秒钟 -->
          <input
            class="m-timer-v2-input-inner"
            v-model="seconds"
            ref="secondInputRef"
            :name="id + '_s'"
            placeholder="SS"
            maxlength="2"
            autocomplete="off"
            @focus="() => handleFocus('second')"
            @blur="() => handleBlur()"
            @input="e => handleTimeInput(e, 'second')"
            @keydown="e => handleTimeKeyDown(e, 'second')"
            @change="validateTime"
          />
        </div>
      </template>

      <!-- 时间选择面板 -->
      <div class="m-timer-v2-panel">
        <div class="m-timer-v2-panel-content">
          <div class="m-timer-v2-time-selector">
            <div class="m-timer-v2-time-column">
              <div class="m-timer-v2-time-title">时</div>
              <div class="m-timer-v2-time-list">
                <div
                  v-for="h in 24"
                  :key="h"
                  :class="['m-timer-v2-time-item', { selected: hours === formatTimeUnit(h - 1) }]"
                  @click="selectHour(h - 1)"
                >
                  {{ formatTimeUnit(h - 1) }}
                </div>
              </div>
            </div>
            <div class="m-timer-v2-time-column">
              <div class="m-timer-v2-time-title">分</div>
              <div class="m-timer-v2-time-list">
                <div
                  v-for="m in 60"
                  :key="m"
                  :class="['m-timer-v2-time-item', { selected: minutes === formatTimeUnit(m - 1) }]"
                  @click="selectMinute(m - 1)"
                >
                  {{ formatTimeUnit(m - 1) }}
                </div>
              </div>
            </div>
            <div class="m-timer-v2-time-column">
              <div class="m-timer-v2-time-title">秒</div>
              <div class="m-timer-v2-time-list">
                <div
                  v-for="s in 60"
                  :key="s"
                  :class="['m-timer-v2-time-item', { selected: seconds === formatTimeUnit(s - 1) }]"
                  @click="selectSecond(s - 1)"
                >
                  {{ formatTimeUnit(s - 1) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="m-timer-v2-panel-footer">
          <m-button-v2 @click="setCurrentTime('start')" is="go" type="default">开始</m-button-v2>
          <m-button-v2 @click="setCurrentTime('current')" is="go" type="default">当前</m-button-v2>
          <m-button-v2 @click="setCurrentTime('end')" is="go" type="default">结束</m-button-v2>
        </div>
      </div>
    </m-popover-v2>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { MTimerV2Type } from "./type";
import { randChar } from "../tools/rand-char";

// Refs
const popoverRef = ref();
const hourInputRef = ref();
const minuteInputRef = ref();
const secondInputRef = ref();
const isFocus = ref(false);
const currentFocus = ref<"hour" | "minute" | "second">("hour");

const props = withDefaults(defineProps<MTimerV2Type>(), {
  id: randChar(),
  modelValue: "",
  clearable: true,
  autofocus: false,
  controls: true
});

const timerRef = ref();

// 时间值
const hours = ref("");
const minutes = ref("");
const seconds = ref("");

const emits = defineEmits(["update:modelValue", "change", "blur", "focus"]);

// 计算完整的时间字符串
const timeValue = computed(() => {
  if (!hours.value && !minutes.value && !seconds.value) {
    return "";
  }
  return `${hours.value || "00"}:${minutes.value || "00"}:${seconds.value || "00"}`;
});

// 格式化时间单位（补零）
function formatTimeUnit(value: number): string {
  return value.toString().padStart(2, "0");
}

// 验证时间输入
function validateTimeInput(value: string, type: "hour" | "minute" | "second"): boolean {
  if (!value) return true;

  const numValue = parseInt(value);
  if (isNaN(numValue)) return false;

  switch (type) {
    case "hour":
      return numValue >= 0 && numValue <= 23;
    case "minute":
    case "second":
      return numValue >= 0 && numValue <= 59;
    default:
      return false;
  }
}

// 处理时间输入
function handleTimeInput(event: Event, type: "hour" | "minute" | "second") {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/[^0-9]/g, "");

  // 限制长度
  if (value.length > 2) {
    value = value.slice(0, 2);
  }

  // 自动跳转到下一个输入框
  if (value.length === 2 && validateTimeInput(value, type)) {
    switch (type) {
      case "hour":
        minuteInputRef.value?.focus();
        break;
      case "minute":
        secondInputRef.value?.focus();
        break;
      case "second":
        secondInputRef.value?.blur();
        break;
    }
  }

  // 更新值
  switch (type) {
    case "hour":
      hours.value = value;
      break;
    case "minute":
      minutes.value = value;
      break;
    case "second":
      seconds.value = value;
      break;
  }

  // 触发更新
  updateTimeValue();
}

function handlePopoverChange(data) {
  isFocus.value = data;
}

// 处理键盘事件
function handleTimeKeyDown(event: KeyboardEvent, type: "hour" | "minute" | "second") {
  // 允许数字、退格、删除、Tab、箭头键
  if (!/[0-9]|Backspace|Delete|Tab|ArrowLeft|ArrowRight|ArrowUp|ArrowDown/.test(event.key)) {
    event.preventDefault();
    return;
  }

  // 处理上下箭头
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    adjustTimeValue(type, event.key === "ArrowUp" ? 1 : -1);
  }

  // 处理左右箭头切换输入框
  if (event.key === "ArrowRight") {
    event.preventDefault();
    switch (type) {
      case "hour":
        minuteInputRef.value?.focus();
        break;
      case "minute":
        secondInputRef.value?.focus();
        break;
    }
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    switch (type) {
      case "minute":
        hourInputRef.value?.focus();
        break;
      case "second":
        minuteInputRef.value?.focus();
        break;
    }
  }
}

// 调整时间值
function adjustTimeValue(type: "hour" | "minute" | "second", delta: number) {
  let currentValue = 0;
  let maxValue = 59;

  switch (type) {
    case "hour":
      currentValue = parseInt(hours.value) || 0;
      maxValue = 23;
      break;
    case "minute":
      currentValue = parseInt(minutes.value) || 0;
      break;
    case "second":
      currentValue = parseInt(seconds.value) || 0;
      break;
  }

  let newValue = currentValue + delta;

  // 循环处理
  if (newValue > maxValue) {
    newValue = 0;
  } else if (newValue < 0) {
    newValue = maxValue;
  }

  const formattedValue = formatTimeUnit(newValue);

  switch (type) {
    case "hour":
      hours.value = formattedValue;
      break;
    case "minute":
      minutes.value = formattedValue;
      break;
    case "second":
      seconds.value = formattedValue;
      break;
  }

  updateTimeValue();
}

// 更新时间值并触发事件
function updateTimeValue() {
  emits("update:modelValue", timeValue.value);
  emits("change", { value: timeValue.value, oldValue: props.modelValue });
}

// 验证完整时间
function validateTime() {
  // 验证各个部分
  if (hours.value && !validateTimeInput(hours.value, "hour")) {
    hours.value = "";
  }
  if (minutes.value && !validateTimeInput(minutes.value, "minute")) {
    minutes.value = "";
  }
  if (seconds.value && !validateTimeInput(seconds.value, "second")) {
    seconds.value = "";
  }

  updateTimeValue();
}

function selectHour(value: number) {
  selectTimeUnit(value, "hour");
}

function selectMinute(value: number) {
  selectTimeUnit(value, "minute");
}

function selectSecond(value: number) {
  selectTimeUnit(value, "second");
}

function selectTimeUnit(value: number, type: "hour" | "minute" | "second") {
  const formattedValue = formatTimeUnit(value);

  switch (type) {
    case "hour":
      hours.value = formattedValue;
      break;
    case "minute":
      minutes.value = formattedValue;
      break;
    case "second":
      seconds.value = formattedValue;
      break;
  }

  updateTimeValue();
}

function setCurrentTime(type: "current" | "end" | "start") {
  const now = new Date();
  hours.value = type === "current" ? formatTimeUnit(now.getHours()) : type === "start" ? "00" : "23";
  minutes.value = type === "current" ? formatTimeUnit(now.getMinutes()) : type === "start" ? "00" : "59";
  seconds.value = type === "current" ? formatTimeUnit(now.getSeconds()) : type === "start" ? "00" : "59";
  popoverRef.value.hidePopover();
  updateTimeValue();
}

// 监听外部点击关闭面板
function handleClickOutside(event: MouseEvent) {
  const panel = document.querySelector(".m-time-panel");
  const inputs = [hourInputRef.value, minuteInputRef.value, secondInputRef.value];

  if (panel && !panel.contains(event.target as Node) && !inputs.some(input => input?.contains(event.target as Node))) {
  }
}

// 初始化监听
onMounted(() => {
  document.addEventListener("click", handleClickOutside);

  // 解析初始值
  if (props.modelValue) {
    const timeParts = props.modelValue.split(":");
    if (timeParts.length >= 1) hours.value = timeParts[0];
    if (timeParts.length >= 2) minutes.value = timeParts[1];
    if (timeParts.length >= 3) seconds.value = timeParts[2];
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// 处理键盘事件
function handleFocus(type: "hour" | "minute" | "second") {
  currentFocus.value = type;
  // 添加滚动事件监听
  const inputElement = {
    hour: hourInputRef,
    minute: minuteInputRef,
    second: secondInputRef
  }[type].value;

  if (inputElement) {
    inputElement.addEventListener("wheel", e => handleWheel(e, type), { passive: false });
  }
  emits("focus");
}

function handleBlur() {
  const inputElements = [hourInputRef.value, minuteInputRef.value, secondInputRef.value];
  inputElements.forEach(inputElement => {
    if (inputElement) {
      inputElement.removeEventListener("wheel", handleWheel);
    }
  });
  validateTime();
  // popoverRef.value.hidePopover();
  emits("blur");
}

// 处理滚轮事件
let lastWheelTime = 0;
let wheelDelta = 0;

function handleWheel(event: WheelEvent, type: "hour" | "minute" | "second") {
  event.preventDefault();

  // 防抖处理
  const now = Date.now();
  if (now - lastWheelTime < 200) {
    return;
  }
  lastWheelTime = now;

  // 累计滚动量
  wheelDelta += event.deltaY;

  // 达到阈值才触发
  if (Math.abs(wheelDelta) >= 50) {
    const direction = wheelDelta > 0 ? -1 : 1;
    adjustTimeValue(type, direction);
    wheelDelta = 0;
  }
}

// 在组件卸载时移除事件监听
onUnmounted(() => {
  const inputElements = [hourInputRef.value, minuteInputRef.value, secondInputRef.value];
  inputElements.forEach(inputElement => {
    if (inputElement) {
      inputElement.removeEventListener("wheel", handleWheel);
    }
  });
});

watch(
  () => props.modelValue,
  data => {
    const timeParts = data.split(":");
    if (timeParts.length >= 1) hours.value = timeParts[0];
    if (timeParts.length >= 2) minutes.value = timeParts[1];
    if (timeParts.length >= 3) seconds.value = timeParts[2];
  },
  { immediate: true }
);
</script>

<style lang="scss">
.m-timer-v2 {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  padding: calc(var(--m-size-v2-padding) / 3) calc(var(--m-size-v2-padding) / 1.2);
  color: var(--m-color-v2-default);
  font-size: var(--m-size-v2-font);
  border-radius: var(--m-size-v2-radius);
  line-height: 1.5715;
  background: none;
  border: 1px solid var(--m-color-v2-border);
  transition: all var(--m-animation-time, 0.2s);
  outline: none;
  > .m-popover-v2 > .m-popover-v2-content {
    padding: 0;
  }
  &:hover {
    border-color: var(--m-color-v2-primary);
  }
  &:has(> .m-popover-v2-reference > .is-focus) {
    border-color: var(--m-color-v2-primary);
    box-shadow: 0 0 0 2px var(--m-color-v2-primary-light-8);
    outline: 0;
  }
}

.m-timer-v2-popover {
  width: 100% !important;
}

.m-timer-v2.is-disabled {
  color: rgba(0, 0, 0, 0.25);
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  box-shadow: none;
  cursor: not-allowed;
  opacity: 1;
}

.m-timer-v2-input {
  display: flex;
  align-items: center;
  gap: 2px;
}

.m-timer-v2-input-inner {
  width: 24px;
  flex: 1;
  height: calc(var(--m-size-v2-height) - var(--m-size-v2-height) / 4);
  border: none;
  outline: none;
  background: transparent;
  text-align: center;
  z-index: 211;
  font-size: var(--m-size-v2-font);
}

.m-timer-v2-panel {
  width: 100%;
}

.m-timer-v2-time-selector {
  display: flex;
  max-height: 200px;
  overflow: hidden;
}

.m-timer-v2-time-column {
  flex: 1;
  overflow-y: auto;
  border-right: 1px solid var(--m-color-v2-border);
}

.m-timer-v2-time-column:last-child {
  border-right: none;
}

.m-timer-v2-time-title {
  padding: calc(var(--m-size-v2-padding) / 2) calc(var(--m-size-v2-padding) / 1);
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  text-align: center;
  border-bottom: 1px solid var(--m-color-v2-border);
  font-size: var(--m-size-v2-font);
}

.m-timer-v2-time-list {
  max-height: 160px;
  overflow-y: auto;
  font-size: var(--m-size-v2-font);

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}

.m-timer-v2-time-item {
  padding: calc(var(--m-size-v2-padding) / 2) calc(var(--m-size-v2-padding) / 1);
  text-align: center;
  cursor: pointer;
  transition: background-color var(--m-animation-time, 0.2s);
}

.m-timer-v2-time-item:hover {
  background-color: var(--m-color-v2-info-light-9);
}

.m-timer-v2-time-item.selected {
  background-color: var(--m-color-v2-primary);
  color: var(--m-color-v2-white);
  font-weight: 500;
}

.m-timer-v2-panel-footer {
  display: flex;
  justify-content: space-between;
  padding: var(--m-size-v2-padding);
  border-top: 1px solid var(--m-color-v2-border);
}
</style>
