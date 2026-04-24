<template>
  <div
    v-if="!display"
    class="pa-select"
    ref="selectRef"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
  >
    <pa-popover
      ref="popoverRef"
      @change="handlePopoverChange"
      :before-close="() => (isFocus ? false : true)"
      :disabled="props.disabled"
      autoWidth
      :teleport-to="teleportInContainer ? selectRef : 'body'"
      :closeByScroll="false"
    >
      <template #reference>
        <div class="pa-select-content">
          <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
            {{ typeof title === "string" ? title : title[languageValue] }}
          </div>
          <div class="pa-select-input" :class="[isFocus ? 'is-focus' : '']">
            <template v-if="tagValue.length > 0 && isMultiple">
              <pa-tag
                :tagList="tagValue"
                :disabled="props.disabled"
                :style="{ width: !waitTag ? '100%' : 'auto' }"
                @remove-tag="removeTag"
              ></pa-tag>
            </template>
            <input
              v-if="waitTag"
              class="pa-select-input-inner"
              :value="inputValue"
              :placeholder="inputPlaceholder"
              ref="inputRef"
              :name="id"
              autocomplete="off"
              :disabled="props.disabled"
              @focus="handleFocus"
              @blur="handleBlur"
              @input="handleInput"
            />
            <pa-icon v-if="inValue && clearable" name="close_circle_line" class="clear-icon" @click="clearInput" />
            <pa-icon :class="!isFocus ? 'down-icon' : 'down-icon up-icon'" name="down_line"></pa-icon>
          </div>
        </div>
      </template>

      <div
        class="pa-select-options"
        style="max-height: 230px"
        ref="optionsRef"
        v-if="!props.disabled && filterOptionsList.length > 0"
      >
        <pa-scrollbar :useBackTop="false" :useShadow="false" :style="{ height: optionsHeight }" :useClosePopover="false">
          <div
            v-for="item in filterOptionsList"
            :key="String(item.value)"
            class="pa-select-option"
            :class="[equalData(item.value, inValue) ? 'is-active' : '']"
            @mouseover="awaitSelecting = true"
            @mouseleave="awaitSelecting = false"
            @click="handleOptionClick(item)"
          >
            <slot name="optionLabel" :scope="item">
              {{ typeof item.label === "object" ? item.label[languageValue] || item.label["zh-CN"] : item.label }}
            </slot>
            <pa-icon name="check_line" class="check-icon"></pa-icon>
          </div>
        </pa-scrollbar>
      </div>
      <div v-else-if="exOptionsList.length" class="pa-select-no-data">{{ languagePackage["empytFind"] }}</div>
      <div v-else class="pa-select-no-data">{{ languagePackage["empyt"] }}</div>
    </pa-popover>
  </div>

  <div v-else class="pa-display-style" :class="[props.class]" :style="{ ...props.style }">
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <div class="pa-display-value_content">
      <slot name="exDisplay"></slot>
      <template v-if="$slots.exDisplay"> ( {{ findData(inValue) || "--" }} ) </template>
      <template v-else>{{ findData(inValue) || "--" }}</template>
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
import { ref, computed, watch, nextTick, ComputedRef, inject, useTemplateRef, onMounted } from "vue";
import { ComponentProps, ComponentEmits } from "./types";
import { equalData } from "../utils/equalData";
import { getElementPosition } from "../utils/getElementPosition";
import { PaOptionType } from "../manager-type";
import { findData as findDataSelect } from "../utils/find-data";
import { PancakeGlobalConfigType } from "../pa-manager/type";
import PaScrollbar from "../pa-scrollbar/pa-scrollbar.vue";

import _ from "lodash";
const { isEqual, isNil, debounce } = _;

const popoverRef = useTemplateRef("popoverRef");
const selectRef = ref();
const isFocus = ref(false);
const optionsRef = ref();
const inputRef = ref();
const waitTag = ref(false);
const awaitSelecting = ref(false);
const optionsHeight = ref("auto");

const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["cell"] || "zh-CN";
});
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

const props = withDefaults(defineProps<ComponentProps>(), {
  type: "select",
  clearable: true
});

const emits = defineEmits<ComponentEmits>();

const inValue = ref(props.modelValue || []);
const exOptionsList = ref(props?.exOptions || []);
const filterValue = ref("");

let oldValue = props.modelValue;

const isMultiple = computed(() => {
  return props.type == "multiple-select" || props.type == "multiple-online-select" || props.type == "multiple-request-select";
});

const isOnlineSelect = computed(() => {
  return props.type == "online-select" || props.type == "multiple-online-select";
});

const isRequestSelect = computed(() => {
  return props.type == "request-select" || props.type == "multiple-request-select";
});

const filterOptionsList = computed(() => {
  if (isOnlineSelect.value) return exOptionsList.value;
  return exOptionsList.value.filter(item => {
    const label = typeof item.label === "object" ? item.label[languageValue.value] : item.label;
    return label.includes(filterValue.value);
  });
});

const inputValue = computed(() => {
  if (isFocus.value || isMultiple.value) {
    return filterValue.value || "";
  } else {
    const data = exOptionsList.value?.find?.(item => item.value == inValue.value)?.label || inValue.value || "";
    if (typeof data === "object") {
      return data[languageValue.value] || data["zh-CN"] || "";
    }
    return data;
  }
});

