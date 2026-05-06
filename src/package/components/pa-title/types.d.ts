/**
 * @module pa-title/types
 * @description PaTitle 标题组件类型定义
 */
/**
 * 模块导入
 * @description 导入多语言类型定义
 */
import { LanguagePackageType } from "../manager-type";
import { ComponentProps as LineComponentProps } from "../pa-line/types";

/**
 * 组件属性
 * @type object
 * @description PaTitle 标题组件的属性类型定义
 */
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
   * 提示信息
   * @type LanguagePackageType | string | undefined
   * @default undefined
   * @description 当设置该值时，会在标题下方显示提示信息
   */
  tips?: LanguagePackageType | string;
  /**
   * 提示位置
   * @type "bottom" | "right" | undefined
   * @default "bottom"
   */
  tipsPosition?: "bottom" | "right";
  /**
   * 内边距方向
   * @type Array<'all' | 'bottom' | 'left' | 'null' | 'right' | 'top'> | undefined
   * @default undefined
   * @description 当设置该值时，会在标题的对应方向添加内边距
   */
  padding?: Array<"all" | "bottom" | "left" | "null" | "right" | "top">;
  /**
   * 样式模式
   * @type "default" | "vertical" | "underline" | undefined
   * @default "default"
   * @description 当设置该值时，会根据不同的样式模式应用不同的样式
   */
  styleMode?: "default" | "underline" | "vertical";

  lineConfig?: LineComponentProps | boolean;
};
