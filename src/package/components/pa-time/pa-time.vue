<template>
  <div
    v-if="!display"
    class="pa-time"
    ref="selectRef"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
  >
    <pa-popover
      ref="popoverRef"
      @change="handlePopoverChange"
      :disabled="props.disabled"
      :popoverWidth="!isRange ? 280 : 600"
      :teleportTo="props.teleportInContainer ? selectRef : 'body'"
      :targetClose="false"
    >
      <template #reference>
        <div class="pa-time-content">
          <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
            {{ typeof title === "string" ? title : title[languageValue] }}
          </div>
          <div v-if="!isRange" class="pa-time-input" :class="[isFocus ? 'is-focus' : '']">
            <input
              class="pa-time-input-inner"
              v-model="inValue"
              :placeholder="inputPlaceholder"
              ref="inputRef"
              :name="id"
              :disabled="props.disabled"
              autocomplete="off"
              @focus="handleFocus"
              @input="handleInput"
            />
          </div>
          <div v-else class="pa-time-input" :class="[isFocus ? 'is-focus' : '']">
            <input
              class="pa-time-input-inner center"
              v-model="inValue[0]"
              :placeholder="languagePackage['startTime']"
              ref="inputRef"
              :name="id"
              :disabled="props.disabled"
              autocomplete="off"
              @focus="handleFocus"
              @input="e => handleInput(e, 'start')"
            />
            -
            <input
              class="pa-time-input-inner center"
              v-model="inValue[1]"
              :placeholder="languagePackage['endTime']"
              ref="inputRef"
              :name="id"
              :disabled="props.disabled"
              autocomplete="off"
              @focus="handleFocus"
              @input="e => handleInput(e, 'end')"
            />
          </div>
        </div>
      </template>
      <MDateTimePanel
        v-if="DateTimeMap[type]"
        :model-value="internalValue"
        :type="type"
        :shortcuts="shortcuts"
        :disabled-date="disabledDateFn"
        @change="handlePanelChange"
      />
      <MYearPanel
        v-else-if="YearMap[type]"
        :model-value="internalValue"
        :type="type"
        :shortcuts="shortcuts"
        :disabled-date="disabledDateFn"
        @change="handlePanelChange"
      />
    </pa-popover>
  </div>

  <div v-else class="pa-display-style" :class="[props.class]" :style="{ ...props.style }">
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <div class="pa-display-value_content">
      <slot name="exDisplay"></slot>
      <template v-if="$slots.exDisplay"> ( {{ findData(inValue) || "--" }} ) </template>
      <template v-else>{{ displayValue || findData(inValue) || "--" }}</template>
    </div>
  </div>

  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(inValue, contrastData))"
    :class="['pa-contrast-style']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ findData(contrastData) || "--" }} ) </template>
    <template v-else>{{ findData(contrastData) || "--" }}</template>
  </div>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 * */
import { ref, Ref, computed, watch, inject, ComputedRef } from "vue";

/**
 * **模块导入**
 * @description 导入组件类型定义
 * */
import { ComponentProps, ComponentEmits } from "./types";

/**
 * **模块导入**
 * @description 导入日期时间面板组件
 * */
import MDateTimePanel from "./date-time-panel.vue";

/**
 * **模块导入**
 * @description 导入年份面板组件
 * */
import MYearPanel from "./year-panel.vue";

/**
 * **模块导入**
 * @description 导入工具函数
 * */
import { convertValue, isValidDate } from "./utils";

/**
 * **模块导入**
 * @description 导入全局配置类型
 * */
import { PancakeGlobalConfigType } from "../pa-manager/type";

/**
 * **模块导入**
 * @description 导入 lodash 工具函数
 * */
import _ from "lodash";
const { isEqual, isNil, cloneDeep } = _;

/**
 * **日期时间类型映射**
 * @description 用于判断是否为日期时间类型
 * */
const DateTimeMap: Record<string, number> = {
  "date-picker-group": 1,
  "date-picker": 1,
  "date-time-picker-group": 1,
  "date-time-picker": 1,
  "time-picker-group": 1,
  "time-picker": 1
};

/**
 * **年份类型映射**
 * @description 用于判断是否为年份类型
 * */
const YearMap: Record<string, number> = {
  "year-picker-group": 1,
  "year-picker": 1,
  "month-picker-group": 1,
  "month-picker": 1
};

/**
 * **组件属性**
 * @type `ComponentProps`
 * @description 组件的属性对象
 * */
const props = withDefaults(defineProps<ComponentProps>(), {
  type: "date-picker"
});

/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
const emits = defineEmits<ComponentEmits>();

/**
 * **是否为范围选择**
 * @type `ComputedRef<boolean>`
 * @description 判断当前类型是否为范围选择模式
 * */
const isRange = computed(() => {
  return props.type.endsWith("-group");
});

