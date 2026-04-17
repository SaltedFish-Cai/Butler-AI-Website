<template>
  <div
    v-if="!display"
    class="sa-radio"
    :class="[props.class]"
    ref="selectRef"
    :style="{ ...props.style }"
    :disabled="props.disabled"
  >
    <sa-radio-item
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
    ></sa-radio-item>
  </div>
  <div v-else class="sa-display-style">
    <slot name="exDisplay"></slot>
    <template v-if="$slots.exDisplay"> ( {{ findData(inValue) || "--" }} )</template>
    <template v-else>{{ findData(inValue) || "--" }}</template>
  </div>

  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(inValue, contrastData))"
    :class="['sa-contrast-style']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ findData(contrastData) || "--" }} )</template>
    <template v-else>{{ findData(contrastData) || "--" }}</template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { SaRadioType } from "./type";

import _ from "lodash";
const { isEqual, isNil } = _;

const props = withDefaults(defineProps<SaRadioType>(), {});
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
  let text = "";
  const options = props.exOptions;
  if (options?.length) {
    const row = data;
    for (let index = 0; index < options.length; index++) {
      const option = options[index];
      if (option.value == row) {
        text += option.label;
      }
    }
  }
  return text || "--";
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
