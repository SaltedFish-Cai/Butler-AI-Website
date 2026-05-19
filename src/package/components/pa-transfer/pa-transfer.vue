<template>
  <div v-if="!display" class="pa-transfer" ref="selectRef" :class="[props.class, { 'is-disabled': props.disabled }]" :style="rootStyle">
    <div class="pa-transfer-select-box">
      <div class="pa-transfer-select-box_title">
        <div class="flex-center">
          <pa-checkbox-item
            isOption
            :disabled="props.disabled"
            :is-indeterminate="awaitSelectList.length > 0"
            :isChecked="awaitSelectList.length === searchAllSelectList.length && searchAllSelectList.length > 0"
            @change="handleCheckedChange('left')"
          ></pa-checkbox-item>
          {{ languagePackage["unSelected"] }}
        </div>
        <pa-input v-if="useSearch" style="width: 1px; flex: 1" class="ml-size" :disabled="props.disabled" v-model="searchAll" />
      </div>
      <div class="pa-transfer-select-box_options">
        <pa-scrollbar :useBackTop="false" :useScrollX="false" :padding="['top', 'bottom']">
          <pa-empty
            v-if="searchAllSelectList.length === 0"
            :style="emptyStyle"
            :message="searchAll.length ? { 'zh-CN': '无匹配数据', 'en-US': 'No match data' } : { 'zh-CN': '无更多数据', 'en-US': 'No more data' }"
          ></pa-empty>
          <div v-else v-for="(item, index) in searchAllSelectList" :key="String(item.value)" class="pa-transfer-option" @click="handleOptionClick(item, 'left', index)">
            <pa-checkbox-item :disabled="props.disabled" :isChecked="item.value ? awaitSelectList.includes(item.value) : false">{{ item.label }}</pa-checkbox-item>
          </div>
        </pa-scrollbar>
      </div>
    </div>
    <div class="pa-transfer-transfer">
      <pa-button icon-name="left_line" :disabled="props.disabled || awaitSelectedList.length === 0" @click="handleTransferClick('left')"></pa-button>
      <pa-button icon-name="right_line" :disabled="props.disabled || awaitSelectList.length === 0" @click="handleTransferClick('right')"></pa-button>
    </div>
    <div class="pa-transfer-select-box">
      <div class="pa-transfer-select-box_title">
        <div class="flex-center">
          <pa-checkbox-item
            isOption
            :disabled="props.disabled"
            :is-indeterminate="awaitSelectedList.length > 0"
            :isChecked="awaitSelectedList.length === filterSelectedList.length && filterSelectedList.length > 0"
            @change="handleCheckedChange('right')"
          ></pa-checkbox-item>
          {{ languagePackage["selected"] }}
        </div>
        <pa-input v-if="useSearch" style="width: 1px; flex: 1" class="ml-size" :disabled="props.disabled" v-model="searchSelected" />
      </div>
      <div class="pa-transfer-select-box_options">
        <pa-scrollbar :useBackTop="false" :useScrollX="false" :padding="['top', 'bottom']">
          <pa-empty
            v-if="filterSelectedList.length === 0"
            :style="emptyStyle"
            :message="searchSelected.length ? { 'zh-CN': '无匹配数据', 'en-US': 'No match data' } : { 'zh-CN': '无更多数据', 'en-US': 'No more data' }"
          ></pa-empty>
          <div v-else v-for="(item, index) in filterSelectedList" :key="String(item.value)" class="pa-transfer-option" @click="handleOptionClick(item, 'right', index)">
            <pa-checkbox-item :disabled="props.disabled" :isChecked="awaitSelectedList.includes(item.value)">{{ item.label }}</pa-checkbox-item>
          </div>
        </pa-scrollbar>
      </div>
    </div>
  </div>
  <div v-else class="pa-display-style">
    <slot name="exDisplay"></slot>
    <template v-if="exOptionsList?.length || displayValue">
      <template v-if="$slots.exDisplay"> ( {{ findData(selectedList.map(item => item.value)) || "--" }} )</template>
      <template v-else>{{ findData(selectedList.map(item => item.value)) || "--" }}</template>
    </template>
    <div v-else>--</div>
  </div>
  <div v-if="useContrast" :class="['pa-contrast-style']">
    <div v-if="exOptionsList?.length">
      <slot name="exContrast"></slot>
      <template v-if="$slots.exContrast"> ( {{ findData(contrastData || []) || "--" }} )</template>
      <template v-else>{{ findData(contrastData || []) || "--" }}</template>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 核心响应式 API
 */
import { ref, Ref, computed, watch, onMounted, onUnmounted, inject, ComputedRef } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import type { ComponentProps, ComponentEmits } from "./types";
/**
 * 模块导入
 * @description 导入随机字符生成工具
 */
import { randChar } from "../tools/rand-char";
/**
 * 模块导入
 * @description 导入选项类型定义
 */
import { PaOptionType } from "../manager-type";
/**
 * 模块导入
 * @description 导入数据查找工具函数
 */
import { findData as findDataSelect } from "./find-data";
/**
 * 模块导入
 * @description 导入全局配置类型定义
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 模块导入
 * @description 导入空值判断工具
 */
