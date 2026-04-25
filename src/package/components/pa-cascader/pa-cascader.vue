<template>
  <div
    v-if="!display"
    class="pa-cascader"
    ref="selectRef"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
  >
    <pa-popover
      ref="popoverRef"
      @change="handlePopoverChange"
      :disabled="props.disabled"
      :teleport-to="teleportInContainer ? selectRef : 'body'"
      sticky="left"
      :autoWidth="!exOptionsList.length || !!filterValue"
      :closeByScroll="false"
    >
      <template #reference>
        <div class="pa-cascader-content">
          <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
            {{ typeof title === "string" ? title : title[languageValue] }}
          </div>
          <div class="pa-cascader-input" :class="[isFocus ? 'is-focus' : '']">
            <template v-if="tagValue.length > 0 && isMultiple">
              <pa-tag
                :tagList="tagValue"
                :disabled="props.disabled"
                :style="{ width: !waitTag ? '100%' : 'auto' }"
                @remove-tag="removeTag"
              ></pa-tag>
            </template>
            <input
              v-if="waitTag"
              class="pa-cascader-input-inner"
              :value="inputValue"
              :placeholder="inputPlaceholder"
              ref="inputRef"
              :name="id"
              :disabled="props.disabled"
              autocomplete="off"
              @focus="handleFocus"
              @input="handleInput"
            />
            <pa-icon v-if="inValue && clearable" name="close_circle_line" class="clear-icon" @click="clearInput" />
            <pa-icon :class="!isFocus ? 'down-icon' : 'down-icon up-icon'" name="down_line"></pa-icon>
          </div>
        </div>
      </template>
      <div class="pa-cascader-options" ref="optionsRef" v-if="!props.disabled && filterOptionsList.length > 0">
        <div class="pa-cascader-options-group">
          <pa-cascader-option
            v-if="!filterValue"
            :exOptions="exOptionsList"
            :inValue="inValue"
            :isMultiple="isMultiple"
            :isCheck="isCheck"
            :flatExOptions="flatExOptions"
            :exOptionsList="exOptionsList"
            :optionsHeight="optionsHeight"
          >
            <template #optionLabel="item">
              <slot name="optionLabel" :scope="item"></slot>
            </template>
          </pa-cascader-option>
          <pa-cascader-option
            v-else
            :exOptions="filterOptionsList"
            :inValue="inValue"
            :isMultiple="isMultiple"
            :isCheck="isCheck"
            :optionsHeight="optionsHeight"
          >
            <template #optionLabel="item">
              <slot name="optionLabel" :scope="item"></slot>
            </template>
          </pa-cascader-option>
        </div>
      </div>
      <div v-else-if="exOptionsList.length" class="pa-cascader-no-data">{{ languagePackage["empytFind"] }}</div>
      <div v-else class="pa-cascader-no-data">{{ languagePackage["empyt"] }}</div>
    </pa-popover>
  </div>

  <div v-else class="pa-display-style" :class="[props.class]" :style="{ ...props.style }">
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <div class="pa-display-value_content">
      <slot name="exDisplay"></slot>
      <template v-if="$slots.exDisplay"> ( {{ findData(inValue) || "--" }} )</template>
      <template v-else>{{ findData(inValue) || "--" }}</template>
    </div>
  </div>

  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(inValue, contrastData))"
    :class="['pa-contrast-style']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ findData(contrastData) || "--" }} )</template>
    <template v-else>{{ findData(contrastData) || "--" }}</template>
  </div>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 * */
import { ref, computed, watch, nextTick, provide, inject, ComputedRef } from "vue";

/**
 * **模块导入**
 * @description 导入级联选项子组件
 * */
import PaCascaderOption from "./pa-cascader-option.vue";

/**
 * **模块导入**
 * @description 导入组件类型定义
 * */
import { ComponentProps, ComponentEmits } from "./types";

/**
 * **模块导入**
 * @description 导入元素位置获取工具
 * */
import { getElementPosition } from "../utils/getElementPosition";

/**
 * **模块导入**
 * @description 导入数据查找工具
 * */
import { findData as findDataSelect } from "../utils/find-data";

/**
 * **模块导入**
 * @description 导入全局配置类型
 * */
import { PancakeGlobalConfigType } from "../pa-manager/type";

import { PaOptionType } from "@/package/components/manager-type";

