<template>
  <div
    v-if="!display"
    class="pa-select"
    ref="selectRef"
    :class="[props.class, { 'is-disabled': props.disabled }]"
    :style="{ ...props.style }"
  >
    <pa-popover
      ref="popoverRef"
      @change="handlePopoverChange"
      :before-close="() => (isFocus ? false : true)"
      :disabled="props.disabled"
      autoWidth
      :teleport-to="teleportInContainer ? selectRef : 'body'"
      :closeByScroll="false"
    >
      <template #reference>
        <div class="pa-select-content">
          <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
            {{ typeof title === "string" ? title : title[languageValue] }}
          </div>
          <div class="pa-select-input" :class="[isFocus ? 'is-focus' : '']">
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
              class="pa-select-input-inner"
              :value="inputValue"
              :placeholder="inputPlaceholder"
              ref="inputRef"
              :name="id"
              autocomplete="off"
              :disabled="props.disabled"
              @focus="handleFocus"
              @blur="handleBlur"
              @input="handleInput"
            />
            <pa-icon v-if="inValue && clearable" name="close_circle_line" class="clear-icon" @click="clearInput" />
            <pa-icon :class="!isFocus ? 'down-icon' : 'down-icon up-icon'" name="down_line"></pa-icon>
          </div>
        </div>
      </template>

      <div
        class="pa-select-options"
        style="max-height: 230px"
        ref="optionsRef"
        v-if="!props.disabled && filterOptionsList.length > 0"
      >
        <pa-scrollbar :useBackTop="false" :useShadow="false" :style="{ height: optionsHeight }" :useClosePopover="false">
          <div
            v-for="item in filterOptionsList"
            :key="String(item.value)"
            class="pa-select-option"
            :class="[equalData(item.value, inValue) ? 'is-active' : '']"
            @mouseover="awaitSelecting = true"
            @mouseleave="awaitSelecting = false"
            @click="handleOptionClick(item)"
          >
            <slot name="optionLabel" :scope="item">
              {{ typeof item.label === "object" ? item.label[languageValue] || item.label["zh-CN"] : item.label }}
            </slot>
            <pa-icon name="check_line" class="check-icon"></pa-icon>
          </div>
        </pa-scrollbar>
      </div>
      <div v-else-if="exOptionsList.length" class="pa-select-no-data">{{ languagePackage["empytFind"] }}</div>
      <div v-else class="pa-select-no-data">{{ languagePackage["empyt"] }}</div>
    </pa-popover>
  </div>

  <div v-else class="pa-display-style" :class="[props.class]" :style="{ ...props.style }">
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <div class="pa-display-value_content">
      <slot name="exDisplay"></slot>
      <template v-if="$slots.exDisplay"> ( {{ findData(inValue) || "--" }} ) </template>
      <template v-else>{{ findData(inValue) || "--" }}</template>
    </div>
  </div>

  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(inValue, contrastData))"
    :class="['pa-contrast-style']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ findData(contrastData) || "--" }} ) </template>
    <template v-else>{{ findData(contrastData) || "--" }}</template>
  </div>
</template>

<script lang="ts" setup>
/**
 * 模块导入
 * @description 导入 Vue 组合式 API
 */
import { ref, computed, watch, nextTick, ComputedRef, inject, useTemplateRef, onMounted } from "vue";
/**
 * 模块导入
 * @description 导入组件类型定义
 */
import { ComponentProps, ComponentEmits } from "./types";
/**
 * 模块导入
 * @description 导入数据比较工具函数
 */
import { equalData } from "../utils/equalData";
/**
 * 模块导入
 * @description 导入元素位置获取工具函数
 */
import { getElementPosition } from "../utils/getElementPosition";
/**
 * 模块导入
 * @description 导入选项类型定义
 */
import { PaOptionType } from "../manager-type";
/**
 * 模块导入
 * @description 导入数据查找工具函数
 */
import { findData as findDataSelect } from "../utils/find-data";
/**
 * 模块导入
 * @description 导入全局配置类型
 */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * 模块导入
 * @description 导入滚动条组件
 */
import PaScrollbar from "../pa-scrollbar/pa-scrollbar.vue";
/**
 * 模块导入
 * @description 导入 lodash 工具函数
 */
import _ from "lodash";
const { isEqual, isNil, debounce } = _;
/**
 * 弹出层引用
 * @type any
 * @description 弹出层组件引用
 */
const popoverRef = useTemplateRef("popoverRef");
/**
 * 选择器容器引用
 * @type any
 * @description 选择器容器 DOM 元素引用
 */
const selectRef = ref();
/**
 * 聚焦状态
 * @type boolean
 * @description 当前是否处于聚焦状态
 */
const isFocus = ref(false);
/**
 * 选项列表引用
 * @type any
 * @description 选项列表容器 DOM 元素引用
 */
