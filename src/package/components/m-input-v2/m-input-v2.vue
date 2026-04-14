<template>
  <template v-if="!display">
    <div class="m-input-v2">
      <!-- <div class="mock-box" v-if="isFocus"></div> -->
      <div
        class="m-input-v2_body"
        :class="[props.class, { 'is-disabled': disabled }, { 'is-focus': isFocus }]"
        :style="{ ...props.style }"
      >
        <!-- textarea -->
        <div class="m-input-v2-textarea" :class="[isFocus ? 'is-focus' : '']">
          <div
            v-if="!isFocus"
            class="m-input-v2-textarea-inner display-ellipsis"
            :class="{ placeholder: !inValue || inValue?.length === 0 }"
          >
            {{ inValue || computedPlaceholder }}
          </div>
          <textarea
            ref="textareaRef"
            class="m-input-v2-textarea-inner textarea"
            :class="[isFocus ? 'is-focus' : 'not-focus']"
            v-model="inValue"
            :name="id"
            :rows="isFocus ? 1 : 1"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleInput"
            @change="handleChange"
            :disabled="disabled"
            autocomplete="off"
            :placeholder="computedPlaceholder"
            :maxlength="maxLength"
          />

          <div v-if="isFocus" class="flex-end clean-box">
            <div v-if="maxLength" class="m-input-word-limit">
              {{ inValue?.length || 0 }}{{ maxLength ? " / " + maxLength : "" }}
            </div>
            <m-icon-v2 name="close_circle_line" class="clear-icon" @click="clearInput" />
          </div>
          <m-icon-v2
            v-else-if="!disabled && clearable && inValue"
            name="close_circle_line"
            class="clear-icon"
            @click="clearInput"
          />
        </div>

        <!-- input -->
        <!-- <div v-else class="m-input-v2-input" :class="[isFocus ? 'is-focus' : '']">
          <input
            class="m-input-v2-input-inner"
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
          <div v-if="maxLength" class="m-input-word-limit">{{ inValue?.length || 0 }}{{ maxLength ? "/" + maxLength : "" }}</div>
          <m-icon-v2 v-if="!disabled && clearable && inValue" name="close_circle_line" class="clear-icon" @click="clearInput" />
        </div> -->
      </div>
    </div>
  </template>
  <div v-else class="m-display-v2">
    <slot name="exDisplay"></slot>
    <template v-if="$slots.exDisplay"> ( {{ inValue || "--" }} )</template>
    <template v-else>{{ inValue || "--" }}</template>
  </div>

  <div
    v-if="(alwaysContrast && !isNil(contrastData)) || (!isNil(contrastData) && !isEqual(inValue, contrastData))"
    :class="['m-contrast-v2']"
  >
    <slot name="exContrast"></slot>
    <template v-if="$slots.exContrast"> ( {{ contrastData || "--" }} )</template>
    <template v-else>{{ contrastData || "--" }}</template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, ComputedRef, watch, onMounted, nextTick, inject } from "vue";
import { MInputV2Type } from "./type";
import lodashPkg from "lodash";
import { randChar } from "../tools/rand-char";
import { ManagerGlobalConfigType } from "../m-manager-v2/type";

const ManagerGlobalConfig = inject("ManagerGlobalConfig") as ComputedRef<ManagerGlobalConfigType>;

const { isEqual, isNil } = lodashPkg;
const inputRef = ref();
const textareaRef = ref();
const isFocus = ref(false);

const languagePackage = computed(() => {
  return ManagerGlobalConfig.value?.language?.package?.["cell"] || {};
});

const computedPlaceholder: ComputedRef<string> = computed(() => {
  const language = ManagerGlobalConfig.value?.language?.value || "zh-CN";
  return typeof props.placeholder === "object"
    ? props.placeholder[language] || languagePackage.value[`inputPlaceholder`]
    : props.placeholder || languagePackage.value[`inputPlaceholder`];
});

const props = withDefaults(defineProps<MInputV2Type>(), {
  id: randChar(),
  modelValue: "",
  type: "text",
  clearable: true,
  autofocus: false
});

const inValue = ref(props.modelValue);
const emits = defineEmits(["update:modelValue", "change", "blur", "focus"]);

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
  const contentHeight = textareaRef.value.scrollHeight + 2;
  const minHeight = parseInt(getComputedStyle(textareaRef.value).minHeight) || 0;
  // 设置新的高度，确保不低于最小高度
  textareaRef.value.style.height = Math.max(contentHeight, minHeight) + "px";

  // 恢复滚动位置
  textareaRef.value.scrollTop = scrollTop;
};

let oldValue: string | undefined = props.modelValue;
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
    inValue.value = !isNil(data) ? data : "";
    oldValue = !isNil(data) ? data : "";
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
