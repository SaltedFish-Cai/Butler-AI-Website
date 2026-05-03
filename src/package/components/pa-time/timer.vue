<template>
  <div class="pa-timer" ref="timerRef" :class="[props.class, { 'is-disabled': props.disabled }]" :style="{ ...props.style }">
    <pa-popover
      ref="popoverRef"
      @change="handlePopoverChange"
      :disabled="props.disabled"
      :popoverWidth="240"
      class="pa-timer-popover"
      :teleportTo="timerRef"
      :targetClose="false"
    >
      <template #reference>
        <!-- 时间输入框 -->
        <div class="pa-timer-input" :class="[isFocus ? 'is-focus' : '']">
          <!-- 小时 -->
          <input
            class="pa-timer-input-inner"
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
            class="pa-timer-input-inner"
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
            class="pa-timer-input-inner"
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
      <div class="pa-timer-panel">
        <div class="pa-timer-panel-content">
          <div class="pa-timer-time-selector">
            <div class="pa-timer-time-column">
              <div class="pa-timer-time-title">时</div>
              <div class="pa-timer-time-list">
                <div
                  v-for="h in 24"
                  :key="h"
                  :class="['pa-timer-time-item', { selected: hours === formatTimeUnit(h - 1) }]"
                  @click="selectHour(h - 1)"
                >
                  {{ formatTimeUnit(h - 1) }}
                </div>
              </div>
            </div>
            <div class="pa-timer-time-column">
              <div class="pa-timer-time-title">分</div>
              <div class="pa-timer-time-list">
                <div
                  v-for="m in 60"
                  :key="m"
                  :class="['pa-timer-time-item', { selected: minutes === formatTimeUnit(m - 1) }]"
                  @click="selectMinute(m - 1)"
                >
                  {{ formatTimeUnit(m - 1) }}
                </div>
              </div>
            </div>
            <div class="pa-timer-time-column">
              <div class="pa-timer-time-title">秒</div>
              <div class="pa-timer-time-list">
                <div
                  v-for="s in 60"
                  :key="s"
                  :class="['pa-timer-time-item', { selected: seconds === formatTimeUnit(s - 1) }]"
                  @click="selectSecond(s - 1)"
                >
                  {{ formatTimeUnit(s - 1) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pa-timer-panel-footer">
          <pa-button @click="setCurrentTime('start')" is="go" type="default">开始</pa-button>
          <pa-button @click="setCurrentTime('current')" is="go" type="default">当前</pa-button>
          <pa-button @click="setCurrentTime('end')" is="go" type="default">结束</pa-button>
        </div>
      </div>
    </pa-popover>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { randChar } from "../tools/rand-char";
import { ComponentProps } from "./types";

/**
 * 组件引用
 * @description DOM 元素引用
 */
const popoverRef = ref();
const hourInputRef = ref();
const minuteInputRef = ref();
const secondInputRef = ref();
const isFocus = ref(false);
const currentFocus = ref<"hour" | "minute" | "second">("hour");

const props = withDefaults(defineProps<ComponentProps>(), {
  id: randChar(),
  modelValue: "",
  clearable: true,
  autofocus: false,
  controls: true
});

const timerRef = ref();

/**
 * 时间值
 * @description 时分秒输入值
 */
const hours = ref("");
const minutes = ref("");
const seconds = ref("");

const emits = defineEmits(["update:modelValue", "change", "blur", "focus"]);

/**
 * 计算完整的时间字符串
 * @returns string 格式化的时间字符串
 * @description 组合时分秒为完整时间字符串
 */
const timeValue = computed(() => {
  if (!hours.value && !minutes.value && !seconds.value) {
    return "";
  }
  return `${hours.value || "00"}:${minutes.value || "00"}:${seconds.value || "00"}`;
});

/**
 * 格式化时间单位（补零）
 * @param value - 数值
 * @returns string 补零后的字符串
 * @description 将数字格式化为两位字符串
 */
function formatTimeUnit(value: number): string {
  return value.toString().padStart(2, "0");
}

/**
 * 验证时间输入
 * @param value - 输入值
 * @param type - | `"minute"` | `"second"` 时间类型
 * @returns boolean 是否有效
 * @description 验证输入值是否在有效范围内
 */
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

/**
 * 处理时间输入
 * @param event - 输入事件
 * @param type - | `"minute"` | `"second"` 时间类型
 * @description 处理时间输入框的输入事件
 */
function handleTimeInput(event: Event, type: "hour" | "minute" | "second") {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/[^0-9]/g, "");

  if (value.length > 2) {
    value = value.slice(0, 2);
  }

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

  updateTimeValue();
}

function handlePopoverChange(data) {
  isFocus.value = data;
}

/**
 * 处理键盘事件
 * @param event - 键盘事件
 * @param type - | `"minute"` | `"second"` 时间类型
 * @description 处理时间输入框的键盘事件
 */
function handleTimeKeyDown(event: KeyboardEvent, type: "hour" | "minute" | "second") {
  if (!/[0-9]|Backspace|Delete|Tab|ArrowLeft|ArrowRight|ArrowUp|ArrowDown/.test(event.key)) {
    event.preventDefault();
    return;
  }

  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    adjustTimeValue(type, event.key === "ArrowUp" ? 1 : -1);
  }

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

/**
 * 调整时间值
 * @param type - | `"minute"` | `"second"` 时间类型
 * @param delta - 增量
 * @description 根据增量调整时间值
 */
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

/**
 * 更新时间值并触发事件
 * @description 更新绑定值并触发 change 事件
 */
function updateTimeValue() {
  emits("update:modelValue", timeValue.value);
  emits("change", { value: timeValue.value, oldValue: props.modelValue });
}

/**
 * 验证完整时间
 * @description 验证所有时间部分是否有效
 */
function validateTime() {
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

/**
 * 监听外部点击关闭面板
 * @param event - 点击事件
 * @description 处理面板外部点击
 */
function handleClickOutside(event: MouseEvent) {
  const panel = document.querySelector(".m-time-panel");
  const inputs = [hourInputRef.value, minuteInputRef.value, secondInputRef.value];

  if (panel && !panel.contains(event.target as Node) && !inputs.some(input => input?.contains(event.target as Node))) {
  }
}

/**
 * 初始化监听
 * @description 组件挂载时初始化事件监听
 */
onMounted(() => {
  document.addEventListener("click", handleClickOutside);

  if (props.modelValue) {
    const timeParts = (props.modelValue as string).split(":");
    if (timeParts.length >= 1) hours.value = timeParts[0];
    if (timeParts.length >= 2) minutes.value = timeParts[1];
    if (timeParts.length >= 3) seconds.value = timeParts[2];
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

/**
 * 处理焦点事件
 * @param type - | `"minute"` | `"second"` 焦点类型
 * @description 处理输入框获得焦点
 */
function handleFocus(type: "hour" | "minute" | "second") {
  currentFocus.value = type;
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
  emits("blur");
}

/**
 * 处理滚轮事件
 * @description 滚动调整时间值
 */
let lastWheelTime = 0;
let wheelDelta = 0;

function handleWheel(event: WheelEvent, type: "hour" | "minute" | "second") {
  event.preventDefault();

  const now = Date.now();
  if (now - lastWheelTime < 200) {
    return;
  }
  lastWheelTime = now;

  wheelDelta += event.deltaY;

  if (Math.abs(wheelDelta) >= 50) {
    const direction = wheelDelta > 0 ? -1 : 1;
    adjustTimeValue(type, direction);
    wheelDelta = 0;
  }
}

/**
 * 组件卸载时清理
 * @description 移除所有事件监听
 */
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
    const timeParts = (data as string).split(":");
    if (timeParts.length >= 1) hours.value = timeParts[0];
    if (timeParts.length >= 2) minutes.value = timeParts[1];
    if (timeParts.length >= 3) seconds.value = timeParts[2];
  },
  { immediate: true }
);
</script>

<style lang="scss">
.pa-timer {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  padding: calc(var(--pa-size-padding) / 3) calc(var(--pa-size-padding) / 1.2);
  color: var(--pa-color-default);
  font-size: var(--pa-size-font);
  border-radius: var(--pa-size-radius, 3px);
  line-height: 1.5715;
  background: none;
  border: 1px solid var(--pa-color-border);
  transition: all var(--pa-animation-time, 0.2s);
  outline: none;
  > .pa-popover > .pa-popover-content {
    padding: 0;
  }
  &:hover {
    border-color: var(--pa-color-primary);
  }
  &:has(> .pa-popover-reference > .is-focus) {
    border-color: var(--pa-color-primary);
    box-shadow: 0 0 0 2px var(--pa-color-primary-light-8);
    outline: 0;
  }
}

.pa-timer-popover {
  width: 100% !important;
}

.pa-timer.is-disabled {
  color: rgba(0, 0, 0, 0.25);
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  box-shadow: none;
  cursor: not-allowed;
  opacity: 1;
}

.pa-timer-input {
  display: flex;
  align-items: center;
  gap: 2px;
}

.pa-timer-input-inner {
  width: 24px;
  flex: 1;
  height: calc(var(--pa-size-height) - var(--pa-size-height) / 4);
  border: none;
  outline: none;
  background: transparent;
  text-align: center;
  z-index: 211;
  font-size: var(--pa-size-font);
}

.pa-timer-panel {
  width: 100%;
}

.pa-timer-time-selector {
  display: flex;
  max-height: 200px;
  overflow: hidden;
}

.pa-timer-time-column {
  flex: 1;
  overflow-y: auto;
  border-right: 1px solid var(--pa-color-border);
}

.pa-timer-time-column:last-child {
  border-right: none;
}

.pa-timer-time-title {
  padding: calc(var(--pa-size-padding) / 2) calc(var(--pa-size-padding) / 1);
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  text-align: center;
  border-bottom: 1px solid var(--pa-color-border);
  font-size: var(--pa-size-font);
}

.pa-timer-time-list {
  max-height: 160px;
  overflow-y: auto;
  font-size: var(--pa-size-font);

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}

.pa-timer-time-item {
  padding: calc(var(--pa-size-padding) / 2) calc(var(--pa-size-padding) / 1);
  text-align: center;
  cursor: pointer;
  transition: background-color var(--pa-animation-time, 0.2s);
}

.pa-timer-time-item:hover {
  background-color: var(--pa-color-info-light-9);
}

.pa-timer-time-item.selected {
  background-color: var(--pa-color-primary);
  color: var(--pa-color-white);
  font-weight: 500;
}

.pa-timer-panel-footer {
  display: flex;
  justify-content: space-between;
  padding: var(--pa-size-padding);
  border-top: 1px solid var(--pa-color-border);
}
</style>
