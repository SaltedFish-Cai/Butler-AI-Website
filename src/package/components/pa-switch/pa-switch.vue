<template>
  <div
    v-if="!display"
    :id="id"
    class="pa-switch"
    :class="[inValue == options.activeValue ? 'pa-switch-active' : '', props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
    @click="changeEvent"
  >
    <div class="pa-switch__inner">
      <div class="pa-switch-text pa-switch-text-inactive">
        {{ options.inActiveText }}
      </div>
      <div class="pa-switch-inner">
        <div class="pa-switch-thumb" :style="{ ...props.iconStyle }">
          <pa-icon
            style="display: flex"
            v-if="options.activeIcon || options.inActiveIcon"
            :name="inValue == options.activeValue ? options.activeIcon : options.inActiveIcon"
          ></pa-icon>
        </div>
      </div>
      <div class="pa-switch-text pa-switch-text-active">
        {{ options.activeText }}
      </div>
    </div>
  </div>
  <div v-else class="pa-display-style">
    <slot name="exDisplay"></slot>
    <template v-if="$slots.exDisplay"> ( {{ findData(inValue, options, language) || "--" }} )</template>
    <template v-else>{{ findData(inValue, options, language) || "--" }}</template>
  </div>
  <div v-if="alwaysContrast || (!isNil(contrastData) && !isEqual(inValue, contrastData))" :class="['pa-contrast-style']">
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ findData(contrastData, options, language) || "--" }} )</template>
    <template v-else>{{ findData(contrastData, options, language) || "--" }}</template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, inject, ref, Ref, watch } from "vue";
import { PaSwitchType } from "./type";
import { findData } from "./find-data";
import { PancakeGlobalConfigType } from "../pa-manager/type";

import _ from "lodash";
const { isEqual, isNil } = _;

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;

const props = withDefaults(defineProps<PaSwitchType>(), {
  activeValue: 1,
  inActiveValue: 0,
  contrastData: undefined
});
// const exOptionsList = ref(props?.exOptions || []);
const language = computed(() => PancakeGlobalConfig.value?.language?.value || "zh-CN");
const inValue: Ref<boolean | number | string | undefined> = ref(props.modelValue);
const emits = defineEmits(["update:modelValue", "change"]);

let oldValue = props.modelValue;
function changeEvent() {
  if (props.disabled || props.display) return;
  const value = inValue.value == options.value.activeValue ? options.value.inActiveValue : options.value.activeValue;
  emits("update:modelValue", value);
  emits("change", { value, oldValue });
  oldValue = value;
}

function changeType(type, opts) {
  if (type == "string") {
    return {
      activeValue: String(opts.activeValue),
      inActiveValue: String(opts.inActiveValue),
      activeText: opts.activeText,
      inActiveText: opts.inActiveText,
      activeIcon: opts.activeIcon,
      inActiveIcon: opts.inActiveIcon
    };
  } else if (type == "number") {
    return {
      activeValue: Number(opts.activeValue),
      inActiveValue: Number(opts.inActiveValue),
      activeText: opts.activeText,
      inActiveText: opts.inActiveText,
      activeIcon: opts.activeIcon,
      inActiveIcon: opts.inActiveIcon
    };
  } else {
    return {
      activeValue: opts.activeValue,
      inActiveValue: opts.inActiveValue,
      activeText: opts.activeText,
      inActiveText: opts.inActiveText,
      activeIcon: opts.activeIcon,
      inActiveIcon: opts.inActiveIcon
    };
  }
}

const options = computed(() => {
  const typeIs = typeof inValue.value;
  const {
    activeValue = true,
    inActiveValue = false,
    activeText = PancakeGlobalConfig.value?.language?.value == "zh-CN" ? "是" : "Yes",
    inActiveText = PancakeGlobalConfig.value?.language?.value == "zh-CN" ? "否" : "No"
  } = props.exOptions || props;

  const _opt = changeType(typeIs, {
    activeValue: activeValue,
    inActiveValue: inActiveValue,
    activeText: typeof activeText == "string" ? activeText : activeText[language.value] || activeText["zh-CN"],
    inActiveText: typeof inActiveText == "string" ? inActiveText : inActiveText[language.value] || inActiveText["zh-CN"],
    activeIcon: props.activeIcon,
    inActiveIcon: props.inActiveIcon
  });
  return _opt;
});

watch(
  () => props.modelValue,
  data => {
    inValue.value = !isNil(data) ? data : options.value.inActiveValue;
    oldValue = !isNil(data) ? data : options.value.inActiveValue;
    emits("update:modelValue", !isNil(data) ? data : options.value.inActiveValue);
  },
  { immediate: true }
);
</script>

<style lang="scss">
@use "./index.scss";
@use "../cell-style.scss";
</style>
