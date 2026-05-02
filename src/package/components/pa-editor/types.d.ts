/**
 * @description 导入 PaFileType 文件上传类型
 */
import type { PaFileType } from "../pa-file/type";

/**
 * @description PaEditor 组件属性
 */
export type ComponentProps = {
  /**
   * @type {string | undefined}
   * @default undefined
   * @description 编辑器 ID，用于标识唯一的编辑器实例
   */
  id?: string;
  /**
   * @type {Array<string> | string | undefined}
   * @default undefined
   * @description 自定义类名，可传入字符串或字符串数组
   */
  class?: Array<string> | string;
  /**
   * @type {Record<string, string | number> | undefined}
   * @default undefined
   * @description 自定义内联样式对象
   */
  style?: Record<string, string | number>;
  /**
   * @type {string}
   * @default -
   * @description 编辑器内容，v-model 绑定值
   */
  modelValue: string;
  /**
   * @type {string | undefined}
   * @default undefined
   * @description 输入框占位符文本
   */
  placeholder?: string;
  /**
   * @type {Array<ComponentExButton> | undefined}
   * @default undefined
   * @description 外部自定义工具栏按钮配置数组
   */
  exButton?: Array<ComponentExButton>;
  /**
   * @type {ComponentConfig | undefined}
   * @default undefined
   * @description 编辑器配置对象
   */
  config?: ComponentConfig;
};

/**
 * @description PaEditor 组件事件
 */
export type ComponentEmits = {
  /**
   * @description 内容更新时触发
   * @param e - 事件名 "update:modelValue"
   * @param value - 更新后的内容
   */
  (e: "update:modelValue", value: string): void;
  /**
   * @description 内容变化时触发
   * @param e - 事件名 "change"
   * @param value - 变化后的内容
   */
  (e: "change", value: string): void;
};

/**
 * @description 外部按钮类型定义
 */
export type ComponentExButton = {
  /**
   * @type {string}
   * @default -
   * @description 按钮图标名称
   */
  icon: string;
  /**
   * @type {string}
   * @default -
   * @description 按钮显示文本
   */
  name: string;
  /**
   * @type {Function}
   * @default -
   * @description 按钮点击回调函数
   */
  target: Function;
  /**
   * @type {boolean | undefined}
   * @default undefined
   * @description 按钮是否处于激活状态
   */
  isActive?: boolean;
};

/**
 * @description 编辑器配置类型
 */
export type ComponentConfig = {
  /**
   * @type {PaFileType | undefined}
   * @default undefined
   * @description 图片上传配置
   */
  uploadImage?: PaFileType;
};

/**
 * @description 工具栏工具类型
 */
export type ComponentTool = {
  /**
   * @type {string}
   * @default -
   * @description 执行命令名称
   */
  command: string;
  /**
   * @type {string}
   * @default -
   * @description 工具图标名称
   */
  icon: string;
  /**
   * @type {string}
   * @default -
   * @description 工具提示文本
   */
  title: string;
  /**
   * @type {string | undefined}
   * @default undefined
   * @description 命令参数值
   */
  value?: string;
  /**
   * @type {Array<ComponentTool> | undefined}
   * @default undefined
   * @description 子工具数组，用于下拉菜单
   */
  children?: Array<ComponentTool>;
  /**
   * @type {boolean | undefined}
   * @default undefined
   * @description 是否处于激活状态
   */
  isActive?: boolean;
  /**
   * @type {string | undefined}
   * @default undefined
   * @description 前景色值
   */
  foreColor?: string;
  /**
   * @type {string | undefined}
   * @default undefined
   * @description 背景色值
   */
  backColor?: string;
  /**
   * @type {string | undefined}
   * @default undefined
   * @description 链接地址字符串
   */
  linkString?: string;
};
