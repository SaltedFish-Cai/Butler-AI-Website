<template>
  <div
    v-if="!display"
    class="pa-transfer"
    ref="selectRef"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
  >
    <div class="pa-transfer-select-box">
      <div class="pa-transfer-select-box_title">
        <pa-checkbox-item
          :disabled="props.disabled"
          :is-indeterminate="awaitSelectList.length > 0"
          :isChecked="awaitSelectList.length === searchAllSelectList.length && searchAllSelectList.length > 0"
          @change="handleCheckedChange('left')"
        ></pa-checkbox-item>
        {{ languagePackage["unselected"] }}
      </div>
      <div class="pa-transfer-select-box_options">
        <pa-input v-if="useSearch" :disabled="props.disabled" class="pa-transfer-input-inner" v-model="searchAll" />
        <pa-scrollbar :useBackTop="false" :useScrollX="false">
          <div
            v-for="(item, index) in searchAllSelectList"
            :key="String(item.value)"
            class="pa-transfer-option"
            @click="handleOptionClick(item, 'left', index, searchAllSelectList)"
          >
            <pa-checkbox-item :disabled="props.disabled" :isChecked="item.value ? awaitSelectList.includes(item.value) : false">{{
              item.label
            }}</pa-checkbox-item>
          </div>
        </pa-scrollbar>
      </div>
    </div>
    <div class="pa-transfer-transfer">
      <pa-button font="left_line" :disabled="props.disabled" @click="handleTransferClick('left')"></pa-button>
      <pa-button font="right_line" :disabled="props.disabled" @click="handleTransferClick('right')"></pa-button>
    </div>
    <div class="pa-transfer-select-box">
      <div class="pa-transfer-select-box_title">
        <pa-checkbox-item
          :disabled="props.disabled"
          :is-indeterminate="awaitSelectedList.length > 0"
          :isChecked="awaitSelectedList.length === filterSelectedList.length && filterSelectedList.length > 0"
          @change="handleCheckedChange('right')"
        ></pa-checkbox-item>
        {{ languagePackage["selected"] }}
      </div>
      <div class="pa-transfer-select-box_options">
        <pa-input v-if="useSearch" :disabled="props.disabled" class="pa-transfer-input-inner" v-model="searchSelected" />
        <pa-scrollbar :useBackTop="false" :useScrollX="false">
          <div
            v-for="(item, index) in filterSelectedList"
            :key="String(item.value)"
            class="pa-transfer-option"
            @click="handleOptionClick(item, 'right', index, filterSelectedList)"
          >
            <pa-checkbox-item :disabled="props.disabled" :isChecked="awaitSelectedList.includes(item.value)">{{
              item.label
            }}</pa-checkbox-item>
          </div>
        </pa-scrollbar>
      </div>
    </div>
  </div>
  <div v-else class="pa-display-style">
    <slot name="exDisplay"></slot>
    <template v-if="exOptionsList?.length || displayValue">
      <template v-if="$slots.exDisplay"> ( {{ findData(selectedList.map(item => item.value)) || "--" }} )</template>
      <template v-else>{{ findData(selectedList.map(item => item.value)) || "--" }}</template>
    </template>
    <div v-else>--</div>
  </div>
  <div
    v-if="
      (alwaysContrast && !isNil(contrastData)) ||
      (!isNil(contrastData) &&
        !isEqual(
          selectedList.map(item => item.value),
          contrastData
        ))
    "
    :class="['pa-contrast-style']"
  >
    <div v-if="exOptionsList?.length">
      <slot name="exContrast"></slot>
      <template v-if="$slots.exContrast"> ( {{ findData(contrastData) }} )</template>
      <template v-else>{{ findData(contrastData) }}</template>
    </div>
  </div>
</template>

