<template>
  <div
    v-if="!display"
    class="m-transfer-v2"
    ref="selectRef"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
  >
    <div class="m-transfer-v2-select-box">
      <div class="m-transfer-v2-select-box_title">
        <m-checkbox-v2-item
          :disabled="props.disabled"
          :is-indeterminate="awaitSelectList.length > 0"
          :isChecked="awaitSelectList.length === searchAllSelectList.length && searchAllSelectList.length > 0"
          @change="handleCheckedChange('left')"
        ></m-checkbox-v2-item>
        {{ languagePackage["unselected"] }}
      </div>
      <div class="m-transfer-v2-select-box_options">
        <m-input-v2 v-if="useSearch" :disabled="props.disabled" class="m-transfer-v2-input-inner" v-model="searchAll" />
        <m-scrollbar-v2 :useBackTop="false">
          <div
            v-for="(item, index) in searchAllSelectList"
            :key="String(item.value)"
            class="m-transfer-v2-option"
            @click="handleOptionClick(item, 'left', index, searchAllSelectList)"
          >
            <m-checkbox-v2-item :disabled="props.disabled" :isChecked="awaitSelectList.includes(item.value)">{{
              item.label
            }}</m-checkbox-v2-item>
          </div>
        </m-scrollbar-v2>
      </div>
    </div>
    <div class="m-transfer-v2-transfer">
      <m-button-v2 font="left_line" :disabled="props.disabled" @click="handleTransferClick('left')"></m-button-v2>
      <m-button-v2 font="right_line" :disabled="props.disabled" @click="handleTransferClick('right')"></m-button-v2>
    </div>
    <div class="m-transfer-v2-select-box">
      <div class="m-transfer-v2-select-box_title">
        <m-checkbox-v2-item
          :disabled="props.disabled"
          :is-indeterminate="awaitSelectedList.length > 0"
          :isChecked="awaitSelectedList.length === filterSelectedList.length && filterSelectedList.length > 0"
          @change="handleCheckedChange('right')"
        ></m-checkbox-v2-item>
        {{ languagePackage["selected"] }}
      </div>
      <div class="m-transfer-v2-select-box_options">
        <m-input-v2 v-if="useSearch" :disabled="props.disabled" class="m-transfer-v2-input-inner" v-model="searchSelected" />
        <m-scrollbar-v2 :useBackTop="false">
          <div
            v-for="(item, index) in filterSelectedList"
            :key="String(item.value)"
            class="m-transfer-v2-option"
            @click="handleOptionClick(item, 'right', index, filterSelectedList)"
          >
            <m-checkbox-v2-item :disabled="props.disabled" :isChecked="awaitSelectedList.includes(item.value)">{{
              item.label
            }}</m-checkbox-v2-item>
          </div>
        </m-scrollbar-v2>
      </div>
    </div>
  </div>
  <div v-else class="m-display-v2">
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
    :class="['m-contrast-v2']"
  >
    <div v-if="exOptionsList?.length">
      <slot name="exContrast"></slot>
      <template v-if="$slots.exContrast"> ( {{ findData(contrastData) }} )</template>
      <template v-else>{{ findData(contrastData) }}</template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref, computed, watch, onMounted, onUnmounted, inject, ComputedRef } from "vue";
import { MTransferV2Type } from "./type";
import lodashPkg from "lodash";
import { randChar } from "../tools/rand-char";
import { MOptionV2Type } from "../manager-type";
import { findData as findDataSelect } from "./find-data";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";

const props = withDefaults(defineProps<MTransferV2Type>(), {
  id: randChar()
});

const emits = defineEmits(["update:modelValue", "change", "remoteMethod"]);

const exOptionsList = ref(props?.exOptions || []);

const searchAll = ref("");
const searchSelected = ref("");

const selectedList: Ref<MOptionV2Type.SelectList> = ref([]);
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

const { isEqual, isNil } = lodashPkg;
const selectRef = ref();

const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;
const languagePackage = computed(() => {
  return ManagerGlobalConfig.value?.language?.package?.["cell"] || {};
});

let oldValue = props.modelValue;

let leftOldIndex = -1;
let rightOldIndex = -1;
let leftAddOrDel = 1;
let rightAddOrDel = 1;

const isShiftPressed = ref(false);
// 监听键盘事件
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Shift") {
    isShiftPressed.value = true;
  }
};

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key === "Shift") {
    isShiftPressed.value = false;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
});

/**
 * 处理选项点击事件
 * @param {Object} item - 点击的选项对象
 */
function handleOptionClick(item, direction, index, list) {
  if (props.disabled) {
    return;
  }
  if (direction === "left") {
    const start = Math.min(leftOldIndex, index);
    const end = Math.max(leftOldIndex, index);
    let splitArr = [item.value];
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
    let splitArr = [item.value];
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

function handleTransferClick(direction) {
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

function handleCheckedChange(direction) {
  if (props.disabled) {
    return;
  }
  if (direction === "left") {
    awaitSelectList.value = searchAllSelectList.value.map(item => item.value);
  } else if (direction === "right") {
    awaitSelectedList.value = selectedList.value.map(item => item.value);
  }
}

function findData(data) {
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

<style lang="scss">
@use "./index.scss";
</style>
