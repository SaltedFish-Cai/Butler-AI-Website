<template>
  <div
    class="pa-form-item"
    :id="`pa-form-item--${prop}`"
    :class="[
      props.class,
      { 'is-required': isRequired },
      useLabelPosition ? `pa-form-item--${useLabelPosition}` : '',
      injectFormContext.errorsMessage[prop] ? 'is-error' : ''
    ]"
    :style="{ ...props.style }"
  >
    <label v-if="label || $slots.label" class="pa-form-item__label" :for="prop" :style="labelStyle">
      <slot name="label">
        <template v-if="label">{{ label }}</template>
      </slot>
      <span v-if="isRequired" class="pa-form-item__require" :class="{ 'is-required': true }"></span>
    </label>

    <div class="pa-form-item__content" :style="contentStyle">
      <slot></slot>

      <!-- 错误提示 -->
      <div v-if="injectFormContext.errorsMessage[prop]" class="pa-form-item__error" :role="'alert'">
        {{ injectFormContext.errorsMessage[prop] }}
      </div>

      <!-- 帮助信息 -->
      <div v-if="help" class="pa-form-item__help">{{ help }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * **Vue 核心响应式 API**
 * @description 导入 Vue 组合式 API 核心函数
 */
import { computed, ref, Ref, inject, provide } from "vue";
/**
 * **模块导入**
 * @description 导入表单类型定义
 */
import { ConfigContextType } from "./types";

type PaFormItemProps = {
  /**
   * **表单字段名**
   * @type `string`
   * @description 表单字段的名称标识
   */
  prop: string;
  /**
   * **标签文本**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 表单项的标签文本
   */
  label?: string;
  /**
   * **自定义类名**
   * @type `Array<string>` | `undefined`
   * @default `undefined`
   * @description 添加到组件的自定义类名
   */
  class?: Array<string>;
  /**
   * **自定义样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 添加到组件的自定义样式
   */
  style?: Record<string, string>;
  /**
   * **帮助信息**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 表单项的帮助提示信息
   */
  help?: string;
};

/**
 * **组件属性**
 * @description PaFormItem 组件的属性对象
 */
const props = withDefaults(defineProps<PaFormItemProps>(), {});

/**
 * **表单上下文注入**
 * @description 注入的表单上下文对象
 */
const injectFormContext = inject<any>("formContext", {});
/**
 * **配置上下文注入**
 * @type `Ref<ConfigContextType>`
 * @description 注入的配置上下文
 */
const injectConfigContext = inject<Ref<ConfigContextType>>(
  "configContext",
  ref({
    labelWidth: "auto",
    labelPosition: "top",
    baseSpanSize: 4,
    itemSpanSize: {},
    data: {},
    contrastData: {},
    alwaysContrast: false,
    display: false,
    languagePackage: {},
    language: "zh-CN",
    exOptions: {},
    exDependent: {},
    exCellDependent: {},
    useRequired: true,
    noLabel: false
  })
);
/**
 * **标签样式**
 * @type `ComputedRef<Record<string, string>>`
 * @description 计算标签的样式对象
 */
const labelStyle = computed(() => {
  const style: Record<string, string> = {};
  if (injectConfigContext.value.labelWidth !== "" && injectConfigContext.value.labelPosition !== "top") {
    style.width = `${injectConfigContext.value.labelWidth}px`;
  }
  return style;
});
/**
 * **标签位置**
 * @type `ComputedRef<string>`
 * @description 计算标签的显示位置
 */
const useLabelPosition = computed(() => injectConfigContext.value.labelPosition || "top");
/**
 * **内容样式**
 * @type `ComputedRef<Record<string, string>>`
 * @description 计算内容区域的样式对象
 */
const contentStyle = computed(() => {
  const style: Record<string, string> = {};
  return style;
});
/**
 * **是否必填项**
 * @type `ComputedRef<boolean>`
 * @description 判断当前表单项是否为必填项
 */
const isRequired = computed(() => {
  if (injectFormContext.rulesKeys.length) {
    return injectFormContext.rulesKeys.includes(props.prop || "");
  }
  return false;
});

provide("elFormItem", {
  ...props,
  isRequired
});
</script>

<style lang="scss">
.pa-form-item {
  display: flex;
  align-items: flex-start;
  position: relative;
  width: 100%;
  padding: calc(var(--pa-size-padding, 10px) / 4) calc(var(--pa-size-padding, 10px) / 4);
  box-sizing: border-box;
  transition: 0.2s;

  &__label {
    display: flex;
    font-size: calc(var(--pa-size-font, 13px) + 1px);
    color: var(--pa-color-font);
    word-break: break-all;
    box-sizing: border-box;
    line-height: 1.5em;
    font-weight: bold;
    width: var(--pa-form-label-width);
    flex: 0 0 var(--pa-form-label-width, auto);
    padding-right: calc(var(--pa-size-padding, 10px) / 1);
  }

  &__content {
    width: 100%;
    font-size: var(--pa-size-font, 13px);
    color: var(--pa-color-font);
    .m-form-group-item {
      > .m-col {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        > .pa-form-item {
          padding: 0 !important;
        }
      }
    }
  }
  &__error {
    margin-top: calc(var(--pa-size-padding, 10px) / 4);
    color: var(--pa-color-danger);
    font-size: calc(var(--pa-size-font, 13px) - 2px);
  }
  &--left {
    .pa-form-item__label {
      transform: translateY(calc(var(--pa-size-padding, 10px) / 3));
    }
  }
  &--right {
    .pa-form-item__label {
      justify-content: flex-end !important;
      transform: translateY(calc(var(--pa-size-padding, 10px) / 2.5));
    }
  }
  &--top {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }

  &--top .pa-form-item__content {
    margin-left: 0;
  }
}

.pa-form-item:has(.pa-form-item__error) {
  background-color: var(--pa-color-warning-light-7);
  border-radius: 3px;
}

.pa-form-item.is-required {
  > .pa-form-item__label {
    &::before {
      content: "*";
      color: var(--pa-color-danger);
      margin-right: 4px;
    }
  }
}

.pa-form-item:has(> .pa-form-item__content > .pa-form-tabs) {
  padding: 0;
}
</style>