<script lang="ts" setup>
/** @description Vue 核心响应式 API */
import { ref, Ref, computed, watch, onMounted, onUnmounted, inject, ComputedRef } from "vue";
/** @description 穿梭框组件 Props 和 Emits 类型 */
import type { ComponentProps, ComponentEmits } from "./types";
/** @description 随机字符生成工具 */
import { randChar } from "../tools/rand-char";
/** @description 选项类型 */
import { PaOptionType } from "../manager-type";
/** @description 数据查找工具 */
import { findData as findDataSelect } from "./find-data";
/** @description 全局配置类型 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/** @description 深比较和空值判断工具 */
import _ from "lodash";
const { isEqual, isNil } = _;
/** @description 组件 Props */
const props = withDefaults(defineProps<ComponentProps>(), {
  id: randChar()
});
/** @description 组件 Emits */
const emits = defineEmits<ComponentEmits>();
/** @description 外置数据选项列表 */
const exOptionsList = ref(props?.exOptions || []);
/** @description 左侧搜索关键词 */
const searchAll = ref("");
/** @description 右侧搜索关键词 */
const searchSelected = ref("");
/** @description 已选中列表 */
const selectedList: Ref<PaOptionType.SelectList> = ref([]);
/** @description 左侧待选中列表 */
const awaitSelectList: Ref<Array<boolean | number | string>> = ref([]);
/** @description 右侧待取消选中列表 */
const awaitSelectedList: Ref<Array<boolean | number | string>> = ref([]);
/** @description 左侧搜索过滤后的未选中列表 */
const searchAllSelectList = computed(() => {
  const _selectedList = selectedList.value.map(item => item.value);
  const filterList = exOptionsList.value.filter(item => !_selectedList.includes(item.value));
  if (searchAll.value) return filterList.filter(item => item.label.includes(searchAll.value));
  return filterList;
});
/** @description 右侧搜索过滤后的已选中列表 */
const filterSelectedList = computed(() => {
  if (searchSelected.value) {
    return selectedList.value.filter(item => item.label.includes(searchSelected.value));
  }
  return selectedList.value;
});
/** @description 组件根元素引用 */
const selectRef = ref();
/** @description 全局配置注入 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/** @description 语言包 */
const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["cell"] || {};
});
/** @description 旧值，用于 change 事件对比 */
let oldValue = props.modelValue || [];
/** @description 左侧上次点击索引 */
let leftOldIndex = -1;
/** @description 右侧上次点击索引 */
let rightOldIndex = -1;
/** @description 左侧添加或删除标记 */
let leftAddOrDel = 1;
/** @description 右侧添加或删除标记 */
let rightAddOrDel = 1;
/** @description Shift 键是否按下 */
const isShiftPressed = ref(false);
/**
 * 处理键盘按下事件
 * @param event - 键盘事件对象
 * @returns void
 * @description 监听 Shift 键按下
 */
function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === "Shift") {
    isShiftPressed.value = true;
  }
}
/**
 * 处理键盘抬起事件
 * @param event - 键盘事件对象
 * @returns void
 * @description 监听 Shift 键抬起
 */
function handleKeyUp(event: KeyboardEvent): void {
  if (event.key === "Shift") {
    isShiftPressed.value = false;
  }
}
/**
 * 处理选项点击事件
 * @param item - 点击的选项对象
 * @param direction - 方向，'left' 或 'right'
 * @param index - 选项索引
 * @param list - 当前列表
 * @returns void
 * @description 点击选项时切换选中状态，支持 Shift 多选
 */
