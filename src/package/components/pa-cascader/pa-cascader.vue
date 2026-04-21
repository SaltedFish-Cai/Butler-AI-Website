<template>
  <div
    v-if="!display"
    class="pa-cascader"
    ref="selectRef"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
  >
    <pa-popover
      ref="popoverRef"
      @change="handlePopoverChange"
      :disabled="props.disabled"
      :teleport-to="teleportInContainer ? selectRef : 'body'"
      sticky="left"
      :autoWidth="!exOptionsList.length || !!filterValue"
      :closeByScroll="false"
    >
      <template #reference>
        <div class="pa-cascader-content">
          <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
            {{ typeof title === "string" ? title : title[languageValue] }}
          </div>
          <div class="pa-cascader-input" :class="[isFocus ? 'is-focus' : '']">
            <!-- tag -->
            <template v-if="tagValue.length > 0 && isMultiple">
              <pa-tag
                :tagList="tagValue"
                :disabled="props.disabled"
                :style="{ width: !waitTag ? '100%' : 'auto' }"
                @remove-tag="removeTag"
              ></pa-tag>
            </template>
            <!-- input -->
            <input
              v-if="waitTag"
              class="pa-cascader-input-inner"
              :value="inputValue"
              :placeholder="inputPlaceholder"
              ref="inputRef"
              :name="id"
              :disabled="props.disabled"
              autocomplete="off"
              @focus="handleFocus"
              @input="handleInput"
            />
            <pa-icon v-if="inValue && clearable" name="close_circle_line" class="clear-icon" @click="clearInput" />
            <pa-icon :class="!isFocus ? 'down-icon' : 'down-icon up-icon'" name="down_line"></pa-icon>
          </div>
        </div>
      </template>
      <div class="pa-cascader-options" ref="optionsRef" v-if="!props.disabled && filterOptionsList.length > 0">
        <!-- <pa-scrollbar noBackTop :useShadow="false" :style="{ height: OptionsHeight }"> -->
        <div class="pa-cascader-options-group">
          <pa-cascader-option
            v-if="!filterValue"
            :exOptions="exOptionsList"
            :inValue="inValue"
            :isMultiple="isMultiple"
            :isCheck="isCheck"
            :flatExOptions="flatExOptions"
            :exOptionsList="exOptionsList"
            :OptionsHeight="OptionsHeight"
          >
            <template #optionLabel="item">
              <slot name="optionLabel" :scope="item"></slot>
            </template>
          </pa-cascader-option>
          <pa-cascader-option
            v-else
            :exOptions="filterOptionsList"
            :inValue="inValue"
            :isMultiple="isMultiple"
            :isCheck="isCheck"
            :OptionsHeight="OptionsHeight"
          >
            <template #optionLabel="item">
              <slot name="optionLabel" :scope="item"></slot>
            </template>
          </pa-cascader-option>
        </div>
        <!-- </pa-scrollbar> -->
      </div>
      <div v-else-if="exOptionsList.length" class="pa-cascader-no-data">{{ languagePackage["empytFind"] }}</div>
      <div v-else class="pa-cascader-no-data">{{ languagePackage["empyt"] }}</div>
    </pa-popover>
  </div>
  <div v-else class="pa-display-style">
    <slot name="exDisplay"></slot>
    <template v-if="$slots.exDisplay"> ( {{ findData(inValue) || "--" }} )</template>
    <template v-else>{{ findData(inValue) || "--" }}</template>
  </div>
  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(inValue, contrastData))"
    :class="['pa-contrast-style']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ findData(contrastData) || "--" }} )</template>
    <template v-else>{{ findData(contrastData) || "--" }}</template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick, provide, inject, ComputedRef } from "vue";
import PaCascaderOption from "./pa-cascader-option.vue";
import { PaCascaderType } from "./type";
import { randChar } from "../tools/rand-char";
import { getElementPosition } from "../utils/getElementPosition";
import { findData as findDataSelect } from "./find-data";
import { PancakeGlobalConfigType } from "../pa-manager/type";

import _ from "lodash";
const { isEqual, isNil, cloneDeep } = _;

const popoverRef = ref();
const selectRef = ref();
const isFocus = ref(false);
const optionsRef = ref();
const inputRef = ref();
const waitTag = ref(false);

const OptionsHeight = ref("auto");

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["cell"] || {};
});
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

const props = withDefaults(defineProps<PaCascaderType>(), {
  id: randChar(),
  type: "cascader",
  clearable: true,
  useSingleText: false,
  useSingleValue: true
});

const emits = defineEmits(["update:modelValue", "change"]);

const inValue = ref(props.modelValue || []);
const exOptionsList = ref(props?.exOptions || []);
const flatExOptions = ref(props?.exOptions || []);

const filterValue = ref("");
const isMultiple = computed(() => {
  return props.type == "multiple-cascader-check" || props.type == "multiple-cascader";
});
const isCheck = computed(() => {
  return props.type == "cascader-check" || props.type == "multiple-cascader-check";
});

const filterOptionsList = computed(() => {
  const filterData = flatExOptions.value.filter(item => {
    const label = typeof item.label === "object" ? item.label[languageValue.value] : item.label;
    return !item.children && label.includes(filterValue.value);
  });
  const exData = filterData.map(item => ({
    label: findParent(item, item.label),
    value: item.value,
    disabled: item.disabled
  }));
  return exData;
});

const inputVal = ref("");
const inputValue = computed(() => {
  if (isFocus.value || isMultiple.value) {
    return inputVal.value;
  } else if (props.useSingleText) {
    return flatExOptions.value.find(item => item.value == inValue.value)?.label || inValue.value || "";
  } else {
    const findItem = flatExOptions.value.find(item => item.value == inValue.value);
    const findText =
      (findItem?.label && typeof findItem?.label === "object" ? findItem?.label[languageValue.value] : findItem?.label) || "";
    return findParent(findItem, findText);
  }
});

