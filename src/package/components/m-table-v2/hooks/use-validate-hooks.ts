import { computed, reactive, ref, nextTick } from "vue";
import { FormItemRule } from "../../m-form-v2/type";
import { cloneDeep } from "lodash";
import { MTableV2Type } from "../type";

export const useValidateHooks = (
  props: MTableV2Type,
  formRules: Record<string, FormItemRule | FormItemRule[]>,
  tableData: any[],
  injectSetScrollToIntersect: (el: Element, callback?: () => void, options?: { offsetY?: number; offsetX?: number }) => void,
  mScrollbarListRef: any,
  getTableData: any
) => {
  const validateStates = reactive<Record<string, { state: "" | "error" | "success" | "validating"; message: string }>>({});
  const errorsMessage = ref<Record<string, string>>({});

  const rulesKeys = computed(() => Object.keys(formRules));

  async function getSubmitTableList() {
    let formResult = true;
    const { valid } = await validate();
    if (!valid) {
      formResult = false;
    }

    if (formResult) {
      const deepData = cloneDeep(tableData) || {};
      const FormData: any = deepData;

      // if (isEqual(baseFormData, FormData)) return "no-change";
      const filterData = getTableData(FormData);

      return filterData.map((item: any) => {
        delete item.errorList;
        return item;
      });
    } else {
      nextTick(() => {
        // window.MScrollbarToError();
        const errorItem = document.querySelector(`#${props.id} .m-table-v2-cell__error`);

        if (errorItem) {
          const fixedIndex = document.querySelectorAll(`#${props.id} > .m-table-v2_body_header_box .sticky-left`);
          const offsetX = Array.from(fixedIndex).reduce((prev, cur: any) => prev + cur.offsetWidth, 20);
          const offsetY = errorItem.parentElement?.parentElement?.clientHeight || 20;
          if (injectSetScrollToIntersect) {
            injectSetScrollToIntersect(errorItem, undefined, { offsetY, offsetX });
          } else if (mScrollbarListRef.value) {
            mScrollbarListRef.value.setScrollToIntersect(errorItem, undefined, { offsetY, offsetX });
          }
        }
        return false;
      });
    }
  }

  // 验证表单
  async function validate(): Promise<{ valid: boolean; errors?: Record<string, string> }> {
    const validations: Promise<void>[] = [];
    errorsMessage.value = {};
    // 遍历所有规则进行验证
    for (let v = 0; v < tableData.length; v++) {
      const dataArray = tableData[v];
      // validations.
      for (let i = 0; i < dataArray.length; i++) {
        const data = dataArray[i];
        errorsMessage.value = {};
        rulesKeys.value.forEach(prop => {
          validations.push(
            new Promise<void>(async resolve => {
              await validateField(prop, data[prop], data).then(() => {
                resolve();
              });
            })
          );
        });
      }
    }

    await Promise.all(validations);
    const errorList = Object.values(errorsMessage.value).filter(msg => msg !== "");
    const valid = errorList.length === 0;
    if (!valid) {
      window.developLog.json(errorsMessage.value, "校验错误", "warning");
    }

    return { valid, errors: valid ? undefined : errorsMessage.value };
  }

  // @ 验证指定字段
  async function validateField(prop: string, value: string, data: any): Promise<{ valid: boolean; error?: string }> {
    if (!formRules[prop]) return { valid: true };
    const rules = Array.isArray(formRules[prop]) ? formRules[prop] : [formRules[prop]];
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
      if (!data.errorList) data.errorList = {};
      data.errorList[prop] = "";
      return { valid: true };
    } catch (error) {
      // 验证失败
      const errorMessage = error instanceof Error ? error.message : String(error);
      validateStates[prop] = { state: "error", message: errorMessage };
      errorsMessage.value[prop] = errorMessage;
      if (!data.errorList) data.errorList = {};
      data.errorList[prop] = errorMessage;
      return { valid: false, error: errorMessage };
    }
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

  return {
    // ...toRefs(state),
    getSubmitTableList,
    validateField
  };
};
