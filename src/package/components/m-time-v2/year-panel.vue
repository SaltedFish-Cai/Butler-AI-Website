<template>
  <div class="m-year-month-picker-panel">
    <!-- 快捷选项 -->
    <div v-if="shortcuts && shortcuts.length > 0" class="m-year-month-picker-shortcuts">
      <div
        v-for="(shortcut, index) in shortcuts"
        :key="index"
        class="m-year-month-picker-shortcut-item"
        @click="handleShortcutClick(shortcut)"
      >
        {{ shortcut.text }}
      </div>
    </div>

    <!-- 主面板 -->
    <div class="m-year-month-picker-panel-main">
      <!-- 范围选择面板 -->
      <div v-if="isRange" class="m-year-month-picker-range-panel">
        <div class="m-year-month-picker-range-side">
          <div class="m-year-month-picker-header">
            <button v-if="isYear" @click="prevYear('start')" class="m-year-month-picker-header-btn">«</button>
            <button v-else @click="prevMouth('start')" class="m-year-month-picker-header-btn">«</button>
            <span class="m-year-month-picker-header-label">{{ getYearRangeLabel(startPanelDate, "start") }}</span>
            <button v-if="!isYear" @click="nextMouth('start')" :disabled="isSameYear" class="m-year-month-picker-header-btn">
              »
            </button>
            <button v-else @click="nextYear('start')" :disabled="isSameYear" class="m-year-month-picker-header-btn">»</button>
          </div>

          <!-- 年份选择网格 -->
          <div v-if="isYear" class="m-year-picker-grid" @wheel="e => handleWheel(e, 'year', 'start')">
            <div v-for="year in startYears" :key="year" :class="getYearClass(year, 'start')" @click="selectYear(year, 'start')">
              {{ year }}
            </div>
          </div>

          <!-- 月份选择网格 -->
          <div v-else class="m-month-picker-grid" @wheel="e => handleWheel(e, 'month', 'start')">
            <div
              v-for="month in months"
              :key="month.value"
              :class="getMonthClass(month.value, 'start')"
              @click="selectMonth(month.value, 'start')"
            >
              {{ month.text }}
            </div>
          </div>
        </div>

        <div class="m-year-month-picker-range-side">
          <div class="m-year-month-picker-header">
            <button v-if="isYear" @click="prevYear('end')" :disabled="isSameYear" class="m-year-month-picker-header-btn">
              «
            </button>
            <button v-else @click="prevMouth('end')" :disabled="isSameYear" class="m-year-month-picker-header-btn">«</button>
            <span class="m-year-month-picker-header-label">{{ getYearRangeLabel(endPanelDate, "end") }}</span>
            <button v-if="!isYear" @click="nextMouth('end')" class="m-year-month-picker-header-btn">»</button>
            <button v-else @click="nextYear('end')" class="m-year-month-picker-header-btn">»</button>
          </div>

          <!-- 年份选择网格 -->
          <div v-if="isYear" class="m-year-picker-grid" @wheel="e => handleWheel(e, 'year', 'end')">
            <div v-for="year in endYears" :key="year" :class="getYearClass(year, 'end')" @click="selectYear(year, 'end')">
              {{ year }}
            </div>
          </div>

          <!-- 月份选择网格 -->
          <div v-else class="m-month-picker-grid" @wheel="e => handleWheel(e, 'month', 'end')">
            <div
              v-for="month in months"
              :key="month.value"
              :class="getMonthClass(month.value, 'end')"
              @click="selectMonth(month.value, 'end')"
            >
              {{ month.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- 单个年月选择面板 -->
      <template v-else>
        <div class="m-year-month-picker-header">
          <button v-if="isYear" @click="prevYear()" class="m-year-month-picker-header-btn">«</button>
          <button v-else @click="prevMouth()" class="m-year-month-picker-header-btn">«</button>
          <span class="m-year-month-picker-header-label">{{ getYearRangeLabel(currentDate) }}</span>
          <button v-if="!isYear" @click="nextMouth()" class="m-year-month-picker-header-btn">»</button>
          <button v-else @click="nextYear()" class="m-year-month-picker-header-btn">»</button>
        </div>

        <!-- 年份选择网格 -->
        <div v-if="isYear" class="m-year-picker-grid" @wheel="e => handleWheel(e, 'year')">
          <div v-for="year in currentYears" :key="year" :class="getYearClass(year)" @click="selectYear(year)">{{ year }}</div>
        </div>

        <!-- 月份选择网格 -->
        <div v-else class="m-month-picker-grid" @wheel="e => handleWheel(e, 'month')">
          <div v-for="month in months" :key="month.value" :class="getMonthClass(month.value)" @click="selectMonth(month.value)">
            {{ month.text }}
          </div>
        </div>
      </template>

      <!-- 底部操作按钮 -->
      <div class="m-year-month-picker-footer">
        <m-button-v2 @click="handleCancel" is="trash" type="default">清空</m-button-v2>
        <m-button-v2 @click="confirmSelection" font="check_line" type="primary">确定</m-button-v2>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import dayjs from "dayjs";
import type { DatePickerShortcut, MDatePickerType } from "./type";

// 类型转换函数
function convertValue(type: string, date: dayjs.Dayjs): string {
  switch (type) {
    case "year":
    case "yearrange":
      return date.format("YYYY");
    case "month":
    case "monthrange":
      return date.format("YYYY-MM");
    case "datetime":
    case "datetimerange":
      return date.format("YYYY-MM-DD HH:mm:ss");
    case "daterange":
    default:
      return date.format("YYYY-MM-DD");
  }
}

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
    type: "year-picker"
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "change", value: any): void;
}>();