/**
 * **模块导入**
 * @description 导入 lodash 工具函数
 * */
import _ from "lodash";
const { isEqual, isNil, cloneDeep } = _;

/**
 * **Popover 组件引用**
 * @type `Ref`
 * @description 弹出层组件的引用
 * */
const popoverRef = ref();

/**
 * **选择器容器引用**
 * @type `Ref`
 * @description 选择器容器的 DOM 引用
 * */
const selectRef = ref();

/**
 * **焦点状态**
 * @type `Ref<boolean>`
 * @description 当前是否处于焦点状态
 * */
const isFocus = ref(false);

/**
 * **选项列表引用**
 * @type `Ref`
 * @description 选项列表容器的 DOM 引用
 * */
const optionsRef = ref();

/**
 * **输入框引用**
 * @type `Ref`
 * @description 输入框的 DOM 引用
 * */
const inputRef = ref();

/**
 * **等待标签状态**
 * @type `Ref<boolean>`
 * @description 是否等待标签渲染完成
 * */
const waitTag = ref(false);

/**
 * **选项列表高度**
 * @type `Ref<string>`
 * @description 选项列表的高度值
 * */
const optionsHeight = ref("auto");

/**
 * **全局配置注入**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 从父组件注入的全局配置
 * */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;

/**
 * **语言包**
 * @type `ComputedRef`
 * @description 当前语言的文本配置
 * */
const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["cell"] || {};
});

/**
 * **当前语言值**
 * @type `ComputedRef<string>`
 * @description 当前选中的语言
 * */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

/**
 * **组件属性**
 * @type `ComponentProps`
 * @description 组件的属性对象
 * */
const props = withDefaults(defineProps<ComponentProps>(), {
  type: "cascader",
  clearable: true,
  useTextByLink: true
});

/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
const emit = defineEmits<ComponentEmits>();

/**
 * **当前值**
 * @type `Ref<Array<number | string> | number | string>`
 * @description 当前选中的值
 * */
const inValue = ref<Array<number | string> | number | string>(props.modelValue || []);

/**
 * **选项列表**
 * @type `Ref<Array<PaOptionType.Select>>`
 * @description 外部传入的选项列表
 * */
const exOptionsList = ref(props?.exOptions || []);

/**
 * **扁平化选项列表**
 * @type `Ref<Array<PaOptionType.Select>>`
 * @description 扁平化处理后的选项列表
 * */
const flatExOptions = ref(props?.exOptions || []);

/**
 * **过滤值**
 * @type `Ref<string>`
 * @description 输入框过滤值
 * */
const filterValue = ref("");

/**
 * **是否多选模式**
 * @type `ComputedRef<boolean>`
 * @description 根据类型判断是否为多选模式
 * */
const isMultiple = computed(() => {
  return props.type == "multiple-cascader-check" || props.type == "multiple-cascader";
});

/**
 * **是否带复选框**
 * @type `ComputedRef<boolean>`
 * @description 根据类型判断是否显示复选框
 * */
const isCheck = computed(() => {
  return props.type == "cascader-check" || props.type == "multiple-cascader-check";
});

/**
 * **过滤后的选项列表**
 * @type `ComputedRef<Array<PaOptionType.Select>>`
 * @description 根据输入值过滤后的选项列表
 * */
const filterOptionsList = computed(() => {
  const filterData = flatExOptions.value.filter(item => {
    const label = typeof item.label === "object" ? item.label[languageValue.value] : item.label;
    return !item.children && label.includes(filterValue.value);
  });
  const exData = filterData.map(item => ({
    label: findParent(item, item.label),
    value: item.value,
    disabled: item.disabled
  }));
  return exData;
});

/**
 * **输入框值**
 * @type `Ref<string>`
 * @description 输入框中显示的值
 * */
const inputVal = ref("");

/**
 * **输入框显示值**
 * @type `ComputedRef<string>`
 * @description 输入框中实际显示的文本
 * */
const inputValue = computed(() => {
  if (isFocus.value || isMultiple.value) {
    return inputVal.value;
  } else if (!props.useTextByLink) {
    return flatExOptions.value.find(item => item.value == inValue.value)?.label || inValue.value || "";
  } else {
    const findItem = flatExOptions.value.find(item => item.value == inValue.value);
    const findText =
      (findItem?.label && typeof findItem?.label === "object" ? findItem?.label[languageValue.value] : findItem?.label) || "";
    return findParent(findItem, findText);
  }
});

