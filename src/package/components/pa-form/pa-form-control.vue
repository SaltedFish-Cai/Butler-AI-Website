<template>
  <div :id="id" :class="[className, { 'is-disabled': disabled }]" :style="styles">
    <!-- 表单内容插槽 -->
    <slot></slot>
  </div>
</template>

<script lang="tsx" setup>
/** @description Vue 核心响应式 API */
import { ref, reactive, defineEmits, watch, computed, provide, inject, Ref } from "vue";
/** @description 表单类型定义 */
import { ConfigContextType, FormItemRule } from "./types";
/** @description 工具函数库 */
import _ from "lodash";
const { cloneDeep, isEqual } = _;

/** @description 组件属性 */
const props = withDefaults(
  defineProps<{
    /**
     * **表单唯一标识**
     * @type `string`
     * @default `undefined`
     * @description 当设置该值时，会添加到组件的 `id` 属性中
     * @description 该值的类型为 `string`，可以是任意类型
     * */
    id?: string;
    /**
     * **自定义类名**
     * @type `string`
     * @default `undefined`
     * @description 当设置该值时，会添加到组件的 `class` 属性中
     * @description 该值的类型为 `string`，可以是任意类型
     * */
    class?: string;
    /**
     * **自定义样式**
     * @type `Record<string, string>`
     * @default `undefined`
     * @description 当设置该值时，会添加到组件的样式中
     * @description 该值的类型为 `Record<string, string>`，可以是任意类型
     * */
    style?: Record<string, string>;
    /**
     * **表单数据模型**
     * @type `Record<string, any>`
     * @default `undefined`
     * @description 当设置该值时，会添加到组件的 `model` 属性中
     * @description 该值的类型为 `Record<string, any>`，可以是任意类型
     * */
    model?: Record<string, any>;
    /**
     * **表单规则**
     * @type `Record<string, FormItemRule | FormItemRule[]>`
     * @default `undefined`
     * @description 当设置该值时，会添加到组件的 `rules` 属性中
     * @description 该值的类型为 `Record<string, FormItemRule | FormItemRule[]>`，可以是任意类型
     * */
    rules?: Record<string, FormItemRule | FormItemRule[]>;
    /**
     * **是否禁用**
     * @type `boolean`
     * @default `false`
     * @description 当设置该值为 `true` 时，会禁用组件
     * @description 该值的类型为 `boolean`，可以是任意类型
     * */
    disabled?: boolean;
    /**
     * **是否在Tabs表单中**
     * @type `boolean`
     * @default `false`
     * @description 当设置该值为 `true` 时，会在Tabs表单中使用该组件
     * @description 该值的类型为 `boolean`，可以是任意类型
     * */
    inTabsForm?: boolean;
  }>(),
  {
    disabled: false,
    labelPosition: "top",
    inTabsForm: false
  }
);

/** @description 组件事件 */
const emit = defineEmits<{
  (e: "validate", valid: boolean, errors?: any): void;
  (e: "submit", value: Record<string, any>): void;
  (e: "change", prop: string, value: any, oldValue: any): void;
  (e: "validationStates", state: boolean): void;
  (e: "setRef", validate: any): void;
}>();

emit("setRef", { validate });

/** @description 计算类名 */
const className = computed(() => {
  const classes = ["pa-form-control"];
  if (props.class) {
    classes.push(props.class);
  }
  return classes;
});

/** @description 计算样式 */
const styles = computed(() => {
  const styleObj = { ...props.style };
  if (
    injectConfigContext.value.labelWidth !== undefined &&
    (injectConfigContext.value.labelPosition === "left" || injectConfigContext.value.labelPosition === "right")
  ) {
    styleObj["--pa-form-label-width"] =
      typeof injectConfigContext.value.labelWidth === "number"
        ? `${injectConfigContext.value.labelWidth}px`
        : injectConfigContext.value.labelWidth;
  }
  return styleObj;
});

/** @description 表单数据存储 */
const formData = reactive<Record<string, any>>({});
/** @description 错误信息存储 */
const errorsMessage = ref<Record<string, string>>({});

/** @description 验证规则存储 */
const formRules = ref<Record<string, FormItemRule | FormItemRule[]>>(props.rules || {});
/** @description 验证状态存储 */
const validateStates = reactive<Record<string, { state: "" | "error" | "success" | "validating"; message: string }>>({});

