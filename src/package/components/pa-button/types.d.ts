/**
 * @module pa-button/types
 * @description PaButton 类型定义
 */
/**
 * 模块导入
 * @description 导入消息弹窗配置类型
 */
import { MessageBoxOptions } from "../pa-message-box/types";
/**
 * 模块导入
 * @description 导入多语言类型定义
 */
import { LanguagePackageType } from "../manager-type";
/**
 * 按钮内置样式类型
 * @description 预设按钮样式类型，包含常用的操作按钮图标和样式
 */
export type ButtonTypeV2Is =
  | "add"
  | "cancel"
  | "check"
  | "delete"
  | "download"
  | "edit"
  | "export"
  | "file"
  | "go"
  | "import"
  | "more"
  | "ok"
  | "refresh"
  | "remove"
  | "save"
  | "search"
  | "submit"
  | "switch"
  | "sync"
  | "time"
  | "trash"
  | "upload"
  | "view";

export type ComponentProps = {
  /**
   * 组件唯一标识
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会作为组件的唯一标识
   */
  id?: string;
  /**
   * 自定义类名
   * @type Array<string> | string | undefined
   * @default undefined
   * @description 当设置该值时，会添加到组件的类名中
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type Record<string, string> | undefined
   * @default undefined
   * @description 当设置该值时，会添加到组件的样式中
   */
  style?: Record<string, string>;
  /**
   * 按钮文本
   * @type LanguagePackageType | string | undefined
   * @default undefined
   * @description 当设置该值时，会显示在按钮上
   */
  text?: LanguagePackageType | string;
  /**
   * 按钮大小
   * @type 'large' | 'medium' | 'small' | undefined
   * @default 'medium'
   * @description 可选值为 `'small'` | `'large'`
   */
  size?: "large" | "medium" | "small";
  /**
   * 内置样式
   * @type ButtonTypeV2Is | undefined
   * @default undefined
   * @description 可选值为 `add` | `cancel` | `check` | `download` | `edit` | `export` | `file` | `go` | `import` | `ok` | `refresh` | `remove` | `save` | `search` | `submit` | `switch` | `sync` | `time` | `trash` | `upload` | `view` | `more`
   */
  is?: ButtonTypeV2Is;
  /**
   * 按钮样式类型
   * @type 'danger' | 'default' | 'info' | 'primary' | 'success' | 'warning'
   * @default undefined
   * @description 可选值为 `'danger'` | `'default'` | `'info'` | `'primary'` | `'success'` | `'warning'`
   */
  type?: "danger" | "default" | "info" | "primary" | "success" | "warning";
  /**
   * 是否禁用状态
   * @type boolean | undefined
   * @default undefined
   * @description 当设置该值为 `true` 时，按钮为禁用状态
   */
  disabled?: boolean;
  /**
   * 加载状态
   * @type boolean | undefined
   * @default undefined
   * @description 当设置该值为 `true` 时，按钮为加载状态
   */
  loading?: boolean;
  /**
   * 自动Loading来源
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会自动判断是否为 `loading` 状态
   */
  loadingBy?: string;
  /**
   * 是否开启防抖功能
   * @type boolean | undefined
   * @default true
   * @description 当设置该值为 `true` 时，会开启防抖功能
   */
  debounced?: boolean;
  /**
   * 防抖按钮时间
   * @type number | undefined
   * @default 300
   * @description 当设置该值为 `number` 时，会设置防抖按钮时间
   */
  debouncedTime?: number;
  /**
   * Icon位置
   * @type 'left' | 'right' | undefined
   * @default 'left'
   * @description 可选值为 `'left'` | `'right'`
   */
  iconPosition?: "left" | "right";
  /**
   * 按钮ICON
   * @type string | undefined
   * @default undefined
   * @description 当设置该值时，会使用该值作为ICON
   */
  iconName?: string;
  /**
   * 是否使用Icon
   * @type boolean | undefined
   * @default true
   * @description 当设置该值为 `true` 时，会使用Icon
   */
  useFont?: boolean;
  /**
   * 是否使用下划线按钮
   * @type boolean | undefined
   * @default undefined
   * @description 当设置该值为 `true` 时，会使用下划线按钮
   */
  useLine?: boolean;
  /**
   * 是否使用朴素按钮
   * @type boolean | undefined
   * @default true
   * @description 当设置该值为 `true` 时，会使用朴素按钮
   */
  usePlain?: boolean;
  /**
   * 确认弹窗配置
   * @type MessageBoxOptions | undefined
   * @default undefined
   * @description 当设置该值时，会开启确认弹窗功能
   */
  confirmConfig?: MessageBoxOptions;
  /**
   * 是否阻止事件冒泡
   * @type boolean | undefined
   * @default true
   * @description 当设置该值为 `true` 时，会阻止事件冒泡
   */
  useStop?: boolean;
};

/**
 * 组件事件定义
 * @description 定义组件可触发的事件
 */
export type ComponentEmits = {
  /**
   * 点击按钮事件
   * @param event MouseEvent 鼠标事件对象
   * @returns void
   */
  (e: "click", event: MouseEvent): void;
  /**
   * 确认按钮点击事件
   * @returns void
   */
  (e: "confirmClick"): void;
  /**
   * 提交按钮点击事件
   * @returns void
   */
  (e: "submitClick"): void;
  /**
   * 删除按钮点击事件
   * @returns void
   */
  (e: "deleteClick"): void;
};
