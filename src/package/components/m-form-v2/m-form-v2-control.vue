<template>
  <div :id="id" :class="[className, { 'is-disabled': disabled }]" :style="styles">
    <!-- 表单内容插槽 -->
    <slot></slot>
  </div>
</template>

<script lang="tsx" setup>
import { ref, reactive, defineEmits, watch, computed, provide, inject, Ref } from "vue";
import { cloneDeep, isEqual } from "lodash";
import { ConfigContextType, FormItemRule } from "./type";

// 定义组件属性
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

// 定义事件
const emit = defineEmits<{
  (e: "validate", valid: boolean, errors?: any): void;
  (e: "submit", value: Record<string, any>): void;
  (e: "change", prop: string, value: any, oldValue: any): void;
  (e: "validationStates", state: boolean): void;
  (e: "setRef", validate: any): void;
}>();

emit("setRef", { validate });

// 计算类名和样式
const className = computed(() => {
  const classes = ["m-form-v2-control"];
  if (props.class) {
    classes.push(props.class);
  }
  return classes;
});

const styles = computed(() => {
  const styleObj = { ...props.style };
  if (injectConfigContext.value.labelWidth !== undefined && injectConfigContext.value.labelPosition === "left") {
    styleObj["--m-form-v2-label-width"] =
      typeof injectConfigContext.value.labelWidth === "number"
        ? `${injectConfigContext.value.labelWidth}px`
        : injectConfigContext.value.labelWidth;
  }
  return styleObj;
});

// 表单数据存储
const formData = reactive<Record<string, any>>({});
const errorsMessage = ref<Record<string, string>>({});

// 验证规则存储
const formRules = ref<Record<string, FormItemRule | FormItemRule[]>>(props.rules || {});
// 验证状态存储
const validateStates = reactive<Record<string, { state: "" | "error" | "success" | "validating"; message: string }>>({});

// 表单项引用存储
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
// 提供给子组件的数据和方法
provide("formContext", formContext);

// 初始化表单数据
function initFormData() {
  if (props.model) {
    Object.keys(formData).forEach(key => {
      delete formData[key];
    });
    Object.assign(formData, cloneDeep(props.model));
  }
}

// 验证表单
async function validate(): Promise<{ valid: boolean; errors?: Record<string, string> }> {
  const validations: Promise<void>[] = [];
  errorsMessage.value = {};
  // 遍历所有规则进行验证
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
    window.developLog.json(errorsMessage.value, "校验错误", "warning");
  }
  emit("validate", valid, errorsMessage.value);
  return { valid, errors: valid ? undefined : errorsMessage.value };
}

// @ 验证指定字段
async function validateField(prop: string, value: string): Promise<{ valid: boolean; error?: string }> {
  if (!formRules.value[prop]) return { valid: true };
  const rules = Array.isArray(formRules.value[prop]) ? formRules.value[prop] : [formRules.value[prop]];

  // 更新验证状态为验证中
  validateStates[prop] = { state: "validating", message: "" };
  errorsMessage.value[prop] = "";
  try {
    for (const rule of rules) {
      await validateRule(rule, value, prop);
    }

    // 验证成功
    validateStates[prop] = { state: "success", message: "" };
    errorsMessage.value[prop] = "";

    return { valid: true };
  } catch (error) {
    // 验证失败
    const errorMessage = error instanceof Error ? error.message : String(error);
    validateStates[prop] = { state: "error", message: errorMessage };
    errorsMessage.value[prop] = errorMessage;
    return { valid: false, error: errorMessage };
  }
}
async function validateFieldInTabsForm(prop: string, value: string): Promise<{ valid: boolean; error?: string }> {
  const result = await validateField(prop, value);

  // 校验完整性
  if (props.inTabsForm) {
    const states = Object.values(errorsMessage.value).filter(msg => msg !== "");
    emit("validationStates", states.length === 0);
  }
  return result;
}

// @ 验证单个规则
function validateRule(rule: FormItemRule, value: any, prop: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 处理必填验证
    if (
      rule.required &&
      (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0))
    ) {
      reject(rule.message || `${prop} is required`);
      return;
    }

    // 如果值为空且不是必填，可以跳过其他验证
    if ((value === undefined || value === null || value === "") && !rule.required) {
      resolve();
      return;
    }

    // 处理transform
    if (rule.transform) {
      value = rule.transform(value);
    }

    // 处理类型验证
    if (rule.type && !validateType(rule.type, value)) {
      reject(rule.message || `${prop} type error`);
      return;
    }

    // 处理长度验证
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

    // 处理正则验证
    if (rule.pattern && rule.pattern instanceof RegExp && !rule.pattern.test(String(value))) {
      reject(rule.message || `${prop} format error`);
      return;
    }

    // 处理枚举验证
    if (rule.enum && Array.isArray(rule.enum) && !rule.enum.includes(value)) {
      reject(rule.message || `${prop} value not in enum`);
      return;
    }

    // 处理自定义验证器
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

// 验证类型
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

// 获取值的长度
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

// 清除指定字段验证
function clearValidateField(props?: string[] | string) {
  if (!props) {
    // 清除所有验证状态
    Object.keys(validateStates).forEach(key => {
      validateStates[key] = { state: "", message: "" };
    });
  } else if (typeof props === "string") {
    // 清除单个字段验证状态
    validateStates[props] = { state: "", message: "" };
  } else if (Array.isArray(props)) {
    // 清除多个字段验证状态
    props.forEach(prop => {
      validateStates[prop] = { state: "", message: "" };
    });
  }
}

// 重置表单
function resetForm() {
  // 清除所有验证状态
  clearValidateField();

  // 重置表单数据
  initFormData();
}

// 提交表单
async function submitForm(): Promise<Record<string, any> | false> {
  const validation = await validate();

  if (validation.valid) {
    const submitData = cloneDeep(formData);
    emit("submit", submitData);
    return submitData;
  }

  return false;
}

// 设置表单数据
function setFormData(data: Record<string, any>) {
  Object.assign(formData, cloneDeep(data));
}

// 获取表单数据
function getFormData(): Record<string, any> {
  return cloneDeep(formData);
}

// 监听props变化
watch(
  () => props.model,
  newVal => {
    if (newVal && !isEqual(newVal, formData)) {
      initFormData();
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.rules,
  newRules => {
    if (newRules) {
      formRules.value = cloneDeep(newRules);
    }
  },
  { deep: true, immediate: true }
);

// 暴露方法给父组件
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
.m-form-v2-control {
  width: 100%;
  box-sizing: border-box;

  &.is-disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  // 表单大小变体
  &--small {
    font-size: 12px;
  }

  &--large {
    font-size: 16px;
  }

  // 标签位置变体
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