const isRange = computed(() => {
  return props.type.endsWith("-group");
});
const isYear = computed(() => {
  return props.type.includes("year");
});
const isMonth = computed(() => {
  return props.type.includes("month");
});

// 计算属性 - 当前显示的年份网格
// const yearGrid = computed(() => {
//   if (isRange.value) {
//     return {
//       start: generateYearGrid(getStartYear(startPanelDate.value)),
//       end: generateYearGrid(getStartYear(endPanelDate.value))
//     };
//   } else {
//     return generateYearGrid(getStartYear(currentDate.value));
//   }
// });

// 计算属性 - 年份范围标签
// const yearRangeLabel = computed(() => {
//   if (isRange.value) {
//     return {
//       start: `${getStartYear(startPanelDate.value)} - ${getStartYear(startPanelDate.value) + 11}`,
//       end: `${getStartYear(endPanelDate.value)} - ${getStartYear(endPanelDate.value) + 11}`
//     };
//   } else {
//     return `${getStartYear(currentDate.value)} - ${getStartYear(currentDate.value) + 11}`;
//   }
// });

// 月份数据
const months = [
  { value: 1, text: "1月" },
  { value: 2, text: "2月" },
  { value: 3, text: "3月" },
  { value: 4, text: "4月" },
  { value: 5, text: "5月" },
  { value: 6, text: "6月" },
  { value: 7, text: "7月" },
  { value: 8, text: "8月" },
  { value: 9, text: "9月" },
  { value: 10, text: "10月" },
  { value: 11, text: "11月" },
  { value: 12, text: "12月" }
];

// 生成年份网格
// function generateYearGrid(startYear: number): number[][] {
//   const grid: number[][] = [];
//   // 每页显示12个年份，3行4列
//   const yearsPerPage = 12;

//   for (let i = 0; i < yearsPerPage; i += 4) {
//     grid.push([startYear + i, startYear + i + 1, startYear + i + 2, startYear + i + 3]);
//   }

//   return grid;
// }

// # 获取年份显示范围的开始年份
// function getStartYear(date: dayjs.Dayjs): number {
//   // 以当前年份为中心，显示前后几年的范围
//   const year = date.year();
//   return Math.floor(year / 10) * 10;
// }

// 日期引用
const currentDate = ref(dayjs());
const startPanelDate = ref(dayjs());
const endPanelDate = ref(dayjs().add(1, "year"));

// 选中值
const selectedYear = ref<number | null>(null);
const selectedMonth = ref<number | null>(null);
const selectedRangeYears = ref<[number | null, number | null]>([null, null]);
const selectedRangeMonths = ref<[number | null, number | null]>([null, null]);

// 计算属性：当前显示的年份范围（12个年份）
const currentYears = computed(() => {
  const years: number[] = [];
  const startYear = Math.floor(currentDate.value.year() / 10) * 10;
  for (let i = 0; i < 12; i++) {
    years.push(startYear + i);
  }
  return years;
});

