<template>
  <div
    class="sa-radio-item"
    :class="[props.class, { 'is-disabled': props.disabled }, { 'is-checked': isChecked }]"
    ref="selectRef"
    :style="{ ...props.style }"
    @click="changeEvent(inValue === props.value ? null : props.value)"
  >
    <div class="sa-radio-item-input-inner">
      <div class="sa-radio-item-input">
        <transition name="mo-animation-fade" mode="out-in">
          <div v-if="isChecked" class="sa-radio-item-input-checked"></div>
        </transition>
      </div>
      <div v-if="props.label || $slots.default" class="sa-radio-item-label">
        <slot>{{ props.label }}</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { SaRadioItemType } from "./type";
import { isNil } from "lodash";

const props = withDefaults(defineProps<SaRadioItemType>(), {});

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
