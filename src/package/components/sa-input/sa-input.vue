<template>
  <template v-if="!display">
    <div class="sa-input" :style="{ ...props.style }" :class="[props.class]">
      <!-- <div class="mock-box" v-if="isFocus"></div> -->
      <div class="sa-input_body" :class="[{ 'is-disabled': disabled }, { 'is-focus': isFocus }]" @click="textareaRef.focus()">
        <!-- textarea -->
        <div v-if="title" :style="{ width: titleWidth }" class="sa-cell-label">
          {{ typeof title === "string" ? title : title[languageValue] }}
        </div>
        <div class="sa-input-textarea" :class="[isFocus ? 'is-focus' : '']">
          <div
            v-if="!isFocus"
            class="sa-input-textarea-inner display-ellipsis"
            :class="{ placeholder: !inValue || inValue?.length === 0 }"
          >
            {{ inValue || computedPlaceholder }}
          </div>
          <textarea
            ref="textareaRef"
            class="sa-input-textarea-inner textarea"
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
            <div v-if="maxLength" class="sa-input-word-limit">
              {{ inValue?.length || 0 }}{{ maxLength ? " / " + maxLength : "" }}
            </div>
            <!-- <sa-icon name="close_circle_line" class="clear-icon" @click="clearInput" /> -->
          </div>
          <sa-icon
            v-else-if="!disabled && clearable && inValue && !isFocus"
            name="close_circle_line"
            class="clear-icon"
            @click="clearInput"
          />
        </div>

        <!-- input -->
        <!-- <div v-else class="sa-input-input" :class="[isFocus ? 'is-focus' : '']">
          <input
            class="sa-input-input-inner"
            v-model="inValue"
            :name="id"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleInput"
            @change="handleChange"
            :disabled="disabled"
            autocomplete="off"
            :placeholder="computedPlaceholder"
            :maxlength="maxLength"
          />
          <div v-if="maxLength" class="sa-input-word-limit">{{ inValue?.length || 0 }}{{ maxLength ? "/" + maxLength : "" }}</div>
          <sa-icon v-if="!disabled && clearable && inValue" name="close_circle_line" class="clear-icon" @click="clearInput" />
        </div> -->
      </div>
    </div>
  </template>
  <div v-else class="sa-display-style">
    <slot name="exDisplay"></slot>
    <template v-if="$slots.exDisplay"> ( {{ inValue || "--" }} )</template>
    <template v-else>{{ inValue || "--" }}</template>
  </div>

  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(inValue, contrastData))"
    :class="['sa-contrast-style']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ contrastData || "--" }} )</template>
    <template v-else>{{ contrastData || "--" }}</template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, ComputedRef, watch, onMounted, nextTick, inject } from "vue";
import { SaInputType } from "./type";
import { randChar } from "../tools/rand-char";
import { PancakeGlobalConfigType } from "../sa-content/type";

import _ from "lodash";
const { isEqual, isNil } = _;

const PancakeGlobalConfig = inject("PancakeGlobalConfig") as ComputedRef<PancakeGlobalConfigType>;

const inputRef = ref();
const textareaRef = ref();
const isFocus = ref(false);

const languagePackage = computed(() => {
  return PancakeGlobalConfig.value?.language?.package?.["cell"] || {};
});
const languageValue = computed(() => {
  return PancakeGlobalConfig.value?.language?.value || "zh-CN";
});

const computedPlaceholder: ComputedRef<string> = computed(() => {
  const language = PancakeGlobalConfig.value?.language?.value || "zh-CN";
  return typeof props.placeholder === "object"
    ? props.placeholder[language] || languagePackage.value[`inputPlaceholder`]
    : props.placeholder || languagePackage.value[`inputPlaceholder`];
});

const props = withDefaults(defineProps<SaInputType>(), {
  id: randChar(),
  modelValue: "",
  type: "textarea",
  clearable: true,
  autofocus: false
});
const inValue = ref(String(props.modelValue));
const emits = defineEmits(["update:modelValue", "change", "blur", "focus", "enter"]);

function handleEnter(e: KeyboardEvent) {
  if (e.key === "Enter") {
    emits("enter");
  }
}

function handleInput() {
  limitLength(inValue.value);
  if (props.type === "textarea") {
    adjustTextareaHeight();
  }
}

function handleChange() {
  emits("change", { value: inValue.value, oldValue });
  emits("update:modelValue", inValue.value);
}

function handleFocus() {
  isFocus.value = true;
  if (props.type === "textarea") {
    adjustTextareaHeight();
  }
  emits("focus");
}
function handleBlur() {
  isFocus.value = false;
  emits("blur");
}

function clearInput() {
  inValue.value = "";
  emits("update:modelValue", "");
  emits("change", { value: "", oldValue });
}

onMounted(() => {
  if (props.autofocus) {
    setTimeout(() => {
      if (props.type === "textarea" && textareaRef.value) {
        textareaRef.value.focus();
      } else if (inputRef.value) {
        inputRef.value.focus();
      }
    }, 300);
  }
  setTimeout(() => {
    adjustTextareaHeight();
  }, 300);
});

// 自动调整textarea高度
const adjustTextareaHeight = () => {
  if (!textareaRef.value) return;

  // 保存当前滚动位置
  const scrollTop = textareaRef.value.scrollTop;

  // 重置高度为auto以获取正确的内容高度
  textareaRef.value.style.height = "auto";

  // 计算内容高度，加上一些缓冲以避免滚动条闪烁
  const contentHeight = textareaRef.value.scrollHeight;
  const minHeight = parseInt(getComputedStyle(textareaRef.value).minHeight) || 0;
  const _val = Math.max(contentHeight, minHeight) + "px";
  // 设置新的高度，确保不低于最小高度
  textareaRef.value.style.height = _val;

  // 恢复滚动位置
  textareaRef.value.scrollTop = scrollTop;
};

let oldValue: string | undefined = String(props.modelValue);
const limitLength = value => {
  if (props.maxLength && value.length > Number(props.maxLength)) {
    inValue.value = value.slice(0, Number(props.maxLength));
    emits("update:modelValue", inValue.value);
    emits("change", { value: inValue.value, oldValue });
  } else {
    emits("update:modelValue", value);
    emits("change", { value, oldValue });
  }
  oldValue = value;
};

watch(
  () => props.modelValue,
  data => {
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