/** @description 表单上下文 */
const formContext = reactive({
  rules: formRules,
  rulesKeys: computed(() => Object.keys(formRules.value)),
  errorsMessage: computed(() => errorsMessage.value),
  validateField: props.inTabsForm ? validateFieldInTabsForm : validateField,
  clearValidate: clearValidateField,
  emitChange: (prop: string, value: any, oldValue: any) => {
    emit("change", prop, value, oldValue);
  }
});

/** @description 配置上下文注入 */
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
provide("formContext", formContext);

/**
 * 初始化表单数据
 * @returns void
 * @description 根据props.model初始化表单数据
 */
function initFormData() {
  if (props.model) {
    Object.keys(formData).forEach(key => {
      delete formData[key];
    });
    Object.assign(formData, cloneDeep(props.model));
  }
}

/**
 * 验证表单
 * @returns 验证结果对象
 * @description 验证所有字段并返回验证结果
 */
async function validate(): Promise<{ valid: boolean; errors?: Record<string, string> }> {
  const validations: Promise<void>[] = [];
  errorsMessage.value = {};
  formContext.rulesKeys.forEach(prop => {
    validations.push(
      new Promise<void>(resolve => {
        validateField(prop, formData[prop]).then(() => {
          resolve();
        });
      })
    );
  });

  await Promise.all(validations);
  const errorList = Object.values(errorsMessage.value).filter(msg => msg !== "");
  const valid = errorList.length === 0;
  if (!valid) {
    typeof window !== "undefined" && window.developLog.json(errorsMessage.value, "校验错误", "warning");
  }
  emit("validate", valid, errorsMessage.value);
  return { valid, errors: valid ? undefined : errorsMessage.value };
}

/**
 * 验证指定字段
 * @param prop - 字段名
 * @param value - 字段值
 * @returns 验证结果
 * @description 验证指定字段的值
 */
async function validateField(prop: string, value: string): Promise<{ valid: boolean; error?: string }> {
  if (!formRules.value[prop]) return { valid: true };
  const rules = Array.isArray(formRules.value[prop]) ? formRules.value[prop] : [formRules.value[prop]];

  validateStates[prop] = { state: "validating", message: "" };
  errorsMessage.value[prop] = "";
  try {
    for (const rule of rules) {
      await validateRule(rule, value, prop);
    }

    validateStates[prop] = { state: "success", message: "" };
    errorsMessage.value[prop] = "";

    return { valid: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    validateStates[prop] = { state: "error", message: errorMessage };
    errorsMessage.value[prop] = errorMessage;
    return { valid: false, error: errorMessage };
  }
}
/**
 * 在Tab表单中验证字段
 * @param prop - 字段名
 * @param value - 字段值
 * @returns 验证结果
 * @description 在Tab表单中验证指定字段并更新校验状态
 */
async function validateFieldInTabsForm(prop: string, value: string): Promise<{ valid: boolean; error?: string }> {
  const result = await validateField(prop, value);

  if (props.inTabsForm) {
    const states = Object.values(errorsMessage.value).filter(msg => msg !== "");
    emit("validationStates", states.length === 0);
  }
  return result;
}

/**
 * 验证单个规则
 * @param rule - 验证规则
 * @param value - 字段值
 * @param prop - 字段名
 * @returns Promise<void>
 * @description 验证单个规则是否通过
 */
function validateRule(rule: FormItemRule, value: any, prop: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (
      rule.required &&
      (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0))
    ) {
      reject(rule.message || `${prop} is required`);
      return;
    }

    if ((value === undefined || value === null || value === "") && !rule.required) {
      resolve();
      return;
    }

    if (rule.transform) {
      value = rule.transform(value);
    }

    if (rule.type && !validateType(rule.type, value)) {
      reject(rule.message || `${prop} type error`);
      return;
    }

    if (rule.min !== undefined && getValueLength(value) < rule.min) {
      reject(rule.message || `${prop} length must be greater than or equal to ${rule.min}`);
      return;
    }

    if (rule.max !== undefined && getValueLength(value) > rule.max) {
      reject(rule.message || `${prop} length must be less than or equal to ${rule.max}`);
      return;
    }

    if (rule.len !== undefined && getValueLength(value) !== rule.len) {
      reject(rule.message || `${prop} length must be equal to ${rule.len}`);
      return;
    }

    if (rule.pattern && rule.pattern instanceof RegExp && !rule.pattern.test(String(value))) {
      reject(rule.message || `${prop} format error`);
      return;
    }

    if (rule.enum && Array.isArray(rule.enum) && !rule.enum.includes(value)) {
      reject(rule.message || `${prop} value not in enum`);
      return;
    }

    if (rule.validator) {
      const callback = (error?: string) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      };

      const result = rule.validator({ rule, value, callback });
      if (result instanceof Promise) {
        result.then(() => resolve()).catch(err => reject(err || rule.message));
      }
    } else {
      resolve();
    }
  });
}

