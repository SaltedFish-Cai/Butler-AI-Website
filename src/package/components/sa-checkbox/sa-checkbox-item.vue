<template>
  <div
    class="sa-checkbox-item"
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
    <div class="sa-checkbox-item-input-inner">
      <div class="sa-checkbox-item-input">
        <sa-icon v-if="isChecked" name="check_line"></sa-icon>
        <sa-icon v-else-if="isIndeterminate" name="minus"></sa-icon>
      </div>
      <div v-if="props.label || $slots.default" class="sa-checkbox-item-label">
        <slot>{{ props.label }}</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { SaCheckboxItemType } from "./type";
import _ from "lodash";
const { isNil } = _;

const props = withDefaults(defineProps<SaCheckboxItemType>(), {});

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
