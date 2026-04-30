<template>
  <div class="pa-cascader-option-group-item" style="max-height: 230px" :class="{ 'is-filter': isFilter }">
    <pa-scrollbar :useBackTop="false" :useShadow="false" :style="optionsHeight ? { height: optionsHeight } : {}">
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
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 * */
import { ref, inject, watch, Ref, computed, ComputedRef } from "vue";
/**
 * **模块导入**
 * @description 导入数据比较工具
 * */
import { equalData } from "../utils/equalData";
/**
 * **模块导入**
 * @description 导入选项类型定义
 * */
import { PaOptionType } from "../manager-type";
/**
 * **模块导入**
 * @description 导入级联选项子组件
 * */
import PaCascaderOption from "./pa-cascader-option.vue";
/**
 * **模块导入**
 * @description 导入全局配置类型
 * */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * **组件属性**
 * @description 组件的属性对象
 * */
const props = withDefaults(
  defineProps<{
    /** **是否选中** @type `boolean` */
    isCheck: boolean;
    /** **是否多选** @type `boolean` */
    isMultiple: boolean;
    /** **是否筛选** @type `boolean` | `undefined` */
    isFilter?: boolean;
    /** **当前选中值** @type `Array<number | string>` | `number` | `string` | `undefined` */
    inValue?: Array<number | string> | number | string;
    /** **选项区域高度** @type `string` | `undefined` */
    optionsHeight?: string;
    /** **选项列表** @type `Array<PaOptionType.Select>` | `undefined` */
    exOptions?: Array<PaOptionType.Select>;
  }>(),
  {}
);
/**
 * **子级选项列表**
 * @type `Ref<Array<PaOptionType.Select>>`
 * @description 当前展开的子级选项
 * */
const childExOptions = ref([] as Array<PaOptionType.Select>);
/**
 * **选项点击处理函数注入**
 * @type `any`
 * @description 从父组件注入的选项点击处理函数
 * */
const injectHandleOptionClick: any = inject("handleOptionClick");
/**
 * **激活值**
 * @type `Ref<boolean | number | string | undefined>`
 * @description 当前鼠标悬停的选项值
 * */
const activeValue: Ref<boolean | number | string | undefined> = ref("");
/**
 * **全局配置注入**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 从父组件注入的全局配置
 * */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * **当前语言值**
 * @type `ComputedRef<string>`
 * @description 当前选中的语言
 * */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
/**
 * **处理选项点击**
 * @param {PaOptionType.Select} item - 选项数据
 * @param {"click" | "over"} type - 事件类型
 * @returns {void}
 * @description 处理选项的点击和悬停事件
 * */
function handleOptionClick(item: PaOptionType.Select, type: "click" | "over"): void {
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
/**
 * **监听 exOptions 变化**
 * @description 当选项列表变化时重置子级选项
 * */
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
/**
 * **查找索引**
 * @param {Array<PaOptionType.Select>} map - 选项列表
 * @param {number[]} arr - 索引数组
 * @param {number[]} parentIndex - 父级索引
 * @returns {void}
 * @description 递归查找匹配值的索引路径
 * */
function findIndex(map: Array<PaOptionType.Select>, arr: number[], parentIndex: number[] = []): void {
  map.forEach((item, index) => {
    if (equalData(item.value, props.inValue)) {
      arr.push(index);
      if (parentIndex && parentIndex.length) arr.unshift(...parentIndex);
    } else if (item.children && item.children.length > 0) {
      findIndex(item.children, arr, [...parentIndex, index]);
    }
  });
}
/**
 * **监听 inValue 变化**
 * @description 当值变化时自动展开对应选项
 * */
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
