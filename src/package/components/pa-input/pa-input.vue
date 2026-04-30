<template>
  <template v-if="!display">
    <div class="pa-input" :style="{ ...props.style }" :class="[props.class]">
      <div class="pa-input_body" :class="[{ 'is-disabled': disabled }, { 'is-focus': isFocus }]" @click="textareaRef.focus()">
        <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
          {{ typeof title === "string" ? title : title[languageValue] }}
        </div>

        <div class="pa-input-textarea" :class="[isFocus ? 'is-focus' : '']">
          <div
            v-if="!isFocus"
            class="pa-input-textarea-inner display-ellipsis"
            :class="{ placeholder: !inValue || inValue?.length === 0 }"
          >
            {{ inValue || computedPlaceholder }}
          </div>

          <textarea
            ref="textareaRef"
            class="pa-input-textarea-inner textarea"
            style="overflow: hidden"
            :class="[isFocus ? 'is-focus' : 'not-focus']"
            v-model="inValue as string"
            :name="id"
            :rows="isFocus ? 1 : 1"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleInput"
            @change="handleChange"
            @keydown="handleEnter"
            :disabled="disabled"
            autocomplete="off"
            :placeholder="computedPlaceholder"
            :maxlength="maxLength"
          />

          <div v-if="isFocus && maxLength" class="flex-end clean-box">
            <div v-if="maxLength" class="pa-input-word-limit">
              {{ inValue?.length || 0 }}{{ maxLength ? " / " + maxLength : "" }}
            </div>
          </div>

          <pa-icon
            v-else-if="!disabled && clearable && inValue && !isFocus"
            name="close_circle_line"
            class="clear-icon"
            @click="clearInput"
          />
        </div>
      </div>
    </div>
  </template>

  <div v-else class="pa-display-style" :class="[props.class]" :style="{ ...props.style }">
    <div v-if="title" :style="{ width: titleWidth }" class="pa-cell-label">
      {{ typeof title === "string" ? title : title[languageValue] }}
    </div>
    <div class="pa-display-value_content">
      <slot name="exDisplay"></slot>
      <template v-if="$slots.exDisplay"> ( {{ inValue || "--" }} ) </template>
      <template v-else>{{ inValue || "--" }}</template>
    </div>
  </div>

  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(inValue, contrastData))"
    :class="['pa-contrast-style']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ contrastData || "--" }} ) </template>
    <template v-else>{{ contrastData || "--" }}</template>
  </div>
</template>

<script lang="ts" setup>
/**
 * **模块导入**
 * @description 导入 Vue 组合式 API
 * */
import { ref, computed, ComputedRef, watch, onMounted, nextTick, inject } from "vue";
/**
 * **模块导入**
 * @description 导入组件类型定义
 * */
import { ComponentProps, ComponentEmits } from "./types";
/**
 * **模块导入**
 * @description 导入全局配置类型
 * */
import { PancakeGlobalConfigType } from "../pa-manager/types";
/**
 * **模块导入**
 * @description 导入 lodash 工具函数
 * */
import _ from "lodash";
const { isEqual, isNil } = _;
/**
 * **全局配置注入**
 * @type `ComputedRef<PancakeGlobalConfigType>`
 * @description 注入全局配置对象
 * */
const PancakeGlobalConfig = inject("PancakeGlobalConfig", {}) as ComputedRef<PancakeGlobalConfigType>;
/**
 * **文本域引用**
 * @type `any`
 * @description 文本域 DOM 元素引用
 * */
const textareaRef = ref();
/**
 * **聚焦状态**
 * @type `boolean`
 * @description 当前是否处于聚焦状态
 * */
const isFocus = ref(false);
/**
 * **旧值存储**
 * @type `string`
 * @description 存储上一次的值，用于变更事件
 * */
let oldValue: string = "";
/**
 * **语言包**
 * @returns `Record<string, string>` 语言包对象
 * @description 获取当前语言包配置
 * */
const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["cell"] || {};
});
/**
 * **语言值**
 * @returns `string` 语言代码
 * @description 获取当前语言设置
 * */
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});
/**
 * **计算属性：占位符文本**
 * @returns `string` 占位符文本
 * @description 根据语言设置计算显示的占位符文本
 * */
