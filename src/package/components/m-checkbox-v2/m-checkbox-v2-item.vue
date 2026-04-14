<template>
  <div
    class="m-checkbox-v2-item"
    :class="[
      props.class,
      { 'is-disabled': props.disabled },
      { 'is-checked': isChecked },
      { 'is-indeterminate': isIndeterminate }
    ]"
    ref="selectRef"
    :style="{ ...props.style }"
    @click="changeEvent(inValue === props.value ? null : props.value)"
  >
    <div class="m-checkbox-v2-item-input-inner">
      <div class="m-checkbox-v2-item-input">
        <m-icon-v2 v-if="isChecked" name="check_line"></m-icon-v2>
        <m-icon-v2 v-else-if="isIndeterminate" name="minus"></m-icon-v2>
      </div>
      <div v-if="props.label || $slots.default" class="m-checkbox-v2-item-label">
        <slot>{{ props.label }}</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { MCheckboxV2ItemType } from "./type";
import { isNil } from "lodash";

const props = withDefaults(defineProps<MCheckboxV2ItemType>(), {});

const inValue = ref(props.modelValue);
const emits = defineEmits(["update:modelValue", "change"]);

const isChecked = computed(() => {
  if (!isNil(props.isChecked)) {
    return props.isChecked;
  }
  return inValue.value == props.value;
});

let oldValue = props.modelValue;
function changeEvent(value) {
  if (props.disabled) return;
  emits("update:modelValue", value);
  emits("change", { value: value, oldValue });
  oldValue = value;
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
