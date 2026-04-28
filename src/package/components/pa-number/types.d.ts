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
   * @description 组件的唯一标识符
   * */
  id?: string;
  /**
   * **自定义类名**
   * @type `Array<string>` | `string` | `undefined`
   * @default `undefined`
   * @description 自定义类名
   * */
  class?: Array<string> | string;
  /**
   * **自定义样式**
   * @type `Record<string, string>` | `undefined`
   * @default `undefined`
   * @description 自定义样式
   * */
  style?: Record<string, string>;
  /**
   * **双向绑定值**
   * @type `string` | `number` | `undefined`
   * @default `undefined`
   * @description 数字框绑定值
   * */
  modelValue?: number | string;
  /**
   * **输入框占位符**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 输入框占位符文本
   * */
  placeholder?: LanguagePackageType | string;
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
   * **是否禁用**
   * @type `boolean` | `undefined`
   * @default `undefined`
   * @description 是否禁用数字框
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
   * **是否显示控制按钮**
   * @type `boolean` | `undefined`
   * @default `true`
   * @description 是否显示增减控制按钮
   * */
  controls?: boolean;
  /**
   * **最小值**
   * @type `number` | `undefined`
   * @default `undefined`
   * @description 数字框最小值
   * */
  min?: number;
  /**
   * **最大值**
   * @type `number` | `undefined`
   * @default `undefined`
   * @description 数字框最大值
   * */
  max?: number;
  /**
   * **单位**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 数字框单位
   * */
  unit?: string;
  /**
   * **精度**
   * @type `number` | `undefined`
   * @default `0`
   * @description 小数点精度
   * */
  precision?: number;
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
   * **步长**
   * @type `number` | `undefined`
   * @default `1`
   * @description 数字框步长
   * */
  step?: number;
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
   * @param `value` `number | string` 输入值
   * @returns `void`
   * */
  (e: "update:modelValue", value: number | string): void;
  /**
   * **数据变更事件**
   * @param `data` `{ value: number | string; oldValue: number | string }` 新值和旧值
   * @returns `void`
   * */
  (e: "change", data: { value: number | string; oldValue: number | string }): void;
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
};
