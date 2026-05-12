<template>
  <div class="m-date-picker-panel">
    <!-- 快捷选项 -->
    <div v-if="shortcuts && shortcuts.length > 0" class="m-date-picker-shortcuts">
      <div
        v-for="(shortcut, index) in shortcuts"
        :key="index"
        class="m-date-picker-shortcut-item"
        @click="handleShortcutClick(shortcut)"
      >
        {{ shortcut.text }}
      </div>
    </div>

    <!-- 主面板 -->
    <div class="m-date-picker-panel-main">
      <!-- 范围选择面板 -->
      <div v-if="isRange" class="m-date-picker-range-panel">
        <div class="m-date-picker-range-side">
          <!-- 日期选择器 -->
          <template v-if="isDate">
            <div class="m-date-picker-header">
              <button @click="prevYear('start')" class="m-date-picker-header-btn">«</button>
              <button @click="prevMonth('start')" class="m-date-picker-header-btn">‹</button>
              <span class="m-date-picker-header-label">{{ startPanelDate.format("YYYY年MM月") }}</span>
              <button @click="nextMonth('start')" :disabled="isSameMonth" class="m-date-picker-header-btn">›</button>
              <button @click="nextYear('start')" :disabled="isSameMonth" class="m-date-picker-header-btn">»</button>
            </div>
            <table class="m-date-table start" @wheel="e => handleWheel(e, 'start')">
              <thead>
                <tr>
                  <th v-for="day in weekDays" :key="day">{{ day }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(week, weekIndex) in startMonthWeeks" :key="weekIndex">
                  <td
                    v-for="(day, dayIndex) in week"
                    :key="dayIndex"
                    :class="getDayClass(day, 'start')"
                    @click="selectRangeDate(day, 'start')"
                  >
                    {{ day ? day.date() : "" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <!-- 时间选择器 -->
          <div v-if="isTime" class="m-date-picker-time-panel">
            <timer v-model="startTime" placeholder="HH:mm:ss" class="m-date-picker-time-input" />
          </div>
        </div>

        <div class="m-date-picker-range-side">
          <!-- 日期选择器 -->
          <template v-if="isDate">
            <div class="m-date-picker-header">
              <button @click="prevYear('end')" :disabled="isSameMonth" class="m-date-picker-header-btn">«</button>
              <button @click="prevMonth('end')" :disabled="isSameMonth" class="m-date-picker-header-btn">‹</button>
              <span class="m-date-picker-header-label">{{ endPanelDate.format("YYYY年MM月") }}</span>
              <button @click="nextMonth('end')" class="m-date-picker-header-btn">›</button>
              <button @click="nextYear('end')" class="m-date-picker-header-btn">»</button>
            </div>
            <table class="m-date-table end" @wheel="e => handleWheel(e, 'end')">
              <thead>
                <tr>
                  <th v-for="day in weekDays" :key="day">{{ day }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(week, weekIndex) in endMonthWeeks" :key="weekIndex">
                  <td
                    v-for="(day, dayIndex) in week"
                    :key="dayIndex"
                    :class="getDayClass(day, 'end')"
                    @click="selectRangeDate(day, 'end')"
                  >
                    {{ day ? day.date() : "" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <!-- 时间选择器 -->
          <div v-if="isTime" class="m-date-picker-time-panel">
            <timer v-model="endTime" placeholder="HH:mm:ss" class="m-date-picker-time-input" />
          </div>
        </div>
      </div>

      <!-- 单个日期选择面板 -->
      <template v-else>
        <!-- 日期选择器 -->
        <template v-if="isDate">
          <div class="m-date-picker-header">
            <button @click="prevYear()" class="m-date-picker-header-btn">«</button>
            <button @click="prevMonth()" class="m-date-picker-header-btn">‹</button>
            <span class="m-date-picker-header-label">{{ currentDate.format("YYYY年MM月") }}</span>
            <button @click="nextMonth()" class="m-date-picker-header-btn">›</button>
            <button @click="nextYear()" class="m-date-picker-header-btn">»</button>
          </div>
          <table class="m-date-table" @wheel="handleWheel">
            <thead>
              <tr>
                <th v-for="day in weekDays" :key="day">{{ day }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, weekIndex) in currentMonthWeeks" :key="weekIndex">
                <td v-for="(day, dayIndex) in week" :key="dayIndex" :class="getDayClass(day)" @click="selectDate(day)">
                  {{ day ? day.date() : "" }}
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <!-- 时间选择器 -->
        <div v-if="isTime" class="m-date-picker-time-panel">
          <timer v-model="selectedTime" placeholder="HH:mm:ss" class="m-date-picker-time-input" />
        </div>
      </template>

      <!-- 底部操作按钮 -->
      <div class="m-date-picker-footer">
        <pa-button @click="handleCancel" is="trash" type="default">清空</pa-button>
        <pa-button @click="confirmSelection" font="check_line" type="primary">确定</pa-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { computed, ref, watch } from "vue";
/**
 * 模块导入
 * @description 导入日期处理库
 */
import dayjs from "dayjs";
/**
 * 模块导入
 * @description 导入日期选择器类型定义
 */
import type { DatePickerShortcut, MDatePickerType } from "./type";
/**
 * 模块导入
 * @description 导入日期转换工具函数
 */
import { convertValue } from "./utils";
/**
 * 模块导入
 * @description 导入时间选择器组件
 */
import Timer from "./timer.vue";

/**
 * 组件属性
 * @description 组件的属性对象
 */
const props = withDefaults(
  defineProps<{
    modelValue?: any;
    type?: MDatePickerType;
    valueType?: "date" | "dayjs" | "string";
    shortcuts?: DatePickerShortcut[];
    disabledDate?: (date: Date) => boolean;
    cellClassName?: (date: Date) => string;
  }>(),
  {
    type: "date-picker"
  }
);

/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "change", value: any): void;
}>();

/**
 * 是否为范围选择
 * @description 判断当前类型是否为范围选择模式
 */
const isRange = computed(() => {
  return props.type.endsWith("-group");
});
/**
 * 是否为时间选择
 * @description 判断当前类型是否为时间选择模式
 */
const isTime = computed(() => {
  return props.type.includes("time");
});
/**
 * 是否为日期选择
 * @description 判断当前类型是否为日期选择模式
 */
const isDate = computed(() => {
  return props.type.includes("date-");
});

/**
 * 星期标签
 * @description 星期几的显示标签
 */
const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
/**
 * 当前日期
 * @description 当前面板显示的日期
 */
const currentDate = ref(dayjs());
/**
 * 起始面板日期
 * @description 范围选择起始面板日期
 */
const startPanelDate = ref(dayjs());
/**
 * 结束面板日期
 * @description 范围选择结束面板日期
 */
const endPanelDate = ref(dayjs().add(1, "month"));
/**
 * 选中日期
 * @description 当前选中的日期
 */
const selectedDate = ref<dayjs.Dayjs | null>(null);
/**
 * 选中范围
 * @description 当前选中的日期范围
 */
const selectedRange = ref<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
/**
 * 选中时间
 * @description 当前选中的时间
 */
const selectedTime = ref("");
/**
 * 起始时间
 * @description 范围选择起始时间
 */
const startTime = ref("");
/**
 * 结束时间
 * @description 范围选择结束时间
 */
const endTime = ref("");

/**
 * 当前月份周数据
 * @description 当前月份日期网格数据
 */
const currentMonthWeeks = computed(() => {
  return generateMonthWeeks(currentDate.value);
});

/**
 * 起始面板月份周数据
 * @description 起始面板月份日期网格数据
 */
const startMonthWeeks = computed(() => {
  return generateMonthWeeks(startPanelDate.value);
});

/**
 * 结束面板月份周数据
 * @description 结束面板月份日期网格数据
 */
const endMonthWeeks = computed(() => {
  return generateMonthWeeks(endPanelDate.value);
});

/**
 * 是否同月
 * @description 判断起始和结束面板是否为同月
 */
const isSameMonth = computed(() => {
  return endPanelDate.value.unix() <= startPanelDate.value.unix();
});

function generateMonthWeeks(date: dayjs.Dayjs): (dayjs.Dayjs | null)[][] {
  const weeks: (dayjs.Dayjs | null)[][] = [];
  const firstDay = date.startOf("month");
  const lastDay = date.endOf("month");
  const startDay = firstDay.startOf("week");
  const endDay = lastDay.endOf("week");

  let currentDay = startDay;

  while (currentDay.isBefore(endDay) || currentDay.isSame(endDay)) {
    if (weeks.length === 0 || weeks[weeks.length - 1].length === 7) {
      weeks.push([]);
    }

    if (currentDay.isBefore(firstDay) || currentDay.isAfter(lastDay)) {
      weeks[weeks.length - 1].push(null);
    } else {
      weeks[weeks.length - 1].push(currentDay);
    }

    currentDay = currentDay.add(1, "day");
  }

  return weeks;
}

function getDayClass(day: dayjs.Dayjs | null, panel?: "end" | "start"): string[] {
  const classes: string[] = [];

  if (!day) {
    return classes;
  }

  /**
   * 当前月份
   * @description 判断当前日期是否在显示月份中
   */
  if (panel === "start") {
    if (day.isSame(startPanelDate.value, "month")) {
      classes.push("current-month");
    }
  } else if (panel === "end") {
    if (day.isSame(endPanelDate.value, "month")) {
      classes.push("current-month");
    }
  } else if (day.isSame(currentDate.value, "month")) {
    classes.push("current-month");
  }

  /**
   * 今天
   * @description 判断是否为今天的日期
   */
  if (day.isSame(dayjs(), "day")) {
    classes.push("today");
  }

  /**
   * 选中状态
   * @description 根据范围或单选模式添加选中状态类
   */
  if (isRange.value) {
    if (
      selectedRange.value[0] &&
      day.isSame(selectedRange.value[0], "day") &&
      selectedRange.value[1] &&
      day.isSame(selectedRange.value[1], "day")
    ) {
      classes.push("selected-start selected-end");
    } else if (selectedRange.value[0] && day.isSame(selectedRange.value[0], "day")) {
      classes.push("selected-start");
    } else if (selectedRange.value[1] && day.isSame(selectedRange.value[1], "day")) {
      classes.push("selected-end");
    } else if (
      selectedRange.value[0] &&
      selectedRange.value[1] &&
      day.isAfter(selectedRange.value[0]) &&
      day.isBefore(selectedRange.value[1])
    ) {
      classes.push("in-range");
    }
  } else if (selectedDate.value && day.isSame(selectedDate.value, "day")) {
    classes.push("selected");
  }

  /**
   * 禁用日期
   * @description 根据禁用日期函数添加禁用状态类
   */
  if (props.disabledDate && props.disabledDate(day.toDate())) {
    classes.push("disabled");
  }

  /**
   * 自定义类名
   * @description 添加用户自定义的单元格类名
   */
  if (props.cellClassName) {
    const customClass = props.cellClassName(day.toDate());
    if (customClass) {
      classes.push(customClass);
    }
  }

  return classes;
}

/**
 * 选择日期
 * @param day - 日期对象
 * @returns void
 * @description 处理日期选择
 */
function selectDate(day: dayjs.Dayjs | null): void {
  if (!day || (props.disabledDate && props.disabledDate(day.toDate())) || isRange.value) {
    return;
  }
  selectedDate.value = day;

  if (!isTime.value) {
    confirmSelection();
  }
}

/**
 * 选择范围日期
 * @param day - 日期对象
 * @param position - 位置（start/end）
 * @returns void
 * @description 处理范围选择日期
 */
function selectRangeDate(day: dayjs.Dayjs | null, position: "end" | "start"): void {
  if (!day || (props.disabledDate && props.disabledDate(day.toDate()))) {
    return;
  }

  if (position === "start") {
    if (!selectedRange.value[1] || day.isBefore(selectedRange.value[1])) {
      selectedRange.value[0] = day;
    } else {
      selectedRange.value[0] = day;
      selectedRange.value[1] = day;
    }
  } else {
    if (!selectedRange.value[0] || day.isAfter(selectedRange.value[0])) {
      selectedRange.value[1] = day;
    } else {
      selectedRange.value[0] = day;
      selectedRange.value[1] = day;
    }
  }

  if (selectedRange.value[0] && selectedRange.value[1] && !isTime.value && !isRange.value) {
    confirmSelection();
  }
}

/**
 * 处理快捷选项点击
 * @param shortcut - 快捷选项
 * @returns void
 * @description 处理快捷选项点击事件
 */
function handleShortcutClick(shortcut: DatePickerShortcut): void {
  let value: [dayjs.Dayjs, dayjs.Dayjs];

  if (typeof shortcut.value === "function") {
    const dateRange = shortcut.value();
    value = [dayjs(dateRange[0]), dayjs(dateRange[1])];
  } else {
    value = [dayjs(shortcut.value[0]), dayjs(shortcut.value[1])];
  }

  selectedRange.value = value;
  selectedDate.value = value[0];
  confirmSelection();
}

/**
 * 确认选择
 * @description 确认当前选中的日期并触发事件
 */
function confirmSelection() {
  let value: any = null;

  if (isRange.value) {
    if (selectedRange.value[0] && selectedRange.value[1]) {
      let startDate = selectedRange.value[0];
      let endDate = selectedRange.value[1];

      /* 处理时间：如果启用时间选择，处理时间部分 */
      if (isTime.value) {
        if (startTime.value) {
          const [hours, minutes, seconds] = startTime.value.split(":");
          startDate = startDate
            .hour(parseInt(hours))
            .minute(parseInt(minutes))
            .second(seconds ? parseInt(seconds) : 0);
        }
        if (endTime.value) {
          const [hours, minutes, seconds] = endTime.value.split(":");
          endDate = endDate
            .hour(parseInt(hours))
            .minute(parseInt(minutes))
            .second(seconds ? parseInt(seconds) : 0);
        }
      }

      value = [convertValue(props.type, startDate), convertValue(props.type, endDate)];
    }
  } else {
    if (selectedDate.value) {
      let date = selectedDate.value;

      /**
       * 处理时间
       * @description 如果启用时间选择，处理时间部分
       */
      if (isTime.value && selectedTime.value) {
        const [hours, minutes, seconds] = selectedTime.value.split(":");
        date = date
          .hour(parseInt(hours))
          .minute(parseInt(minutes))
          .second(seconds ? parseInt(seconds) : 0);
      }

      value = convertValue(props.type, date);
    }
  }
  emit("update:modelValue", value);
  emit("change", value);
}

/**
 * 处理取消
 * @returns void
 * @description 取消当前选择
 */
function handleCancel(): void {
  emit("update:modelValue", isRange.value ? [] : "");
  emit("change", isRange.value ? [] : "");
}

/**
 * 导航控制
 * @description 上一年导航函数
 */
/**
 * 上一年
 * @param panel - 面板位置
 * @returns void
 * @description 上一年导航
 */
function prevYear(panel?: "end" | "start"): void {
  if (panel === "start") {
    startPanelDate.value = startPanelDate.value.subtract(1, "year");
  } else if (panel === "end") {
    endPanelDate.value =
      endPanelDate.value.subtract(1, "year").unix() >= startPanelDate.value.unix()
        ? endPanelDate.value.subtract(1, "year")
        : startPanelDate.value;
  } else {
    currentDate.value = currentDate.value.subtract(1, "year");
  }
}

/**
 * 下一年
 * @param panel - 面板位置
 * @returns void
 * @description 下一年导航
 */
function nextYear(panel?: "end" | "start"): void {
  if (panel === "start") {
    startPanelDate.value =
      startPanelDate.value.add(1, "year").unix() <= endPanelDate.value.unix()
        ? startPanelDate.value.add(1, "year")
        : endPanelDate.value;
  } else if (panel === "end") {
    endPanelDate.value = endPanelDate.value.add(1, "year");
  } else {
    currentDate.value = currentDate.value.add(1, "year");
  }
}

/**
 * 上一个月
 * @param panel - 面板位置
 * @returns void
 * @description 上一个月导航
 */
function prevMonth(panel?: "end" | "start") {
  if (panel === "start") {
    startPanelDate.value = startPanelDate.value.subtract(1, "month");
  } else if (panel === "end") {
    endPanelDate.value =
      endPanelDate.value.subtract(1, "month").unix() >= startPanelDate.value.unix()
        ? endPanelDate.value.subtract(1, "month")
        : startPanelDate.value;
  } else {
    currentDate.value = currentDate.value.subtract(1, "month");
  }
}

/**
 * 下一个月
 * @param panel - 面板位置
 * @returns void
 * @description 下一个月导航
 */
function nextMonth(panel?: "end" | "start"): void {
  if (panel === "start") {
    startPanelDate.value = startPanelDate.value =
      startPanelDate.value.add(1, "month").unix() <= endPanelDate.value.unix()
        ? startPanelDate.value.add(1, "month")
        : endPanelDate.value;
  } else if (panel === "end") {
    endPanelDate.value = endPanelDate.value.add(1, "month");
  } else {
    currentDate.value = currentDate.value.add(1, "month");
  }
}

/**
 * 处理表格滚轮事件
 * @description 滚动切换月份
 */
/**
 * 处理滚轮事件
 * @param event - 滚轮事件
 * @param panel - 面板位置
 * @returns void
 * @description 处理滚轮切换月份
 */
let lastWheelTime = 0;

/**
 * 滚轮增量
 * @description 记录滚轮累计增量
 */
let wheelDelta = 0;

/**
 * 滚轮处理函数
 * @param event - 滚轮事件
 * @param panel - 面板位置
 * @returns void
 * @description 处理滚轮事件用于月份切换
 */
function handleWheel(event: WheelEvent, panel?: "end" | "start"): void {
  event.preventDefault();

  const now = Date.now();
  wheelDelta += Math.abs(event.deltaY);

  if (wheelDelta < 50) {
    return;
  }

  if (now - lastWheelTime < 100) {
    return;
  }

  wheelDelta = 0;
  lastWheelTime = now;

  if (event.deltaY < 0) {
    prevMonth(panel);
  } else {
    nextMonth(panel);
  }
}

/**
 * 初始化值
 * @description 监听外部值变化并初始化内部状态
 */
/**
 * 监听外部值变化
 * @description 同步外部传入的值到内部状态
 */
watch(
  () => props.modelValue,
  newValue => {
    let exDate = "";
    if (props.type == "time-picker" || props.type == "time-picker-group") {
      exDate = "2025-01-01 ";
    }
    if (isRange.value && Array.isArray(newValue) && newValue.length) {
      selectedRange.value = [null, null];
      if (newValue[0]) {
        const _newVal = exDate + newValue[0];
        selectedRange.value[0] = dayjs(_newVal);
        startPanelDate.value = dayjs(_newVal);
        startTime.value = _newVal.split(" ")[1];
      }
      if (newValue[1]) {
        const _newVal = exDate + newValue[1];
        selectedRange.value[1] = dayjs(_newVal);
        endPanelDate.value = dayjs(_newVal);
        endTime.value = _newVal.split(" ")[1];
      }
    } else if (!!newValue && !Array.isArray(newValue)) {
      const _newVal = exDate + newValue;
      selectedDate.value = dayjs(_newVal);
      currentDate.value = dayjs(_newVal);
      selectedTime.value = _newVal.split(" ")[1];
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.m-date-picker-panel {
  display: flex;

  &.has-time {
    min-width: 400px;
  }
}

.m-date-picker-shortcuts {
  width: 120px;
  font-size: var(--pa-size-font);
  border-right: 1px solid var(--pa-color-border);
}

.m-date-picker-shortcut-item {
  padding: calc(var(--pa-size-padding) / 2) calc(var(--pa-size-padding) / 1);
  cursor: pointer;

  &:hover {
    background-color: var(--pa-color-info-light-9);
  }
}

.m-date-picker-panel-main {
  flex: 1;
  min-width: 0;
}

.m-date-picker-range-panel {
  display: flex;
}

.m-date-picker-range-side {
  flex: 1;
  padding: calc(var(--pa-size-padding) / 1.5);

  &:first-child {
    padding-left: 0;
    border-right: 1px solid var(--pa-color-border);
  }
  &:last-child {
    padding-right: 0;
  }
}

.m-date-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--pa-size-font);
  margin-bottom: var(--pa-size-padding);
}

.m-date-picker-header-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: calc(var(--pa-size-padding) / 2) calc(var(--pa-size-padding) / 1);

  &:hover {
    background-color: var(--pa-color-info-light-9);
  }
}

.m-date-picker-header-label {
  font-weight: 500;
}

.m-date-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--pa-size-font);

  th,
  td {
    text-align: center;
    padding: var(--pa-size-padding) 0;
  }

  th {
    font-weight: normal;
    color: var(--pa-color-font);
  }

  td {
    cursor: pointer;

    &:hover {
      background-color: var(--pa-color-info-light-9);
    }

    &.current-month {
      border-radius: 3px;
      color: var(--pa-color-font);
      transition: all var(--pa-animation-time, 0.2s);
    }

    &.today {
      color: var(--pa-color-primary);
      font-weight: bold;
    }

    &.selected,
    &.selected-start,
    &.selected-end {
      background-color: var(--pa-color-primary);
      color: var(--pa-color-white);
    }

    &.in-range {
      border-radius: 0;
      background-color: var(--pa-color-scrollbar);
    }

    &.disabled {
      color: var(--pa-color-info-light-4);
      cursor: not-allowed;

      &:hover {
        background-color: transparent;
      }
    }
  }
}

.m-date-table.start,
.m-date-table.end {
  .current-month.selected-start {
    border-radius: 0;
    border-top-left-radius: calc(var(--pa-size-radius, 3px) * 2);
    border-bottom-left-radius: calc(var(--pa-size-radius, 3px) * 2);
  }

  .current-month.selected-end {
    border-radius: 0;
    border-top-right-radius: calc(var(--pa-size-radius, 3px) * 2);
    border-bottom-right-radius: calc(var(--pa-size-radius, 3px) * 2);
  }
  .current-month.selected-start.selected-end {
    border-radius: var(--pa-size-radius, 3px);
  }
}

.m-date-picker-time-panel {
  padding: var(--pa-size-padding) 0;
}

.m-date-picker-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: calc(var(--pa-size-padding) / 1.5);
  border-top: 1px solid var(--pa-color-border);
}
</style>
