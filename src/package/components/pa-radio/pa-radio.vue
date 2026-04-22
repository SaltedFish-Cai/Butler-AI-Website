<template>
  <div
    v-if="!display"
    class="pa-radio"
    :class="[props.class]"
    ref="selectRef"
    :style="{ ...props.style }"
    :disabled="props.disabled"
  >
    <pa-radio-item
      v-for="item in exOptionsList"
      :key="String(item.value)"
      :label="item.label"
      :value="item.value"
      :is-checked="inValue == item.value"
      :disabled="props.disabled"
      @change="
        ({ value }) => {
          changeEvent({ value, option: item });
        }
      "
    ></pa-radio-item>
  </div>

  <div v-else class="pa-display-style" :class="[props.class]" :style="{ ...props.style }">
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <div class="pa-display-value_content">
      <slot name="exDisplay"></slot>
      <template v-if="$slots.exDisplay"> ( {{ findData(inValue) || "--" }} )</template>
      <template v-else>{{ findData(inValue) || "--" }}</template>
    </div>
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
import { ref, watch, computed, inject, ComputedRef } from "vue";
import { PaRadioType } from "./type";
import { PancakeGlobalConfigType } from "../pa-manager/type";
import { findData as findDataSelect } from "../utils/find-data";

import _ from "lodash";
const { isEqual, isNil } = _;

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

const props = withDefaults(defineProps<PaRadioType>(), {});
const exOptionsList = ref(props?.exOptions || []);

const inValue = ref(props.modelValue);
const emits = defineEmits(["update:modelValue", "change"]);

let oldValue = props.modelValue;
function changeEvent({ value, option }) {
  if (props.disabled) return;
  inValue.value = value;

  emits("update:modelValue", value);
  emits("change", { value: value, oldValue, option });
  oldValue = value;
}

function findData(data) {
  if (props.displayValue) {
    return props.displayValue || "--";
  }
  return findDataSelect(data, exOptionsList.value, false, languageValue.value);
}

// #Watch modelValue
watch(
  () => props.modelValue,
  data => {
    inValue.value = !isNil(data) ? data : "";
    oldValue = !isNil(data) ? data : "";
  },
  { immediate: true, deep: true }
);

// #Watch exOptionsList
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