const startYears = computed(() => {
  const years: number[] = [];
  const startYear = Math.floor(startPanelDate.value.year() / 10) * 10;
  for (let i = 0; i < 12; i++) {
    years.push(startYear + i);
  }
  return years;
});

const endYears = computed(() => {
  const years: number[] = [];
  const startYear = Math.floor(endPanelDate.value.year() / 10) * 10;
  for (let i = 0; i < 12; i++) {
    years.push(startYear + i);
  }
  return years;
});

const isSameYear = computed(() => {
  return endPanelDate.value.year() <= startPanelDate.value.year();
});

// # 获取年份范围标签
function getYearRangeLabel(date: dayjs.Dayjs, position?: "end" | "start"): string {
  const year = date.year();
  const startYear = Math.floor(year / 10) * 10;
  const endYear = startYear + 11;

  if (isYear.value) {
    return `${startYear} - ${endYear}`;
  }

  if (position === "start") {
    if (isYear.value) return `${startYear}`;
    else return `${year}`;
  } else if (position === "end") {
    if (isYear.value) return `${endYear}`;
    else return `${year}`;
  }

  return `${year}`;
}

// # 选择年份
function selectYear(year: number, position?: "end" | "start") {
  // 检查是否禁用
  const date = dayjs().year(year).month(0).date(1);
  if (props.disabledDate && props.disabledDate(date.toDate())) {
    return;
  }

  if (isRange.value && position) {
    // 范围选择
    if (position === "start") {
      if (selectedRangeYears.value[1] && year > selectedRangeYears.value[1]) {
        selectedRangeYears.value[0] = year;
        selectedRangeMonths.value[0] = null; // 重置月份选择
        selectedRangeYears.value[1] = year;
        selectedRangeMonths.value[1] = null; // 重置月份选择
      } else {
        selectedRangeYears.value[0] = year;
        selectedRangeMonths.value[0] = null; // 重置月份选择
      }

      // startPanelDate.value = startPanelDate.value.year(year);
    } else {
      if (selectedRangeYears.value[0] && year < selectedRangeYears.value[0]) {
        selectedRangeYears.value[0] = year;
        selectedRangeMonths.value[0] = null; // 重置月份选择
        selectedRangeYears.value[1] = year;
        selectedRangeMonths.value[1] = null; // 重置月份选择
      } else {
        selectedRangeYears.value[1] = year;
        selectedRangeMonths.value[1] = null; // 重置月份选择
      }
      // endPanelDate.value = endPanelDate.value.year(year);
    }
  } else {
    // 单个选择
    selectedYear.value = year;
    selectedMonth.value = null; // 重置月份选择
    currentDate.value = currentDate.value.year(year);

    // 如果启用了月份选择器，则显示月份面板
    if (!isRange.value) {
      // 如果不显示月份选择器，直接确认选择
      confirmSelection();
    }
  }
}

// # 选择月份
function selectMonth(month: number, position?: "end" | "start") {
  // 检查是否禁用
  const year =
    isRange.value && position
      ? position === "start"
        ? selectedRangeYears.value[0]
        : selectedRangeYears.value[1]
      : selectedYear.value;

  if (year === null) return;

  const date = dayjs()
    .year(year)
    .month(month - 1)
    .date(1);
  if (props.disabledDate && props.disabledDate(date.toDate())) {
    return;
  }

  if (isRange.value && position) {
    // 范围选择
    if (position === "start") {
      if (
        selectedRangeMonths.value[1] &&
        selectedRangeYears.value[0] == selectedRangeYears.value[1] &&
        month > selectedRangeMonths.value[1]
      ) {
        selectedRangeYears.value[0] = startPanelDate.value.year();
        selectedRangeMonths.value[0] = month;
        selectedRangeYears.value[1] = startPanelDate.value.year();
        selectedRangeMonths.value[1] = month;
      } else {
        selectedRangeYears.value[0] = startPanelDate.value.year();
        selectedRangeMonths.value[0] = month;
        startPanelDate.value = startPanelDate.value.month(month - 1);
      }
    } else {
      if (
        selectedRangeMonths.value[0] &&
        selectedRangeYears.value[0] == selectedRangeYears.value[1] &&
        month < selectedRangeMonths.value[0]
      ) {
        selectedRangeYears.value[0] = startPanelDate.value.year();
        selectedRangeMonths.value[0] = month;
        selectedRangeYears.value[1] = startPanelDate.value.year();
        selectedRangeMonths.value[1] = month;
      } else {
        selectedRangeYears.value[1] = endPanelDate.value.year();
        selectedRangeMonths.value[1] = month;
        endPanelDate.value = endPanelDate.value.month(month - 1);
      }
    }
  } else {
    // 单个选择
    selectedYear.value = currentDate.value.year();
    selectedMonth.value = month;
    currentDate.value = currentDate.value.month(month - 1);

    // 确认选择
    confirmSelection();
  }
}

