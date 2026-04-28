/**
 * **模块导入**
 * @description 导入多语言类型定义
 * */
import { LanguagePackageType } from "../manager-type";

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
   * **是否使用下划线**
   * @type `boolean` | `undefined`
   * @default `true`
   * @description 当设置该值为 `true` 时，会使用下划线装饰
   * */
  line?: boolean;
  /**
   * **提示信息**
   * @type `LanguagePackageType` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会在标题下方显示提示信息
   * */
  tips?: LanguagePackageType | string;
  /**
   * **内边距方向**
   * @type `Array<'top' | 'left' | 'bottom' | 'right' | 'all' | 'null'>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会在标题的对应方向添加内边距
   * */
  padding?: Array<"all" | "bottom" | "left" | "null" | "right" | "top">;
};
