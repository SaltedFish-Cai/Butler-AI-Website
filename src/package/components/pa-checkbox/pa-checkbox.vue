<template>
  <div
    v-if="!display"
    class="pa-checkbox"
    :class="[props.class]"
    ref="selectRef"
    :style="{ ...props.style }"
    :disabled="props.disabled"
  >
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <pa-checkbox-item
      v-for="item in exOptionsList"
      :key="String(item.value)"
      :label="item.label"
      :value="item.value"
      :is-checked="inValue?.includes?.(item.value)"
      :disabled="props.disabled"
      isOption
      @change="
        ({ value }) => {
          changeEvent({ value, option: item });
        }
      "
    ></pa-checkbox-item>
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
import { computed, ComputedRef, inject, ref, watch } from "vue";
import { ComponentProps } from "./type";
import { PancakeGlobalConfigType } from "../pa-manager/type";
import { findData as findDataSelect } from "../utils/find-data";

import _ from "lodash";
const { isEqual, isNil } = _;

const props = withDefaults(defineProps<ComponentProps>(), {});
const exOptionsList = ref(props?.exOptions || []);

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

const inValue = ref(props.modelValue || []);
const emits = defineEmits(["update:modelValue", "change"]);

let oldValue = props.modelValue;
function changeEvent({ value, option }) {
  if (props.disabled) return;
  if (inValue?.value?.includes(value)) {
    inValue.value = inValue.value.filter(item => item !== value);
  } else {
    inValue.value.push(value);
  }
  emits("update:modelValue", inValue.value);
  emits("change", { value: inValue.value, oldValue, option });
  oldValue = inValue.value;
}

function findData(data) {
  if (props.displayValue) {
    return props.displayValue || "--";
  }
  return findDataSelect(data, props.exOptions, false, languageValue.value);
}

// #Watch modelValue
watch(
  () => props.modelValue,
  data => {
    inValue.value = !isNil(data) ? data : [];
    oldValue = !isNil(data) ? data : [];
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