// # 获取年份单元格的类名
function getYearClass(year: number, position?: "end" | "start"): string[] {
  const classes: string[] = ["year-cell"];
  const date = dayjs().year(year).month(0).date(1);

  // 当前显示范围内的年份
  if (isRange.value && position) {
    const panelDate = position === "start" ? startPanelDate.value : endPanelDate.value;
    const startYear = Math.floor(panelDate.year() / 10) * 10;
    if (year >= startYear && year < startYear + 12) {
      classes.push("current-decade");
    }
  } else {
    const startYear = Math.floor(currentDate.value.year() / 10) * 10;
    if (year >= startYear && year < startYear + 12) {
      classes.push("current-decade");
    }
  }

  // 今年
  if (year === dayjs().year()) {
    classes.push("this-year");
  }

  // 选中状态
  if (isRange.value && position) {
    if (
      selectedRangeYears.value[0] &&
      year == selectedRangeYears.value[0] &&
      selectedRangeYears.value[1] &&
      year == selectedRangeYears.value[1]
    ) {
      classes.push("selected-start selected-end");
    } else if (selectedRangeYears.value[0] === year) {
      classes.push("selected-start");
    } else if (selectedRangeYears.value[1] === year) {
      classes.push("selected-end");
    } else if (
      selectedRangeYears.value[0] &&
      selectedRangeYears.value[1] &&
      year > selectedRangeYears.value[0] &&
      year < selectedRangeYears.value[1]
    ) {
      classes.push("in-range");
    }
  } else if (selectedYear.value === year) {
    classes.push("selected");
  }

  // 禁用状态
  if (props.disabledDate && props.disabledDate(date.toDate())) {
    classes.push("disabled");
  }

  return classes;
}

// # 获取月份单元格的类名
function getMonthClass(month: number, position?: "end" | "start"): string[] {
  const classes: string[] = ["month-cell"];

  const year =
    isRange.value && position
      ? position === "start"
        ? selectedRangeYears.value[0]
        : selectedRangeYears.value[1]
      : selectedYear.value;
  if (year === null) return classes;

  const date = dayjs()
    .year(year)
    .month(month - 1)
    .date(1);

  const _selectedYears = selectedRangeYears.value;
  const _selectedMonths = selectedRangeMonths.value;
  const _startPanelYear = startPanelDate.value.year();
  const _endPanelYear = endPanelDate.value.year();
  // 当前月
  if (
    (!isRange.value && currentDate.value.year() === dayjs().year() && month === dayjs().month() + 1) ||
    (position === "start" && _startPanelYear === dayjs().year() && month === dayjs().month() + 1) ||
    (position === "end" && _endPanelYear === dayjs().year() && month === dayjs().month() + 1)
  ) {
    classes.push("this-month");
  }

  // 选中状态
  if (isRange.value && position) {
    if (
      _selectedYears[0] == _selectedYears[1] &&
      _selectedYears[0] == _selectedYears[1] &&
      month == _selectedMonths[0] &&
      month == _selectedMonths[1]
    ) {
      classes.push("selected-start selected-end");
    } else if (
      position === "start" &&
      ((_startPanelYear === _selectedYears[0] && _selectedMonths[0] === month) ||
        (_startPanelYear === _selectedYears[1] && _selectedMonths[1] === month))
    ) {
      classes.push(_startPanelYear === _selectedYears[1] && _selectedMonths[1] === month ? "selected-end" : "selected-start");
    } else if (
      position === "end" &&
      ((_endPanelYear === _selectedYears[1] && _selectedMonths[1] === month) ||
        (_endPanelYear === _selectedYears[0] && _selectedMonths[0] === month))
    ) {
      classes.push(_endPanelYear === _selectedYears[0] && _selectedMonths[0] === month ? "selected-start" : "selected-end");
    } else if (
      _selectedYears[0] &&
      _selectedYears[1] &&
      _selectedMonths[0] &&
      _selectedMonths[1] &&
      ((position === "start" && _startPanelYear < _selectedYears[1] && _startPanelYear > _selectedYears[0]) ||
        (position === "end" && _endPanelYear > _selectedYears[0] && _endPanelYear < _selectedYears[1]) ||
        (position === "start" &&
          ((_selectedYears[0] != _selectedYears[1] && _startPanelYear == _selectedYears[0] && month >= _selectedMonths[0]) ||
            (_selectedYears[0] != _selectedYears[1] && _startPanelYear == _selectedYears[1] && month <= _selectedMonths[1]) ||
            (_startPanelYear == _selectedYears[0] &&
              _selectedYears[0] == _selectedYears[1] &&
              month <= _selectedMonths[1] &&
              month >= _selectedMonths[0]))) ||
        (position === "end" &&
          ((_selectedYears[0] != _selectedYears[1] && _endPanelYear == _selectedYears[1] && month <= _selectedMonths[1]) ||
            (_selectedYears[0] != _selectedYears[1] && _endPanelYear == _selectedYears[0] && month >= _selectedMonths[0]) ||
            (_endPanelYear == _selectedYears[1] &&
              _selectedYears[0] == _selectedYears[1] &&
              month <= _selectedMonths[1] &&
              month >= _selectedMonths[0]))))
    ) {
      classes.push("in-range");
    }
  } else if (selectedMonth.value === month && currentDate.value.year() === year) {
    classes.push("selected");
  }

  // 禁用状态
  if (props.disabledDate && props.disabledDate(date.toDate())) {
    classes.push("disabled");
  }

  return classes;
}

