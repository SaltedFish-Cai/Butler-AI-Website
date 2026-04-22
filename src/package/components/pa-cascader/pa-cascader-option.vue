<template>
  <div class="pa-cascader-option-group-item" style="max-height: 230px" :class="{ 'is-filter': isFilter }">
    <pa-scrollbar :useBackTop="false" :useShadow="false" :style="{ height: optionsHeight }">
      <div
        v-for="item in exOptions"
        :key="String(item.value)"
        class="pa-cascader-option"
        :class="[
          equalData(item.value, activeValue) || equalData(item.value, inValue) ? 'is-active' : '',
          { 'is-filter': isFilter }
        ]"
        @mouseover="handleOptionClick(item, 'over')"
        @click="handleOptionClick(item, 'click')"
      >
        <div class="flex-center-start">
          <pa-checkbox-item
            v-if="(isMultiple && isCheck) || (isMultiple && !item.children?.length)"
            :isChecked="equalData(item.value, inValue)"
            class="mr-size"
          >
            <slot name="optionLabel" :scope="item">
              {{ typeof item.label === "object" ? item.label[languageValue] || item.label["zh-CN"] : item.label }}
            </slot>
            <template v-if="item.children?.length">({{ item.children.length }})</template></pa-checkbox-item
          >
          <pa-radio-item v-else-if="isCheck" :isChecked="equalData(item.value, inValue)" class="mr-size">
            <slot name="optionLabel" :scope="item">
              {{ typeof item.label === "object" ? item.label[languageValue] || item.label["zh-CN"] : item.label }}
            </slot>
            <template v-if="item.children?.length">({{ item.children.length }})</template></pa-radio-item
          >
          <template v-else>
            <slot name="optionLabel" :scope="item">
              {{ typeof item.label === "object" ? item.label[languageValue] || item.label["zh-CN"] : item.label }}
            </slot>
            <template v-if="item.children?.length">({{ item.children.length }})</template>
          </template>
        </div>
        <pa-icon v-if="!item.children?.length && !isCheck" name="check_line" class="check-icon"></pa-icon>
        <pa-icon v-if="item.children?.length" name="right_line" class="arrow-icon"></pa-icon>
      </div>
    </pa-scrollbar>
  </div>
  <template v-if="childExOptions.length">
    <pa-cascader-option
      :exOptions="childExOptions"
      :inValue="inValue"
      :isMultiple="isMultiple"
      :isCheck="isCheck"
      :optionsHeight="optionsHeight"
    >
      <template #optionLabel="item">
        <slot name="optionLabel" :scope="item"></slot>
      </template>
    </pa-cascader-option>
  </template>
</template>

<script lang="ts" setup>
import { ref, inject, watch, Ref, computed, ComputedRef } from "vue";
import { equalData } from "../utils/equalData";
import { PaOptionType } from "../manager-type";
import PaCascaderOption from "./pa-cascader-option.vue";
import { PancakeGlobalConfigType } from "../pa-manager/type";

const props = withDefaults(
  defineProps<{
    isCheck: boolean;
    isMultiple: boolean;
    isFilter?: boolean;
    inValue?: Array<number | string> | number | string;
    optionsHeight?: string;
    exOptions?: Array<PaOptionType.Select>;
  }>(),
  {}
);
const childExOptions = ref([] as Array<PaOptionType.Select>);
const injectHandleOptionClick: any = inject("handleOptionClick");
const activeValue: Ref<boolean | number | string | undefined> = ref("");

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

function handleOptionClick(item: PaOptionType.Select, type: "click" | "over") {
  if (item.children?.length) {
    childExOptions.value = item.children;
    activeValue.value = item.value;
  } else {
    childExOptions.value = [];
    activeValue.value = "";
  }

  if ((type === "click" && props.isCheck) || (type === "click" && !item.children?.length)) {
    injectHandleOptionClick(item);
  }
}

watch(
  () => props.exOptions,
  () => {
    childExOptions.value = [];
  },
  {
    immediate: true,
    deep: true
  }
);

function findIndex(map, arr, parentIndex?) {
  // 遍历当前层级的所有选项
  map.forEach((item, index) => {
    // 使用equalData函数比较当前项的值与目标值是否相等
    if (equalData(item.value, props.inValue)) {
      // 如果找到匹配的值，将当前层级的下标添加到路径数组中
      arr.push(index);
      if (parentIndex) arr.unshift(...parentIndex);
    }
    // 如果当前项有子节点，递归查找子节点
    else if (item.children && item.children.length > 0) {
      // 先递归查找子节点
      findIndex(item.children, arr, [...parentIndex, index]);
    }
  });
}
watch(
  () => props.inValue,
  data => {
    const indexMap: number[] = [];
    if (data && props.exOptions) {
      findIndex(props.exOptions, indexMap, []);
      if (indexMap.length) {
        handleOptionClick(props.exOptions[indexMap[0]], "over");
      }
    }
  },
  {
    immediate: true
  }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