function handleOptionClick(item: PaOptionType.Select, direction: string, index: number, list: PaOptionType.SelectList): void {
  if (props.disabled) {
    return;
  }
  if (direction === "left") {
    const start = Math.min(leftOldIndex, index);
    const end = Math.max(leftOldIndex, index);
    let splitArr: Array<boolean | number | string> = [item.value];
    if (leftOldIndex != -1 && isShiftPressed.value) {
      splitArr = list.slice(start, end + 1).map(item => item.value);
    }
    if (awaitSelectList.value.includes(item.value)) {
      leftAddOrDel = 2;
    } else {
      leftAddOrDel = 1;
    }
    if (leftAddOrDel == 2) {
      awaitSelectList.value = awaitSelectList.value.filter(val => !splitArr.includes(val));
    } else {
      awaitSelectList.value = Array.from(new Set([...awaitSelectList.value, ...splitArr]));
    }
    leftOldIndex = index;
  } else {
    const start = Math.min(rightOldIndex, index);
    const end = Math.max(rightOldIndex, index);
    let splitArr: Array<boolean | number | string> = [item.value];
    if (leftOldIndex != -1 && isShiftPressed.value) {
      splitArr = list.slice(start, end + 1).map(item => item.value);
    }
    if (awaitSelectedList.value.includes(item.value)) {
      rightAddOrDel = 2;
    } else {
      rightAddOrDel = 1;
    }
    if (rightAddOrDel == 2) {
      awaitSelectedList.value = awaitSelectedList.value.filter(val => !splitArr.includes(val));
    } else {
      awaitSelectedList.value = Array.from(new Set([...awaitSelectedList.value, ...splitArr]));
    }
    rightOldIndex = index;
  }
}
/**
 * 处理穿梭按钮点击事件
 * @param direction - 方向，'left' 或 'right'
 * @returns void
 * @description 点击穿梭按钮时将选中项移动到对面列表
 */
function handleTransferClick(direction: string): void {
  if (props.disabled) {
    return;
  }
  if (direction === "left") {
    selectedList.value = selectedList.value.filter(item => !awaitSelectedList.value.includes(item.value));
    awaitSelectedList.value = [];
    searchSelected.value = "";
  } else if (direction === "right") {
    selectedList.value = [
      ...selectedList.value,
      ...awaitSelectList.value.map(item => ({ value: item, label: findDataSelect(item, exOptionsList.value) }))
    ];
    searchAll.value = "";
    awaitSelectList.value = [];
  }
  emits(
    "update:modelValue",
    selectedList.value.map(item => item.value)
  );
  emits("change", { value: selectedList.value.map(item => item.value), oldValue });
  oldValue = selectedList.value.map(item => item.value);
}
/**
 * 处理全选/取消全选
 * @param direction - 方向，'left' 或 'right'
 * @returns void
 * @description 切换当前列表的全选状态
 */
function handleCheckedChange(direction: string): void {
  if (props.disabled) {
    return;
  }
  if (direction === "left") {
    awaitSelectList.value = searchAllSelectList.value.map(item => item.value);
  } else if (direction === "right") {
    awaitSelectedList.value = selectedList.value.map(item => item.value);
  }
}
/**
 * 查找数据标签
 * @param data - 数据值数组
 * @returns 对应的标签字符串
 * @description 根据 value 查找对应的 label，优先使用 displayValue
 */
function findData(data: Array<boolean | number | string>): string {
  if (props.displayValue) {
    return props.displayValue || "--";
  }
  return findDataSelect(data, exOptionsList.value);
}
/** @description 组件挂载时初始化断点并添加键盘事件监听 */
onMounted(() => {
  if (typeof window !== "undefined") window.addEventListener("keydown", handleKeyDown);
  if (typeof window !== "undefined") window.addEventListener("keyup", handleKeyUp);
});
/** @description 组件卸载时移除键盘事件监听 */
onUnmounted(() => {
  if (typeof window !== "undefined") window.removeEventListener("keydown", handleKeyDown);
  if (typeof window !== "undefined") window.removeEventListener("keyup", handleKeyUp);
});
/**
 * @description 监听 modelValue 变化，同步更新已选中列表
 */
watch(
  () => props.modelValue,
  data => {
    if (props.exOptions && data && Array.isArray(data)) {
      selectedList.value = props.exOptions.filter(item => data.includes(item.value)) || [];
      oldValue = selectedList.value.map(item => item.value);
    }
  },
  { immediate: true }
);
/**
 * @description 监听 exOptions 变化，同步更新外置选项列表
 */
watch(
  () => props.exOptions,
  data => {
    exOptionsList.value = data || [];
    if (props.exOptions && props.modelValue && Array.isArray(props.modelValue)) {
      selectedList.value = props.exOptions.filter(item => props.modelValue?.includes(item.value)) || [];
      oldValue = selectedList.value.map(item => String(item.value));
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