const optionsRef = ref();
/**
 * 输入框引用
 * @type any
 * @description 输入框 DOM 元素引用
 */
const inputRef = ref();
/**
 * 等待标签渲染标志
 * @type boolean
 * @description 控制多选标签的渲染时机
 */
const waitTag = ref(false);
/**
 * 等待选择中标志
 * @type boolean
 * @description 鼠标是否在选项上悬停
 */
const awaitSelecting = ref(false);
/**
 * 选项列表高度
 * @type string
 * @description 选项列表的动态高度
 */
const optionsHeight = ref("auto");
/**
 * 全局配置注入
 * @type ComputedRef<PancakeGlobalConfigType>
 * @description 注入全局配置对象
 */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * 语言包
 * @returns Record<string, string> 语言包对象
 * @description 获取当前语言包配置
 */
const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["cell"] || "zh-CN";
});
/**
 * 语言值
 * @returns string 语言代码
 * @description 获取当前语言设置
 */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
/**
 * 组件属性
 * @type ComponentProps
 * @description 组件的属性对象
 */
const props = withDefaults(defineProps<ComponentProps>(), {
  type: "select",
  clearable: true
});
/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
const emits = defineEmits<ComponentEmits>();
/**
 * 是否多选模式
 * @returns boolean 是否为多选模式
 * @description 判断当前是否为多选选择器
 */
const isMultiple = computed(() => {
  return props.type == "multiple-select" || props.type == "multiple-online-select" || props.type == "multiple-request-select";
});
/**
 * 内部值
 * @type any
 * @description 选择器的内部绑定值
 */
const inValue = ref(props.modelValue || []);
/**
 * 扩展选项列表
 * @type Array<any>
 * @description 处理后的选项列表
 */
const exOptionsList = ref(props?.exOptions || []);
/**
 * 过滤值
 * @type string
 * @description 输入框过滤关键词
 */
const filterValue = ref("");
/**
 * 旧值存储
 * @type Array<number | string> | number | string
 * @description 存储上一次的值，用于变更事件
 */
let oldValue: Array<number | string> | number | string = props.modelValue || (isMultiple.value ? [] : "");
/**
 * 是否在线选择器
 * @returns boolean 是否为在线选择器
 * @description 判断当前是否为在线搜索选择器
 */
const isOnlineSelect = computed(() => {
  return props.type == "online-select" || props.type == "multiple-online-select";
});
/**
 * 是否请求选择器
 * @returns boolean 是否为请求选择器
 * @description 判断当前是否为远程请求选择器
 */
const isRequestSelect = computed(() => {
  return props.type == "request-select" || props.type == "multiple-request-select";
});
/**
 * 过滤后的选项列表
 * @returns Array<any> 过滤后的选项列表
 * @description 根据输入关键词过滤选项列表
 */
const filterOptionsList = computed(() => {
  if (isOnlineSelect.value) return exOptionsList.value;
  return exOptionsList.value.filter(item => {
    const label = typeof item.label === "object" ? item.label[languageValue.value] : item.label;
    return label.includes(filterValue.value);
  });
});
/**
 * 输入框显示值
 * @returns string 输入框显示的文本
 * @description 计算输入框应显示的文本内容
 */
const inputValue = computed(() => {
  if (isFocus.value || isMultiple.value) {
    return filterValue.value || "";
  } else {
    const data = exOptionsList.value?.find?.(item => item.value == inValue.value)?.label || inValue.value || "";
    if (typeof data === "object") {
      return data[languageValue.value] || data["zh-CN"] || "";
    }
    return data;
  }
});
/**
 * 输入框占位符
 * @returns string 占位符文本
 * @description 计算输入框的占位符文本
 */
const inputPlaceholder = computed(() => {
  if (Array.isArray(inValue.value) && inValue.value?.length && isMultiple.value) {
    return "";
  } else if (isFocus.value) {
    const _label = exOptionsList.value.find(item => item.value == inValue.value)?.label;
    return (
      (_label && typeof _label === "object" ? _label[languageValue.value] : _label) ||
      (typeof props.placeholder === "object"
        ? props.placeholder[languageValue.value] || languagePackage.value[`selectPlaceholder`]
        : props.placeholder || languagePackage.value[`selectPlaceholder`])
    );
  } else {
    return typeof props.placeholder === "object"
      ? props.placeholder[languageValue.value] || languagePackage.value[`selectPlaceholder`]
      : props.placeholder || languagePackage.value[`selectPlaceholder`];
  }
});
/**
 * 标签值列表
 * @returns Array<any> 标签数据列表
 * @description 多选模式下已选中的标签数据
 */
const tagValue = computed(() => {
  if (isMultiple.value) {
    if (inValue.value && Array.isArray(inValue.value)) {
      const _InValue: Array<string> = inValue.value.map(item => String(item));
      return exOptionsList.value.filter(item => _InValue.includes(String(item.value)));
    }
    return [];
  } else {
    return [];
  }
});
/**
 * 设置选项列表高度
 * @description 根据内容动态设置选项列表高度
 */