/**
 * 验证类型
 * @param type - 类型名称
 * @param value - 待验证值
 * @returns 是否匹配类型
 * @description 验证值是否匹配指定类型
 */
function validateType(type: string, value: any): boolean {
  switch (type) {
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number" && !isNaN(value);
    case "boolean":
      return typeof value === "boolean";
    case "array":
      return Array.isArray(value);
    case "object":
      return typeof value === "object" && value !== null && !Array.isArray(value);
    case "integer":
      return Number.isInteger(value);
    case "float":
      return typeof value === "number" && !Number.isInteger(value) && !isNaN(value);
    case "date":
      return value instanceof Date && !isNaN(value.getTime());
    case "url":
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    case "email":
      return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value);
    case "hex":
      return /^#?([a-f0-9]{6}|[a-f0-9]{3})$/.test(value);
    default:
      return true;
  }
}

/**
 * 获取值的长度
 * @param value - 待计算值
 * @returns 值的长度
 * @description 获取字符串、数组或对象的长度
 */
function getValueLength(value: any): number {
  if (value === undefined || value === null) {
    return 0;
  }
  if (typeof value === "string" || Array.isArray(value)) {
    return value.length;
  }
  if (typeof value === "object") {
    return Object.keys(value).length;
  }
  return String(value).length;
}

/**
 * 清除指定字段验证
 * @param props - 字段名或字段名数组
 * @returns void
 * @description 清除指定字段的验证状态
 */
function clearValidateField(props?: string[] | string) {
  if (!props) {
    Object.keys(validateStates).forEach(key => {
      validateStates[key] = { state: "", message: "" };
    });
  } else if (typeof props === "string") {
    validateStates[props] = { state: "", message: "" };
  } else if (Array.isArray(props)) {
    props.forEach(prop => {
      validateStates[prop] = { state: "", message: "" };
    });
  }
}

/**
 * 重置表单
 * @returns void
 * @description 清除所有验证状态并重置表单数据
 */
function resetForm() {
  clearValidateField();

  initFormData();
}

/**
 * 提交表单
 * @returns 表单数据或false
 * @description 验证表单并提交数据
 */
async function submitForm(): Promise<Record<string, any> | false> {
  const validation = await validate();

  if (validation.valid) {
    const submitData = cloneDeep(formData);
    emit("submit", submitData);
    return submitData;
  }

  return false;
}

/**
 * 设置表单数据
 * @param data - 表单数据
 * @returns void
 * @description 设置表单的数据
 */
function setFormData(data: Record<string, any>) {
  console.log("++++++++++> data:", data);
  Object.assign(formData, cloneDeep(data));
}

/**
 * 获取表单数据
 * @returns 表单数据的深拷贝
 * @description 获取表单数据的深拷贝
 */
function getFormData(): Record<string, any> {
  return cloneDeep(formData);
}

/** @description 监听model变化并初始化表单数据 */
watch(
  () => props.model,
  newVal => {
    if (newVal && !isEqual(newVal, formData)) {
      initFormData();
    }
  },
  { deep: true, immediate: true }
);

/** @description 监听rules变化并更新验证规则 */
watch(
  () => props.rules,
  newRules => {
    if (newRules) {
      formRules.value = cloneDeep(newRules);
    }
  },
  { deep: true, immediate: true }
);

defineExpose({
  validate,
  validateField,
  clearValidate: clearValidateField,
  resetForm,
  submitForm,
  setFormData,
  getFormData,
  formData
});
</script>

<style lang="scss">
.pa-form-control {
  width: 100%;
  box-sizing: border-box;

  &.is-disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  &--small {
    font-size: 12px;
  }

  &--large {
    font-size: 16px;
  }

  &--label-top {
    .m-form-item {
      flex-direction: column;
      align-items: flex-start;

      .m-form-item__label {
        width: 100%;
        text-align: left;
        margin-right: 0;
        margin-bottom: 8px;
      }

      .m-form-item__content {
        width: 100%;
      }
    }
  }

  &--label-right {
    .m-form-item {
      flex-direction: row;

      .m-form-item__label {
        text-align: right;
      }
    }
  }

  &--label-left {
    .m-form-item {
      flex-direction: row;

      .m-form-item__label {
        text-align: left;
      }
    }
  }
}
</style>
