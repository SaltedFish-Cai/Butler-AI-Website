<template>
  <div
    v-if="!display"
    class="sa-select"
    ref="selectRef"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
  >
    <sa-popover
      ref="popoverRef"
      @change="handlePopoverChange"
      :before-close="() => (isFocus ? false : true)"
      :disabled="props.disabled"
      autoWidth
      :teleport-to="teleportInContainer ? selectRef : 'body'"
    >
      <template #reference>
        <div class="sa-select-content">
          <div class="sa-select-input" :class="[isFocus ? 'is-focus' : '']">
            <!-- tag -->
            <template v-if="tagValue.length > 0 && isMultiple">
              <sa-tag
                :tagList="tagValue"
                :disabled="props.disabled"
                :style="{ width: !waitTag ? '100%' : 'auto' }"
                @remove-tag="removeTag"
              ></sa-tag>
            </template>
            <!-- input -->
            <input
              v-if="waitTag"
              class="sa-select-input-inner"
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
            <sa-icon v-if="inValue && clearable" name="close_circle_line" class="clear-icon" @click="clearInput" />
            <sa-icon :class="!isFocus ? 'down-icon' : 'down-icon up-icon'" name="down_line"></sa-icon>
          </div>
        </div>
      </template>
      <div
        class="sa-select-options"
        style="max-height: 230px"
        ref="optionsRef"
        v-if="!props.disabled && filterOptionsList.length > 0"
      >
        <sa-scrollbar :useBackTop="false" :useShadow="false" :style="{ height: OptionsHeight }" :useClosePopover="false">
          <div
            v-for="item in filterOptionsList"
            :key="String(item.value)"
            class="sa-select-option"
            :class="[equalData(item.value, inValue) ? 'is-active' : '']"
            @mouseover="awaitSelecting = true"
            @mouseleave="awaitSelecting = false"
            @click="handleOptionClick(item)"
          >
            <slot name="optionLabel" :scope="item"> {{ item.label }} </slot>
            <sa-icon name="check_line" class="check-icon"></sa-icon>
          </div>
        </sa-scrollbar>
      </div>
      <div v-else-if="exOptionsList.length" class="sa-select-no-data">{{ languagePackage["empytFind"] }}</div>
      <div v-else class="sa-select-no-data">{{ languagePackage["empyt"] }}</div>
    </sa-popover>
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
import { ref, computed, watch, nextTick, ComputedRef, inject, useTemplateRef } from "vue";
import { SaSelectType } from "./type";
import lodashPkg from "lodash";
import { randChar } from "../tools/rand-char";
import { equalData } from "../utils/equalData";
import { getElementPosition } from "../utils/getElementPosition";
import { MOptionV2Type } from "../manager-type";
import { findData as findDataSelect } from "./find-data";
import { SaltedGlobalConfigType } from "../sa-content/type";
import SaScrollBar from "../sa-scrollbar/sa-scrollbar.vue";

const { isEqual, isNil, debounce } = lodashPkg;
const popoverRef = useTemplateRef("popoverRef");
const selectRef = ref();
const isFocus = ref(false);
const optionsRef = ref();
const inputRef = ref();
const waitTag = ref(false);
const awaitSelecting = ref(false);

const OptionsHeight = ref("auto");

const SaltedGlobalConfig = inject("SaltedGlobalConfig") as ComputedRef<SaltedGlobalConfigType>;
const languagePackage = computed(() => {
  return SaltedGlobalConfig.value?.language?.package?.["cell"] || "zh-CN";
});

const props = withDefaults(defineProps<SaSelectType>(), {
  id: randChar(),
  type: "select",
  clearable: true
});

const emits = defineEmits(["update:modelValue", "change", "remoteMethod"]);

const inValue = ref(props.modelValue || []);
const exOptionsList = ref(props?.exOptions || []);
const filterValue = ref("");
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
  return exOptionsList.value.filter(item => item.label.includes(filterValue.value));
});
const inputValue = computed(() => {
  if (isFocus.value || isMultiple.value) {
    return filterValue.value || "";
  } else {
    const data = exOptionsList.value.find(item => item.value == inValue.value)?.label || inValue.value || "";
    return data;
  }
});

const inputPlaceholder = computed(() => {
  const language = SaltedGlobalConfig.value?.language?.value || "zh-CN";
  if (Array.isArray(inValue.value) && inValue.value?.length && isMultiple.value) {
    return "";
  } else if (isFocus.value) {
    return (
      exOptionsList.value.find(item => item.value == inValue.value)?.label ||
      (typeof props.placeholder === "object"
        ? props.placeholder[language] || languagePackage.value[`selectPlaceholder`]
        : props.placeholder || languagePackage.value[`selectPlaceholder`])
    );
  } else {
    return typeof props.placeholder === "object"
      ? props.placeholder[language] || languagePackage.value[`selectPlaceholder`]
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

let oldValue = props.modelValue;

/**
 * 处理输入事件
 * @param {Object} e - 事件对象
 */

function setHeight() {
  const position = getElementPosition(optionsRef.value);
  OptionsHeight.value = ((position?.height && Number(position?.height)) || 0) + "px";
}

const debounceSetHeight = debounce(setHeight, 100);
async function handleInput({ target }) {
  filterValue.value = target.value;
  OptionsHeight.value = "auto";

  if (isOnlineSelect.value) {
    await remoteMethodFn(target.value);
  }

  nextTick(() => {
    if (optionsRef.value) {
      debounceSetHeight();
    }
  });
}

function handleFocus() {
  isFocus.value = true;
  popoverRef.value?.showPopover();
}

function handleBlur() {
  if (awaitSelecting.value) return;
  isFocus.value = false;
  popoverRef.value?.hidePopover();
}

function handlePopoverChange(data) {
  if (!data) {
    isFocus.value = false;
    filterValue.value = "";
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

/**
 * 处理选项点击事件
 * @param {Object} item - 点击的选项对象
 */
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
 * 处理标签移除事件
 * @param {Object} item - 点击的标签对象
 */
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
  return findDataSelect(data, exOptionsList.value);
}

/**
 * 清除输入事件
 * @param {Object} e - 事件对象
 */
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
 * 远程方法
 * @param {string} query - 查询字符串
 */
async function remoteMethodFn(query) {
  if (isRequestSelect.value && exOptionsList.value.length) {
    return [];
  }
  if (props.requestApi) {
    const opt: MOptionV2Type.SelectList = await props.requestApi({ query: query || "" });
    exOptionsList.value = opt || [];
  } else {
    exOptionsList.value = [];
  }
}

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
