/**
 * @module pa-select-icon/types
 * @description PaSelectIcon 类型定义
 */
/**
 * 模块导入
 * @description 导入多语言类型定义
 */
import { LanguagePackageType } from "../manager-type";
/**
 * 组件属性定义
 * @description 图标选择器组件的属性类型
 */
/**
 * 组件属性
 * @type object
 * @description PaSelectIcon 组件的属性类型定义
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
   * @type string | undefined
   * @default undefined
   * @description 图标选择器绑定值
   */
  modelValue?: string;
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
   * @description 是否禁用图标选择器
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
   * 纯展示类型下直接显示值
   * @type string | undefined
   * @default undefined
   * @description 纯展示模式下直接显示的值
   */
  displayValue?: string;
  /**
   * Teleport 目标
   * @type boolean | undefined
   * @default undefined
   * @description 是否将弹出层挂载到容器内
   */
  teleportInContainer?: boolean;
  /**
   * 对比数据
   * @type string | undefined
   * @default undefined
   * @description 用于对比的原数据
   */
  contrastData?: string;
  /**
   * 是否显示对比数据
   * @type boolean | undefined
   * @default undefined
   * @description 是否总是显示对比数据
   */
  alwaysContrast?: boolean;
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
};
/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
export type ComponentEmits = {
  /**
   * 双向绑定更新事件
   * @param value - 图标名称
   * @returns void
   */
  (e: "update:modelValue", value: string): void;
  /**
   * 图标变更事件
   * @param data - 新值和旧值
   * @returns void
   */
  (e: "change", data: { value: string; oldValue: string }): void;
};
