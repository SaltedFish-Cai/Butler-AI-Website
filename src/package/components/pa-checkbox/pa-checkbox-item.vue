<template>
  <div
    class="pa-checkbox-item"
    :class="[
      props.class,
      { 'is-disabled': props.disabled },
      { 'is-checked': isChecked },
      { 'is-indeterminate': isIndeterminate }
    ]"
    ref="selectRef"
    :style="{ ...props.style }"
    @click="changeEvent"
  >
    <div class="pa-checkbox-item-input-inner">
      <div class="pa-checkbox-item-input">
        <pa-icon v-if="isChecked" name="check_line"></pa-icon>
        <pa-icon v-else-if="isIndeterminate" name="minus"></pa-icon>
      </div>
      <div v-if="props.label || $slots.default" class="pa-checkbox-item-label">
        <slot>{{ typeof props.label === "object" ? props.label[language] : props.label }}</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, inject, ref, watch } from "vue";
import { ComponentItemProps } from "./type";
import { PancakeGlobalConfigType } from "../pa-manager/type";

import _ from "lodash";
const { isNil } = _;

const props = withDefaults(defineProps<ComponentItemProps & { isOption?: boolean }>(), { isChecked: undefined });

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";

const inValue = ref(props.modelValue);
const emits = defineEmits(["update:modelValue", "change"]);

const isChecked = computed(() => {
  if (!isNil(props.isChecked)) {
    return props.isChecked;
  } else if (props.isIndeterminate) {
    return false;
  }
  return inValue.value == props.value;
});

let oldValue = props.modelValue;
function changeEvent() {
  if (props.disabled || !isNil(props.isChecked) || props.isIndeterminate) return;
  inValue.value = props.isOption ? props.value : inValue.value == props.value ? false : props.value;
  if (props.disabled) return;
  emits("update:modelValue", inValue.value);
  emits("change", { value: inValue.value, oldValue });
  oldValue = inValue.value;
  return;
}

// #Watch modelValue
watch(
  () => props.modelValue,
  data => {
    inValue.value = data;
    oldValue = data;
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