/**
 * **弹出层引用**
 * @type `Ref<any>`
 * @description 弹出层组件的引用
 * */
const popoverRef = ref();

/**
 * **选择器容器引用**
 * @type `Ref<HTMLElement | undefined>`
 * @description 选择器容器元素的引用
 * */
const selectRef = ref();

/**
 * **是否聚焦**
 * @type `Ref<boolean>`
 * @description 输入框是否处于聚焦状态
 * */
const isFocus = ref(false);

/**
 * **输入框引用**
 * @type `Ref<HTMLInputElement | undefined>`
 * @description 输入框元素的引用
 * */
const inputRef = ref();

/**
 * **内部值**
 * @type `Ref<Array<string> | string | null>`
 * @description 组件内部的绑定值
 * */
const internalValue: Ref<Array<string> | string | null> = ref(isRange.value ? [] : null);

/**
 * **全局配置注入**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 注入全局配置对象
 * */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;

/**
 * **当前语言值**
 * @type `ComputedRef<string>`
 * @description 当前选中的语言
 * */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

/**
 * **输入框占位符**
 * @type `ComputedRef<string>`
 * @description 输入框的占位符文本
 * */
const inputPlaceholder = computed(() => {
  return typeof props.placeholder === "object"
    ? props.placeholder[languageValue.value] || languagePackage.value[`selectPlaceholder`]
    : props.placeholder || languagePackage.value[`selectPlaceholder`];
});

/**
 * **语言包**
 * @type `ComputedRef<Record<string, string>>`
 * @description 当前语言的文本配置
 * */
const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["cell"] || {};
});

/**
 * **显示值**
 * @type `Ref<Array<string> | string>`
 * @description 输入框显示的值
 * */
const inValue = ref<Array<string> | string>(props.modelValue || []);

/**
 * **旧值存储**
 * @type `Array<string> | string`
 * @description 存储上一次的值，用于对比
 * */
let oldValue: Array<string> | string = props.modelValue || "";

/**
 * **处理输入事件**
 * @param `event` 输入事件对象
 * @param `panel` 面板类型（start/end）
 * @returns `void`
 * @description 处理输入框输入事件
 * */
function handleInput({ target }, panel?: "end" | "start"): void {
  const value = target.value;

  if (value && !isValidDate(value)) {
    typeof window !== "undefined" && window.developLog.log("日期格式不合法:", value, "warning");
    return;
  }

  if (Array.isArray(inValue.value) && isRange.value && panel === "start") {
    inValue.value[0] = value;
  } else if (Array.isArray(inValue.value) && isRange.value && panel === "end") {
    inValue.value[1] = value;
  } else {
    inValue.value = value;
  }
  internalValue.value = inValue.value;
  emits("update:modelValue", inValue.value);
  emits("change", { value: inValue.value, oldValue });
  oldValue = inValue.value;
}

/**
 * **处理聚焦事件**
 * @returns `void`
 * @description 处理输入框聚焦事件
 * */
function handleFocus(): void {
  isFocus.value = true;
}

/**
 * **处理面板变更**
 * @param `data` 选中的数据
 * @returns `void`
 * @description 处理日期时间面板选择变更
 * */
function handlePanelChange(data: Array<string> | string): void {
  internalValue.value = data;
  inValue.value = data;
  emits("update:modelValue", data);
  emits("change", { value: data, oldValue });
  oldValue = data;
  popoverRef.value.hidePopover();
}

/**
 * **处理弹出层变更**
 * @param `data` 弹出层状态
 * @returns `void`
 * @description 处理弹出层显示/隐藏变更
 * */
function handlePopoverChange(data: boolean): void {
  if (!data) {
    isFocus.value = false;
  } else {
    internalValue.value = cloneDeep(inValue.value);
  }
}

/**
 * **查找显示数据**
 * @param `data` 要查找的数据
 * @returns `string` 显示的文本
 * @description 根据值查找对应的显示文本
 * */
function findData(data: Array<string> | string | undefined): string {
  if (Array.isArray(data) && data.length) {
    const filterData = data?.filter?.(item => !!item);
    return filterData.map(item => convertValue(props.type, item))?.join(` ${languagePackage.value["to"]} `) || "--";
  } else if (!isNil(data)) {
    return convertValue(props.type, data as string) || "--";
  } else return "--";
}

/**
 * **监听 modelValue 变化**
 * @description 同步外部传入的值到内部状态
 * */
watch(
  () => props.modelValue,
  data => {
    if (data) {
      if (isRange.value) {
        const _data = Array.isArray(data) ? data : [];
        inValue.value = _data.map(item => convertValue(props.type, item));
      } else {
        const _data = !Array.isArray(data) ? data : "";
        inValue.value = convertValue(props.type, _data);
      }
    } else {
      inValue.value = isRange.value ? [] : "";
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
@use "./index.scss";
@use "../cell-style.scss";
</style>
