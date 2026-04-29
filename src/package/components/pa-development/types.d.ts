/**
 * @module pa-development
 * @description 开发工具组件类型定义
 */
/**
 * PaDevelopment 组件 Props
 * @type {ComponentProps}
 * @description 开发工具组件的属性类型
 */
export type ComponentProps = {
  /**
   * 组件唯一标识
   * @type `string` | `undefined`
   * @default `""`
   * @description 当设置该值时，会作为组件的唯一标识
   */
  id?: string;
  /**
   * 自定义类名
   * @type `Array<string>` | `string` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的类名中
   */
  class?: Array<string> | string;
  /**
   * 自定义样式
   * @type `Record<string, string | number>` | `undefined`
   * @default `undefined`
   * @description 当设置该值时，会添加到组件的样式中
   */
  style?: Record<string, string | number>;
};