const inputPlaceholder = computed(() => {
  if (Array.isArray(inValue.value) && inValue.value?.length && isMultiple.value) {
    return "";
  } else if (isFocus.value) {
    const _label = exOptionsList.value.find(item => item.value == inValue.value)?.label;
    return (
      (_label && typeof _label === "object" ? _label[languageValue.value] : _label) ||
      (typeof props.placeholder === "object"
        ? props.placeholder[languageValue.value] || languagePackage.value[`selectPlaceholder`]
        : props.placeholder || languagePackage.value[`selectPlaceholder`])
    );
  } else {
    return typeof props.placeholder === "object"
      ? props.placeholder[languageValue.value] || languagePackage.value[`selectPlaceholder`]
      : props.placeholder || languagePackage.value[`selectPlaceholder`];
  }
});

const tagValue = computed(() => {
  if (isMultiple.value) {
    if (inValue.value && Array.isArray(inValue.value)) {
      const _InValue: Array<string> = inValue.value.map(item => String(item));
      return exOptionsList.value.filter(item => _InValue.includes(String(item.value)));
    }
    return [];
  } else {
    return [];
  }
});

/**
 * **设置选项列表高度**
 * @description 根据内容动态设置选项列表高度
 * */
function setHeight() {
  const position = getElementPosition(optionsRef.value);
  optionsHeight.value = ((position?.height && Number(position?.height)) || 0) + "px";
}

const debounceSetHeight = debounce(setHeight, 100);

/**
 * **处理输入事件**
 * @description 处理输入框输入，过滤选项列表
 * */
async function handleInput({ target }) {
  filterValue.value = target.value;
  optionsHeight.value = "auto";

  if (isOnlineSelect.value) {
    await remoteMethodFn(target.value);
  }

  nextTick(() => {
    if (optionsRef.value) {
      debounceSetHeight();
    }
  });
}

/**
 * **处理聚焦事件**
 * @description 显示弹出层
 * */
function handleFocus() {
  isFocus.value = true;
  popoverRef.value?.showPopover();
}

/**
 * **处理失焦事件**
 * @description 隐藏弹出层
 * */
function handleBlur() {
  if (awaitSelecting.value) return;
  isFocus.value = false;
  popoverRef.value?.hidePopover();
}

/**
 * **处理弹出层状态变化**
 * @description 根据弹出层状态更新组件状态
 * */
function handlePopoverChange(data) {
  if (!data) {
    isFocus.value = false;
    filterValue.value = "";
  } else {
    inputRef.value.focus();
    optionsHeight.value = "auto";
    setTimeout(() => {
      if (optionsRef.value) {
        const position = getElementPosition(optionsRef.value);
        optionsHeight.value = ((position?.height && Number(position?.height)) || 0) + "px";
      }
    }, 100);
  }
}

/**
 * **处理选项点击事件**
 * @description 选择或取消选择选项
 * */
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
    popoverRef.value?.hidePopover();
    inValue.value = item.value;
  }

  emits("update:modelValue", inValue.value);
  emits("change", { value: inValue.value, oldValue, option: item });
  oldValue = inValue.value;
}

/**
 * **处理标签移除事件**
 * @description 从多选值中移除指定标签
 * */
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

/**
 * **查找显示数据**
 * @description 根据 value 查找对应的显示文本
 * */
function findData(data) {
  if (props.displayValue) {
    return props.displayValue || "--";
  }
  return findDataSelect(data, exOptionsList.value, false, languageValue.value);
}

/**
 * **清空输入内容**
 * @description 清空选择器值
 * */
function clearInput(e) {
  e.stopPropagation();
  inValue.value = isMultiple.value ? [] : "";
  emits("update:modelValue", "");
  emits("change", { value: "", oldValue });
  oldValue = "";
  if (isOnlineSelect.value) {
    remoteMethodFn("");
  }
}

/**
 * **远程请求方法**
 * @description 调用 requestApi 获取远程选项
 * */
async function remoteMethodFn(query) {
  if (isRequestSelect.value && exOptionsList.value.length) {
    return [];
  }
  if (props.requestApi) {
    const opt: PaOptionType.SelectList = await props.requestApi({ query: query || "" });
    exOptionsList.value = opt || [];
  } else {
    exOptionsList.value = [];
  }
}

onMounted(() => {
  if (props.createUseChange) {
    const item = exOptionsList.value.find(item => item.value === props.modelValue);
    handleOptionClick(item || {});
  }
});

watch(
  () => props.modelValue,
  data => {
    waitTag.value = false;
    inValue.value = !isNil(data) && data !== "" ? data : isMultiple.value ? [] : "";
    oldValue = !isNil(data) && data !== "" ? data : isMultiple.value ? [] : "";
    if (isOnlineSelect.value || isRequestSelect.value) {
      remoteMethodFn(data);
    }
    nextTick(() => {
      waitTag.value = true;
    });
  },
  { immediate: true }
);

watch(
  () => props.exOptions,
  data => {
    exOptionsList.value = data || [];
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
@use "./index.scss";
@use "../cell-style.scss";
</style>