function handleShortcutClick(shortcut: DatePickerShortcut) {
  let value: [dayjs.Dayjs, dayjs.Dayjs];

  if (typeof shortcut.value === "function") {
    const dateRange = shortcut.value();
    value = [dayjs(dateRange[0]), dayjs(dateRange[1])];
  } else {
    value = [dayjs(shortcut.value[0]), dayjs(shortcut.value[1])];
  }

  // 设置选中的值
  if (isRange.value) {
    selectedRangeYears.value = [value[0].year(), value[1].year()];
    selectedRangeMonths.value = [value[0].month() + 1, value[1].month() + 1];
  } else {
    selectedYear.value = value[0].year();
    selectedMonth.value = value[0].month() + 1;
  }

  confirmSelection();
}

// # 确认选择
function confirmSelection() {
  let value: any = null;

  if (isRange.value) {
    // 范围选择
    if (selectedRangeYears.value[0] !== null && selectedRangeYears.value[1] !== null) {
      // 确保有月份值
      const startMonth = selectedRangeMonths.value[0] || 1;
      const endMonth = selectedRangeMonths.value[1] || 12;

      // 创建开始和结束日期
      const startDate = dayjs()
        .year(selectedRangeYears.value[0]!)
        .month(startMonth - 1)
        .startOf("month");

      const endDate = dayjs()
        .year(selectedRangeYears.value[1]!)
        .month(endMonth - 1)
        .endOf("month");

      // 根据类型转换值
      if (isYear.value) {
        // 年份选择器，只返回年份
        value = [startDate.year(), endDate.year()];
      } else if (isMonth.value) {
        // 月份选择器，返回年月字符串
        value = [startDate.format("YYYY-MM"), endDate.format("YYYY-MM")];
      } else {
        // 完整日期
        value = [convertValue(props.type, startDate), convertValue(props.type, endDate)];
      }
    }
  } else {
    // 单个选择
    if (selectedYear.value !== null) {
      // 确保有月份值
      const month = selectedMonth.value || 1;

      // 创建日期
      const date = dayjs()
        .year(selectedYear.value)
        .month(month - 1)
        .startOf(isMonth.value ? "month" : "year");

      // 根据类型转换值
      if (isYear.value) {
        // 年份选择器，只返回年份
        value = date.year();
      } else if (isMonth.value) {
        // 月份选择器，返回年月字符串
        value = date.format("YYYY-MM");
      } else {
        // 完整日期
        value = convertValue(props.type, date);
      }
    }
  }

  emit("update:modelValue", value);
  emit("change", value);
}

