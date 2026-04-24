<template>
  <div
    class="pa-radio-item"
    :class="[props.class, { 'is-disabled': props.disabled }, { 'is-checked': isChecked }]"
    ref="selectRef"
    :style="{ ...props.style }"
    @click="changeEvent"
  >
    <div class="pa-radio-item-input-inner">
      <div class="pa-radio-item-input">
        <transition name="mo-animation-fade" mode="out-in">
          <div v-if="isChecked" class="pa-radio-item-input-checked"></div>
        </transition>
      </div>
      <div v-if="props.label || $slots.default" class="pa-radio-item-label">
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

const props = withDefaults(defineProps<ComponentItemProps>(), { isChecked: undefined });

const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";

const inValue = ref(props.modelValue);
const emits = defineEmits(["update:modelValue", "change"]);

const isChecked = computed(() => {
  if (!isNil(props.isChecked)) {
    return props.isChecked;
  }
  return inValue.value == props.value;
});

let oldValue = props.modelValue;
function changeEvent() {
  if (props.disabled || !isNil(props.isChecked)) return;
  emits("update:modelValue", props.value);
  emits("change", { value: props.value, oldValue });
  oldValue = props.value;
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
