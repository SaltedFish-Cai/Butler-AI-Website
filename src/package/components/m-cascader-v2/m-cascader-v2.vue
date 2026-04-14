<template>
  <div
    v-if="!display"
    class="m-cascader-v2"
    ref="selectRef"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
  >
    <m-popover-v2
      ref="popoverRef"
      @change="handlePopoverChange"
      :disabled="props.disabled"
      :teleport-to="teleportInContainer ? selectRef : 'body'"
      sticky="left"
      :autoWidth="!exOptionsList.length || !!filterValue"
    >
      <template #reference>
        <div class="m-cascader-v2-content">
          <div class="m-cascader-v2-input" :class="[isFocus ? 'is-focus' : '']">
            <!-- tag -->
            <template v-if="tagValue.length > 0 && isMultiple">
              <m-tag-v2
                :tagList="tagValue"
                :disabled="props.disabled"
                :style="{ width: !waitTag ? '100%' : 'auto' }"
                @remove-tag="removeTag"
              ></m-tag-v2>
            </template>
            <!-- input -->
            <input
              v-if="waitTag"
              class="m-cascader-v2-input-inner"
              :value="inputValue"
              :placeholder="inputPlaceholder"
              ref="inputRef"
              :name="id"
              :disabled="props.disabled"
              autocomplete="off"
              @focus="handleFocus"
              @input="handleInput"
            />
            <m-icon-v2 v-if="inValue && clearable" name="close_circle_line" class="clear-icon" @click="clearInput" />
            <m-icon-v2 :class="!isFocus ? 'down-icon' : 'down-icon up-icon'" name="down_line"></m-icon-v2>
          </div>
        </div>
      </template>
      <div class="m-cascader-v2-options" ref="optionsRef" v-if="!props.disabled && filterOptionsList.length > 0">
        <!-- <m-scrollbar-v2 noBackTop :useShadow="false" :style="{ height: OptionsHeight }"> -->
        <div class="m-cascader-v2-options-group">
          <m-cascader-v2-option
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
          </m-cascader-v2-option>
          <m-cascader-v2-option
            v-else
            :exOptions="filterOptionsList"
            :inValue="inValue"
            :isMultiple="isMultiple"
            :isCheck="isCheck"
            :OptionsHeight="OptionsHeight"
            isFilter
          >
            <template #optionLabel="item">
              <slot name="optionLabel" :scope="item"></slot>
            </template>
          </m-cascader-v2-option>
        </div>
        <!-- </m-scrollbar-v2> -->
      </div>
      <div v-else-if="exOptionsList.length" class="m-cascader-v2-no-data">{{ languagePackage["empytFind"] }}</div>
      <div v-else class="m-cascader-v2-no-data">{{ languagePackage["empyt"] }}</div>
    </m-popover-v2>
  </div>
  <div v-else class="m-display-v2">
    <slot name="exDisplay"></slot>
    <template v-if="$slots.exDisplay"> ( {{ findData(inValue) || "--" }} )</template>
    <template v-else>{{ findData(inValue) || "--" }}</template>
  </div>
  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(inValue, contrastData))"
    :class="['m-contrast-v2']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ findData(contrastData) || "--" }} )</template>
    <template v-else>{{ findData(contrastData) || "--" }}</template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick, provide, inject, ComputedRef } from "vue";
import MCascaderV2Option from "./m-cascader-v2-option.vue";
import { MCascaderV2Type } from "./type";
import lodashPkg, { cloneDeep } from "lodash";
import { randChar } from "../tools/rand-char";
import { getElementPosition } from "../utils/getElementPosition";
import { findData as findDataSelect } from "./find-data";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";

const { isEqual, isNil } = lodashPkg;
const popoverRef = ref();
const selectRef = ref();
const isFocus = ref(false);
const optionsRef = ref();
const inputRef = ref();
const waitTag = ref(false);

const OptionsHeight = ref("auto");

const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;
const languagePackage = computed(() => {
  return ManagerGlobalConfig.value?.language?.package?.["cell"] || {};
});

const props = withDefaults(defineProps<MCascaderV2Type>(), {
  id: randChar(),
  type: "cascader",
  clearable: true,
  useSingleText: false,
  useSingleValue: true
});

const emits = defineEmits(["update:modelValue", "change", "remoteMethod"]);

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
  const filterData = flatExOptions.value.filter(item => !item.children && item.label.includes(filterValue.value));
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
    const findText = findItem?.label || "";
    return findParent(findItem, findText);
  }
});

const inputPlaceholder = computed(() => {
  const language = ManagerGlobalConfig.value?.language?.value || "zh-CN";
  const basePlaceholder =
    typeof props.placeholder === "object"
      ? props.placeholder[language] || languagePackage.value[`selectPlaceholder`]
      : props.placeholder || languagePackage.value[`selectPlaceholder`];

  if (Array.isArray(inValue.value) && inValue.value?.length && isMultiple.value) {
    return "";
  } else if (isFocus.value) {
    if (props.useSingleText) {
      return flatExOptions.value.find(item => item.value == inValue.value)?.label || basePlaceholder;
    } else {
      const findItem = flatExOptions.value.find(item => item.value == inValue.value);
      const findText = findItem?.label || "";
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
    const _findText = item.parent.label + " / " + findText;
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
