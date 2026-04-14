<template>
  <div
    class="m-form-v2-item"
    :id="`m-form-v2-item--${prop}`"
    :class="[
      props.class,
      { 'is-required': isRequired },
      useLabelPosition ? `m-form-v2-item--${useLabelPosition}` : '',
      injectFormContext.errorsMessage[prop] ? 'is-error' : ''
    ]"
    :style="{ ...props.style }"
  >
    <label v-if="label || $slots.label" class="m-form-v2-item__label" :for="prop" :style="labelStyle">
      <slot name="label">
        <template v-if="label">{{ label }}</template>
      </slot>
      <span v-if="isRequired" class="m-form-v2-item__require" :class="{ 'is-required': true }"></span>
    </label>

    <div class="m-form-v2-item__content" :style="contentStyle">
      <slot></slot>

      <!-- 错误提示 -->
      <div v-if="injectFormContext.errorsMessage[prop]" class="m-form-v2-item__error" :role="'alert'">
        {{ injectFormContext.errorsMessage[prop] }}
      </div>

      <!-- 帮助信息 -->
      <div v-if="help" class="m-form-v2-item__help">{{ help }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, Ref, inject, provide } from "vue";
import { ConfigContextType } from "./type";

// 定义 Props
type MFormV2ItemProps = {
  /**
   * **表单字段名**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的 `prop` 属性中
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  prop: string;

  /**
   * **标签文本**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的 `label` 属性中
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  label?: string;

  /**
   * **自定义类名**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的 `class` 属性中
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  class?: string[];

  /**
   * **自定义样式**
   * @type `Record<string, string>`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的 `style` 属性中
   * @description 该值的类型为 `Record<string, string>`，可以是任意类型
   * */
  style?: Record<string, string>;

  /**
   * **帮助信息**
   * @type `string`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的 `help` 属性中
   * @description 该值的类型为 `string`，可以是任意类型
   * */
  help?: string;
};

// # Var
const props = withDefaults(defineProps<MFormV2ItemProps>(), {});

// 从父组件注入表单上下文
const injectFormContext = inject<any>("formContext", {});
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
// 计算标签样式
const labelStyle = computed(() => {
  const style: Record<string, string> = {};
  if (injectConfigContext.value.labelWidth !== "" && injectConfigContext.value.labelPosition !== "top") {
    style.width = `${injectConfigContext.value.labelWidth}px`;
  }
  return style;
});

const useLabelPosition = computed(() => injectConfigContext.value.labelPosition || "top");

// 计算内容样式
const contentStyle = computed(() => {
  const style: Record<string, string> = {};
  // const _labelPosition = injectConfigContext.value.labelPosition || "top";
  // if (injectConfigContext.value.labelWidth !== "" && _labelPosition !== "top") {
  //   style.marginLeft = `${injectConfigContext.value.labelWidth}px`;
  // }
  return style;
});

// 计算是否为必填项
const isRequired = computed(() => {
  if (injectFormContext.rulesKeys.length) {
    return injectFormContext.rulesKeys.includes(props.prop || "");
  }

  return false;
});

// 提供给子组件的上下文
provide("elFormItem", {
  ...props,
  isRequired
});
</script>

<style lang="scss">
.m-form-v2-item {
  display: flex;
  align-items: flex-start;
  position: relative;
  width: 100%;
  padding: calc(var(--m-component-padding-size, 10px) / 4) calc(var(--m-component-padding-size, 10px) / 4);
  box-sizing: border-box;
  transition: 0.2s;

  &__label {
    display: flex;
    font-size: calc(var(--m-component-font-size, 13px) + 1px);
    color: var(--m-font-color);
    word-break: break-all;
    box-sizing: border-box;
    line-height: 1.5em;
    font-weight: bold;
    width: var(--m-form-v2-label-width);
    flex: 0 0 var(--m-form-v2-label-width, auto);
    padding-right: calc(var(--m-component-padding-size, 10px) / 1);
  }

  &__content {
    width: 100%;
    font-size: var(--m-component-font-size, 13px);
    color: var(--m-font-color);
    .m-form-group-item {
      > .m-col {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        > .m-form-v2-item {
          padding: 0 !important;
        }
      }
    }
  }
  &__error {
    margin-top: calc(var(--m-component-padding-size, 10px) / 4);
    color: var(--m-color-danger);
    font-size: calc(var(--m-component-font-size, 13px) - 2px);
  }
  &--left {
    .m-form-v2-item__label {
      transform: translateY(calc(var(--m-component-padding-size, 10px) / 3));
    }
  }
  &--right {
    .m-form-v2-item__label {
      justify-content: flex-end !important;
      transform: translateY(calc(var(--m-component-padding-size, 10px) / 2.5));
    }
  }
  &--top {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }

  &--top .m-form-v2-item__content {
    margin-left: 0;
  }
}

.m-form-v2-item:has(.m-form-v2-item__error) {
  background-color: var(--m-color-warning-light-7);
  border-radius: 3px;
}

.m-form-v2-item.is-required {
  > .m-form-v2-item__label {
    &::before {
      content: "*";
      color: var(--m-color-danger);
      margin-right: 4px;
    }
  }
}

.m-form-v2-item:has(> .m-form-v2-item__content > .m-form-v2-tabs) {
  padding: 0;
}
</style>
