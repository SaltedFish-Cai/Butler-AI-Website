<template>
  <div
    v-if="!display"
    class="m-time-v2"
    ref="selectRef"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
  >
    <m-popover-v2
      ref="popoverRef"
      @change="handlePopoverChange"
      :disabled="props.disabled"
      :popoverWidth="!isRange ? 280 : 600"
      :teleportTo="props.teleportInContainer ? selectRef : 'body'"
      :targetClose="false"
    >
      <template #reference>
        <div class="m-time-v2-content">
          <div v-if="!isRange" class="m-time-v2-input" :class="[isFocus ? 'is-focus' : '']">
            <!-- input -->
            <input
              class="m-time-v2-input-inner"
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
          <div v-else class="m-time-v2-input" :class="[isFocus ? 'is-focus' : '']">
            <!-- input -->
            <input
              class="m-time-v2-input-inner center"
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
              class="m-time-v2-input-inner center"
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
import { ref, Ref, computed, watch, inject, ComputedRef } from "vue";
import { MTimeV2Type } from "./type";
import lodashPkg from "lodash";
import { randChar } from "../tools/rand-char";
import MDateTimePanel from "./date-time-panel.vue";
import MYearPanel from "./year-panel.vue";
import { convertValue, isValidDate } from "./utils";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";

const DateTimeMap = {
  "date-picker-group": 1,
  "date-picker": 1,
  "date-time-picker-group": 1,
  "date-time-picker": 1,
  "time-picker-group": 1,
  "time-picker": 1
};
const YearMap = {
  "year-picker-group": 1,
  "year-picker": 1,
  "month-picker-group": 1,
  "month-picker": 1
};

const props = withDefaults(defineProps<MTimeV2Type>(), {
  id: randChar(),
  type: "date-picker"
});

const emits = defineEmits(["update:modelValue", "change", "remoteMethod"]);

const isRange = computed(() => {
  return props.type.endsWith("-group");
});
const { isEqual, isNil, cloneDeep } = lodashPkg;
const popoverRef = ref();
const selectRef = ref();
const isFocus = ref(false);
const inputRef = ref();
const internalValue: Ref<string[] | string | null> = ref(isRange.value ? [] : null);

const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;

const inputPlaceholder = computed(() => {
  const language = ManagerGlobalConfig.value?.language?.value || "zh-CN";
  return typeof props.placeholder === "object"
    ? props.placeholder[language] || languagePackage.value[`selectPlaceholder`]
    : props.placeholder || languagePackage.value[`selectPlaceholder`];
});

const languagePackage = computed(() => {
  return ManagerGlobalConfig.value?.language?.package?.["cell"] || {};
});

const inValue = ref(props.modelValue || []);

let oldValue = props.modelValue;

/**
 * 处理输入事件
 * @param {Object} e - 事件对象
 */
function handleInput({ target }, panel?: "end" | "start") {
  const value = target.value;

  // 验证日期格式
  if (value && !isValidDate(value)) {
    // 如果日期格式不合法，可以在这里处理错误
    window.developLog.log("日期格式不合法:", value, "warning");
    // 可以选择不清空输入，让用户继续编辑
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

function handleFocus() {
  isFocus.value = true;
}

function handlePanelChange(data) {
  internalValue.value = data;
  inValue.value = data;
  emits("update:modelValue", data);
  emits("change", { value: data, oldValue });
  oldValue = data;
  popoverRef.value.hidePopover();
}

function handlePopoverChange(data) {
  if (!data) {
    isFocus.value = false;
  } else {
    internalValue.value = cloneDeep(inValue.value);
  }
}

function findData(data) {
  if (Array.isArray(data) && data.length) {
    const filterData = data?.filter?.(item => !!item);
    return filterData.map(item => convertValue(props.type, item))?.join(` ${languagePackage.value["to"]} `) || "--";
  } else if (!isNil(data)) {
    return convertValue(props.type, data) || "--";
  } else return "--";
}

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
</style>
