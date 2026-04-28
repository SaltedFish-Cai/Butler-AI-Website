/**
 * **模块导入**
 * @description 导入多语言类型定义
 * */
import { LanguagePackageType } from "../manager-type";
/**
 * **组件属性定义**
 * @description 定义组件的属性类型
 * */
export type ComponentProps = {
  /**
   * **组件唯一标识**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会作为组件的唯一标识
   * */
  id?: string;
  /**
   * **自定义类名**
   * @type `Array<string>` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   * */
  class?: Array<string> | string;
  /**
   * **自定义样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   * */
  style?: Record<string, string>;
  /**
   * **双向绑定值**
   * @type `string` | `number` | `undefined`
   * @default `undefined`
   * @description 输入框绑定值
   * */
  modelValue?: number | string;
  /**
   * **输入框类型**
   * @type `'input'` | `'text'` | `'textarea'` | `undefined`
   * @default `textarea`
   * @description 输入框类型，可选值为 `input`、`text`、`textarea`
   * */
  type?: "input" | "text" | "textarea";
  /**
   * **表单项标签**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 表单项标签文本
   * */
  title?: LanguagePackageType | string;
  /**
   * **表单项标签宽度**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 表单项标签宽度
   * */
  titleWidth?: string;
  /**
   * **表单项占位符**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 输入框占位符文本
   * */
  placeholder?: LanguagePackageType | string;
  /**
   * **是否禁用**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 是否禁用输入框
   * */
  disabled?: boolean;
  /**
   * **纯展示模式**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 是否开启纯展示模式
   * */
  display?: boolean;
  /**
   * **最大长度**
   * @type `number` | `string` | `undefined`
   * @default `undefined`
   * @description 输入内容最大长度
   * */
  maxLength?: number | string;
  /**
   * **显示清除按钮**
   * @type `boolean` | `undefined`
   * @default `true`
   * @description 是否显示清除按钮
   * */
  clearable?: boolean;
  /**
   * **自动聚焦**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 是否自动聚焦
   * */
  autofocus?: boolean;
  /**
   * **对比数据**
   * @type `number` | `string` | `undefined`
   * @default `undefined`
   * @description 用于对比的原数据
   * */
  contrastData?: number | string;
  /**
   * **是否显示对比数据**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 是否总是显示对比数据
   * */
  alwaysContrast?: boolean;
};
/**
 * **组件事件定义**
 * @description 定义组件可触发的事件
 * */
export type ComponentEmits = {
  /**
   * **双向绑定更新事件**
   * @param `value` `string` 输入值
   * @returns `void`
   * */
  (e: "update:modelValue", value: string): void;
  /**
   * **数据变更事件**
   * @param `data` `{ value: string; oldValue: string }` 新值和旧值
   * @returns `void`
   * */
  (e: "change", data: { value: string; oldValue: string }): void;
  /**
   * **失去焦点事件**
   * @returns `void`
   * */
  (e: "blur"): void;
  /**
   * **获得焦点事件**
   * @returns `void`
   * */
  (e: "focus"): void;
  /**
   * **按下回车键事件**
   * @returns `void`
   * */
  (e: "enter"): void;
};
