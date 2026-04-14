<template>
  <div
    class="sa-form-item"
    :id="`sa-form-item--${prop}`"
    :class="[
      props.class,
      { 'is-required': isRequired },
      useLabelPosition ? `sa-form-item--${useLabelPosition}` : '',
      injectFormContext.errorsMessage[prop] ? 'is-error' : ''
    ]"
    :style="{ ...props.style }"
  >
    <label v-if="label || $slots.label" class="sa-form-item__label" :for="prop" :style="labelStyle">
      <slot name="label">
        <template v-if="label">{{ label }}</template>
      </slot>
      <span v-if="isRequired" class="sa-form-item__require" :class="{ 'is-required': true }"></span>
    </label>

    <div class="sa-form-item__content" :style="contentStyle">
      <slot></slot>

      <!-- 错误提示 -->
      <div v-if="injectFormContext.errorsMessage[prop]" class="sa-form-item__error" :role="'alert'">
        {{ injectFormContext.errorsMessage[prop] }}
      </div>

      <!-- 帮助信息 -->
      <div v-if="help" class="sa-form-item__help">{{ help }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, Ref, inject, provide } from "vue";
import { ConfigContextType } from "./type";

// 定义 Props
type SaFormItemProps = {
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
const props = withDefaults(defineProps<SaFormItemProps>(), {});

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
.sa-form-item {
  display: flex;
  align-items: flex-start;
  position: relative;
  width: 100%;
  padding: calc(var(--sa-size-padding, 10px) / 4) calc(var(--sa-size-padding, 10px) / 4);
  box-sizing: border-box;
  transition: 0.2s;

  &__label {
    display: flex;
    font-size: calc(var(--sa-size-font, 13px) + 1px);
    color: var(--sa-color-font);
    word-break: break-all;
    box-sizing: border-box;
    line-height: 1.5em;
    font-weight: bold;
    width: var(--sa-form-label-width);
    flex: 0 0 var(--sa-form-label-width, auto);
    padding-right: calc(var(--sa-size-padding, 10px) / 1);
  }

  &__content {
    width: 100%;
    font-size: var(--sa-size-font, 13px);
    color: var(--sa-color-font);
    .m-form-group-item {
      > .m-col {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        > .sa-form-item {
          padding: 0 !important;
        }
      }
    }
  }
  &__error {
    margin-top: calc(var(--sa-size-padding, 10px) / 4);
    color: var(--sa-color-danger);
    font-size: calc(var(--sa-size-font, 13px) - 2px);
  }
  &--left {
    .sa-form-item__label {
      transform: translateY(calc(var(--sa-size-padding, 10px) / 3));
    }
  }
  &--right {
    .sa-form-item__label {
      justify-content: flex-end !important;
      transform: translateY(calc(var(--sa-size-padding, 10px) / 2.5));
    }
  }
  &--top {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }

  &--top .sa-form-item__content {
    margin-left: 0;
  }
}

.sa-form-item:has(.sa-form-item__error) {
  background-color: var(--sa-color-warning-light-7);
  border-radius: 3px;
}

.sa-form-item.is-required {
  > .sa-form-item__label {
    &::before {
      content: "*";
      color: var(--sa-color-danger);
      margin-right: 4px;
    }
  }
}

.sa-form-item:has(> .sa-form-item__content > .sa-form-tabs) {
  padding: 0;
}
</style>
