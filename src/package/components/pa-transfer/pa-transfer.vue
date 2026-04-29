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
            <pa-checkbox-item :disabled="props.disabled" :isChecked="awaitSelectList.includes(item.value)">{{
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

<script lang="ts" setup name="PaTransfer">
/**
 * @component PaTransfer
 * @description 穿梭框组件，在两个列表之间进行数据的选择和移动
 * @author Butler AI
 */
import { ref, Ref, computed, watch, onMounted, onUnmounted, inject, ComputedRef } from "vue";
import type { TransferProps } from "./types";
import { randChar } from "../tools/rand-char";
import { PaOptionType } from "../manager-type";
import { findData as findDataSelect } from "./find-data";
import { PancakeGlobalConfigType } from "../pa-manager/type";
import "./index.scss";

import _ from "lodash";
const { isEqual, isNil } = _;

/**
 * PaTransfer 组件 Props
 */
interface Props extends TransferProps {}

const props = withDefaults(defineProps<Props>(), {
  id: randChar()
});

const emits = defineEmits<{
  (e: "update:modelValue", value: Array<boolean | number | string>): void;
  (e: "change", payload: { value: Array<boolean | number | string>; oldValue: Array<boolean | number | string> }): void;
  (e: "remoteMethod", query: string): void;
}>();

const exOptionsList = ref(props?.exOptions || []);

const searchAll = ref("");
const searchSelected = ref("");

const selectedList: Ref<PaOptionType.SelectList> = ref([]);
const awaitSelectList: Ref<Array<boolean | number | string>> = ref([]);
const awaitSelectedList: Ref<Array<boolean | number | string>> = ref([]);

const searchAllSelectList = computed(() => {
  const _selectedList = selectedList.value.map(item => item.value);
  const filterList = exOptionsList.value.filter(item => !_selectedList.includes(item.value));
  if (searchAll.value) return filterList.filter(item => item.label.includes(searchAll.value));
  return filterList;
});

const filterSelectedList = computed(() => {
  if (searchSelected.value) {
    return selectedList.value.filter(item => item.label.includes(searchSelected.value));
  }
  return selectedList.value;
});

const selectRef = ref();

const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["cell"] || {};
});

let oldValue = props.modelValue;

let leftOldIndex = -1;
let rightOldIndex = -1;
let leftAddOrDel = 1;
let rightAddOrDel = 1;

const isShiftPressed = ref(false);

/** 监听键盘按下事件 */
const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === "Shift") {
    isShiftPressed.value = true;
  }
};

/** 监听键盘抬起事件 */
const handleKeyUp = (event: KeyboardEvent): void => {
  if (event.key === "Shift") {
    isShiftPressed.value = false;
  }
};

onMounted(() => {
  if (typeof window !== "undefined") window.addEventListener("keydown", handleKeyDown);
  if (typeof window !== "undefined") window.addEventListener("keyup", handleKeyUp);
});

onUnmounted(() => {
  if (typeof window !== "undefined") window.removeEventListener("keydown", handleKeyDown);
  if (typeof window !== "undefined") window.removeEventListener("keyup", handleKeyUp);
});

/**
 * 处理选项点击事件
 * @param item - 点击的选项对象
 * @param direction - 方向
 * @param index - 索引
 * @param list - 列表
 */
function handleOptionClick(item: PaOptionType.SelectItem, direction: string, index: number, list: PaOptionType.SelectList): void {
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
 * @param direction - 方向
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

  emits("update:modelValue", selectedList.value.map(item => item.value));
  emits("change", { value: selectedList.value.map(item => item.value), oldValue });
  oldValue = selectedList.value.map(item => item.value);
}

/**
 * 处理全选/取消全选
 * @param direction - 方向
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
 * @param data - 数据值
 */
function findData(data: Array<boolean | number | string>): string {
  if (props.displayValue) {
    return props.displayValue || "--";
  }
  return findDataSelect(data, exOptionsList.value);
}

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