function handleCancel() {
  // 清空选中状态
  selectedYear.value = null;
  selectedMonth.value = null;
  selectedRangeYears.value = [null, null];
  selectedRangeMonths.value = [null, null];

  emit("update:modelValue", isRange.value ? [] : "");
  emit("change", isRange.value ? [] : "");
}

// # 导航控制 - 月份
function prevMouth(panel?: "end" | "start") {
  if (isRange.value) {
    if (panel === "start") {
      startPanelDate.value = startPanelDate.value.year(startPanelDate.value.year() - 1);
    } else if (panel === "end") {
      const start = selectedRangeYears.value?.[0] || startPanelDate.value.year();
      const end = endPanelDate.value.year();
      endPanelDate.value = endPanelDate.value.year(end - 1 >= start ? end - 1 : start);
    }
  } else {
    currentDate.value = currentDate.value.year(currentDate.value.year() - 1);
  }
}
function nextMouth(panel?: "end" | "start") {
  if (isRange.value) {
    if (panel === "start") {
      const start = startPanelDate.value.year();
      const end = selectedRangeYears.value?.[1] || endPanelDate.value.year();
      startPanelDate.value = startPanelDate.value.year(start + 1 <= end ? start + 1 : end);
    } else if (panel === "end") {
      endPanelDate.value = endPanelDate.value.year(endPanelDate.value.year() + 1);
    }
  } else {
    currentDate.value = currentDate.value.year(currentDate.value.year() + 1);
  }
}

// # 导航控制 - 十年
function prevYear(panel?: "end" | "start") {
  if (isRange.value) {
    if (panel === "start") {
      startPanelDate.value = startPanelDate.value.year(startPanelDate.value.year() - 10);
    } else if (panel === "end") {
      const start = selectedRangeYears.value?.[0] || startPanelDate.value.year();
      const end = endPanelDate.value.year();
      endPanelDate.value = endPanelDate.value.year(end - 1 >= start ? end - 10 : start);
    }
  } else {
    currentDate.value = currentDate.value.year(currentDate.value.year() - 10);
  }
}
function nextYear(panel?: "end" | "start") {
  if (isRange.value) {
    if (panel === "start") {
      const start = startPanelDate.value.year();
      const end = selectedRangeYears.value?.[1] || endPanelDate.value.year();
      startPanelDate.value = startPanelDate.value.year(start + 1 <= end ? start + 10 : end);
    } else if (panel === "end") {
      endPanelDate.value = endPanelDate.value.year(endPanelDate.value.year() + 10);
    }
  } else {
    currentDate.value = currentDate.value.year(currentDate.value.year() + 10);
  }
}

// # 处理滚轮事件
let lastWheelTime = 0;
let wheelDelta = 0;
function handleWheel(event: WheelEvent, type: "month" | "year" = "year", panel?: "end" | "start") {
  event.preventDefault();

  const now = Date.now();
  wheelDelta += Math.abs(event.deltaY);

  // 降低敏感度：只有当滚动量达到阈值时才触发切换
  if (wheelDelta < 50) {
    return;
  }

  // 防抖处理：避免快速连续滚动
  if (now - lastWheelTime < 100) {
    return;
  }

  // 重置滚动量和时间
  wheelDelta = 0;
  lastWheelTime = now;
  if (type === "year") {
    // 年份视图：滚动切换十年
    if (event.deltaY < 0) {
      prevYear(panel);
    } else {
      nextYear(panel);
    }
  } else {
    // 月份视图：滚动切换年份
    if (event.deltaY < 0) {
      prevMouth(panel);
    } else {
      nextMouth(panel);
    }
  }
}

