<template>
  <div
    v-if="!display"
    :id="id"
    class="m-switch-v2"
    :class="[inValue == options.activeValue ? 'm-switch-v2-active' : '', props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
    @click="changeEvent"
  >
    <div class="m-switch-v2__inner">
      <div class="m-switch-v2-text m-switch-v2-text-inactive">
        {{ options.inActiveText }}
      </div>
      <div class="m-switch-v2-inner">
        <div class="m-switch-v2-thumb" :style="{ ...props.iconStyle }">
          <m-icon-v2
            style="display: flex"
            v-if="options.activeIcon || options.inActiveIcon"
            :name="inValue == options.activeValue ? options.activeIcon : options.inActiveIcon"
          ></m-icon-v2>
        </div>
      </div>
      <div class="m-switch-v2-text m-switch-v2-text-active">
        {{ options.activeText }}
      </div>
    </div>
  </div>
  <div v-else class="m-display-v2">
    <slot name="exDisplay"></slot>
    <template v-if="$slots.exDisplay"> ( {{ findData(inValue, options, language) || "--" }} )</template>
    <template v-else>{{ findData(inValue, options, language) || "--" }}</template>
  </div>
  <div v-if="alwaysContrast || (!isNil(contrastData) && !isEqual(inValue, contrastData))" :class="['m-contrast-v2']">
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ findData(contrastData, options, language) || "--" }} )</template>
    <template v-else>{{ findData(contrastData, options, language) || "--" }}</template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, inject, ref, Ref, watch } from "vue";
import { MSwitchV2Type } from "./type";
import lodashPkg from "lodash";
import { findData } from "./find-data";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";

const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;

const props = withDefaults(defineProps<MSwitchV2Type>(), {
  activeValue: true,
  inActiveValue: false,
  contrastData: undefined
});
const { isEqual, isNil } = lodashPkg;
// const exOptionsList = ref(props?.exOptions || []);
const language = computed(() => ManagerGlobalConfig.value?.language?.value || "zh-CN");
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
    activeText = ManagerGlobalConfig.value?.language?.value == "zh-CN" ? "是" : "Yes",
    inActiveText = ManagerGlobalConfig.value?.language?.value == "zh-CN" ? "否" : "No"
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