/**
 * **输入框占位符**
 * @type `ComputedRef<string>`
 * @description 输入框的占位符文本
 * */
const inputPlaceholder = computed(() => {
  const basePlaceholder =
    typeof props.placeholder === "object"
      ? props.placeholder[languageValue.value] || languagePackage.value[`selectPlaceholder`]
      : props.placeholder || languagePackage.value[`selectPlaceholder`];

  if (Array.isArray(inValue.value) && inValue.value?.length && isMultiple.value) {
    return "";
  } else if (isFocus.value) {
    if (!props.useTextByLink) {
      const _label = flatExOptions.value.find(item => item.value == inValue.value)?.label;
      return (_label && typeof _label === "object" ? _label[languageValue.value] : _label) || basePlaceholder;
    } else {
      const findItem = flatExOptions.value.find(item => item.value == inValue.value);
      const findText =
        (findItem?.label && typeof findItem?.label === "object" ? findItem?.label[languageValue.value] : findItem?.label) || "";
      return findParent(findItem, findText) || basePlaceholder;
    }
  } else {
    return basePlaceholder;
  }
});

/**
 * **标签值列表**
 * @type `ComputedRef<Array<PaOptionType.Select>>`
 * @description 多选模式下显示的标签列表
 * */
const tagValue = computed(() => {
  if (isMultiple.value) {
    if (inValue.value && Array.isArray(inValue.value)) {
      const _InValue: Array<string> = inValue.value.map(item => String(item));
      return flatExOptions.value.filter(item => _InValue.includes(String(item.value)));
    }
    return [];
  } else {
    return [];
  }
});

/**
 * **旧值存储**
 * @type `Array<number | string> | number | string`
 * @description 用于存储上一次的值，用于对比
 * */
let oldValue: Array<number | string> | number | string = props.modelValue || typeof props.modelValue === "string" ? "" : [];

/**
 * **查找父级标签**
 * @param {PaOptionType.Select} item - 当前选项
 * @param {string | object} findText - 当前文本
 * @returns {string} 拼接后的完整路径文本
 * @description 递归查找父级并拼接标签路径
 * */
function findParent(item: PaOptionType.Select | undefined, findText: object | string): string {
  if (item?.parent) {
    const _findText =
      (typeof item.parent.label === "object" ? item.parent.label[languageValue.value] : item.parent.label) + " / " + findText;
    return findParent(item.parent, _findText);
  }
  return findText as string;
}

/**
 * **处理输入事件**
 * @param {Event} event - 输入事件对象
 * @returns {void}
 * @description 处理输入框输入事件，更新过滤值
 * */
function handleInput({ target }): void {
  filterValue.value = target.value;
  inputVal.value = target.value;
  optionsHeight.value = "auto";
  nextTick(() => {
    if (optionsRef.value) {
      const position = getElementPosition(optionsRef.value);
      optionsHeight.value = ((position?.height && Number(position?.height)) || 0) + "px";
    }
  });
}

/**
 * **处理焦点事件**
 * @returns {void}
 * @description 处理输入框获取焦点事件
 * */
function handleFocus(): void {
  isFocus.value = true;
  setTimeout(() => {
    popoverRef.value.showPopover();
  }, 200);
}

/**
 * **处理弹出层变化**
 * @param {boolean} data - 弹出层显示状态
 * @returns {void}
 * @description 处理弹出层显示/隐藏状态变化
 * */
function handlePopoverChange(data: boolean): void {
  if (!data) {
    isFocus.value = false;
    filterValue.value = "";
    inputVal.value = "";
  } else {
    inputRef.value.focus();
    optionsHeight.value = "auto";
    setTimeout(() => {
      if (optionsRef.value) {
        const position = getElementPosition(optionsRef.value);
        optionsHeight.value = ((position?.height && Number(position?.height)) || 0) + "px";
      }
    }, 100);
  }
}

/**
 * **处理选项点击**
 * @param {PaOptionType.Select} item - 被点击的选项
 * @returns {void}
 * @description 处理选项点击事件，更新选中值
 * */