// 初始化值
watch(
  () => props.modelValue,
  newValue => {
    if (isRange.value && Array.isArray(newValue) && newValue.length) {
      // 重置范围选择的值
      selectedRangeYears.value = [null, null];
      selectedRangeMonths.value = [null, null];

      // 处理开始日期
      if (newValue[0]) {
        const date = dayjs(newValue[0]);
        selectedRangeYears.value[0] = date.year();
        selectedRangeMonths.value[0] = date.month() + 1;
        startPanelDate.value = date;
      }

      // 处理结束日期
      if (newValue[1]) {
        const date = dayjs(newValue[1]);
        selectedRangeYears.value[1] = date.year();
        selectedRangeMonths.value[1] = date.month() + 1;
        endPanelDate.value = date;
      }
    } else if (!!newValue && !Array.isArray(newValue)) {
      // 处理单个值
      const date = dayjs(newValue);
      selectedYear.value = date.year();
      selectedMonth.value = date.month() + 1;
      currentDate.value = date;
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.m-year-month-picker-panel {
  position: relative;
}

.m-year-month-picker-shortcuts {
  display: flex;
  flex-wrap: wrap;
  padding: var(--m-size-v2-padding);
  border-bottom: 1px solid var(--m-color-v2-border);
}

.m-year-month-picker-shortcut-item {
  padding: calc(var(--m-size-v2-padding) / 2) var(--m-size-v2-padding);
  margin-right: var(--m-size-v2-padding);
  margin-bottom: calc(var(--m-size-v2-padding) / 2);
  font-size: var(--m-size-v2-font);
  cursor: pointer;
  border-radius: var(--m-size-v2-radius);
  transition: all var(--m-animation-time, 0.2s);
}

.m-year-month-picker-shortcut-item:hover {
  background-color: var(--m-color-v2-info-light-9);
  color: var(--m-color-v2-primary);
}

.m-year-month-picker-panel-main {
  flex: 1;
  min-width: 0;
}

.m-year-month-picker-range-panel {
  display: flex;
}

.m-year-month-picker-range-side {
  flex: 1;
  padding: var(--m-size-v2-padding);
  &:first-child {
    border-right: 1px solid var(--m-color-v2-border);
  }
}

.m-year-month-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--m-size-v2-font);
}

.m-year-month-picker-header-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: calc(var(--m-size-v2-padding) / 2) var(--m-size-v2-padding);

  &:hover {
    background-color: var(--m-color-v2-info-light-9);
  }
}

.m-year-month-picker-header-label {
  font-weight: 500;
}

.m-year-picker-grid,
.m-month-picker-grid {
  padding-bottom: calc(var(--m-size-v2-padding) / 1.5);
  max-height: 300px;
  overflow-y: auto;
}

.m-year-picker-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.m-month-picker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.year-cell,
.month-cell {
  height: 36px;
  line-height: 36px;
  text-align: center;
  cursor: pointer;
  border-radius: var(--m-size-v2-radius);
  transition: all 0.3s;
  font-size: var(--m-size-v2-font);

  &:hover:not(.disabled) {
    background-color: var(--m-color-v2-info-light-9);
    color: var(--m-color-v2-primary);
  }

  &.selected,
  &.selected-start,
  &.selected-end {
    background-color: var(--m-color-v2-primary) !important;
    color: var(--m-color-v2-white) !important;
  }

  &.disabled {
    color: var(--m-color-v2-info-light-4);
    cursor: not-allowed;
  }

  &.disabled:hover {
    background-color: transparent;
    color: var(--m-color-v2-info-light-4);
  }

  &.in-range {
    border-radius: 0;
    color: var(--m-color-v2-font) !important;
    background-color: var(--m-color-v2-scrollbar) !important;
  }
}

.year-cell.this-year,
.month-cell.this-month {
  font-weight: 500;
  color: var(--m-color-v2-primary);
}

.year-cell.selected.this-year,
.year-cell.selected-start.this-year,
.year-cell.selected-end.this-year,
.month-cell.selected.this-month,
.month-cell.selected-start.this-month,
.month-cell.selected-end.this-month {
  color: var(--m-color-v2-white);
}

.year-cell.current-decade,
.month-cell.current-year {
  font-weight: normal;
}

.year-cell.selected-start,
.month-cell.selected-start {
  border-radius: 0;
  border-top-left-radius: calc(var(--m-size-v2-padding) * 2);
  border-bottom-left-radius: calc(var(--m-size-v2-padding) * 2);
}

.year-cell.selected-end,
.month-cell.selected-end {
  border-radius: 0;
  border-top-right-radius: calc(var(--m-size-v2-padding) * 2);
  border-bottom-right-radius: calc(var(--m-size-v2-padding) * 2);
}

.year-cell.selected-start.selected-end,
.month-cell.selected-start.selected-end {
  border-radius: calc(var(--m-size-v2-padding) * 2);
}

.m-year-month-picker-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: calc(var(--m-size-v2-padding) / 1.5);
  border-top: 1px solid var(--m-color-v2-border);
}

.m-year-month-picker-footer :deep(.m-button-v2) {
  margin-left: var(--m-size-v2-padding);
}
</style>