const inputPlaceholder = computed(() => {
  const basePlaceholder =
    typeof props.placeholder === "object"
      ? props.placeholder[languageValue.value] || languagePackage.value[`selectPlaceholder`]
      : props.placeholder || languagePackage.value[`selectPlaceholder`];

  if (Array.isArray(inValue.value) && inValue.value?.length && isMultiple.value) {
    return "";
  } else if (isFocus.value) {
    if (props.useSingleText) {
      const _label = flatExOptions.value.find(item => item.value == inValue.value)?.label;
      return (_label && typeof _label === "object" ? _label[languageValue.value] : _label) || basePlaceholder;
    } else {
      const findItem = flatExOptions.value.find(item => item.value == inValue.value);
      const findText =
        (findItem?.label && typeof findItem?.label === "object" ? findItem?.label[languageValue.value] : findItem?.label) || "";
      return findParent(findItem, findText) || basePlaceholder;
    }
  } else {
    return basePlaceholder;
  }
});

const tagValue = computed(() => {
  if (isMultiple.value) {
    if (inValue.value && Array.isArray(inValue.value)) {
      const _InValue: Array<string> = inValue.value.map(item => String(item));
      return flatExOptions.value.filter(item => _InValue.includes(String(item.value)));
    }
    return [];
  } else {
    return [];
  }
});

let oldValue = props.modelValue;

function findParent(item, findText) {
  if (item?.parent) {
    const _findText =
      (typeof item.parent.label === "object" ? item.parent.label[languageValue.value] : item.parent.label) + " / " + findText;
    return findParent(item.parent, _findText);
  }
  return findText;
}

/**
 * 处理输入事件
 * @param {Object} e - 事件对象
 */
function handleInput({ target }) {
  filterValue.value = target.value;
  inputVal.value = target.value;
  OptionsHeight.value = "auto";
  nextTick(() => {
    if (optionsRef.value) {
      const position = getElementPosition(optionsRef.value);
      OptionsHeight.value = ((position?.height && Number(position?.height)) || 0) + "px";
    }
  });
}

function handleFocus() {
  isFocus.value = true;
  setTimeout(() => {
    popoverRef.value.showPopover();
  }, 200);
}

function handlePopoverChange(data) {
  if (!data) {
    isFocus.value = false;
    filterValue.value = "";
    inputVal.value = "";
  } else {
    inputRef.value.focus();
    OptionsHeight.value = "auto";
    setTimeout(() => {
      if (optionsRef.value) {
        const position = getElementPosition(optionsRef.value);
        OptionsHeight.value = ((position?.height && Number(position?.height)) || 0) + "px";
      }
    }, 100);
  }
}

function handleOptionClick(item) {
  if (isMultiple.value) {
    waitTag.value = false;
    if (inValue.value && Array.isArray(inValue.value)) {
      const _InValue: Array<string> = inValue.value.map(item => String(item));
      if (_InValue.includes(String(item.value))) {
        inValue.value = inValue.value.filter(val => item.value != val);
      } else {
        inValue.value.push(item.value);
      }
    }
    nextTick(() => {
      waitTag.value = true;
    });
  } else {
    popoverRef.value.hidePopover();
    inValue.value = item.value;
  }
  emits("update:modelValue", inValue.value);
  emits("change", { value: inValue.value, oldValue, option: item });
  oldValue = inValue.value;
}
provide("handleOptionClick", handleOptionClick);

function removeTag({ value }) {
  if (inValue.value && Array.isArray(inValue.value)) {
    const _InValue: Array<string> = inValue.value.map(item => String(item));
    if (_InValue.includes(String(value))) {
      inValue.value = inValue.value.filter(val => val != value);
    }
  }
  emits("update:modelValue", inValue.value);
  emits("change", { value: inValue.value, oldValue });
  oldValue = inValue.value;
}

function findData(data) {
  if (props.displayValue) {
    return props.displayValue || "--";
  }
  return findDataSelect(data, flatExOptions.value);
}

// 清除输入
function clearInput(e) {
  e.stopPropagation();
  inValue.value = isMultiple.value ? [] : "";
  emits("update:modelValue", "");
  emits("change", { value: "", oldValue });
  oldValue = inValue.value;
}

watch(
  () => props.modelValue,
  data => {
    waitTag.value = false;
    inValue.value = !isNil(data) ? data : isMultiple.value ? [] : "";
    oldValue = !isNil(data) ? data : isMultiple.value ? [] : "";
    nextTick(() => {
      waitTag.value = true;
    });
  },
  { immediate: true }
);

function flatOptions(options) {
  const _options = cloneDeep(options);
  return _options.flatMap(item => {
    if (item.children?.length) {
      const parent = cloneDeep(item);
      delete parent.children;
      item.children = item.children.map(child => ({ ...child, parent }));
      return [item, ...flatOptions(item.children)];
    }
    return [item];
  });
}

function setMapValue(data, parentValue?) {
  if (!data) return [];
  const _data = cloneDeep(data);
  _data.forEach(item => {
    item.value = parentValue ? parentValue + "-" + item.value : String(item.value);
    if (item.children?.length) {
      item.children = setMapValue(item.children, item.value);
    }
  });

  return _data;
}

watch(
  () => props.exOptions,
  data => {
    exOptionsList.value = !props.useSingleValue ? setMapValue(data) : data || [];
    flatExOptions.value = flatOptions(exOptionsList.value);
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
@use "./index.scss";
@use "../cell-style.scss";
</style>
