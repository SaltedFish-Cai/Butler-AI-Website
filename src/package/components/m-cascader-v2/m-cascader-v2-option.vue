<template>
  <div class="m-cascader-v2-option-group-item" style="max-height: 230px" :class="{ 'is-filter': isFilter }">
    <m-scrollbar-v2 :useBackTop="false" :useShadow="false" :style="{ height: OptionsHeight }">
      <div
        v-for="item in exOptions"
        :key="String(item.value)"
        class="m-cascader-v2-option"
        :class="[
          equalData(item.value, activeValue) || equalData(item.value, inValue) ? 'is-active' : '',
          { 'is-filter': isFilter }
        ]"
        @mouseover="handleOptionClick(item, 'over')"
        @click="handleOptionClick(item, 'click')"
      >
        <div class="flex-center-start">
          <m-checkbox-v2-item
            v-if="(isMultiple && isCheck) || (isMultiple && !item.children?.length)"
            :isChecked="equalData(item.value, inValue)"
            class="mr-size-v2"
          >
            <slot name="optionLabel" :scope="item"> {{ item.label }} </slot>
            <template v-if="item.children?.length">({{ item.children.length }})</template></m-checkbox-v2-item
          >
          <m-radio-v2-item v-else-if="isCheck" :isChecked="equalData(item.value, inValue)" class="mr-size-v2">
            <slot name="optionLabel" :scope="item"> {{ item.label }} </slot>
            <template v-if="item.children?.length">({{ item.children.length }})</template></m-radio-v2-item
          >
          <template v-else>
            <slot name="optionLabel" :scope="item"> {{ item.label }} </slot>
            <template v-if="item.children?.length">({{ item.children.length }})</template>
          </template>
        </div>
        <m-icon-v2 v-if="!item.children?.length && !isCheck" name="check_line" class="check-icon"></m-icon-v2>
        <m-icon-v2 v-if="item.children?.length" name="right_line" class="arrow-icon"></m-icon-v2>
      </div>
    </m-scrollbar-v2>
  </div>
  <template v-if="childExOptions.length">
    <m-cascader-v2-option
      :exOptions="childExOptions"
      :inValue="inValue"
      :isMultiple="isMultiple"
      :isCheck="isCheck"
      :OptionsHeight="OptionsHeight"
    >
      <template #optionLabel="item">
        <slot name="optionLabel" :scope="item"></slot>
      </template>
    </m-cascader-v2-option>
  </template>
</template>

<script lang="ts" setup>
import { ref, inject, watch, Ref } from "vue";
import { MCascaderV2OptionType } from "./type";
import { equalData } from "../utils/equalData";
import { MOptionV2Type } from "../manager-type";
import MCascaderV2Option from "./m-cascader-v2-option.vue";

const props = withDefaults(defineProps<MCascaderV2OptionType>(), {});
const childExOptions = ref([] as Array<MOptionV2Type.Select>);
const injectHandleOptionClick: any = inject("handleOptionClick");
const activeValue: Ref<boolean | number | string> = ref("");

function handleOptionClick(item: MOptionV2Type.Select, type: "click" | "over") {
  if (item.children?.length) {
    childExOptions.value = item.children;
    activeValue.value = item.value;
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