function setHeight() {
  const position = getElementPosition(optionsRef.value);
  optionsHeight.value = ((position?.height && Number(position?.height)) || 0) + "px";
}
/**
 * 防抖设置高度函数
 * @type Function
 * @description 防抖处理的高度设置函数
 */
const debounceSetHeight = debounce(setHeight, 100);
/**
 * 处理输入事件
 * @description 处理输入框输入，过滤选项列表
 */
async function handleInput({ target }) {
  filterValue.value = target.value;
  optionsHeight.value = "auto";
  if (isOnlineSelect.value) {
    await remoteMethodFn(target.value);
  }
  nextTick(() => {
    if (optionsRef.value) {
      debounceSetHeight();
    }
  });
}
/**
 * 处理聚焦事件
 * @description 显示弹出层
 */
function handleFocus() {
  isFocus.value = true;
  popoverRef.value?.showPopover();
}
/**
 * 处理失焦事件
 * @description 隐藏弹出层
 */
function handleBlur() {
  if (awaitSelecting.value) return;
  isFocus.value = false;
  popoverRef.value?.hidePopover();
}
/**
 * 处理弹出层状态变化
 * @description 根据弹出层状态更新组件状态
 */
function handlePopoverChange(data) {
  if (!data) {
    isFocus.value = false;
    filterValue.value = "";
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
 * 处理选项点击事件
 * @description 选择或取消选择选项
 */
function handleOptionClick(item) {
  if (isMultiple.value) {
    waitTag.value = false;
    if (inValue.value && Array.isArray(inValue.value)) {
      const _InValue: Array<string> = inValue.value.map(item => String(item));
      if (_InValue.includes(String(item.value))) {
        inValue.value = inValue.value.filter(val => item.value != val);
      } else {
        inValue.value.push(item.value);
      }
    }
    nextTick(() => {
      waitTag.value = true;
    });
  } else {
    popoverRef.value?.hidePopover();
    inValue.value = item.value;
  }
  emits("update:modelValue", inValue.value);
  emits("change", { value: inValue.value, oldValue, option: item });
  oldValue = inValue.value;
}
/**
 * 处理标签移除事件
 * @description 从多选值中移除指定标签
 */
function removeTag({ value }) {
  if (inValue.value && Array.isArray(inValue.value)) {
    const _InValue: Array<string> = inValue.value.map(item => String(item));
    if (_InValue.includes(String(value))) {
      inValue.value = inValue.value.filter(val => val != value);
    }
  }
  emits("update:modelValue", inValue.value);
  emits("change", { value: inValue.value, oldValue });
  oldValue = inValue.value;
}
/**
 * 查找显示数据
 * @description 根据 value 查找对应的显示文本
 */
function findData(data) {
  if (props.displayValue) {
    return props.displayValue || "--";
  }
  return findDataSelect(data, exOptionsList.value, false, languageValue.value);
}
/**
 * 清空输入内容
 * @description 清空选择器值
 */
function clearInput(e) {
  e.stopPropagation();
  inValue.value = isMultiple.value ? [] : "";
  emits("update:modelValue", "");
  emits("change", { value: "", oldValue });
  oldValue = "";
  if (isOnlineSelect.value) {
    remoteMethodFn("");
  }
}
/**
 * 远程请求方法
 * @description 调用 requestApi 获取远程选项
 */
async function remoteMethodFn(query) {
  if (isRequestSelect.value && exOptionsList.value.length) {
    return [];
  }
  if (props.requestApi) {
    const opt: PaOptionType.SelectList = await props.requestApi({ query: query || "" });
    exOptionsList.value = opt || [];
  } else {
    exOptionsList.value = [];
  }
}
/**
 * 组件挂载生命周期
 * @description 初始化组件状态
 */
onMounted(() => {
  if (props.createUseChange) {
    const item = exOptionsList.value.find(item => item.value === props.modelValue);
    handleOptionClick(item || {});
  }
});
/**
 * 监听 modelValue 变化
 * @description 外部值变化时更新内部值
 */
watch(
  () => props.modelValue,
  data => {
    waitTag.value = false;
    inValue.value = !isNil(data) && data !== "" ? data : isMultiple.value ? [] : "";
    oldValue = !isNil(data) && data !== "" ? data : isMultiple.value ? [] : "";
    if (isOnlineSelect.value || isRequestSelect.value) {
      remoteMethodFn(data);
    }
    nextTick(() => {
      waitTag.value = true;
    });
  },
  { immediate: true }
);
/**
 * 监听 exOptions 变化
 * @description 外部选项列表变化时更新内部列表
 */
watch(
  () => props.exOptions,
  data => {
    exOptionsList.value = data || [];
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss">
@use "./index.scss";
@use "../cell-style.scss";
</style>
