/**
 * @module pa-select/types
 * @description PaSelect 类型定义
 */
/**
 * 模块导入
 * @description 导入选项类型和多语言类型定义
 */
import { PaOptionType, LanguagePackageType } from "../manager-type";
/**
 * 选择器类型
 * @description 选择器组件支持的类型
 */
export type ComponentType =
  | "multiple-online-select"
  | "multiple-request-select"
  | "multiple-select"
  | "online-select"
  | "request-select"
  | "select";
/**
 * 组件属性定义
 * @description 选择器组件的属性类型
 */
/**
 * 组件属性
 * @type object
 * @description PaSelect 组件的属性类型定义
 */
export type ComponentProps = {
  /**
   * 组件唯一标识
   * @type string | undefined
   * @default undefined
   * @description 组件的唯一标识符
   */
  id?: string;
  /**
   * 自定义类名
   * @type Array<string> | string | undefined
   * @default undefined
   * @description 自定义类名
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string> | undefined
   * @default undefined
   * @description 自定义样式
   */
  style?: Record<string, string>;
  /**
   * 双向绑定值
   * @type Array<number | string> | number | string | undefined
   * @default undefined
   * @description 选择器绑定值
   */
  modelValue?: Array<number | string> | number | string;
  /**
   * 纯展示数据
   * @type string | undefined
   * @default undefined
   * @description 纯展示模式下直接显示的值
   */
  displayValue?: string;
  /**
   * 选择器类型
   * @type ComponentType
   * @default select
   * @description 选择器类型，支持单选、多选、异步等模式
   */
  type?: ComponentType;
  /**
   * 表单项标签
   * @type LanguagePackageType | string | undefined
   * @default undefined
   * @description 表单项标签文本
   */
  title?: LanguagePackageType | string;
  /**
   * 表单项标签宽度
   * @type string | undefined
   * @default undefined
   * @description 表单项标签宽度
   */
  titleWidth?: string;
  /**
   * 创建时是否使用 change 事件
   * @type boolean
   * @default false
   * @description 组件创建时是否触发 change 事件
   */
  createUseChange?: boolean;
  /**
   * 外置选项数据
   * @type PaOptionType.SelectList | undefined
   * @default undefined
   * @description 外部传入的选项列表
   */
  exOptions?: PaOptionType.SelectList;
  /**
   * 远端请求选项接口
   * @type ({ query: string }) => Promise<PaOptionType.SelectList> | undefined
   * @default undefined
   * @description 异步请求选项的接口函数
   */
  requestApi?: ({ query: string }) => Promise<PaOptionType.SelectList>;
  /**
   * 输入框占位符
   * @type LanguagePackageType | string | undefined
   * @default undefined
   * @description 输入框占位符文本
   */
  placeholder?: LanguagePackageType | string;
  /**
   * 是否禁用
   * @type boolean | undefined
   * @default undefined
   * @description 是否禁用选择器
   */
  disabled?: boolean;
  /**
   * 纯展示模式
   * @type boolean | undefined
   * @default undefined
   * @description 是否开启纯展示模式
   */
  display?: boolean;
  /**
   * 显示清除按钮
   * @type boolean
   * @default true
   * @description 是否显示清除按钮
   */
  clearable?: boolean;
  /**
   * Teleport 目标
   * @type boolean | undefined
   * @default undefined
   * @description 是否将弹出层挂载到容器内
   */
  teleportInContainer?: boolean;
  /**
   * 对比数据
   * @type Array<number | string> | number | string | undefined
   * @default undefined
   * @description 用于对比的原数据
   */
  contrastData?: Array<number | string> | number | string;
  /**
   * 是否显示对比数据
   * @type boolean | undefined
   * @default undefined
   * @description 是否总是显示对比数据
   */
  alwaysContrast?: boolean;
};
/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
export type ComponentEmits = {
  /**
   * 双向绑定更新事件
   * @param value - | `number` | `string` 选择值
   * @returns void
   */
  (e: "update:modelValue", value: Array<number | string> | number | string): void;
  /**
   * 数据变更事件
   * @param data - 新值、旧值和当前选项
   * @returns void
   */
  (e: "change", data: { value: any; oldValue: any; option?: PaOptionType.Select }): void;
};