function handleOptionClick(item: PaOptionType.Select): void {
  if (isMultiple.value) {
    waitTag.value = false;
    if (inValue.value && Array.isArray(inValue.value)) {
      const _InValue: Array<string> = inValue.value.map(item => String(item));
      if (_InValue.includes(String(item.value))) {
        inValue.value = inValue.value.filter(val => item.value != val);
      } else {
        inValue.value.push(typeof item.value === "string" ? item.value : String(item.value));
      }
    }
    nextTick(() => {
      waitTag.value = true;
    });
  } else {
    popoverRef.value.hidePopover();
    inValue.value = typeof item.value === "string" ? item.value : String(item.value);
  }
  emit("update:modelValue", inValue.value);
  emit("change", { value: inValue.value, oldValue, option: item });
  oldValue = inValue.value;
}
provide("handleOptionClick", handleOptionClick);

/**
 * **移除标签**
 * @param {object} param - 包含要移除值的对象
 * @returns {void}
 * @description 从多选值中移除指定标签
 * */
function removeTag({ value }): void {
  if (inValue.value && Array.isArray(inValue.value)) {
    const _InValue: Array<string> = inValue.value.map(item => String(item));
    if (_InValue.includes(String(value))) {
      inValue.value = inValue.value.filter(val => val != value);
    }
  }
  emit("update:modelValue", inValue.value);
  emit("change", { value: inValue.value, oldValue, option: {} as PaOptionType.Select });
  oldValue = inValue.value;
}

/**
 * **查找数据显示**
 * @param {Array<number | string> | number | string} data - 要查找的数据
 * @returns {string} 查找到的显示文本
 * @description 根据值查找对应的显示文本
 * */
function findData(data: Array<number | string> | number | string): string {
  if (props.displayValue) {
    return props.displayValue || "--";
  }
  return findDataSelect(data, flatExOptions.value, props.useTextByLink, languageValue.value);
}

/**
 * **清除输入**
 * @param {MouseEvent} e - 鼠标事件
 * @returns {void}
 * @description 清空当前选中的值
 * */
function clearInput(e: MouseEvent): void {
  e.stopPropagation();
  inValue.value = isMultiple.value ? [] : "";
  emit("update:modelValue", "");
  emit("change", { value: "", oldValue, option: {} as PaOptionType.Select });
  oldValue = inValue.value;
}

/**
 * **监听 modelValue 变化**
 * @description 同步外部传入的值到内部状态
 * */
watch(
  () => props.modelValue,
  data => {
    waitTag.value = false;
    inValue.value = !isNil(data) ? data : isMultiple.value ? [] : "";
    oldValue = !isNil(data) ? data : isMultiple.value ? [] : "";
    nextTick(() => {
      waitTag.value = true;
    });
  },
  { immediate: true }
);

/**
 * **扁平化选项列表**
 * @param {Array<PaOptionType.Select>} options - 选项列表
 * @returns {Array<PaOptionType.Select>} 扁平化后的列表
 * @description 将树形选项列表转换为扁平结构
 * */
function flatOptions(options: Array<PaOptionType.Select>): Array<PaOptionType.Select> {
  const _options = cloneDeep(options);
  return _options.flatMap(item => {
    if (item.children?.length) {
      const parent = cloneDeep(item);
      delete parent.children;
      item.children = item.children.map(child => ({ ...child, parent }));
      return [item, ...flatOptions(item.children)];
    }
    return [item];
  });
}

/**
 * **设置映射值**
 * @param {Array<PaOptionType.Select>} data - 选项数据
 * @param {string} parentValue - 父级值
 * @returns {Array<PaOptionType.Select>} 处理后的数据
 * @description 递归设置选项值的映射关系
 * */
function setMapValue(data: Array<PaOptionType.Select>, parentValue?: string): Array<PaOptionType.Select> {
  if (!data) return [];
  const _data = cloneDeep(data);
  _data.forEach(item => {
    item.value = parentValue ? parentValue + "-" + item.value : String(item.value);
    if (item.children?.length) {
      item.children = setMapValue(item.children, item.value);
    }
  });
  return _data;
}

/**
 * **监听 exOptions 变化**
 * @description 同步外部传入的选项列表
 * */
watch(
  () => props.exOptions,
  data => {
    exOptionsList.value = props.useValueBylink ? setMapValue(data) : data || [];
    flatExOptions.value = flatOptions(exOptionsList.value);
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
@use "./index.scss";
@use "../cell-style.scss";
</style>