import isNil from "../tools/is-nil";
/**
 * 模块导入
 * @description 导入值相等判断工具
 */
import isEqual from "../tools/is-equal";
/**
 * 语言包映射
 * @description 穿梭框组件的语言文本映射表
 */
const LANGUAGE_MAP: Record<string, Record<string, string>> = {
  "zh-CN": { unSelected: "未选择", selected: "已选择" },
  "en-US": { unSelected: "Unselected", selected: "Selected" }
};
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  id: randChar(),
  height: "300px"
});
/**
 * 组件事件
 * @description 组件的 emits 定义
 */
const emits = defineEmits<ComponentEmits>();
/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 注入全局配置对象
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 当前语言值
 * @type ComputedRef<string>
 * @description 当前选中的语言
 */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
/**
 * 语言包
 * @description 当前语言的文本配置
 */
const languagePackage = computed(() => LANGUAGE_MAP[languageValue.value]);
/**
 * 外置数据选项列表
 * @type Ref<PaOptionType.SelectList>
 * @description 外置数据选项列表
 */
const exOptionsList: Ref<PaOptionType.SelectList> = ref(props?.exOptions || []);
/**
 * 左侧搜索关键词
 * @type Ref<string>
 * @description 左侧搜索关键词
 */
const searchAll = ref("");
/**
 * 右侧搜索关键词
 * @type Ref<string>
 * @description 右侧搜索关键词
 */
const searchSelected = ref("");
/**
 * 已选中列表
 * @type Ref<PaOptionType.SelectList>
 * @description 已选中列表
 */
const selectedList: Ref<PaOptionType.SelectList> = ref([]);
/**
 * 左侧待选中列表
 * @type Ref<Array<boolean | number | string>>
 * @description 左侧待选中列表
 */
const awaitSelectList: Ref<Array<boolean | number | string>> = ref([]);
/**
 * 右侧待取消选中列表
 * @type Ref<Array<boolean | number | string>>
 * @description 右侧待取消选中列表
 */
const awaitSelectedList: Ref<Array<boolean | number | string>> = ref([]);
/**
 * 组件根元素引用
 * @type Ref<HTMLElement | undefined>
 * @description 组件根元素引用
 */
const selectRef = ref();
/**
 * Shift 键是否按下
 * @type Ref<boolean>
 * @description Shift 键是否按下
 */
const isShiftPressed = ref(false);
/**
 * 左侧搜索过滤后的未选中列表
 * @type ComputedRef<PaOptionType.SelectList>
 * @description 左侧搜索过滤后的未选中列表
 */
const searchAllSelectList = computed(() => {
  const _selectedList = selectedList.value.map(item => item.value);
  const filterList = exOptionsList.value.filter(item => !_selectedList.includes(item.value));
  if (searchAll.value)
    return filterList.filter(item => {
      const _label = typeof item.label == "string" ? item.label : item.label[languageValue.value];
      return _label.includes(searchAll.value);
    });
  return filterList;
});
/**
 * 右侧搜索过滤后的已选中列表
 * @type ComputedRef<PaOptionType.SelectList>
 * @description 右侧搜索过滤后的已选中列表
 */
const filterSelectedList = computed(() => {
  if (searchSelected.value) {
    return selectedList.value.filter(item => {
      const _label = typeof item.label == "string" ? item.label : item.label[languageValue.value];
      return _label.includes(searchSelected.value);
    });
  }
  return selectedList.value;
});
/**
 * 根元素样式
 * @type ComputedRef<Record<string, string | number>>
 * @description 根元素的动态样式
 */
const rootStyle = computed(() => ({
  ...props.style,
  height: props.height
}));
/**
 * 空状态样式
 * @type ComputedRef<Record<string, string>>
 * @description 空状态容器的动态样式
 */
const emptyStyle = computed(() => ({
  height: `calc(${props.height} - 75px)`,
  marginTop: "0px",
  marginBottom: "0px"
}));
/**
 * 是否使用对比模式
 * @type ComputedRef<boolean>
 * @description 根据 alwaysContrast 和 contrastData 判断是否显示对比数据
 */
const useContrast = computed(() => {
  if (isNil(props.contrastData)) return false;
  if (props.alwaysContrast) return true;
  return !isEqual(
    selectedList.value.map(item => item.value),
    props.contrastData
  );
});
/**
 * 旧值
 * @description 用于 change 事件对比的旧值缓存
 */
let oldValue = props.modelValue || [];
/**
 * 左侧上次点击索引
 * @description 左侧 Shift 多选的起始索引
 */
let leftOldIndex = -1;
/**
 * 右侧上次点击索引
 * @description 右侧 Shift 多选的起始索引
 */
let rightOldIndex = -1;
/**
 * 左侧添加或删除标记
 * @description 1=添加 2=删除
 */
let leftAddOrDel = 1;
/**
 * 右侧添加或删除标记
 * @description 1=添加 2=删除
 */
let rightAddOrDel = 1;
/**
 * 处理键盘按下事件
 * @param event - 键盘事件对象
 * @returns void
 * @description 监听 Shift 键按下
 */
