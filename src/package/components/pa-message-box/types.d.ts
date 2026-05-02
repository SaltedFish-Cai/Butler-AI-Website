/**
 * **模块导入**
 * @description 导入 Vue 组件实例类型
 * */
import type { ComponentPublicInstance } from "vue";
/**
 * **模块导入**
 * @description 导入多语言包类型
 * */
import { LanguagePackageType } from "../manager-type";
/**
 * **消息框类型**
 * @description 定义消息框的类型
 * */
export type MessageBoxType = "danger" | "info" | "primary" | "success" | "warning";
/**
 * **组件属性定义**
 * @description 确认弹窗组件的配置选项
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
   * **消息框标题**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 消息框标题，支持多语言
   * */
  title?: LanguagePackageType | string;
  /**
   * **消息框内容**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 消息框内容，支持多语言
   * */
  message?: LanguagePackageType | string;
  /**
   * **弹窗类型**
   * @type `'confirm'` | `undefined`
   * @default `undefined`
   * @description 是否为确认弹窗
   * */
  isType?: "confirm" | undefined;
  /**
   * **消息类型**
   * @type `MessageBoxType` | `undefined`
   * @default `undefined`
   * @description 消息类型，影响样式
   * */
  type?: MessageBoxType;
  /**
   * **自定义类名**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 自定义消息框容器的类名
   * */
  customClass?: string;
  /**
   * **确认回调**
   * @type `(() => void)` | `undefined`
   * @default `undefined`
   * @description 点击确认按钮时的回调函数
   * */
  onConfirm?: () => void;
  /**
   * **关闭回调**
   * @type `(() => void)` | `undefined`
   * @default `undefined`
   * @description 关闭消息框时的回调函数
   * */
  onClose?: () => void;
  /**
   * **是否使用HTML字符串**
   * @type `boolean` | `undefined`
   * @default `false`
   * @description 是否使用 HTML 字符串渲染消息
   * */
  dangerouslyUseHTMLString?: boolean;
  /**
   * **确认按钮文本**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 确认按钮的文本，支持多语言
   * */
  confirmButtonText?: LanguagePackageType | string;
  /**
   * **取消按钮文本**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 取消按钮的文本，支持多语言
   * */
  cancelButtonText?: LanguagePackageType | string;
  /**
   * **取消按钮图标**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 取消按钮的图标名称
   * */
  cancelButtonIcon?: string;
  /**
   * **确认按钮图标**
   * @type `string` | `undefined`
   * @default `undefined`
   * @description 确认按钮的图标名称
   * */
  confirmButtonIcon?: string;
  /**
   * **层级**
   * @type `number` | `undefined`
   * @default `2050`
   * @description 消息框的 z-index 值
   * */
  zIndex?: number;
  /**
   * **ESC键关闭**
   * @type `boolean` | `undefined`
   * @default `true`
   * @description 是否在按下 ESC 键时关闭消息框
   * */
  closeOnPressEscape?: boolean;
};
/**
 * **消息框配置选项**
 * @description 消息框配置选项别名，与 ComponentProps 保持一致
 * */
export type MessageBoxOptions = ComponentProps;
/**
 * **消息框实例**
 * @description 消息框实例的类型定义
 * */
export type MessageBoxInstance = {
  /**
   * **实例ID**
   * @type `string`
   * @description 消息框实例的唯一标识
   * */
  id: string;
  /**
   * **Vue组件实例**
   * @type `ComponentPublicInstance`
   * @description 消息框对应的 Vue 组件实例
   * */
  vm: ComponentPublicInstance;
  /**
   * **配置选项**
   * @type `MessageBoxOptions`
   * @description 消息框的配置选项
   * */
  options: MessageBoxOptions;
  /**
   * **关闭方法**
   * @type `() => void`
   * @description 关闭消息框的方法
   * */
  close: () => void;
};
/**
 * **消息框管理器类型**
 * @description 消息框管理器的类型定义
 * */
export type MessageBoxManager = {
  /**
   * **消息框列表**
   * @type `Array<MessageBoxInstance>`
   * @description 当前所有消息框实例
   * */
  notifications: Array<MessageBoxInstance>;
  /**
   * **添加消息框**
   * @param `options` `MessageBoxOptions` 消息框配置
   * @returns `MessageBoxInstance` 消息框实例
   * */
  add: (options: MessageBoxOptions) => MessageBoxInstance;
  /**
   * **关闭消息框**
   * @param `id` `string` 消息框ID
   * */
  close: (id: string) => void;
  /**
   * **关闭所有消息框**
   * */
  closeAll: () => void;
};