const computedPlaceholder: ComputedRef<string> = computed(() => {
  const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";
  return typeof props.placeholder === "object"
    ? props.placeholder[language] || languagePackage.value[`inputPlaceholder`]
    : props.placeholder || languagePackage.value[`inputPlaceholder`];
});
/**
 * **组件属性**
 * @type `ComponentProps`
 * @description 组件的属性对象
 * */
const props = withDefaults(defineProps<ComponentProps>(), {
  type: "textarea",
  clearable: true
});
/**
 * **内部值**
 * @type `string`
 * @description 输入框的内部绑定值
 * */
const inValue = ref(String(props.modelValue));
/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
const emits = defineEmits<ComponentEmits>();
/**
 * **处理回车键事件**
 * @description 按下回车键时触发 enter 事件
 * */
function handleEnter(e: KeyboardEvent) {
  if (e.key === "Enter") {
    emits("enter");
  }
}
/**
 * **处理输入事件**
 * @description 输入内容变化时调整高度
 * */
function handleInput() {
  limitLength(inValue.value);
  if (props.type === "textarea") {
    adjustTextareaHeight();
  }
}
/**
 * **处理变更事件**
 * @description 内容变更时触发 change 和 update:modelValue 事件
 * */
function handleChange() {
  emits("change", { value: inValue.value, oldValue });
  emits("update:modelValue", inValue.value);
}
/**
 * **处理聚焦事件**
 * @description 获得焦点时触发 focus 事件
 * */
function handleFocus() {
  isFocus.value = true;
  if (props.type === "textarea") {
    adjustTextareaHeight();
  }
  emits("focus");
}
/**
 * **处理失焦事件**
 * @description 失去焦点时触发 blur 事件
 * */
function handleBlur() {
  isFocus.value = false;
  emits("blur");
}
/**
 * **清空输入内容**
 * @description 清空输入框并触发相关事件
 * */
function clearInput() {
  inValue.value = "";
  emits("update:modelValue", "");
  emits("change", { value: "", oldValue });
}
/**
 * **自动调整 textarea 高度**
 * @description 根据内容自动调整文本域高度
 * */
function adjustTextareaHeight() {
  if (!textareaRef.value) return;
  const scrollTop = textareaRef.value.scrollTop;
  textareaRef.value.style.height = "auto";
  const contentHeight = textareaRef.value.scrollHeight;
  const minHeight = parseInt(getComputedStyle(textareaRef.value).minHeight) || 0;
  const _val = Math.max(contentHeight, minHeight) + "px";
  textareaRef.value.style.height = _val;
  textareaRef.value.scrollTop = scrollTop;
}
/**
 * **限制输入长度**
 * @description 限制输入内容的最大长度
 * */
function limitLength(value: string) {
  if (props.maxLength && value.length > Number(props.maxLength)) {
    inValue.value = value.slice(0, Number(props.maxLength));
    emits("update:modelValue", inValue.value);
    emits("change", { value: inValue.value, oldValue });
  } else {
    emits("update:modelValue", value);
    emits("change", { value, oldValue });
  }
  oldValue = value;
}
/**
 * **组件挂载生命周期**
 * @description 初始化组件状态，设置自动聚焦
 * */
onMounted(() => {
  oldValue = String(props.modelValue) || "";
  if (props.autofocus) {
    setTimeout(() => {
      if (props.type === "textarea" && textareaRef.value) {
        textareaRef.value.focus();
      }
    }, 300);
  }
  setTimeout(() => {
    adjustTextareaHeight();
  }, 300);
});
/**
 * **监听 modelValue 变化**
 * @description 外部值变化时更新内部值
 * */
watch(
  () => props.modelValue,
  () => {
    const data = props.modelValue;
    inValue.value = !isNil(data) ? data.toString() : "";
    oldValue = !isNil(data) ? data.toString() : "";
    nextTick(() => {
      adjustTextareaHeight();
    });
  }
);
</script>

<style lang="scss">
@use "./index.scss";
@use "../cell-style.scss";
</style>