function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === "Shift") {
    isShiftPressed.value = true;
  }
}
/**
 * 处理键盘抬起事件
 * @param event - 键盘事件对象
 * @returns void
 * @description 监听 Shift 键抬起
 */
function handleKeyUp(event: KeyboardEvent): void {
  if (event.key === "Shift") {
    isShiftPressed.value = false;
  }
}
/**
 * 处理选项点击事件
 * @param item - 点击的选项对象
 * @param direction - 方向 left 或 right
 * @param index - 选项索引
 * @returns void
 * @description 点击选项时切换选中状态，支持 Shift 多选
 */
function handleOptionClick(item: PaOptionType.Select, direction: string, index: number): void {
  if (props.disabled) return;
  if (direction === "left") {
    const start = Math.min(leftOldIndex, index);
    const end = Math.max(leftOldIndex, index);
    let splitArr: Array<boolean | number | string> = [item.value];
    if (leftOldIndex != -1 && isShiftPressed.value) {
      splitArr = searchAllSelectList.value.slice(start, end + 1).map(item => item.value);
    }
    leftAddOrDel = awaitSelectList.value.includes(item.value) ? 2 : 1;
    if (leftAddOrDel == 2) {
      awaitSelectList.value = awaitSelectList.value.filter(val => !splitArr.includes(val));
    } else {
      awaitSelectList.value = Array.from(new Set([...awaitSelectList.value, ...splitArr]));
    }
    leftOldIndex = index;
  } else {
    const start = Math.min(rightOldIndex, index);
    const end = Math.max(rightOldIndex, index);
    let splitArr: Array<boolean | number | string> = [item.value];
    if (rightOldIndex != -1 && isShiftPressed.value) {
      splitArr = filterSelectedList.value.slice(start, end + 1).map(item => item.value);
    }
    rightAddOrDel = awaitSelectedList.value.includes(item.value) ? 2 : 1;
    if (rightAddOrDel == 2) {
      awaitSelectedList.value = awaitSelectedList.value.filter(val => !splitArr.includes(val));
    } else {
      awaitSelectedList.value = Array.from(new Set([...awaitSelectedList.value, ...splitArr]));
    }
    rightOldIndex = index;
  }
}
/**
 * 处理穿梭按钮点击事件
 * @param direction - 方向 left 或 right
 * @returns void
 * @description 点击穿梭按钮时将选中项移动到对面列表
 */
function handleTransferClick(direction: string): void {
  if (props.disabled) return;
  if (direction === "left") {
    selectedList.value = selectedList.value.filter(item => !awaitSelectedList.value.includes(item.value));
    awaitSelectedList.value = [];
    searchSelected.value = "";
  } else if (direction === "right") {
    selectedList.value = [...selectedList.value, ...awaitSelectList.value.map(item => ({ value: item, label: findDataSelect(item, exOptionsList.value) }))];
    searchAll.value = "";
    awaitSelectList.value = [];
  }
  emits(
    "update:modelValue",
    selectedList.value.map(item => item.value)
  );
  emits("change", { value: selectedList.value.map(item => item.value), oldValue });
  oldValue = selectedList.value.map(item => item.value);
}
/**
 * 处理全选/取消全选
 * @param direction - 方向 left 或 right
 * @returns void
 * @description 切换当前列表的全选状态
 */
function handleCheckedChange(direction: string): void {
  if (props.disabled) return;
  if (direction === "left") {
    if (awaitSelectList.value.length === searchAllSelectList.value.length) {
      awaitSelectList.value.length = 0;
    } else {
      awaitSelectList.value = searchAllSelectList.value.map(item => item.value);
    }
  } else if (direction === "right") {
    if (awaitSelectedList.value.length === filterSelectedList.value.length) {
      awaitSelectedList.value.length = 0;
    } else {
      awaitSelectedList.value = selectedList.value.map(item => item.value);
    }
  }
}
/**
 * 查找数据标签
 * @param data - 数据值数组
 * @returns 对应的标签字符串
 * @description 根据 value 查找对应的 label
 */
function findData(data: Array<boolean | number | string>): string {
  if (props.displayValue) {
    return props.displayValue || "--";
  }
  return findDataSelect(data, exOptionsList.value);
}
/**
 * 组件挂载
 * @description 组件挂载时添加键盘事件监听
 */
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
});
/**
 * 组件卸载
 * @description 组件卸载时移除键盘事件监听
 */
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
});
/**
 * 监听 modelValue 和 exOptions
 * @description 同步外部数据到内部状态，合并两个 watcher 消除挂载时重复初始化
 */
watch(
  [() => props.modelValue, () => props.exOptions],
  ([modelValue, exOptions]) => {
    exOptionsList.value = exOptions || [];
    if (exOptions && modelValue && Array.isArray(modelValue)) {
      selectedList.value = exOptions.filter(item => modelValue.includes(item.value));
      oldValue = selectedList.value.map(item => item.value);
    }
  },
  { immediate: true }
);
</script>

<style lang="scss">
@use "./index.scss";
</style>
